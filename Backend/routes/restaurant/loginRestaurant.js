/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
// const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const genRandom = require('randomstring');
const url = require('url');
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

const getRestroID = async (userID) => {
  const restroIDFetchQuery = 'CALL restroIDFetch(?)';
  const con = await mysqlConnection();
  const [results, fields] = await con.query(restroIDFetchQuery, userID);
  con.end();
  return results[0][0].RestaurantID;
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
    return value;
  }
  return value;
};

const restLogin = async (req, res) => {
  const { emailID } = req.body;
  const { password } = req.body;
  const role = 'Restaurant';
  const value = await checkValidID(emailID, role);
  if (value.length !== 0) {
    const passwordFromDB = value[0];
    // console.log('This is ', passwordFromDB, ' and ', password);
    if (await bcrypt.compare(password, passwordFromDB)) {
      const token = genRandom.generate();
      const ID = value[1];
      res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
      res.cookie('role', role, { maxAge: 900000, httpOnly: false, path: '/' });

      UserTokens.push({ userId: ID, emailID, role, Token: token });
      // req.session.user = req.body.emailID;
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end('Successful Login for Restaurant');
    }
  } else {
    res.writeHead(401, { 'content-type': 'text/json' });
    res.end(JSON.stringify({ message: 'Login Failed for Restauranr' }));
  }
};

const logoutRest = async (req, res) => {
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

const getUserIdFromToken = (token, userRole) => {
  let User = null;
  User = UserTokens.filter((user) => user.Token === token && user.role === userRole);

  let userID = null;
  if (User) {
    userID = User[0].userId;
  }
  return userID;
};

const menuFetch = async (req, res) => {
  const { category } = url.parse(req.url, true).query;
  const id = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
  const restroID = await getRestroID(id);
  let items = null;
  if (category === 'APPETIZERS') {
    items = 'CALL fetchAppetizerItems(?)';
  } else if (category === 'BEVERAGESs') {
    items = 'CALL fetchBeveragesItems(?)';
  } else if (category === 'DESSERTS') {
    items = 'CALL fetchDessertsItems(?)';
  } else if (category === 'MAIN_COURSE') {
    items = 'CALL fetchMainCourseItems(?)';
  } else {
    items = 'CALL fetchSaladsItems(?)';
  }
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(items, restroID);
  con.end();
  res.end(JSON.stringify(results));
};

const menuInsert = async (req, res) => {
  const { category, name, price, cuisine, ingredients, description, ImageUrl } = req.body;
  const userid = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
  const id = await getRestroID(userid);
  let items = null;
  if (category === 'APPETIZERS') {
    items = 'CALL insertAppetizerItems(?,?,?,?,?,?,?)';
  } else if (category === 'BEVERAGES') {
    items = 'CALL insertBeveragesItems(?,?,?,?,?,?,?)';
  } else if (category === 'DESSERTS') {
    items = 'CALL insertDessertsItems(?,?,?,?,?,?,?)';
  } else if (category === 'MAIN_COURSE') {
    items = 'CALL insertMainCourseItems(?,?,?,?,?,?,?)';
  } else {
    items = 'CALL insertSaladsItems(?,?,?,?,?,?,?)';
  }
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(items, [
    id,
    name,
    price,
    cuisine,
    ingredients,
    description,
    ImageUrl,
  ]);
  con.end();
  res.end(JSON.stringify(results));
};

const menuItemDeletion = async (req, res) => {
  const { category, foodId } = req.body;
  const userid = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
  const id = await getRestroID(userid);
  let items = null;
  if (category === 'APPETIZERS') {
    items = 'CALL deleteAppetizerItems(?,?)';
  } else if (category === 'BEVERAGES') {
    items = 'CALL deleteBeveragesItems(?,?)';
  } else if (category === 'DESSERTS') {
    items = 'CALL deleteDessertsItems(?,?)';
  } else if (category === 'MAIN_COURSE') {
    items = 'CALL deleteMainCourseItems(?,?)';
  } else {
    items = 'CALL deleteSaladsItems(?,?)';
  }
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(items, [id, foodId]);
  con.end();
  res.end('Deletion successful');
};

const reviewFetch = async (req, res) => {
  const userid = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
  const id = await getRestroID(userid);
  const items = 'CALL fetchReviews(?)';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(items, id);
  con.end();
  res.end(JSON.stringify(results));
};

// Fetching Restaurant Details
const getRestaurantCompleteInfo = async (request, response) => {
  try {
    const ID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const userID = await getRestroID(ID);
    if (userID) {
      const getRestaurantCompleteInfoQuery = 'CALL getRestaurantCompleteInfoQuery(?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getRestaurantCompleteInfoQuery, userID);
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

// Update Restaurant Profile
const updateRestaurantProfile = async (restaurant, response) => {
  try {
    const {
      Name,
      // eslint-disable-next-line camelcase
      Country,
      // eslint-disable-next-line camelcase
      StateName,
      City,
      Zip,
      Street,
      // eslint-disable-next-line camelcase
      Contact,
      // eslint-disable-next-line camelcase
      Opening_Time,
      ImageUrl,
      // eslint-disable-next-line camelcase
      Closing_Time,
      CurbsidePickup,
      DineIn,
      YelpDelivery,
    } = restaurant.body;
    const userID = getUserIdFromToken(restaurant.body.token, restaurant.body.role);
    const restroID = await getRestroID(userID);
    if (restroID) {
      const updateRestaurantProfileQuery = 'CALL updateRestPrfile(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(updateRestaurantProfileQuery, [
        Name,
        // eslint-disable-next-line camelcase
        Country,
        // eslint-disable-next-line camelcase
        StateName,
        City,
        Number(Zip),
        Street,
        // eslint-disable-next-line camelcase
        Number(Contact),
        // eslint-disable-next-line camelcase
        Opening_Time,
        // eslint-disable-next-line camelcase
        Closing_Time,
        restroID,
        ImageUrl,
        CurbsidePickup,
        DineIn,
        YelpDelivery,
      ]);

      connection.end();

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
};

const updateMenu = async (req, res) => {
  try {
    // eslint-disable-next-line camelcase
    const {
      category,
      Name,
      MainIngredients,
      CuisineID,
      Description,
      Price,
      ID,
      ImageUrl,
    } = req.body;

    const userID = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
    const restroID = await getRestroID(userID);
    if (restroID) {
      let updateRestaurantMenuQuery = null;
      if (category === 'APPETIZERS') {
        updateRestaurantMenuQuery = 'CALL updateAppetizerMenu(?,?,?,?,?,?,?,?)';
      } else if (category === 'BEVERAGES') {
        updateRestaurantMenuQuery = 'CALL updateBeveragesMenu(?,?,?,?,?,?,?,?)';
      } else if (category === 'DESSERTS') {
        updateRestaurantMenuQuery = 'CALL updateDessertsMenu(?,?,?,?,?,?,?,?)';
      } else if (category === 'MAIN_COURSE') {
        updateRestaurantMenuQuery = 'CALL updateMainCourseMenu(?,?,?,?,?,?,?,?)';
      } else {
        updateRestaurantMenuQuery = 'CALL updateSaladsMenu(?,?,?,?,?,?,?,?)';
      }
      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(updateRestaurantMenuQuery, [
        restroID,
        Name,
        // eslint-disable-next-line camelcase
        MainIngredients,
        CuisineID,
        Description,
        Price,
        ID,
        ImageUrl,
      ]);

      connection.end();
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end(JSON.stringify(results));
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
};

const getRestaurantOrders = async (request, response) => {
  try {
    const { sortValue } = url.parse(request.url, true).query;
    let state = null;
    if (sortValue === 'All') state = '%';
    else if (sortValue === 'New') state = 'New';
    else if (sortValue === 'Delivered') state = 'Delivered';
    else state = 'Canceled';
    const ID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const userID = await getRestroID(ID);
    if (userID) {
      const getRestaurantOdersQuery = 'CALL getOrderDetails(?,?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getRestaurantOdersQuery, [state, userID]);
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

const getPersonOrder = async (request, response) => {
  try {
    const { orderID } = url.parse(request.url, true).query;
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    if (userID) {
      const getRestaurantOdersQuery = 'CALL getPersonOrderDetails(?,?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getRestaurantOdersQuery, [orderID, userID]);
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

const updateDeliveryStatus = async (req, res) => {
  try {
    // eslint-disable-next-line camelcase
    const { deliveryStatus, orderID } = req.body;

    const updateDelivery = 'CALL updateDelivery(?,?,?)';

    let state = null;
    if (deliveryStatus === '5') state = 'Delivered';
    else if (deliveryStatus === '7') state = 'Canceled';
    else state = 'New';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(updateDelivery, [
      deliveryStatus,
      orderID,
      state,
    ]);
    connection.end();
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
};

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

// restaurant/foodImageUpload
const foodImageUpload = async (req, res) => {
  try {
    const userID = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
    const restroID = await getRestroID(userID);
    if (restroID) {
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

const fetchEvents = async (request, response) => {
  try {
    const { sortValue } = url.parse(request.url, true).query;
    const ID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const userID = await getRestroID(ID);
    if (userID) {
      const getEventsQuery = 'CALL getEvents(?,?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getEventsQuery, [sortValue, userID]);
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

// restaurant/fetchRegisteredCustomers
const fetchRegisteredCustomers = async (request, response) => {
  try {
    const { eventID } = url.parse(request.url, true).query;
    const ID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const userID = await getRestroID(ID);
    if (userID) {
      const getEventsCustomersQuery = 'CALL getEventsCustomers(?,?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getEventsCustomersQuery, [eventID, userID]);
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

// restaurant/createNewEvent
const createNewEvent = async (request, response) => {
  try {
    const {
      Name,
      Description,
      EventDate,
      EventStartTime,
      EventEndTime,
      City,
      State,
      Country,
      Street,
      Zip,
      hashtags,
    } = request.body;
    const ID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    const userID = await getRestroID(ID);
    if (userID) {
      const createEventsQuery = 'CALL createEvents(?,?,?,?,?,?,?,?)';
      // eslint-disable-next-line prefer-template
      const address = Street + ' ' + City + ' ' + Zip + ' ' + State + ' ' + Country;
      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(createEventsQuery, [
        userID,
        Name,
        Description,
        EventDate,
        EventStartTime,
        EventEndTime,
        address,
        hashtags,
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

const restImageUpload = multer({
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

const uploadRestaurantProfilePic = async (req, res) => {
  try {
    const userID = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
    const custID = await getRestroID(userID);
    if (custID) {
      restImageUpload(req, res, function (err) {
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

module.exports = {
  restLogin,
  logoutRest,
  menuFetch,
  menuInsert,
  menuItemDeletion,
  reviewFetch,
  getRestaurantCompleteInfo,
  updateRestaurantProfile,
  updateMenu,
  getRestaurantOrders,
  getPersonOrder,
  updateDeliveryStatus,
  foodImageUpload,
  fetchEvents,
  createNewEvent,
  fetchRegisteredCustomers,
  uploadRestaurantProfilePic,
};
