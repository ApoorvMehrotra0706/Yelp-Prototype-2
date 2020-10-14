const States = require('../models/StateModel');
const Country = require('../models/CountryModel');
const Gender = require('../models/GenderModel');
// const Cuisine = require('../models/CuisineModel');

const getStateAndCountry = async (req, res) => {
  const data = [];
  States.find({}, (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    } else {
      data.push(result);
      Country.find({}, (error1, result1) => {
        if (error1) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end();
        } else {
          data.push(result1);
          Gender.find({}, (error2, result2) => {
            if (error2) {
              res.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              res.end();
            } else {
              res.writeHead(200, {
                'Content-Type': 'application/json',
              });
              // res.end(JSON.stringify(result));
              data.push(result2);
              res.end(JSON.stringify(data));
            }
          });
        }
      });
    }
  });
};

module.exports = getStateAndCountry;
