const mysql = require('mysql2/promise');

const mysqlConnection = async () =>
  mysql.createConnection({
    host: '',
    user: '',
    port: '3306',
    password: '',
    database: 'YELP',
    multipleStatements: true,
  });

module.exports = mysqlConnection;
