const bcrypt = require('bcrypt');
const genRandom = require('randomstring');
const mysqlConnection = require('../../connection');

// eslint-disable-next-line prefer-const
let UserTokens = [];

const checkValidID = async (emailID, role) => {
  const userIDValidCheck = 'CALL validUserID(?,?)';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(userIDValidCheck, [emailID, role]);
  con.end();
  const value = [];

  if (results[0][0]) {
    value.push(results[0][0].Password);
    value.push(results[0][0].ID);
  }
  return value;
};

const loginCust = async (req, res) => {
  const { emailID } = req.body;
  const { password } = req.body;
  const role = 'Customer';
  const value = await checkValidID(emailID, role);
  if (value.length !== 0) {
    if (await bcrypt.compare(password, value[0])) {
      const token = genRandom.generate();
      const ID = value[1];
      res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
      res.cookie('role', role, { maxAge: 900000, httpOnly: false, path: '/' });
      UserTokens.push({ emailId: emailID, userID: ID, role, Token: token });

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

const logoutCust = async (req, res) => {
  let isTokenDeleted = false;
  // eslint-disable-next-line array-callback-return
  UserTokens.filter(function (user) {
    if (user.Token === req.body.token) {
      UserTokens.splice(UserTokens.indexOf(user), 1);
      isTokenDeleted = true;
    }
  });
  if (isTokenDeleted) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end('User Token Deleted');
  } else {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('User Token Not Found');
  }
};
module.exports = { loginCust, logoutCust };
