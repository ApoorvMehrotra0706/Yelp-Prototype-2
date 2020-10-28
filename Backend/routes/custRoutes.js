const express = require('express');
const { checkAuth } = require('../passport');

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
} = require('./customerData/customerHandling');

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

// Generate order for customer
Router.post('/generateOrder', checkAuth, async (req, res) => {
  const value = await generateOrder(req, res);
  return value;
});

// Fetch menu for the customer
Router.get('/menuFetch', checkAuth, async (req, res) => {
  const value = await menuFetch(req, res);
  return value;
});

// Fetch orders of the customer
Router.get('/fetchAllOrders', checkAuth, async (req, res) => {
  const value = await fetchAllOrders(req, res);
  return value;
});

// Fetch event list for the customer
Router.get('/fetchEventList', checkAuth, async (req, res) => {
  const value = await fetchEventList(req, res);
  return value;
});

// Register customer to an event
Router.post('/eventRegistration', checkAuth, async (req, res) => {
  const value = await eventRegistration(req, res);
  return value;
});

// Get events registered by the customer
Router.get('/getCustRegisteredEvents', checkAuth, async (req, res) => {
  const value = await getCustRegisteredEvents(req, res);
  return value;
});

// Get searched events by the customer
Router.get('/fetchSearchedEventList', checkAuth, async (req, res) => {
  const value = await fetchSearchedEventList(req, res);
  return value;
});

// Get the list of Yelp users
Router.get('/fetchYelpUserList', checkAuth, async (req, res) => {
  const value = await fetchYelpUserList(req, res);
  return value;
});

// Adding the user to the fllow list of customer
Router.post('/followUser', checkAuth, async (req, res) => {
  const value = await followUser(req, res);
  return value;
});

// Fetched searched yelp user
Router.get('/fetchSearchedYelpUser', checkAuth, async (req, res) => {
  const value = await fetchSearchedYelpUser(req, res);
  return value;
});

module.exports = Router;
