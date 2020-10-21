const express = require('express');
const { checkAuth } = require('../passport');

// eslint-disable-next-line no-unused-vars
const {
  generateOrder,
  fetchAllOrders,
  fetchOrderDetails,
  fetchEventList,
  eventRegistration,
  getCustRegisteredEvents,
} = require('./customer/loginCustomer');
// const signupCustomer = require('./customer/signupCustomer');
const {
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
} = require('./customerData/customerHandling');
const {
  menuFetch,
  fetchReviews,
  createState,
  createCountry,
  createGender,
  createCuisine,
  deleteCuisine,
} = require('./customer/states');

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

// Logout for the customer
Router.post('/logoutCustomer', async (req, res) => {
  const value = await logoutCustomer(req, res);
  return value;
});

// Fetching customer profile
Router.get('/getCustomerCompleteProfile', checkAuth, async (req, res) => {
  const value = await getCustomerCompleteProfile(req, res);
  return value;
});

// Uploading customer profile picture
Router.post('/uploadCustomerProfilePic', checkAuth, async (req, res) => {
  const value = await uploadCustomerProfilePic(req, res);
  return value;
});

// Updating customer profile
Router.put('/updateProfile', checkAuth, async (req, res) => {
  const value = await updateProfile(req, res);
  return value;
});

// Updating customer contact info
Router.put('/updateContactInfo', checkAuth, async (req, res) => {
  const value = await updateContactInfo(req, res);
  return value;
});

// Fetching search strings
Router.get('/fetchSearchStrings', async (req, res) => {
  const value = await fetchSearchStrings(req, res);
  return value;
});

// Fetching Restaurant Search Results
Router.get('/fetchRestaurantResults', async (req, res) => {
  const value = await fetchRestaurantResults(req, res);
  return value;
});

// Fetching specific restaurant profile for customer
Router.get('/fetchRestaurantProfileForCustomer', async (req, res) => {
  const value = await fetchRestaurantProfileForCustomer(req, res);
  return value;
});

// Submit the review given by the customer
Router.post('/submitReview', checkAuth, async (req, res) => {
  const value = await submitReview(req, res);
  return value;
});

Router.get('/menuFetch', async (req, res) => {
  const value = await menuFetch(req, res);
  return value;
});

Router.get('/fetchReviews', async (req, res) => {
  const value = await fetchReviews(req, res);
  return value;
});

Router.post('/generateOrder', async (req, res) => {
  const value = await generateOrder(req, res);
  return value;
});

Router.get('/fetchAllOrders', async (req, res) => {
  const value = await fetchAllOrders(req, res);
  return value;
});

Router.get('/fetchOrderDetails', async (req, res) => {
  const value = await fetchOrderDetails(req, res);
  return value;
});

Router.get('/fetchEventList', async (req, res) => {
  const value = await fetchEventList(req, res);
  return value;
});

Router.post('/eventRegistration', async (req, res) => {
  const value = await eventRegistration(req, res);
  return value;
});

Router.get('/getCustRegisteredEvents', async (req, res) => {
  const value = await getCustRegisteredEvents(req, res);
  return value;
});

Router.post('/stateCreate', async (req, res) => {
  const value = await createState(req, res);
  return value;
});

Router.post('/createCountry', async (req, res) => {
  const value = await createCountry(req, res);
  return value;
});

Router.post('/createGender', async (req, res) => {
  const value = await createGender(req, res);
  return value;
});

Router.post('/createCuisine', async (req, res) => {
  const value = await createCuisine(req, res);
  return value;
});

Router.delete('/deleteCuisine', async (req, res) => {
  const value = await deleteCuisine(req, res);
  return value;
});

module.exports = Router;
