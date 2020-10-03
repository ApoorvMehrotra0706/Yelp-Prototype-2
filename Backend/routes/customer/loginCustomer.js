/* eslint-disable camelcase */
/* eslint-disable func-names */
const bcrypt = require('bcrypt');
const genRandom = require('randomstring');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const mysqlConnection = require('../../connection');

// eslint-disable-next-line prefer-const
let UserTokens = [];
const { BUCKET_NAME } = process.env;
const s3Storage = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const getUserIdFromToken = (token, userRole) => {
  let User = null;
  User = UserTokens.filter((user) => user.Token === token && user.role === userRole);

  let userID = null;
  if (User) {
    userID = User[0].userId;
  }
  return userID;
};

const checkValidID = async (emailID, role) => {
  const userIDValidCheck = 'CALL validUserID(?,?)';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(userIDValidCheck, [emailID, role]);
  con.end();
  const value = [];

  if (results[0][0]) {
    value.push(results[0][0].Password);
    value.push(results[0][0].ID);
  }
  return value;
};

const loginCust = async (req, res) => {
  const { emailID } = req.body;
  const { password } = req.body;
  const role = 'Customer';
  const value = await checkValidID(emailID, role);
  if (value.length !== 0) {
    if (await bcrypt.compare(password, value[0])) {
      const token = genRandom.generate();
      const ID = value[1];
      res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
      res.cookie('role', role, { maxAge: 900000, httpOnly: false, path: '/' });
      UserTokens.push({ userId: ID, emailID, role, Token: token });

      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end('Successful Login for Customer');
    }
  } else {
    res.writeHead(401, { 'content-type': 'text/json' });
    res.end(JSON.stringify({ message: 'Login Failed for Customer' }));
  }
};

const logoutCust = async (req, res) => {
  let isTokenDeleted = false;
  // eslint-disable-next-line array-callback-return
  UserTokens.filter(function (user) {
    if (user.Token === req.body.token) {
      UserTokens.splice(UserTokens.indexOf(user), 1);
      isTokenDeleted = true;
    }
  });
  if (isTokenDeleted) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end('User Token Deleted');
  } else {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('User Token Not Found');
  }
};

const getCustID = async (userID) => {
  const restroIDFetchQuery = 'CALL customerIDFetch(?)';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(restroIDFetchQuery, userID);
  con.end();
  return results[0][0].CustomerID;
};

// customer/getCustomerCompleteProfile
const fetchCustomerDetails = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const custID = await getCustID(userID);
    if (userID) {
      const getEventsCustomersQuery = 'CALL getCustomerDetails(?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getEventsCustomersQuery, custID);
      con.end();

      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

// customer/getDataForCustomerUpdateProfile
// return from login join customer, second select will return country, third state, fourth gender
const fetchCustProfileData = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const custID = await getCustID(userID);
    if (userID) {
      const getEventsCustomersQuery = 'CALL getCustDetailsForUpdate(?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getEventsCustomersQuery, custID);
      con.end();

      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

// uploadCustomerProfilePic
const imageUpload = multer({
  storage: multerS3({
    s3: s3Storage,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // eslint-disable-next-line func-names
    // eslint-disable-next-line object-shorthand
    key: function (req, file, cb) {
      console.log(req.body);
      const folderName = 'yelp-rest-';
      console.log('Multer Called', folderName);
      cb(null, `${folderName}/${Date.now().toString()}${file.originalname}`);
    },
  }),
}).single('file');

const uploadCustomerProfilePic = async (req, res) => {
  try {
    const userID = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
    const custID = await getCustID(userID);
    if (custID) {
      imageUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          res.json({ status: 400, error: err.message });
        } else if (err) {
          res.json({ status: 400, error: err.message });
        } else {
          console.log(req.file.location);

          res.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          res.end(req.file.location);
        }
      });
    } else {
      res.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      res.end('Invalid User');
    }
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
  return res;
};

// customer/updateProfile
const updateProfile = async (request, response) => {
  try {
    const {
      First_Name,
      Last_Name,
      Nick_Name,
      Gender,
      Date_of_Birth,
      Country_ID,
      State_ID,
      City,
      Zip,
      Street,
      Headline,
      I_Love,
      Find_Me_In,
      Website,
      ImageUrl,
    } = request.body;
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const custID = await getCustID(userID);
    if (custID) {
      const updateCustomersQuery = 'CALL updateCustProfile(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line prefer-template
      const name = First_Name + ' ' + Last_Name;
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(updateCustomersQuery, [
        custID,
        name,
        Nick_Name,
        Gender,
        Date_of_Birth,
        Country_ID,
        State_ID,
        City,
        Zip,
        Street,
        Headline,
        I_Love,
        Find_Me_In,
        Website,
        ImageUrl,
      ]);
      con.end();

      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};
// customer/getContactInfo EmailID from Login and Contact from Customer

const getContactInfo = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const custID = await getCustID(userID);
    if (custID) {
      const getCustContactQuery = 'CALL getCustContact(?,?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getCustContactQuery, [custID, userID]);
      con.end();

      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

const updateContactInfo = async (request, response) => {
  let flag = 1;
  try {
    const { Email, NewEmail, ContactNo, Password } = request.body;
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const custID = await getCustID(userID);

    if (Email === NewEmail) flag = 1;
    else {
      const check = await checkValidID(NewEmail, 'Customer');
      if (check.length !== 0) flag = 0;
    }
    if (flag) {
      if (custID) {
        const value = await checkValidID(Email, 'Customer');
        if (value) {
          if (await bcrypt.compare(Password, value[0])) {
            const updateCustomersQuery = 'CALL updateCustContact(?,?,?,?)';
            const con = await mysqlConnection();
            // eslint-disable-next-line no-unused-vars
            const [results, fields] = await con.query(updateCustomersQuery, [
              custID,
              userID,
              NewEmail,
              ContactNo,
            ]);
            con.end();

            response.writeHead(200, {
              'Content-Type': 'text/plain',
            });
            response.end(JSON.stringify(results));
          } else {
            response.writeHead(401, {
              'Content-Type': 'text/plain',
            });
            response.end('Invalid Password');
          }
        }
      }
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Email ID already in use');
    }
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};
// customer/updateContactInfo  EmailID (first verify if unique), Password in Login, Contact in Customer
module.exports = {
  loginCust,
  logoutCust,
  fetchCustomerDetails,
  fetchCustProfileData,
  uploadCustomerProfilePic,
  updateProfile,
  getContactInfo,
  updateContactInfo,
};
