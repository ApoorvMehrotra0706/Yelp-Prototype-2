const express = require('express');

const bodyParser = require('body-parser');

const restaurantRoutes = require('./routes/restRoutes');

const customerRoutes = require('./routes/custRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/restaurant', restaurantRoutes);

app.use('/customer', customerRoutes);

app.listen(3000);
