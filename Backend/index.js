const express = require('express');

const bodyParser = require('body-parser');

const restuarantSignupRoutes = require('./routes/signupRestaurant');

const customerSignupRoutes = require('./routes/signupCustomer');

const app = express();

app.use(bodyParser.json());

app.use('/restaurant', restuarantSignupRoutes);

app.use('/customer', customerSignupRoutes);

app.listen(3000);
