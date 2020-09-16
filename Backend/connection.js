const mysql = require('mysql2/promise');

const mysqlConnection = async () =>
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'Abhijeet0512',
    database: 'yelp',
    multipleStatements: true,
  });

module.exports = mysqlConnection;
