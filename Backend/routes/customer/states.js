const mysqlConnection = require('../../connection');

const statesName = async (req, res) => {
  const statesFetchProcedure = 'CALL statesFetch()';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(statesFetchProcedure);
  con.end();

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
module.exports = { statesName, countryName, cuisineFetch, deliveryStatus };
