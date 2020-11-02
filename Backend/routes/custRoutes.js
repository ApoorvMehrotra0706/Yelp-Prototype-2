/* eslint-disable no-console */
/* eslint-disable func-names */
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const kafka = require('../kafka/client');
const { checkAuth } = require('../passport');

const Router = express.Router();

// Login for the customer
Router.post('/loginCustomer', async (req, res) => {
  // const value = await loginCustomer(req, res);
  // return value;
  const data = {
    api: 'loginCustomer',
    body: req.body,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Signup for the customer
Router.post('/signupCustomer', async (req, res) => {
  // const value = await signupCustomer(req, res);
  // return value;
  const data = {
    api: 'signupCustomer',
    body: req.body,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Logout for the customer
Router.post('/logoutCustomer', async (req) => {
  req.logout();
});

// Fetching customer profile
Router.get('/getCustomerCompleteProfile', checkAuth, async (req, res) => {
  // const value = await getCustomerCompleteProfile(req, res);
  // return value;
  const data = {
    api: 'getCustomerCompleteProfile',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Uploading customer profile picture
Router.post('/uploadCustomerProfilePic', checkAuth, async (req, res) => {
  // const value = await uploadCustomerProfilePic(req, res);
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

// Updating customer profile
Router.put('/updateProfile', checkAuth, async (req, res) => {
  // const value = await updateProfile(req, res);
  // return value;
  const data = {
    api: 'updateProfile',
    body: req.body,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Updating customer contact info
Router.put('/updateContactInfo', checkAuth, async (req, res) => {
  // const value = await updateContactInfo(req, res);
  // return value;
  const data = {
    api: 'updateContactInfo',
    body: req.body,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Fetching search strings
Router.get('/fetchSearchStrings', async (req, res) => {
  // const value = await fetchSearchStrings(req, res);
  // return value;
  const data = {
    api: 'fetchSearchStrings',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Fetching Restaurant Search Results
Router.get('/fetchRestaurantResults', async (req, res) => {
  // const value = await fetchRestaurantResults(req, res);
  // return value;
  const data = {
    api: 'fetchRestaurantResults',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Fetching specific restaurant profile for customer
Router.get('/fetchRestaurantProfileForCustomer', async (req, res) => {
  // const value = await fetchRestaurantProfileForCustomer(req, res);
  // return value;
  const data = {
    api: 'fetchRestaurantProfileForCustomer',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Submit the review given by the customer
Router.post('/submitReview', checkAuth, async (req, res) => {
  // const value = await submitReview(req, res);
  // return value;
  const data = {
    api: 'submitReview',
    body: req.body,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Generate order for customer
Router.post('/generateOrder', checkAuth, async (req, res) => {
  // const value = await generateOrder(req, res);
  // return value;
  const data = {
    api: 'generateOrder',
    body: req.body,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Fetch menu for the customer
Router.get('/menuFetch', checkAuth, async (req, res) => {
  // const value = await menuFetch(req, res);
  // return value;
  const data = {
    api: 'menuFetch',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Fetch orders of the customer
Router.get('/fetchAllOrders', checkAuth, async (req, res) => {
  // const value = await fetchAllOrders(req, res);
  // return value;
  const data = {
    api: 'fetchAllOrders',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Fetch event list for the customer
Router.get('/fetchEventList', checkAuth, async (req, res) => {
  // const value = await fetchEventList(req, res);
  // return value;
  const data = {
    api: 'fetchEventList',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Register customer to an event
Router.post('/eventRegistration', checkAuth, async (req, res) => {
  // const value = await eventRegistration(req, res);
  // return value;
  const data = {
    api: 'eventRegistration',
    body: req.body,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Get events registered by the customer
Router.get('/getCustRegisteredEvents', checkAuth, async (req, res) => {
  // const value = await getCustRegisteredEvents(req, res);
  // return value;
  const data = {
    api: 'getCustRegisteredEvents',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Get searched events by the customer
Router.get('/fetchSearchedEventList', checkAuth, async (req, res) => {
  // const value = await fetchSearchedEventList(req, res);
  // return value;
  const data = {
    api: 'fetchSearchedEventList',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Get the list of Yelp users
Router.get('/fetchYelpUserList', checkAuth, async (req, res) => {
  // const value = await fetchYelpUserList(req, res);
  // return value;
  const data = {
    api: 'fetchYelpUserList',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Adding the user to the fllow list of customer
Router.post('/followUser', checkAuth, async (req, res) => {
  // const value = await followUser(req, res);
  // return value;
  const data = {
    api: 'followUser',
    body: req.body,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Fetched searched yelp user
Router.get('/fetchSearchedYelpUser', checkAuth, async (req, res) => {
  // const value = await fetchSearchedYelpUser(req, res);
  // return value;
  const data = {
    api: 'fetchSearchedYelpUser',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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

// Fetching messages
Router.get('/fetchMessages', checkAuth, async (req, res) => {
  const data = {
    api: 'fetchMessages',
    url: req.url,
  };
  kafka.make_request('custRoutes', data, function (err, results) {
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
