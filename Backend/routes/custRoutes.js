const express = require('express');

// eslint-disable-next-line no-unused-vars
const {
  loginCust,
  logoutCust,
  fetchCustomerDetails,
  fetchCustProfileData,
  updateProfile,
  getContactInfo,
  updateContactInfo,
  uploadCustomerProfilePic,
  submitReview,
  generateOrder,
} = require('./customer/loginCustomer');
const signupCustomer = require('./customer/signupCustomer');
const {
  statesName,
  countryName,
  cuisineFetch,
  deliveryStatus,
  fetchSearchStrings,
  fetchRestaurantResults,
  menuFetch,
  fetchReviews,
  fetchRestaurantProfileForCustomer,
} = require('./customer/states');

const Router = express.Router();

// Login for the customer
Router.post('/loginCustomer', async (req, res) => {
  const value = await loginCust(req, res);
  return value;
});

// Signup for the customer
Router.post('/signupCustomer', async (req, res) => {
  const value = await signupCustomer(req, res);
  return value;
});

// Logout for the customer
Router.post('/logoutCustomer', async (req, res) => {
  const value = await logoutCust(req, res);
  return value;
});

// Give state names
Router.get('/stateNames', async (req, res) => {
  const value = await statesName(req, res);
  return value;
});

// Give country names and codes
Router.get('/countryNames', async (req, res) => {
  const value = await countryName(req, res);
  return value;
});

Router.get('/cuisineFetch', async (req, res) => {
  const value = await cuisineFetch(req, res);
  return value;
});

Router.get('/getOrderDeliveryStatus', async (req, res) => {
  const value = await deliveryStatus(req, res);
  return value;
});

Router.get('/getCustomerCompleteProfile', async (req, res) => {
  const value = await fetchCustomerDetails(req, res);
  return value;
});

Router.get('/fetchCustProfileData', async (req, res) => {
  const value = await fetchCustProfileData(req, res);
  return value;
});

Router.put('/updateProfile', async (req, res) => {
  const value = await updateProfile(req, res);
  return value;
});

Router.post('/uploadCustomerProfilePic', async (req, res) => {
  const value = await uploadCustomerProfilePic(req, res);
  return value;
});

Router.get('/getContactInfo', async (req, res) => {
  const value = await getContactInfo(req, res);
  return value;
});

Router.put('/updateContactInfo', async (req, res) => {
  const value = await updateContactInfo(req, res);
  return value;
});

Router.get('/fetchSearchStrings', async (req, res) => {
  const value = await fetchSearchStrings(req, res);
  return value;
});

Router.get('/fetchRestaurantResults', async (req, res) => {
  const value = await fetchRestaurantResults(req, res);
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

Router.get('/fetchRestaurantProfileForCustomer', async (req, res) => {
  const value = await fetchRestaurantProfileForCustomer(req, res);
  return value;
});

Router.post('/submitReview', async (req, res) => {
  const value = await submitReview(req, res);
  return value;
});

Router.post('/generateOrder', async (req, res) => {
  const value = await generateOrder(req, res);
  return value;
});

module.exports = Router;
