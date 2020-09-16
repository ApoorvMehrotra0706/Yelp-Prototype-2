/* eslint-disable import/no-unresolved */
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const express = require('express');

const bodyParser = require('body-parser');

const session = require('express-session');

const restaurantRoutes = require('./routes/restRoutes');

const customerRoutes = require('./routes/custRoutes');

const app = express();

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_YELP,
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

app.use('/restaurant', restaurantRoutes);

app.use('/customer', customerRoutes);

app.listen(3000);
