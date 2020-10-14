/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const geocoder = require('google-geocoder');
const jwt = require('jsonwebtoken');
const url = require('url');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Login = require('../models/LoginModel');
const Restaurant = require('../models/RestaurantModel');
const { secret } = require('../../config');
const { auth } = require('../../passport');

auth();

const { BUCKET_NAME } = process.env;
const s3Storage = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const geofinder = geocoder({
  // key: `'${process.env.GOOGLEAPIKEY}'`,
  key: 'AIzaSyDHRJvSWfXNenjs51fuPKCvOODQKm2AhQY',
});

const signupRestaurant = async (req, res) => {
  Login.findOne({ emailID: req.body.emailID, Role: 'Restaurant' }, (error, result) => {
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
      let place = req.body.streetAddress.concat(', ');
      place = place.concat(req.body.zip);
      // eslint-disable-next-line func-names
      geofinder.find(place, async function (error1, response) {
        const latitude = response[0].location.lat;
        const longitude = response[0].location.lng;
        const Password = await bcrypt.hash(req.body.password, 10);
        const login = new Login({
          ...req.body,
          Password,
          Role: 'Restaurant',
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

            const restaurant = new Restaurant({
              ...req.body,
              name,
              RestaurantID: data._id,
              latitude,
              longitude,
            });
            // eslint-disable-next-line no-unused-vars
            restaurant.save((er, data1) => {
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
      });
    }
  });
};

// Restaurant login
const loginRestaurant = async (req, res) => {
  Login.findOne({ emailID: req.body.emailID, Role: 'Restaurant' }, async (error, user) => {
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

// Restaurant Logout
const restaurantLogout = async (req, res) => {
  req.logout();
  res.status(200).end('Logged out');
};

// Restaurant Profile Fetch
const restaurantProfile = async (req, res) => {
  const { RestaurantID } = url.parse(req.url, true).query;
  Restaurant.findOne({ RestaurantID }, (error, result) => {
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

// Multer function application
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

// Upload profile picture
const uploadRestaurantProfilePic = async (req, res) => {
  try {
    // const { RestaurantID } = req.body;
    // eslint-disable-next-line func-names
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
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
  return res;
};

// Restaurant Profile update
const updateRestaurantProfile = async (req, res) => {
  Restaurant.updateOne(
    { RestaurantID: req.body.user_id },
    {
      ...req.body,
      name: req.body.Name,
      contact: req.body.Contact,
      streetAddress: req.body.Street,
      city: req.body.City,
      state: req.body.StateName,
      country: req.body.Country,
      zip: req.body.Zip,
      ImageURL: req.body.ImageURL,
      Yelp_Delivery: req.body.YelpDelivery,
      Curbside_Pickup: req.body.CurbsidePickup,
      Dine_In: req.body.DineIn,
    },
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
  signupRestaurant,
  loginRestaurant,
  restaurantLogout,
  restaurantProfile,
  uploadRestaurantProfilePic,
  updateRestaurantProfile,
};
