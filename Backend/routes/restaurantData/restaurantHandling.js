/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const geocoder = require('google-geocoder');
const jwt = require('jsonwebtoken');
const Login = require('../models/LoginModel');
const Restaurant = require('../models/RestaurantModel');
const { secret } = require('../../config');
const { auth } = require('../../passport');

auth();

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

// Customer login
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

const restaurantLogout = async (req, res) => {
  req.logout();
  res.status(200).end('Logged out');
};
module.exports = { signupRestaurant, loginRestaurant, restaurantLogout };
