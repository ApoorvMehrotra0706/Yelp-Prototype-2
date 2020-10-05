const express = require('express');

// eslint-disable-next-line no-unused-vars
const {
  restLogin,
  logoutRest,
  menuFetch,
  menuInsert,
  menuItemDeletion,
  reviewFetch,
  getRestaurantCompleteInfo,
  updateRestaurantProfile,
  updateMenu,
  getRestaurantOrders,
  getPersonOrder,
  updateDeliveryStatus,
  foodImageUpload,
  fetchEvents,
  createNewEvent,
  fetchRegisteredCustomers,
  uploadRestaurantProfilePic,
  fetchCustomerDetails,
} = require('./restaurant/loginRestaurant');
const signupRestaurant = require('./restaurant/signupRestaurant');

const Router = express.Router();

// Login for the Restaurant
Router.post('/loginRestaurant', async (req, res) => {
  const value = await restLogin(req, res);
  return value;
});

// Signup for the Restaurant
Router.post('/signupRestaurant', async (req, res) => {
  const value = await signupRestaurant(req, res);
  return value;
});

// Logout for the Restaurant
Router.post('/logoutRestaurant', async (req, res) => {
  const value = await logoutRest(req, res);
  return value;
});

// Fetching items from menu
Router.get('/menuFetch', async (req, res) => {
  const value = await menuFetch(req, res);
  return value;
});

// Inserting items in the menu
Router.post('/menuInsert', async (req, res) => {
  const value = await menuInsert(req, res);
  return value;
});

// Deleting items in the menu
Router.post('/menuDelete', async (req, res) => {
  const value = await menuItemDeletion(req, res);
  return value;
});

// Fetch reviews for the restaurant
Router.get('/fetchReview', async (req, res) => {
  const value = await reviewFetch(req, res);
  return value;
});

Router.get('/restaurantProfile', async (req, res) => {
  const value = await getRestaurantCompleteInfo(req, res);
  return value;
});

Router.post('/updateRestProfile', async (req, res) => {
  const value = await updateRestaurantProfile(req, res);
  return value;
});

Router.post('/updateMenu', async (req, res) => {
  const value = await updateMenu(req, res);
  return value;
});

Router.get('/orderFetch', async (req, res) => {
  const value = await getRestaurantOrders(req, res);
  return value;
});

Router.get('/fetchPersonOrder', async (req, res) => {
  const value = await getPersonOrder(req, res);
  return value;
});

Router.post('/updateDeliveryStatus', async (req, res) => {
  const value = await updateDeliveryStatus(req, res);
  return value;
});

Router.post('/foodImageUpload', async (req, res) => {
  const value = await foodImageUpload(req, res);
  return value;
});

Router.get('/fetchEvents', async (req, res) => {
  const value = await fetchEvents(req, res);
  return value;
});

Router.get('/fetchRegisteredCustomers', async (req, res) => {
  const value = await fetchRegisteredCustomers(req, res);
  return value;
});

Router.post('/createNewEvent', async (req, res) => {
  const value = await createNewEvent(req, res);
  return value;
});

Router.post('/uploadRestaurantProfilePic', async (req, res) => {
  const value = await uploadRestaurantProfilePic(req, res);
  return value;
});

Router.get('/fetchCustomerDetails', async (req, res) => {
  const value = await fetchCustomerDetails(req, res);
  return value;
});

module.exports = Router;
