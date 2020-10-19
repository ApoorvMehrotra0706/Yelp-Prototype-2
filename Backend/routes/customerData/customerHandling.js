/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const url = require('url');
const Login = require('../models/LoginModel');
const Customer = require('../models/CustomerModel');
const { secret } = require('../../config');
const { auth } = require('../../passport');

auth();

const { BUCKET_NAME } = process.env;
const s3Storage = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const signupCustomer = async (req, res) => {
  Login.findOne({ emailID: req.body.emailID, Role: 'Customer' }, async (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('EmailID already in use');
    } else {
      const Password = await bcrypt.hash(req.body.password, 10);
      const login = new Login({
        ...req.body,
        Password,
        Role: 'Customer',
      });
      // eslint-disable-next-line no-unused-vars
      login.save((e, data) => {
        if (e) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end();
        } else {
          let name = req.body.firstName.concat(' ');
          name = name.concat(req.body.lastName);
          let today = new Date();
          const dd = String(today.getDate()).padStart(2, '0');
          const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
          const yyyy = today.getFullYear();

          today = `${mm}/${dd}/${yyyy}`;
          const customer = new Customer({
            ...req.body,
            name,
            // eslint-disable-next-line no-underscore-dangle
            CustomerID: data._id,
            YelpingSince: today,
          });
          // eslint-disable-next-line no-unused-vars
          customer.save((er, data1) => {
            if (er) {
              res.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              res.end();
            } else {
              res.writeHead(200, {
                'Content-Type': 'text/plain',
              });
              res.end();
            }
          });
        }
      });
    }
  });
};

// Customer login
const loginCustomer = async (req, res) => {
  Login.findOne({ emailID: req.body.emailID, Role: 'Customer' }, async (error, user) => {
    if (error) {
      res.status(500).end('Error Occured');
    }
    if (user) {
      if (await bcrypt.compare(req.body.password, user.Password)) {
        const payload = { _id: user._id, username: user.emailID, role: user.Role };
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        res.status(200).end(`JWT ${token}`);
      } else {
        res.status(401).end('Invalid Credentials');
      }
    } else {
      res.status(401).end('User not found');
    }
  });
};

// Logout Customer
const logoutCustomer = async (req, res) => {
  req.logout();
  res.status(200).end('Logged out');
};

// Fetching Customer Profile
const getCustomerCompleteProfile = async (req, res) => {
  const { CustomerID } = url.parse(req.url, true).query;
  Customer.findOne({ CustomerID }, (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    } else {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(result));
    }
  });
};

// upload Customer Profile Pic
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

// Receiving request for profile picture upload
const uploadCustomerProfilePic = async (req, res) => {
  try {
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
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
  return res;
};

// Customer Profile update
const updateProfile = async (req, res) => {
  Customer.updateOne(
    { CustomerID: req.body.user_id },
    {
      ...req.body,
      name: req.body.Name,
      contact: req.body.Contact,
      gender: req.body.Gender,
      state: req.body.State,
      country: req.body.Country,
      Things_Customer_Love: req.body.ILove,
    },
    // eslint-disable-next-line no-unused-vars
    (er, data) => {
      if (er) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        res.end();
      }
    }
  );
};

module.exports = {
  signupCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomerCompleteProfile,
  uploadCustomerProfilePic,
  updateProfile,
};
