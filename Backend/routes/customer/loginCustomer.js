const bcrypt = require('bcrypt');
const genRandom = require('randomstring');
const mysqlConnection = require('../../connection');

// eslint-disable-next-line prefer-const
let UserTokens = [];

const checkValidID = async (emailID, role) => {
  const userIDValidCheck = 'CALL validUserID(?.?)';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(userIDValidCheck, [emailID, role]);
  con.end();
  let value = false;

  if (results[0][0].Password) {
    value = results[0][0].Password;
  }
  return value;
};

const loginCust = async (req, res) => {
  const { emailID } = req.body;
  const { password } = req.body;
  const role = 'Customer';
  const value = await checkValidID(emailID, role);
  if (value) {
    if (await bcrypt.compare(password, value)) {
      const token = genRandom.generate();
      res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
      res.cookie('Customer', role, { maxAge: 900000, httpOnly: false, path: '/' });
      UserTokens.push({ userId: emailID, role, Token: token });
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end('Successful Login for Customer');
    }
  } else {
    res.writeHead(401, { 'content-type': 'text/json' });
    res.end(JSON.stringify({ message: 'Login Failed for Customer' }));
  }
};

module.exports = loginCust;
