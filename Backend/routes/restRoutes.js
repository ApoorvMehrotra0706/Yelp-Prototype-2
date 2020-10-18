const express = require('express');
const { checkAuth } = require('../passport');

const {
  signupRestaurant,
  loginRestaurant,
  restaurantLogout,
  restaurantProfile,
  uploadRestaurantProfilePic,
  updateRestaurantProfile,
  cuisineFetch,
  foodImageUpload,
  menuInsert,
  menuFetch,
  menuDelete,
  updateMenu,
  fetchReview,
  fetchOrderandDetails,
  updateDeliveryStatus,
  fetchEvents,
  createNewEvent,
  fetchRegisteredCustomers,
} = require('./restaurantData/restaurantHandling');

const Router = express.Router();

// Signup for the Restaurant
Router.post('/signupRestaurant', async (req, res) => {
  const value = await signupRestaurant(req, res);
  return value;
});

// Login for the Restaurant
Router.post('/loginRestaurant', async (req, res) => {
  const value = await loginRestaurant(req, res);
  return value;
});

// Logout for the Restaurant
Router.post('/restaurantLogout', async (req, res) => {
  const value = await restaurantLogout(req, res);
  return value;
});

// Fetching Restaurant Profile
Router.get('/restaurantProfile', checkAuth, async (req, res) => {
  const value = await restaurantProfile(req, res);
  return value;
});

// Upload profile picture
Router.post('/uploadRestaurantProfilePic', checkAuth, async (req, res) => {
  const value = await uploadRestaurantProfilePic(req, res);
  return value;
});

// Update Restaurant Profile
Router.post('/updateRestProfile', checkAuth, async (req, res) => {
  const value = await updateRestaurantProfile(req, res);
  return value;
});

// Fetching Cuisine
Router.get('/cuisineFetch', checkAuth, async (req, res) => {
  const value = await cuisineFetch(req, res);
  return value;
});

// Uploading food photo
Router.post('/foodImageUpload', checkAuth, async (req, res) => {
  const value = await foodImageUpload(req, res);
  return value;
});

// Inserting items in the menu
Router.post('/menuInsert', checkAuth, async (req, res) => {
  const value = await menuInsert(req, res);
  return value;
});

// Fetching items from the menu
Router.get('/menuFetch', checkAuth, async (req, res) => {
  const value = await menuFetch(req, res);
  return value;
});

// Deleting items from the menu
Router.post('/menuDelete', checkAuth, async (req, res) => {
  const value = await menuDelete(req, res);
  return value;
});

// Update food items in the menu
Router.post('/updateMenu', checkAuth, async (req, res) => {
  const value = await updateMenu(req, res);
  return value;
});

// Fetch reviews for the restaurant
Router.get('/fetchReview', checkAuth, async (req, res) => {
  const value = await fetchReview(req, res);
  return value;
});

// Fetch order, order details and customer details
Router.get('/fetchOrderandDetails', checkAuth, async (req, res) => {
  const value = await fetchOrderandDetails(req, res);
  return value;
});

// Updating the order status
Router.post('/updateDeliveryStatus', checkAuth, async (req, res) => {
  const value = await updateDeliveryStatus(req, res);
  return value;
});

// Fetching the events
Router.get('/fetchEvents', async (req, res) => {
  const value = await fetchEvents(req, res);
  return value;
});

// Creating new events
Router.post('/createNewEvent', checkAuth, async (req, res) => {
  const value = await createNewEvent(req, res);
  return value;
});

// Fetching the registered customers and their details
Router.get('/fetchRegisteredCustomers', async (req, res) => {
  const value = await fetchRegisteredCustomers(req, res);
  return value;
});

module.exports = Router;
