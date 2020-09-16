const express = require('express');

// eslint-disable-next-line no-unused-vars
const loginRestaurant = require('./restaurant/loginRestaurant');
const signupRestaurant = require('./restaurant/signupRestaurant');

const Router = express.Router();

// Login for the Restaurant
Router.post('/loginRestaurant', async (req, res) => {
  const value = await loginRestaurant(req, res);
  return value;
});

// Signup for the Restaurant
Router.post('/signupRestaurant', async (req, res) => {
  const value = await signupRestaurant(req, res);
  return value;
});

module.exports = Router;
