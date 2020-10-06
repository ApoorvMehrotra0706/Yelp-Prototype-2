const url = require('url');
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
};
