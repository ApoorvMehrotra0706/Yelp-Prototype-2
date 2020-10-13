/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Login = require('../models/LoginModel');
const Customer = require('../models/CustomerModel');
const { secret } = require('../../config');
const { auth } = require('../../passport');

auth();

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
module.exports = { signupCustomer, loginCustomer, logoutCustomer };
