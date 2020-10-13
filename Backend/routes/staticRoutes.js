const express = require('express');

const staticData = require('./fixedData/staticData');

const Router = express.Router();

Router.get('/fetchStaticData', async (req, res) => {
  const value = await staticData(req, res);
  return value;
});

module.exports = Router;
