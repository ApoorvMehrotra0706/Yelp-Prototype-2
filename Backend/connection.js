const mysql = require('mysql2/promise');

const mysqlConnection = async () =>
  mysql.createConnection({
    host: 'yelp.ccqrmksnmmm6.us-east-2.rds.amazonaws.com',
    user: 'root',
    port: '3306',
    password: 'Abhijeet0512',
    database: 'YELP',
    multipleStatements: true,
  });

module.exports = mysqlConnection;
