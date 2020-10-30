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
const { auth } = require('../../../Backend/passport');
// const FoodMenu = require('../models/FoodMenuOrder');
const Cuisine = require('../models/CuisineModel');
const Appetizer = require('../models/Appetizer');
const Beverage = require('../models/Beverages');
const MainCourse = require('../models/Main_Course');
const Salads = require('../models/Salads');
const Desserts = require('../models/Desserts');
const Review = require('../models/ReviewsModel');
const Order = require('../models/OrdersModel');
const Events = require('../models/EventsModel');

auth();


const geofinder = geocoder({
  // key: `'${process.env.GOOGLEAPIKEY}'`,
  key: 'AIzaSyDHRJvSWfXNenjs51fuPKCvOODQKm2AhQY',
});

async function handle_request(msg, callback) {
  switch(msg.api) {
    case 'signupRestaurant': {
      let res = {};
      Login.findOne({ emailID: msg.body.emailID, Role: 'Restaurant' }, (error, result) => {
        if (error) {
          res.status = 500;
          res.end = 'Network Error';
          callback(null, res);
        }
        if (result) {
          res.status = 400;
          res.end ='EmailID already in use';
          callback(null, res);
        } else {
          let place = msg.body.streetAddress.concat(', ');
          place = place.concat(msg.body.zip);
          // eslint-disable-next-line func-names
          geofinder.find(place, async function (error1, response) {
            const latitude = response[0].location.lat;
            const longitude = response[0].location.lng;
            const Password = await bcrypt.hash(msg.body.password, 10);
            const login = new Login({
              ...msg.body,
              Password,
              Role: 'Restaurant',
            });
            // eslint-disable-next-line no-unused-vars
            login.save((e, data) => {
              if (e) {
                res.status = 500;
                res.end = 'Network Error';
                callback(null, res);
              } else {
                let name = msg.body.firstName.concat(' ');
                name = name.concat(msg.body.lastName);
    
                const restaurant = new Restaurant({
                  ...msg.body,
                  name,
                  RestaurantID: data._id,
                  Latitude: latitude,
                  Longitude: longitude,
                  TotalReviewCount: 0,
                  TotalRatings: 0,
                });
                // eslint-disable-next-line no-unused-vars
                restaurant.save((er, data1) => {
                  if (er) {
                    res.status = 500;
                    res.end = 'Network Error';
                    callback(null, res);
                  } else {
                    res.status = 200;
                    res.end = 'Signup successful';
                    callback(null, res);
                  }
                });
              }
            });
          });
        }
      });
      break;
    }
    case 'loginRestaurant': {
      let res = {};
      Login.findOne({ emailID: msg.body.emailID, Role: 'Restaurant' }, async (error, user) => {
        if (error) {
          res.status = 500;
          res.end = 'Error Occured';
          callback(null, res);
        }
        if (user) {
          if (await bcrypt.compare(msg.body.password, user.Password)) {
            const payload = { _id: user._id, username: user.emailID, role: user.Role };
            const token = jwt.sign(payload, secret, {
              expiresIn: 1008000,
            });
            res.status =200;
            res.end = `JWT ${token}`;
            callback(null, res);
          } else {
            res.status = 401;
            res.end = 'Invalid Credentials';
            callback(null, res);
          }
        } else {
          res.status = 401;
          res.end = 'User not found';
          callback(null, res);
        }
      })
      break;
    }
    case 'restaurantProfile': {
      const { RestaurantID } = url.parse(msg.body, true).query;
      let res = {};
      Restaurant.findOne({ RestaurantID }, (error, result) => {
        if (error) {
          res.status = 500;
          res.end = 'Network error';
          callback(null, res);
        } else {
          res.status = 200;
          res.end = JSON.stringify(result);
          callback(null, res);
        }
      });
      break;
    }
    case 'updateRestProfile': {
      let res = {};
      Restaurant.updateOne(
        { RestaurantID: msg.body.user_id },
        {
          ...msg.body,
          name: msg.body.Name,
          contact: msg.body.Contact,
          streetAddress: msg.body.Street,
          city: msg.body.City,
          state: msg.body.StateName,
          country: msg.body.Country,
          zip: msg.body.Zip,
          ImageURL: msg.body.ImageURL,
          Yelp_Delivery: msg.body.YelpDelivery,
          Curbside_Pickup: msg.body.CurbsidePickup,
          Dine_In: msg.body.DineIn,
        },
        (er, data) => {
          if (er) {
            res.status = 500;
            res.end = 'Network Error';
            callback(null, res);
          } else {
            res.status = 200;
            res.end = 'Updated successfully';
            callback(null, res);
          }
        }
      );
      break;
    }
    case 'cuisineFetch': {
      let res = {};
      const resultData = [];
      // const { RestaurantID } = url.parse(data.body, true).query;
      Cuisine.find({}, (error2, result2) => {
        if (error2) {
          res.status = 500;
          res.end = 'Network Error';
          callback(null, res);
        } else {
          res.status = 200;
          res.end = JSON.stringify(result2);
          callback(null, res);
        }
      });
      break;
    }
    case 'menuInsert': {
      // const { RestaurantID } = url.parse(msg.url, true).query;
      let res = {};
      if (msg.body.category === 'APPETIZERS') {
        const appetizer = new Appetizer({
          ...msg.body,
        });
        appetizer.save((e, data) => {
          if (e) {
            res.status = 500;
            res.end = 'Network Error';
            callback(null, res);
          } else {
            res.status = 200;
            res.end = 'Insertion Successful';
            callback(null, res);
          }
        });
      } else if (msg.body.category === 'BEVERAGES') {
        const beverage = new Beverage({
          ...msg.body,
        });
        beverage.save((e, data) => {
          if (e) {
            res.status = 500;
            res.end = 'Network Error';
            callback(null, res);
          } else {
            res.status = 200;
            res.end = 'Insertion Successful';
            callback(null, res);
          }
        });
      } else if (msg.body.category === 'MAIN_COURSE') {
        const mainCourse = new MainCourse({
          ...msg.body,
        });
        mainCourse.save((e, data) => {
          if (e) {
            res.status = 500;
            res.end = 'Network Error';
            callback(null, res);
          } else {
            res.status = 200;
            res.end = 'Insertion Successful';
            callback(null, res);
          }
        });
      } else if (msg.body.category === 'SALADS') {
        const salads = new Salads({
          ...msg.body,
        });
        salads.save((e, data) => {
          if (e) {
            res.status = 500;
            res.end = 'Network Error';
            callback(null, res);
          } else {
            res.status = 200;
            res.end = 'Insertion Successful';
            callback(null, res);
          }
        });
      } else {
        const desserts = new Desserts({
          ...msg.body,
        });
        desserts.save((e, data) => {
          if (e) {
            res.status = 500;
            res.end = 'Network error';
            callback(null, res);
          } else {
            res.status = 200;
            res.end = 'Insertion Successful';
            callback(null, res);
          }
        });
      }
      break;
    }
    case 'menuFetch': {
      const { RestaurantID, pageNo, category } = url.parse(msg.url, true).query;
      let res = {};
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
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
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
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
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
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
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
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
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
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
      }
      break;
    }
    case 'menuDelete': {
      const { category, foodId } = msg.body;
      let menuModel = null;
      let res = {};
      if (category === 'APPETIZERS') menuModel = Appetizer;
      else if (category === 'BEVERAGES') menuModel = Beverage;
      else if (category === 'MAIN_COURSE') menuModel = MainCourse;
      else if (category === 'SALADS') menuModel = Salads;
      else menuModel = Desserts;
      menuModel.deleteOne({ _id: foodId }, (error, result) => {
        if (error) {
          res.status = 500;
          res.end = 'Network Error';
          callback(null, res);
        }
        if (result.n === 0) {
          res.status = 400;
          res.end = 'Food Item does not exists';
          callback(null, res);
        } else {
          res.status = 200;
          res.end = 'Deletion successful';
          callback(null, res);
        }
      });
      break;
    }
    case 'updateMenu': {
      const { category, ID } = msg.body;
      let res = {};
      let menuModel = null;
      if (category === 'APPETIZERS') menuModel = Appetizer;
      else if (category === 'BEVERAGES') menuModel = Beverage;
      else if (category === 'MAIN_COURSE') menuModel = MainCourse;
      else if (category === 'SALADS') menuModel = Salads;
      else menuModel = Desserts;
      menuModel.updateOne(
        { _id: ID },
        {
          ...msg.body,
          Dishname: msg.body.Name,
          Main_Ingredients: msg.body.MainIngredients,
          Cuisine: msg.body.CuisineID,
          ImageURL: msg.body.ImageUrl,
        },
        (er, data) => {
          if (er) {
            res.status = 500;
            res.end = 'Network Profile';
            callback(null, res);
          } else {
            res.status = 200;
            res.end = 'Updation successful';
            callback(null, res);
          }
        }
  );
    }
    case 'fetchReview': {
      const { RestaurantID, pageNo } = url.parse(msg.url, true).query;
      let res = {};
      const result = await Review.find({ RestaurantID })
        .limit(4)
        .skip(pageNo * 4)
        .exec();
      const count = await Review.find({ RestaurantID }).countDocuments();
      const noOfPages = Math.ceil(count / 4);
      const results = [];
      results.push(result);
      results.push(noOfPages);
      res.status = 200;
      res.end = JSON.stringify(results);
      callback(null, res);
      break;
    }
    case 'fetchOrderandDetails': {
      const { RestaurantID, pageNo, sortValue } = url.parse(msg.url, true).query;
      let statusValue = null;
      let res = {};
      if (sortValue === 'All') {
        statusValue = [
          { Status: 'Order Received' },
          { Status: 'Preparing' },
          { Status: 'On the way' },
          { Status: 'Pick up Ready' },
          { Status: 'Delivered' },
          { Status: 'Picked up' },
        ];
      } else if (sortValue === 'New') {
        statusValue = [
          { Status: 'Order Received' },
          { Status: 'Preparing' },
          { Status: 'On the way' },
          { Status: 'Pick up Ready' },
        ];
      } else if (sortValue === 'Delivered')
        statusValue = [{ Status: 'Delivered' }, { Status: 'Picked up' }];
      else statusValue = [{ Status: 'Canceled' }];

      const result = await Order.find({ $and: [{ RestaurantID }, { $or: statusValue }] })
        .limit(4)
        .skip(pageNo * 4)
        .exec();
      const count = await Order.find({
        $and: [{ RestaurantID }, { $or: statusValue }],
      }).countDocuments();
      const noOfPages = Math.ceil(count / 4);
      const results = [];
      results.push(result);
      results.push(noOfPages);
      results.push(count);
      res.status = 200;
      res.end = JSON.stringify(results);
      callback(null, res);
      break;
    }
    case 'updateDeliveryStatus': {
      const { deliveryStatus, orderID } = msg.body;
      let res = {};
      let status = null;
      let state = 'New';
      if (deliveryStatus === '2') status = 'Preparing';
      else if (deliveryStatus === '3') status = 'On the way';
      else if (deliveryStatus === '4') status = 'Pick up Ready';
      else if (deliveryStatus === '5') {
        status = 'Delivered';
        state = 'Delivered';
      } else if (deliveryStatus === '6') {
        status = 'Picked up';
        state = 'Delivered';
      } else {
        status = 'Canceled';
        state = 'Canceled';
      }
      Order.updateOne(
        { _id: orderID },
        {
          StatusID: deliveryStatus,
          Status: status,
          State: state,
        },
        (er, data) => {
          if (er) {
            res.status = 500;
            res.end = 'Network Error';
            callback(null, res);
          } else {
            res.status = 200;
            res.end = 'Order status updated';
            callback(null, res);
          }
        }
      );
      break;
    }
    case 'fetchEvents': {
      const { RestaurantID, pageNo, sortValue } = url.parse(msg.url, true).query;
      const results = [];
      let res = {};
      if (sortValue === 'upcoming') {
        const result = await Events.find({
          $and: [{ RestaurantID }, { EventDate: { $gte: new Date() } }],
        })
          .limit(4)
          .skip(pageNo * 4)
          .exec();
        const count = await Events.find({
          $and: [{ RestaurantID }, { EventDate: { $gte: new Date() } }],
        }).countDocuments();
        const noOfPages = Math.ceil(count / 4);
        results.push(result);
        results.push(noOfPages);
        results.push(count);
      } else {
        const result = await Events.find({
          $and: [{ RestaurantID }, { EventDate: { $lt: new Date() } }],
        })
          .limit(4)
          .skip(pageNo * 4)
          .exec();
        const count = await Events.find({
          $and: [{ RestaurantID }, { EventDate: { $lt: new Date() } }],
        }).countDocuments();
        const noOfPages = Math.ceil(count / 4);
        results.push(result);
        results.push(noOfPages);
        results.push(count);
      }
      res.status = 200;
      res.end = JSON.stringify(results);
      callback(null, res);
      break;
    }
    case 'createNewEvent': {
      let res = {};
      Events.findOne(
        { RestaurantID: msg.body.RestaurantID, EventName: msg.body.name },
        (error, result) => {
          if (error) {
            res.status = 500;
            res.end = 'Network Error';
            callback(null, res);
          }
          if (result) {
            res.status = 400;
            res.end = 'Event exists already';
            callback(null, res);
          } else {
            let location = msg.body.Street.concat(' ,');
            location = location.concat(msg.body.City);
            location = location.concat(' ,');
            location = location.concat(msg.body.State);
            location = location.concat(' ,');
            location = location.concat(msg.body.Zip);
            location = location.concat(' ,');
            location = location.concat(msg.body.Country);
            const events = new Events({
              ...msg.body,
              EventName: msg.body.Name,
              Location: location,
              Hashtags: msg.body.hashtags,
            });
            // eslint-disable-next-line no-unused-vars
            events.save((e, data) => {
              if (e) {
                res.status = 500;
                res.end = 'Network Error';
                callback(null, res);
              } else {
                res.status = 200;
                res.end = 'New event created';
                callback(null, res);
              }
            });
          }
        }
      );
      break;
    }
    case 'fetchRegisteredCustomers': {
      const { eventID, pageNo } = url.parse(msg.url, true).query;
      const results = [];
      let res = {};
      try {
        const result = await Events.findOne(
          { _id: eventID },
          { RegisteredCustomers: { $slice: [pageNo * 4, 4] } }
        );
          
        const count = (await Events.findOne({ _id: eventID })).RegisteredCustomers.length;
        const noOfPages = Math.ceil(count / 4);
        results.push(result);
        results.push(noOfPages);
        results.push(count);
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
      } catch (error) {
        res.status = 400;
        res.end = 'No customers found';
        callback(null, res);
      }

      break;
    }
    default:
      break;
  }
}

exports.handle_request = handle_request;


// exports.handle_request = handle_request;
