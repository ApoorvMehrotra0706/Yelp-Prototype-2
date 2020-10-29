/* eslint-disable func-names */
/* eslint-disable no-console */
const express = require('express');
const kafka = require('../kafka/client');

// const staticData = require('./fixedData/staticData');

const Router = express.Router();

Router.get('/fetchStaticData', async (req, res) => {
  // const value = await staticData(req, res);
  // return value;
  const data = {
    api: 'fetchStaticData',
    body: req.body,
  };
  kafka.make_request('staticRoutes', data, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.end('Network Error');
    } else {
      console.log('Inside else');
      res.status(results.status);

      res.end(results.end);
    }
  });
});

module.exports = Router;
