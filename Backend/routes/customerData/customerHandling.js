/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const url = require('url');
const Login = require('../models/LoginModel');
const Customer = require('../models/CustomerModel');
const Appetizer = require('../models/Appetizer');
const Beverage = require('../models/Beverages');
const Desserts = require('../models/Desserts');
const MainCourse = require('../models/Main_Course');
const Salads = require('../models/Salads');
const Cuisine = require('../models/CuisineModel');
const Restaurant = require('../models/RestaurantModel');
const Review = require('../models/ReviewsModel');
const Order = require('../models/OrdersModel');
const Events = require('../models/EventsModel');
const CustEvents = require('../models/CustomerRegisteredEvents');
const { secret } = require('../../config');
const { auth } = require('../../passport');

auth();

const { BUCKET_NAME } = process.env;
const s3Storage = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// Customer signup
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
            City: req.body.city,
            state: req.body.stateName,
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

// Customer contact details update
const updateContactInfo = async (req, res) => {
  Login.findOne({ _id: req.body.user_id, Role: 'Customer' }, async (error, user) => {
    if (error) {
      res.status(500).end('Error Occured');
    }
    if (user) {
      if (req.body.emailID !== req.body.newEmailID) {
        if (await bcrypt.compare(req.body.Password, user.Password)) {
          Login.updateOne(
            { _id: req.body.user_id },
            {
              emailID: req.body.newEmailID,
            },
            // eslint-disable-next-line no-unused-vars
            (er, data) => {
              if (er) {
                res.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                res.end();
              } else {
                const payload = { _id: user._id, username: req.body.newEmailID, role: user.Role };
                const token = jwt.sign(payload, secret, {
                  expiresIn: 1008000,
                });
                Customer.updateOne(
                  { CustomerID: req.body.user_id },
                  {
                    contact: req.body.contact,
                  },
                  // eslint-disable-next-line no-unused-vars
                  (err, data1) => {
                    if (err) {
                      res.writeHead(500, {
                        'Content-Type': 'text/plain',
                      });
                      res.end();
                    } else {
                      res.status(200).end(`JWT ${token}`);
                    }
                  }
                );
              }
            }
          );
        } else {
          res.status(400).end('Invalid credentials');
        }
      } else {
        Customer.updateOne(
          { CustomerID: req.body.user_id },
          {
            ...req.body,
          },
          // eslint-disable-next-line no-unused-vars
          (err, data1) => {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              res.end();
            } else {
              res.status(200).end(req.body.token);
            }
          }
        );
      }
    } else {
      res.status(401).end('Invalid Credentials');
    }
  });
};

// Fetching restaurant search strings
const fetchSearchStrings = async (req, res) => {
  const data = [];
  await Appetizer.find({}, (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result) {
      data.push(result);
    } else {
      data.push(0);
    }
  });
  await Beverage.find({}, (error1, result1) => {
    if (error1) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result1) {
      data.push(result1);
    } else {
      data.push(0);
    }
  });
  await MainCourse.find({}, (error2, result2) => {
    if (error2) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result2) {
      data.push(result2);
    } else {
      data.push(0);
    }
  });
  await Salads.find({}, (error3, result3) => {
    if (error3) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result3) {
      data.push(result3);
    } else {
      data.push(0);
    }
  });
  await Desserts.find({}, (error4, result4) => {
    if (error4) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result4) {
      data.push(result4);
    } else {
      data.push(0);
    }
  });
  await Cuisine.find({}, (error5, result5) => {
    if (error5) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result5) {
      data.push(result5);
    } else {
      data.push(0);
    }
  });
  await Restaurant.find({}, (error6, result6) => {
    if (error6) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result6) {
      data.push(result6);
    } else {
      data.push(0);
    }
  });
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(data));
};

// Fetching all possible restaurant searches
const fetchRestaurantResults = async (req, res) => {
  const { filter, searchString, pageNo } = url.parse(req.url, true).query;
  let restaurantData = [];
  let count = 0;
  if (filter === '1') {
    restaurantData = await Restaurant.find({
      name: { $regex: `${searchString}`, $options: 'i' },
    })
      .limit(4)
      .skip(pageNo * 4)
      .exec();
    count = await Restaurant.find({
      name: { $regex: `${searchString}`, $options: 'i' },
    }).countDocuments();
  } else if (filter === '2') {
    const appetizerRestID = await Appetizer.find(
      {
        Dishname: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const beveragesRestID = await Beverage.find(
      {
        Dishname: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const mainCourseRestID = await MainCourse.find(
      {
        Dishname: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const dessertRestID = await Desserts.find(
      {
        Dishname: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const saladRestID = await Salads.find(
      {
        Dishname: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const apptizerRestaurantID = appetizerRestID.map((restID) => {
      return restID.RestaurantID;
    });
    const beverageRestaurantID = beveragesRestID.map((restID) => {
      return restID.RestaurantID;
    });
    const mainCourdeRestaurantID = mainCourseRestID.map((restID) => {
      return restID.RestaurantID;
    });
    const saladsRestaurantID = saladRestID.map((restID) => {
      return restID.RestaurantID;
    });
    const dessertsRestaurantID = dessertRestID.map((restID) => {
      return restID.RestaurantID;
    });

    restaurantData = await Restaurant.find({
      RestaurantID: {
        $in: [
          ...apptizerRestaurantID,
          ...beverageRestaurantID,
          ...mainCourdeRestaurantID,
          ...saladsRestaurantID,
          ...dessertsRestaurantID,
        ],
      },
    })
      .limit(4)
      .skip(pageNo * 4)
      .exec();

    count = await Restaurant.find({
      RestaurantID: {
        $in: [
          ...apptizerRestaurantID,
          ...beverageRestaurantID,
          ...mainCourdeRestaurantID,
          ...saladsRestaurantID,
          ...dessertsRestaurantID,
        ],
      },
    }).countDocuments();
  } else if (filter === '3') {
    const appetizerRestID = await Appetizer.find(
      {
        Cuisine: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const beveragesRestID = await Beverage.find(
      {
        Cuisine: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const mainCourseRestID = await MainCourse.find(
      {
        Cuisine: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const dessertRestID = await Desserts.find(
      {
        Cuisine: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const saladRestID = await Salads.find(
      {
        Cuisine: { $regex: `${searchString}`, $options: 'i' },
      },
      { _id: 0, RestaurantID: 1 }
    );
    const apptizerRestaurantID = appetizerRestID.map((restID) => {
      return restID.RestaurantID;
    });
    const beverageRestaurantID = beveragesRestID.map((restID) => {
      return restID.RestaurantID;
    });
    const mainCourdeRestaurantID = mainCourseRestID.map((restID) => {
      return restID.RestaurantID;
    });
    const saladsRestaurantID = saladRestID.map((restID) => {
      return restID.RestaurantID;
    });
    const dessertsRestaurantID = dessertRestID.map((restID) => {
      return restID.RestaurantID;
    });

    restaurantData = await Restaurant.find({
      RestaurantID: {
        $in: [
          ...apptizerRestaurantID,
          ...beverageRestaurantID,
          ...mainCourdeRestaurantID,
          ...saladsRestaurantID,
          ...dessertsRestaurantID,
        ],
      },
    })
      .limit(4)
      .skip(pageNo * 4)
      .exec();

    count = await Restaurant.find({
      RestaurantID: {
        $in: [
          ...apptizerRestaurantID,
          ...beverageRestaurantID,
          ...mainCourdeRestaurantID,
          ...saladsRestaurantID,
          ...dessertsRestaurantID,
        ],
      },
    }).countDocuments();
  } else {
    restaurantData = await Restaurant.aggregate([
      {
        $addFields: {
          restLocation: {
            $concat: ['$state', ', ', '$city', ', ', '$streetAddress'],
          },
        },
      },
      {
        $match: {
          restLocation: {
            $regex: `${searchString}`,
            $options: 'i',
          },
        },
      },
    ])
      .limit(4)
      .skip(pageNo * 4)
      .exec();

    count = await Restaurant.aggregate([
      {
        $addFields: {
          restLocation: {
            $concat: ['$state', ', ', '$city', ', ', '$streetAddress'],
          },
        },
      },
      {
        $match: {
          restLocation: {
            $regex: `${searchString}`,
            $options: 'i',
          },
        },
      },
      {
        $count: 'count',
      },
    ]);
  }
  const noOfPages = Math.ceil(count / 4);
  const result = [restaurantData, count, noOfPages];
  res.status(200).end(JSON.stringify(result));
};

// Restaurant profile fetch for customer view
const fetchRestaurantProfileForCustomer = async (req, res) => {
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

// Submitting the review for a restaurant
const submitReview = async (req, res) => {
  const review = new Review({
    ...req.body,
    Ratings: req.body.rating,
    Review: req.body.review,
  });
  // eslint-disable-next-line no-unused-vars
  review.save((e, data) => {
    if (e) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    } else {
      Restaurant.findOne({ RestaurantID: req.body.RestaurantID }, (error, result) => {
        if (error) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end();
        } else {
          const totalReviewCount = Number(result.TotalReviewCount);
          const totalRatings = result.TotalRatings;
          Restaurant.updateOne(
            { RestaurantID: req.body.RestaurantID },
            {
              TotalReviewCount: totalReviewCount + 1,
              TotalRatings: totalRatings + Number(req.body.rating),
            },
            (er, data1) => {
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
        }
      });
    }
  });
};

// Generating an order
const generateOrder = async (req, res) => {
  const order = new Order({
    ...req.body,
  });
  // eslint-disable-next-line no-unused-vars
  order.save((e, data) => {
    if (e) {
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
};

// Fetching menu
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

// Fetching the orders placed by the customer
const fetchAllOrders = async (req, res) => {
  const { CustomerID, filter1, filter2, sortOrder, pageNo } = url.parse(req.url, true).query;
  let orderDetails = [];
  if (filter1 !== 'All') {
    orderDetails = await Order.find({ CustomerID, DeliveryMode: filter1, Status: filter2 })
      .sort({ Date: sortOrder })
      .limit(4)
      .skip(pageNo * 4)
      .exec();
    const count = await Order.find({
      CustomerID,
      DeliveryMode: filter1,
      Status: filter2,
    }).countDocuments();
    const noOfPages = Math.ceil(count / 4);
    const results = [];
    results.push(orderDetails);
    results.push(noOfPages);
    results.push(count);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } else {
    orderDetails = await Order.find({ CustomerID })
      .sort({ Date: sortOrder })
      .limit(4)
      .skip(pageNo * 4)
      .exec();
    const count = await Order.find({ CustomerID }).countDocuments();
    const noOfPages = Math.ceil(count / 4);
    const results = [];
    results.push(orderDetails);
    results.push(noOfPages);
    results.push(count);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  }
};

// Fetching the event listy for customer
const fetchEventList = async (req, res) => {
  const { filter, pageNo } = url.parse(req.url, true).query;
  const eventDetails = await Events.find({ EventDate: { $gte: new Date() } })
    .sort({ EventDate: filter })
    .limit(4)
    .skip(pageNo * 4)
    .exec();
  const count = await Events.find({ EventDate: { $gte: new Date() } }).countDocuments();
  const noOfPages = Math.ceil(count / 4);
  const results = [];
  results.push(eventDetails);
  results.push(noOfPages);
  results.push(count);
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(JSON.stringify(results));
};

// Registering customer to an event
const eventRegistration = async (req, res) => {
  try {
    Events.findOne({ _id: req.body.EventID }, async (error, result) => {
      if (error) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end();
      }
      if (result) {
        Events.updateOne(
          { _id: req.body.EventID },
          { $push: { RegisteredCustomers: req.body.RegisteredCustomers } },
          // eslint-disable-next-line no-unused-vars
          (er, data) => {
            if (er) {
              res.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              res.end();
            } else {
              const custRegEvents = new CustEvents({
                ...req.body.RegisteredCustomers,
              });
              // eslint-disable-next-line no-unused-vars
              custRegEvents.save((e, data1) => {
                if (e) {
                  res.writeHead(500, {
                    'Content-Type': 'text/plain',
                  });
                  res.end();
                } else {
                  Customer.findOne({ CustomerID: req.body.CustomerID }, async (error1, result1) => {
                    if (error1) {
                      res.writeHead(500, {
                        'Content-Type': 'text/plain',
                      });
                      res.end();
                    }
                    if (result1) {
                      Customer.updateOne(
                        { CustomerID: req.body.CustomerID },
                        { $push: { Events: req.body } },
                        // eslint-disable-next-line no-unused-vars
                        (er1, data2) => {
                          if (er1) {
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
                    }
                  });
                }
              });
            }
          }
        );
      }
    });
  } catch (errorrr) {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end();
  }
};

// Fetching searched event list for customer
const fetchSearchedEventList = async (req, res) => {
  const { searchString, filter, pageNo } = url.parse(req.url, true).query;
  const events = await Events.find({
    EventName: { $regex: `${searchString}`, $options: 'i' },
  })
    .sort({ EventDate: filter })
    .limit(4)
    .skip(pageNo * 4)
    .exec();
  const count = await Events.find({
    EventName: { $regex: `${searchString}`, $options: 'i' },
  }).countDocuments();
  const noOfPages = Math.ceil(count / 4);
  const results = [];
  results.push(events);
  results.push(noOfPages);
  results.push(count);
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(JSON.stringify(results));
};

// Fetching customer registered events
const getCustRegisteredEvents = async (req, res) => {
  try {
    const { CustomerID, filter, pageNo } = url.parse(req.url, true).query;
    const eventDetails = await CustEvents.find({ CustomerID })
      .sort({ EventDate: filter })
      .limit(4)
      .skip(pageNo * 4)
      .exec();
    const count = await CustEvents.find({ CustomerID }).countDocuments();
    const noOfPages = Math.ceil(count / 4);
    const results = [];
    results.push(eventDetails);
    results.push(noOfPages);
    results.push(count);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end();
  }
};

// Fetching yelp users list
const fetchYelpUserList = async (req, res) => {
  try {
    const { CustomerID, pageNo, category } = url.parse(req.url, true).query;
    if (category === 'All') {
      const customer = await Customer.find({ CustomerID: { $nin: [CustomerID] } })
        .limit(4)
        .skip(pageNo * 4)
        .exec();
      const count = await Customer.find({ CustomerID: { $nin: [CustomerID] } }).countDocuments();
      const noOfPages = Math.ceil(count / 4);
      const results = [];
      results.push(customer);
      results.push(noOfPages);
      results.push(count);
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end(JSON.stringify(results));
    } else {
      const start = Number(pageNo) * 4;
      const end = start + 4;
      const customer = await Customer.find({ CustomerID }, { Following: { $slice: [start, end] } });
      const record = await Customer.find({ CustomerID });
      const count = record[0].FollowingCustomerIDs.length;
      const noOfPages = Math.ceil(count / 4);
      const results = [];
      results.push(customer);
      results.push(noOfPages);
      results.push(count);
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end(JSON.stringify(results));
    }
  } catch (error) {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end();
  }
};

// Following a user on yelp
const followUser = async (req, res) => {
  try {
    Customer.findOne({ CustomerID: req.body.CustomerID }, async (error, result) => {
      if (error) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end();
      }
      if (result) {
        Customer.updateOne(
          { CustomerID: req.body.CustomerID },
          {
            $push: {
              Following: req.body.Following,
              FollowingCustomerIDs: req.body.FollowingCustomerIDs,
            },
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
      }
    });
  } catch (errorrr) {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end();
  }
};

// Fetching searched yelp user
const fetchSearchedYelpUser = async (req, res) => {
  try {
    let customerData = [];
    let count = 0;
    const { CustomerID, searchString, searchCriteria, pageNo } = url.parse(req.url, true).query;
    if (searchCriteria === 'First Name') {
      customerData = await Customer.find({
        $and: [
          { CustomerID: { $nin: [CustomerID] } },
          { name: { $regex: `${searchString}`, $options: 'i' } },
        ],
      })
        .limit(4)
        .skip(pageNo * 4)
        .exec();
      count = await Customer.find({
        $and: [
          { CustomerID: { $nin: [CustomerID] } },
          { name: { $regex: `${searchString}`, $options: 'i' } },
        ],
      }).countDocuments();
    } else if (searchCriteria === 'NickName') {
      customerData = await Customer.find({
        $and: [
          { CustomerID: { $nin: [CustomerID] } },
          { NickName: { $regex: `${searchString}`, $options: 'i' } },
        ],
      })
        .limit(4)
        .skip(pageNo * 4)
        .exec();
      count = await Customer.find({
        $and: [
          { CustomerID: { $nin: [CustomerID] } },
          { NickName: { $regex: `${searchString}`, $options: 'i' } },
        ],
      }).countDocuments();
    } else {
      customerData = await Customer.find({
        $and: [
          { CustomerID: { $nin: [CustomerID] } },
          { City: { $regex: `${searchString}`, $options: 'i' } },
        ],
      })
        .limit(4)
        .skip(pageNo * 4)
        .exec();
      count = await Customer.find({
        $and: [
          { CustomerID: { $nin: [CustomerID] } },
          { City: { $regex: `${searchString}`, $options: 'i' } },
        ],
      }).countDocuments();
    }
    const noOfPages = Math.ceil(count / 4);
    const results = [];
    results.push(customerData);
    results.push(noOfPages);
    results.push(count);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end();
  }
};

module.exports = {
  signupCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomerCompleteProfile,
  uploadCustomerProfilePic,
  updateProfile,
  updateContactInfo,
  fetchSearchStrings,
  fetchRestaurantResults,
  fetchRestaurantProfileForCustomer,
  submitReview,
  generateOrder,
  menuFetch,
  fetchAllOrders,
  fetchEventList,
  eventRegistration,
  getCustRegisteredEvents,
  fetchSearchedEventList,
  fetchYelpUserList,
  followUser,
  fetchSearchedYelpUser,
};
