/* eslint-disable import/no-unresolved */
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
const cookieParser = require('cookie-parser');
const express = require('express');

const bodyParser = require('body-parser');

const session = require('express-session');

const restaurantRoutes = require('./routes/restRoutes');

const customerRoutes = require('./routes/custRoutes');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_YELP,
    resave: false,
    saveUninitialized: true,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

// eslint-disable-next-line func-names
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use('/restaurant', restaurantRoutes);

app.use('/customer', customerRoutes);

app.listen(3004);
