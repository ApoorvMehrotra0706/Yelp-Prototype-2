const mysqlConnection = require('../../connection');

const statesName = async (req, res) => {
  const statesFetchProcedure = 'CALL statesFetch()';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(statesFetchProcedure);
  con.end();

  res.end(JSON.stringify(results));
};

module.exports = statesName;
