const url = require('url');
const States = require('../models/StateModel');
const Country = require('../models/CountryModel');
const Gender = require('../models/GenderModel');
const Cuisine = require('../models/CuisineModel');
const mysqlConnection = require('../../connection');

const statesName = async (req, res) => {
  const statesFetchProcedure = 'CALL statesFetch()';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(statesFetchProcedure);
  con.end();
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(JSON.stringify(results));
};

const countryName = async (req, res) => {
  const countryFetchProcedure = 'CALL countryFetch()';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(countryFetchProcedure);
  con.end();

  res.end(JSON.stringify(results));
};

const cuisineFetch = async (req, res) => {
  const cuisineFetchProcedure = 'CALL cuisineFetch()';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(cuisineFetchProcedure);
  con.end();
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(JSON.stringify(results));
};

const deliveryStatus = async (req, res) => {
  const deliveryFetchProcedure = 'CALL fetchDeliveryState()';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(deliveryFetchProcedure);
  con.end();

  res.end(JSON.stringify(results));
};

// fetchSearchStrings
const fetchSearchStrings = async (req, res) => {
  const getSearchStringQuery = 'CALL fetchSearchStrings()';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(getSearchStringQuery);
  con.end();
  res.end(JSON.stringify(results));
};

const fetchRestaurantResults = async (req, res) => {
  try {
    const { filter, searchString } = url.parse(req.url, true).query;
    const getRestResultsQuery = 'CALL fetchRestaurantResults(?,?)';
    const con = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await con.query(getRestResultsQuery, [filter, searchString]);
    con.end();
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Failed');
  }
  return res;
};

const menuFetch = async (req, res) => {
  try {
    const { restroId } = url.parse(req.url, true).query;
    const getRestMenuQuery = 'CALL fetchRestaurantMenu(?)';
    const con = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await con.query(getRestMenuQuery, restroId);
    con.end();
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Failed');
  }
  return res;
};

const fetchReviews = async (req, res) => {
  try {
    const { restroId } = url.parse(req.url, true).query;
    const getRestReviewQuery = 'CALL fetchRestaurantReview(?,?)';
    const con = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await con.query(getRestReviewQuery, restroId);
    con.end();
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Failed');
  }
  return res;
};

const fetchRestaurantProfileForCustomer = async (req, res) => {
  try {
    const { restroId } = url.parse(req.url, true).query;
    const getRestForCustQuery = 'CALL getRestForCust(?)';
    const con = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await con.query(getRestForCustQuery, restroId);
    con.end();
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Failed');
  }
  return res;
};

const createState = async (req, res) => {
  const stateName = new States({
    StateName: req.body.State,
  });
  States.findOne({ StateName: req.body.State }, (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('State already exists');
    } else {
      // eslint-disable-next-line no-unused-vars
      stateName.save((e, data) => {
        if (e) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end();
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          res.end();
        }
      });
    }
  });
};

const createCountry = async (req, res) => {
  const country = new Country({
    CountryName: req.body.Country,
  });
  Country.findOne({ CountryName: req.body.Country }, (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Country already exists');
    } else {
      // eslint-disable-next-line no-unused-vars
      country.save((e, data) => {
        if (e) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end();
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          res.end();
        }
      });
    }
  });
};

const createGender = async (req, res) => {
  const gender = new Gender({
    GenderName: req.body.gender,
  });
  Gender.findOne({ GenderName: req.body.gender }, (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Gender already exists');
    } else {
      // eslint-disable-next-line no-unused-vars
      gender.save((e, data) => {
        if (e) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end();
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          res.end();
        }
      });
    }
  });
};

const createCuisine = async (req, res) => {
  const cuisine = new Cuisine({
    CuisineName: req.body.Cuisine,
  });
  Cuisine.findOne({ CuisineName: req.body.Cuisine }, (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Cuisine already exists');
    } else {
      // eslint-disable-next-line no-unused-vars
      cuisine.save((e, data) => {
        if (e) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end();
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          res.end();
        }
      });
    }
  });
};

const deleteCuisine = async (req, res) => {
  Cuisine.deleteOne({ CuisineName: req.body.Cuisine }, (error, result) => {
    if (error) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
    if (result.n === 0) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Book ID does not exists');
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
  });
};

module.exports = {
  statesName,
  countryName,
  cuisineFetch,
  deliveryStatus,
  fetchSearchStrings,
  fetchRestaurantResults,
  menuFetch,
  fetchReviews,
  fetchRestaurantProfileForCustomer,
  createState,
  createCountry,
  createGender,
  createCuisine,
  deleteCuisine,
};
