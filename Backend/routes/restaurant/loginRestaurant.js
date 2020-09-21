// const bodyParser = require('body-parser');
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
    return value;
  }
  return value;
};

const restLogin = async (req, res) => {
  const { emailID } = req.body;
  const { password } = req.body;
  const role = 'Restaurant';
  const value = await checkValidID(emailID, role);
  if (value.length !== 0) {
    const passwordFromDB = value[0];
    // console.log('This is ', passwordFromDB, ' and ', password);
    if (await bcrypt.compare(password, passwordFromDB)) {
      const token = genRandom.generate();
      const ID = value[1];
      res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
      res.cookie('role', role, { maxAge: 900000, httpOnly: false, path: '/' });
      UserTokens.push({ userId: ID, emailID, role, Token: token });
      // req.session.user = req.body.emailID;
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end('Successful Login for Restaurant');
    }
  } else {
    res.writeHead(401, { 'content-type': 'text/json' });
    res.end(JSON.stringify({ message: 'Login Failed for Restauranr' }));
  }
};

const logoutRest = async (req, res) => {
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

module.exports = { restLogin, logoutRest };
