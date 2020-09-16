const express = require('express');

// eslint-disable-next-line no-unused-vars
const loginCustomer = require('./customer/loginCustomer');
const signupCustomer = require('./customer/signupCustomer');

const Router = express.Router();

// Login for the customer
Router.post('/loginCustomer', async (req, res) => {
  const value = await loginCustomer(req, res);
  return value;
});

// Signup for the customer
Router.post('/signupCustomer', async (req, res) => {
  const value = await signupCustomer(req, res);
  return value;
});

module.exports = Router;
