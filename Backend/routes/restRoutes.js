/* eslint-disable no-console */
/* eslint-disable func-names */
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const kafka = require('../kafka/client');
const { checkAuth } = require('../passport');

const Router = express.Router();

// Signup for the Restaurant
Router.post('/signupRestaurant', async (req, res) => {
  // const value = await signupRestaurant(req, res);
  // return value;
  const data = {
    api: 'signupRestaurant',
    body: req.body,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Login for the Restaurant
Router.post('/loginRestaurant', async (req, res) => {
  // const value = await loginRestaurant(req, res);
  // return value;
  const data = {
    api: 'loginRestaurant',
    body: req.body,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Logout for the Restaurant
Router.post('/restaurantLogout', async (req) => {
  // const value = await restaurantLogout(req, res);
  // return value;
  req.logout();
});

// Fetching Restaurant Profile
Router.get('/restaurantProfile', checkAuth, async (req, res) => {
  // const value = await restaurantProfile(req, res);
  // return value;
  const data = {
    api: 'restaurantProfile',
    body: req.url,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

const { BUCKET_NAME } = process.env;
const s3Storage = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

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
Router.post('/uploadRestaurantProfilePic', checkAuth, async (req, res) => {
  // const value = await uploadRestaurantProfilePic(req, res);
  // return value;
  try {
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
});

// Update Restaurant Profile
Router.post('/updateRestProfile', checkAuth, async (req, res) => {
  // const value = await updateRestaurantProfile(req, res);
  // return value;
  const data = {
    api: 'updateRestProfile',
    body: req.body,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Fetching Cuisine
Router.get('/cuisineFetch', checkAuth, async (req, res) => {
  // const value = await cuisineFetch(req, res);
  // return value;
  const data = {
    api: 'cuisineFetch',
    body: req.url,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Image uploading of food
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

// Uploading food photo
Router.post('/foodImageUpload', checkAuth, async (req, res) => {
  // const value = await foodImageUpload(req, res);
  // return value;
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
});

// Inserting items in the menu
Router.post('/menuInsert', checkAuth, async (req, res) => {
  // const value = await menuInsert(req, res);
  // return value;
  const data = {
    api: 'menuInsert',
    body: req.body,
    url: req.url,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Fetching items from the menu
Router.get('/menuFetch', checkAuth, async (req, res) => {
  // const value = await menuFetch(req, res);
  // return value;
  const data = {
    api: 'menuFetch',
    url: req.url,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Deleting items from the menu
Router.post('/menuDelete', checkAuth, async (req, res) => {
  // const value = await menuDelete(req, res);
  // return value;
  const data = {
    api: 'menuDelete',
    body: req.body,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Update food items in the menu
Router.post('/updateMenu', checkAuth, async (req, res) => {
  // const value = await updateMenu(req, res);
  // return value;
  const data = {
    api: 'updateMenu',
    body: req.body,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Fetch reviews for the restaurant
Router.get('/fetchReview', checkAuth, async (req, res) => {
  // const value = await fetchReview(req, res);
  // return value;
  const data = {
    api: 'fetchReview',
    url: req.url,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Fetch order, order details and customer details
Router.get('/fetchOrderandDetails', checkAuth, async (req, res) => {
  // const value = await fetchOrderandDetails(req, res);
  // return value;
  const data = {
    api: 'fetchOrderandDetails',
    url: req.url,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Updating the order status
Router.post('/updateDeliveryStatus', checkAuth, async (req, res) => {
  // const value = await updateDeliveryStatus(req, res);
  // return value;
  const data = {
    api: 'updateDeliveryStatus',
    body: req.body,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Fetching the events
Router.get('/fetchEvents', checkAuth, async (req, res) => {
  // const value = await fetchEvents(req, res);
  // return value;
  const data = {
    api: 'fetchEvents',
    url: req.url,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Creating new events
Router.post('/createNewEvent', checkAuth, async (req, res) => {
  // const value = await createNewEvent(req, res);
  // return value;
  const data = {
    api: 'createNewEvent',
    body: req.body,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Fetching the registered customers and their details
Router.get('/fetchRegisteredCustomers', checkAuth, async (req, res) => {
  // const value = await fetchRegisteredCustomers(req, res);
  // return value;
  const data = {
    api: 'fetchRegisteredCustomers',
    url: req.url,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

// Updating the message
Router.post('/sendMessage', checkAuth, async (req, res) => {
  // const value = await fetchRegisteredCustomers(req, res);
  // return value;
  const data = {
    api: 'sendMessage',
    body: req.body,
  };
  kafka.make_request('restRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);
      res.end(results.end);
    }
  });
});

module.exports = Router;
