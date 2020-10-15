/* eslint-disable func-names */
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
// const FoodMenu = require('../models/FoodMenuOrder');
const Cuisine = require('../models/CuisineModel');
const Appetizer = require('../models/Appetizer');
const Beverage = require('../models/Beverages');
const MainCourse = require('../models/Main_Course');
const Salads = require('../models/Salads');
const Desserts = require('../models/Desserts');

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

// Food Menu and Cuisine Fetch
const cuisineFetch = async (req, res) => {
  const resultData = [];
  const { RestaurantID } = url.parse(req.url, true).query;
  Cuisine.find({}, (error2, result2) => {
    if (error2) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    } else {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(result2));
    }
  });
};

// Image uploading for food
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

// Food Image Upload
const foodImageUpload = async (req, res) => {
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

const menuInsert = async (req, res) => {
  const { RestaurantID } = url.parse(req.url, true).query;
  if (req.body.category === 'APPETIZERS') {
    const appetizer = new Appetizer({
      ...req.body,
    });
    appetizer.save((e, data) => {
      if (e) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        res.end('Insertion Successful');
      }
    });
  } else if (req.body.category === 'BEVERAGES') {
    const beverage = new Beverage({
      ...req.body,
    });
    beverage.save((e, data) => {
      if (e) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        res.end('Insertion Successful');
      }
    });
  } else if (req.body.category === 'MAIN_COURSE') {
    const mainCourse = new MainCourse({
      ...req.body,
    });
    mainCourse.save((e, data) => {
      if (e) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        res.end('Insertion Successful');
      }
    });
  } else if (req.body.category === 'SALADS') {
    const salads = new Salads({
      ...req.body,
    });
    salads.save((e, data) => {
      if (e) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        res.end('Insertion Successful');
      }
    });
  } else {
    const desserts = new Desserts({
      ...req.body,
    });
    desserts.save((e, data) => {
      if (e) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        res.end('Insertion Successful');
      }
    });
  }
};

const menuFetch = async (req, res) => {
  const { RestaurantID, pageNo, category } = url.parse(req.url, true).query;
  if (category === 'APPETIZERS') {
    const result = await Appetizer.find({ RestaurantID })
      .limit(4)
      .skip(pageNo * 4)
      .exec();
    const count = await Appetizer.find({ RestaurantID }).countDocuments();
    const noOfPages = Math.ceil(count / 4);
    const results = [];
    results.push(result);
    results.push(noOfPages);
    results.push(count);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } else if (category === 'BEVERAGES') {
    const result = await Beverage.find({ RestaurantID })
      .limit(4)
      .skip(pageNo * 4)
      .exec();
    const count = await Beverage.find({ RestaurantID }).countDocuments();
    const noOfPages = Math.ceil(count / 4);
    const results = [];
    results.push(result);
    results.push(noOfPages);
    results.push(count);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } else if (category === 'MAIN_COURSE') {
    const result = await MainCourse.find({ RestaurantID })
      .limit(4)
      .skip(pageNo * 4)
      .exec();
    const count = await MainCourse.find({ RestaurantID }).countDocuments();
    const noOfPages = Math.ceil(count / 4);
    const results = [];
    results.push(result);
    results.push(noOfPages);
    results.push(count);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } else if (category === 'SALADS') {
    const result = await Salads.find({ RestaurantID })
      .limit(4)
      .skip(pageNo * 4)
      .exec();
    const count = await Salads.find({ RestaurantID }).countDocuments();
    const noOfPages = Math.ceil(count / 4);
    const results = [];
    results.push(result);
    results.push(noOfPages);
    results.push(count);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } else {
    const result = await Desserts.find({ RestaurantID })
      .limit(4)
      .skip(pageNo * 4)
      .exec();
    const count = await Desserts.find({ RestaurantID }).countDocuments();
    const noOfPages = Math.ceil(count / 4);
    const results = [];
    results.push(result);
    results.push(noOfPages);
    results.push(count);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  }
};

const menuDelete = async (req, res) => {
  const { category, foodId } = req.body;
  let menuModel = null;
  if (category === 'APPETIZERS') menuModel = Appetizer;
  else if (category === 'BEVERAGES') menuModel = Beverage;
  else if (category === 'MAIN_COURSE') menuModel = MainCourse;
  else if (category === 'SALADS') menuModel = Salads;
  else menuModel = Desserts;
  menuModel.deleteOne({ _id: foodId }, (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result.n === 0) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Food Item does not exists');
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
  });
};
module.exports = {
  signupRestaurant,
  loginRestaurant,
  restaurantLogout,
  restaurantProfile,
  uploadRestaurantProfilePic,
  updateRestaurantProfile,
  cuisineFetch,
  foodImageUpload,
  menuInsert,
  menuFetch,
  menuDelete,
};
