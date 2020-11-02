/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const url = require("url");
const Login = require("../models/LoginModel");
const Customer = require("../models/CustomerModel");
const Appetizer = require("../models/Appetizer");
const Beverage = require("../models/Beverages");
const Desserts = require("../models/Desserts");
const MainCourse = require("../models/Main_Course");
const Salads = require("../models/Salads");
const Cuisine = require("../models/CuisineModel");
const Restaurant = require("../models/RestaurantModel");
const Review = require("../models/ReviewsModel");
const Order = require("../models/OrdersModel");
const Events = require("../models/EventsModel");
const CustEvents = require("../models/CustomerRegisteredEvents");
const Messages = require("../models/MessagesModel");
const { secret } = require("../../config");
const { auth } = require("../../../Backend/passport");

auth();

async function handle_request(msg, callback) {
  switch (msg.api) {
    case "signupCustomer": {
      let res = {};
      Login.findOne(
        { emailID: msg.body.emailID, Role: "Customer" },
        async (error, result) => {
          if (error) {
            res.status = 500;
            res.end = "Network error";
            callback(null, res);
          }
          if (result) {
            res.status = 400;
            res.end = "EmailID already in use";
            callback(null, res);
          } else {
            const Password = await bcrypt.hash(msg.body.password, 10);
            const login = new Login({
              ...msg.body,
              Password,
              Role: "Customer",
            });
            // eslint-disable-next-line no-unused-vars
            login.save((e, data) => {
              if (e) {
                res.status = 500;
                res.end = "Network error";
                callback(null, res);
              } else {
                let name = msg.body.firstName.concat(" ");
                name = name.concat(msg.body.lastName);
                let today = new Date();
                const dd = String(today.getDate()).padStart(2, "0");
                const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
                const yyyy = today.getFullYear();

                today = `${mm}/${dd}/${yyyy}`;
                const customer = new Customer({
                  ...msg.body,
                  name,
                  // eslint-disable-next-line no-underscore-dangle
                  CustomerID: data._id,
                  City: msg.body.city,
                  state: msg.body.stateName,
                  YelpingSince: today,
                });
                // eslint-disable-next-line no-unused-vars
                customer.save((er, data1) => {
                  if (er) {
                    res.status = 400;
                    res.end = "Failed to save";
                    callback(null, res);
                  } else {
                    res.status = 200;
                    res.end = "Successfully saved";
                    callback(null, res);
                  }
                });
              }
            });
          }
        }
      );
      break;
    }
    case "loginCustomer": {
      let res = {};
      Login.findOne(
        { emailID: msg.body.emailID, Role: "Customer" },
        async (error, user) => {
          if (error) {
            res.status = 500;
            res.end = "Error occured";
            callback(null, res);
          }
          if (user) {
            if (await bcrypt.compare(msg.body.password, user.Password)) {
              const payload = {
                _id: user._id,
                username: user.emailID,
                role: user.Role,
              };
              const token = jwt.sign(payload, secret, {
                expiresIn: 1008000,
              });
              res.status = 200;
              res.end = `JWT ${token}`;
              callback(null, res);
            } else {
              res.status = 401;
              res.end = "Invalid Credentials";
              callback(null, res);
            }
          } else {
            res.status = 401;
            res.end = "User not found";
            callback(null, res);
          }
        }
      );
      break;
    }
    case "getCustomerCompleteProfile": {
      const { CustomerID } = url.parse(msg.url, true).query;
      let res = {};
      Customer.findOne({ CustomerID }, (error, result) => {
        if (error) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        } else {
          res.status = 200;
          res.end = JSON.stringify(result);
          callback(null, res);
        }
      });
      break;
    }
    case "updateProfile": {
      let res = {};
      Customer.updateOne(
        { CustomerID: msg.body.user_id },
        {
          ...msg.body,
          name: msg.body.Name,
          contact: msg.body.Contact,
          gender: msg.body.Gender,
          state: msg.body.State,
          country: msg.body.Country,
          Things_Customer_Love: msg.body.ILove,
        },
        // eslint-disable-next-line no-unused-vars
        (er, data) => {
          if (er) {
            res.status = 500;
            res.end = "Network Error";
            callback(null, res);
          } else {
            res.status = 200;
            res.end = "Updation successful";
            callback(null, res);
          }
        }
      );
      break;
    }
    case "updateContactInfo": {
      let res = {};
      Login.findOne(
        { _id: msg.body.user_id, Role: "Customer" },
        async (error, user) => {
          if (error) {
            res.status(500).end("Error Occured");
          }
          if (user) {
            if (msg.body.emailID !== msg.body.newEmailID) {
              if (await bcrypt.compare(msg.body.Password, user.Password)) {
                Login.updateOne(
                  { _id: msg.body.user_id },
                  {
                    emailID: msg.body.newEmailID,
                  },
                  // eslint-disable-next-line no-unused-vars
                  (er, data) => {
                    if (er) {
                      res.writeHead(500, {
                        "Content-Type": "text/plain",
                      });
                      res.end();
                    } else {
                      const payload = {
                        _id: user._id,
                        username: msg.body.newEmailID,
                        role: user.Role,
                      };
                      const token = jwt.sign(payload, secret, {
                        expiresIn: 1008000,
                      });
                      Customer.updateOne(
                        { CustomerID: msg.body.user_id },
                        {
                          contact: msg.body.contact,
                        },
                        // eslint-disable-next-line no-unused-vars
                        (err, data1) => {
                          if (err) {
                            res.status = 500;
                            res.end = "Network Error";
                            callback(null, res);
                          } else {
                            res.status = 200;
                            res.end = `JWT ${token}`;
                            callback(null, res);
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                res.status = 400;
                res.end = "Invalid credentials";
                callback(null, res);
              }
            } else {
              Customer.updateOne(
                { CustomerID: msg.body.user_id },
                {
                  ...msg.body,
                },
                // eslint-disable-next-line no-unused-vars
                (err, data1) => {
                  if (err) {
                    res.status = 500;
                    res.end = "Network Error";
                    callback(null, res);
                  } else {
                    res.status = 200;
                    res.end = msg.body.token;
                    callback(null, res);
                  }
                }
              );
            }
          } else {
            res.status = 401;
            res.end = "Invalid Credentials";
            callback(null, res);
          }
        }
      );
      break;
    }
    case "fetchSearchStrings": {
      const data = [];
      let res = {};
      await Appetizer.find({}, (error, result) => {
        if (error) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        }
        if (result) {
          data.push(result);
        } else {
          data.push(0);
        }
      });
      await Beverage.find({}, (error1, result1) => {
        if (error1) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        }
        if (result1) {
          data.push(result1);
        } else {
          data.push(0);
        }
      });
      await MainCourse.find({}, (error2, result2) => {
        if (error2) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        }
        if (result2) {
          data.push(result2);
        } else {
          data.push(0);
        }
      });
      await Salads.find({}, (error3, result3) => {
        if (error3) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        }
        if (result3) {
          data.push(result3);
        } else {
          data.push(0);
        }
      });
      await Desserts.find({}, (error4, result4) => {
        if (error4) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        }
        if (result4) {
          data.push(result4);
        } else {
          data.push(0);
        }
      });
      await Cuisine.find({}, (error5, result5) => {
        if (error5) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        }
        if (result5) {
          data.push(result5);
        } else {
          data.push(0);
        }
      });
      await Restaurant.find({}, (error6, result6) => {
        if (error6) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        }
        if (result6) {
          data.push(result6);
        } else {
          data.push(0);
        }
      });
      res.status = 200;
      res.end = JSON.stringify(data);
      callback(null, res);
      break;
    }
    case "fetchRestaurantResults": {
      const { filter, searchString, pageNo } = url.parse(msg.url, true).query;
      let restaurantData = [];
      let res = {};
      let count = 0;
      if (filter === "1") {
        restaurantData = await Restaurant.find({
          name: { $regex: `${searchString}`, $options: "i" },
        })
          .limit(4)
          .skip(pageNo * 4)
          .exec();
        count = await Restaurant.find({
          name: { $regex: `${searchString}`, $options: "i" },
        }).countDocuments();
      } else if (filter === "2") {
        const appetizerRestID = await Appetizer.find(
          {
            Dishname: { $regex: `${searchString}`, $options: "i" },
          },
          { _id: 0, RestaurantID: 1 }
        );
        const beveragesRestID = await Beverage.find(
          {
            Dishname: { $regex: `${searchString}`, $options: "i" },
          },
          { _id: 0, RestaurantID: 1 }
        );
        const mainCourseRestID = await MainCourse.find(
          {
            Dishname: { $regex: `${searchString}`, $options: "i" },
          },
          { _id: 0, RestaurantID: 1 }
        );
        const dessertRestID = await Desserts.find(
          {
            Dishname: { $regex: `${searchString}`, $options: "i" },
          },
          { _id: 0, RestaurantID: 1 }
        );
        const saladRestID = await Salads.find(
          {
            Dishname: { $regex: `${searchString}`, $options: "i" },
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
      } else if (filter === "3") {
        const appetizerRestID = await Appetizer.find(
          {
            Cuisine: { $regex: `${searchString}`, $options: "i" },
          },
          { _id: 0, RestaurantID: 1 }
        );
        const beveragesRestID = await Beverage.find(
          {
            Cuisine: { $regex: `${searchString}`, $options: "i" },
          },
          { _id: 0, RestaurantID: 1 }
        );
        const mainCourseRestID = await MainCourse.find(
          {
            Cuisine: { $regex: `${searchString}`, $options: "i" },
          },
          { _id: 0, RestaurantID: 1 }
        );
        const dessertRestID = await Desserts.find(
          {
            Cuisine: { $regex: `${searchString}`, $options: "i" },
          },
          { _id: 0, RestaurantID: 1 }
        );
        const saladRestID = await Salads.find(
          {
            Cuisine: { $regex: `${searchString}`, $options: "i" },
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
                $concat: ["$state", ", ", "$city", ", ", "$streetAddress"],
              },
            },
          },
          {
            $match: {
              restLocation: {
                $regex: `${searchString}`,
                $options: "i",
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
                $concat: ["$state", ", ", "$city", ", ", "$streetAddress"],
              },
            },
          },
          {
            $match: {
              restLocation: {
                $regex: `${searchString}`,
                $options: "i",
              },
            },
          },
          {
            $count: "count",
          },
        ]);
      }
      const noOfPages = Math.ceil(count / 4);
      const result = [restaurantData, count, noOfPages];
      res.status = 200;
      res.end = JSON.stringify(result);
      callback(null, res);
      break;
    }
    case "fetchRestaurantProfileForCustomer": {
      const { RestaurantID } = url.parse(msg.url, true).query;
      let res = {};
      Restaurant.findOne({ RestaurantID }, (error, result) => {
        if (error) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        } else {
          res.status = 200;
          res.end = JSON.stringify(result);
          callback(null, res);
        }
      });
      break;
    }
    case "submitReview": {
      let res = {};
      const review = new Review({
        ...msg.body,
        Ratings: msg.body.rating,
        Review: msg.body.review,
      });
      // eslint-disable-next-line no-unused-vars
      review.save((e, data) => {
        if (e) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        } else {
          Restaurant.findOne(
            { RestaurantID: msg.body.RestaurantID },
            (error, result) => {
              if (error) {
                res.status = 500;
                res.end = "Network Error";
                callback(null, res);
              } else {
                const totalReviewCount = Number(result.TotalReviewCount);
                const totalRatings = result.TotalRatings;
                Restaurant.updateOne(
                  { RestaurantID: msg.body.RestaurantID },
                  {
                    TotalReviewCount: totalReviewCount + 1,
                    TotalRatings: totalRatings + Number(msg.body.rating),
                  },
                  (er, data1) => {
                    if (er) {
                      res.status = 500;
                      res.end = "Network Error";
                      callback(null, res);
                    } else {
                      res.status = 200;
                      res.end = "Review Submitted";
                      callback(null, res);
                    }
                  }
                );
              }
            }
          );
        }
      });
      break;
    }
    case "generateOrder": {
      let res = {};
      const order = new Order({
        ...msg.body,
      });
      // eslint-disable-next-line no-unused-vars
      order.save((e, data) => {
        if (e) {
          res.status = 500;
          res.end = "Network Error";
          callback(null, res);
        } else {
          res.status = 200;
          res.end = "Order generated";
          callback(null, res);
        }
      });
      break;
    }
    case "menuFetch": {
      let res = {};
      const { RestaurantID, pageNo, category } = url.parse(msg.url, true).query;
      if (category === "APPETIZERS") {
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
      } else if (category === "BEVERAGES") {
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
      } else if (category === "MAIN_COURSE") {
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
      } else if (category === "SALADS") {
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
    case "fetchAllOrders": {
      const { CustomerID, filter1, filter2, sortOrder, pageNo } = url.parse(
        msg.url,
        true
      ).query;
      let orderDetails = [];
      let res = {};
      if (filter1 !== "All") {
        orderDetails = await Order.find({
          CustomerID,
          DeliveryMode: filter1,
          Status: filter2,
        })
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
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
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
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
      }
      break;
    }
    case "fetchEventList": {
      let res = {};
      const { filter, pageNo } = url.parse(msg.url, true).query;
      const eventDetails = await Events.find({
        EventDate: { $gte: new Date() },
      })
        .sort({ EventDate: filter })
        .limit(4)
        .skip(pageNo * 4)
        .exec();
      const count = await Events.find({
        EventDate: { $gte: new Date() },
      }).countDocuments();
      const noOfPages = Math.ceil(count / 4);
      const results = [];
      results.push(eventDetails);
      results.push(noOfPages);
      results.push(count);
      res.status = 200;
      res.end = JSON.stringify(results);
      callback(null, res);
      break;
    }
    case "eventRegistration": {
      try {
        let res = {};
        Events.findOne({ _id: msg.body.EventID }, async (error, result) => {
          if (error) {
            res.status = 500;
            res.end = "Network Error";
            callback(null, res);
          }
          if (result) {
            Events.updateOne(
              { _id: msg.body.EventID },
              { $push: { RegisteredCustomers: msg.body.RegisteredCustomers } },
              // eslint-disable-next-line no-unused-vars
              (er, data) => {
                if (er) {
                  res.status = 500;
                  res.end = "Network Error";
                  callback(null, res);
                } else {
                  const custRegEvents = new CustEvents({
                    ...msg.body.RegisteredCustomers,
                  });
                  // eslint-disable-next-line no-unused-vars
                  custRegEvents.save((e, data1) => {
                    if (e) {
                      res.status = 500;
                      res.end = "Network Error";
                      callback(null, res);
                    } else {
                      Customer.findOne(
                        { CustomerID: msg.body.CustomerID },
                        async (error1, result1) => {
                          if (error1) {
                            res.status = 500;
                            res.end = "Network Error";
                            callback(null, res);
                            es.end();
                          }
                          if (result1) {
                            Customer.updateOne(
                              { CustomerID: msg.body.CustomerID },
                              { $push: { Events: msg.body } },
                              // eslint-disable-next-line no-unused-vars
                              (er1, data2) => {
                                if (er1) {
                                  res.status = 500;
                                  res.end = "Network Error";
                                  callback(null, res);
                                  es.end();
                                } else {
                                  res.status = 200;
                                  res.end = "Registered for the event";
                                  callback(null, res);
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  });
                }
              }
            );
          }
        });
      } catch (errorrr) {
        res.status = 500;
        res.end = "Network Error";
        callback(null, res);
      }
      break;
    }
    case "getCustRegisteredEvents": {
      let res = {};
      try {
        const { CustomerID, filter, pageNo } = url.parse(msg.url, true).query;
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
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
      } catch (error) {
        res.status = 500;
        res.end = "Network Error";
        callback(null, res);
      }
      break;
    }
    case "fetchSearchedEventList": {
      let res = {};
      const { searchString, filter, pageNo } = url.parse(msg.url, true).query;
      const events = await Events.find({
        EventName: { $regex: `${searchString}`, $options: "i" },
      })
        .sort({ EventDate: filter })
        .limit(4)
        .skip(pageNo * 4)
        .exec();
      const count = await Events.find({
        EventName: { $regex: `${searchString}`, $options: "i" },
      }).countDocuments();
      const noOfPages = Math.ceil(count / 4);
      const results = [];
      results.push(events);
      results.push(noOfPages);
      results.push(count);
      res.status = 200;
      res.end = JSON.stringify(results);
      callback(null, res);
      break;
    }
    case "fetchYelpUserList": {
      let res = {};
      try {
        const { CustomerID, pageNo, category } = url.parse(msg.url, true).query;
        if (category === "All") {
          const customer = await Customer.find({
            CustomerID: { $nin: [CustomerID] },
          })
            .limit(4)
            .skip(pageNo * 4)
            .exec();
          const count = await Customer.find({
            CustomerID: { $nin: [CustomerID] },
          }).countDocuments();
          const noOfPages = Math.ceil(count / 4);
          const results = [];
          results.push(customer);
          results.push(noOfPages);
          results.push(count);
          res.status = 200;
          res.end = JSON.stringify(results);
          callback(null, res);
        } else {
          const start = Number(pageNo) * 4;
          const end = start + 4;
          const customer = await Customer.find(
            { CustomerID },
            { Following: { $slice: [start, end] } }
          );
          const record = await Customer.find({ CustomerID });
          const count = record[0].FollowingCustomerIDs.length;
          const noOfPages = Math.ceil(count / 4);
          const results = [];
          results.push(customer);
          results.push(noOfPages);
          results.push(count);
          res.status = 200;
          res.end = JSON.stringify(results);
          callback(null, res);
        }
      } catch (error) {
        res.status = 500;
        res.end = "Network Error";
        callback(null, res);
      }
      break;
    }
    case "followUser": {
      let res = {};
      try {
        Customer.findOne(
          { CustomerID: msg.body.CustomerID },
          async (error, result) => {
            if (error) {
              res.status = 500;
              res.end = "Network Error";
              callback(null, res);
            }
            if (result) {
              Customer.updateOne(
                { CustomerID: msg.body.CustomerID },
                {
                  $push: {
                    Following: msg.body.Following,
                    FollowingCustomerIDs: msg.body.FollowingCustomerIDs,
                  },
                },
                // eslint-disable-next-line no-unused-vars
                (er, data) => {
                  if (er) {
                    res.status = 500;
                    res.end = "Network Error";
                    callback(null, res);
                  } else {
                    res.status = 200;
                    res.end = "Followed successfully";
                    callback(null, res);
                  }
                }
              );
            }
          }
        );
      } catch (errorrr) {
        res.status = 500;
        res.end = "Network Error";
        callback(null, res);
      }
      break;
    }
    case "fetchSearchedYelpUser": {
      let res = {};
      try {
        let customerData = [];
        let count = 0;
        const { CustomerID, searchString, searchCriteria, pageNo } = url.parse(
          msg.url,
          true
        ).query;
        if (searchCriteria === "First Name") {
          customerData = await Customer.find({
            $and: [
              { CustomerID: { $nin: [CustomerID] } },
              { name: { $regex: `${searchString}`, $options: "i" } },
            ],
          })
            .limit(4)
            .skip(pageNo * 4)
            .exec();
          count = await Customer.find({
            $and: [
              { CustomerID: { $nin: [CustomerID] } },
              { name: { $regex: `${searchString}`, $options: "i" } },
            ],
          }).countDocuments();
        } else if (searchCriteria === "NickName") {
          customerData = await Customer.find({
            $and: [
              { CustomerID: { $nin: [CustomerID] } },
              { NickName: { $regex: `${searchString}`, $options: "i" } },
            ],
          })
            .limit(4)
            .skip(pageNo * 4)
            .exec();
          count = await Customer.find({
            $and: [
              { CustomerID: { $nin: [CustomerID] } },
              { NickName: { $regex: `${searchString}`, $options: "i" } },
            ],
          }).countDocuments();
        } else {
          customerData = await Customer.find({
            $and: [
              { CustomerID: { $nin: [CustomerID] } },
              { City: { $regex: `${searchString}`, $options: "i" } },
            ],
          })
            .limit(4)
            .skip(pageNo * 4)
            .exec();
          count = await Customer.find({
            $and: [
              { CustomerID: { $nin: [CustomerID] } },
              { City: { $regex: `${searchString}`, $options: "i" } },
            ],
          }).countDocuments();
        }
        const noOfPages = Math.ceil(count / 4);
        const results = [];
        results.push(customerData);
        results.push(noOfPages);
        results.push(count);
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
      } catch (error) {
        res.status = 500;
        res.end = "Network Error";
        callback(null, res);
      }
      break;
    }
    case "fetchMessages": {
      const { CustomerID, pageNo } = url.parse(msg.url, true).query;
      const results = [];
      let res = {};
      try {
        const result = await Messages.find({ CustomerID })
          .limit(4)
          .skip(pageNo * 4)
          .exec();
        const count = await Messages.find({ CustomerID }).countDocuments();
        const noOfPages = Math.ceil(count / 4);
        const results = [];
        results.push(result);
        results.push(noOfPages);
        results.push(count);
        res.status = 200;
        res.end = JSON.stringify(results);
        callback(null, res);
      } catch (error) {
        res.status = 500;
        res.end = "Network error";
        callback(null, res);
      }
      break;
    }
    default:
      break;
  }
}

// module.exports = {
//   signupCustomer,
//   loginCustomer,
//   logoutCustomer,
//   getCustomerCompleteProfile,
//   uploadCustomerProfilePic,
//   updateProfile,
//   updateContactInfo,
//   fetchSearchStrings,
//   fetchRestaurantResults,
//   fetchRestaurantProfileForCustomer,
//   submitReview,
//   generateOrder,
//   menuFetch,
//   fetchAllOrders,
//   fetchEventList,
//   eventRegistration,
//   getCustRegisteredEvents,
//   fetchSearchedEventList,
//   fetchYelpUserList,
//   followUser,
//   fetchSearchedYelpUser,
// };
exports.handle_request = handle_request;
