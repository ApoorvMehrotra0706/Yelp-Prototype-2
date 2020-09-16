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
  const value = false;
  if (results[0][0]) {
    return results[0][0];
  }
  return value;
};

const restLogin = async (req, res) => {
  const { emailID } = req.body;
  const { password } = req.body;
  const role = 'Restaurant';
  const value = await checkValidID(emailID, role);
  if (value) {
    const passwordFromDB = value.Password;
    console.log('This is ', passwordFromDB, ' and ', password);
    if (await bcrypt.compare(password, passwordFromDB)) {
      const token = genRandom.generate();
      res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
      res.cookie('Restaurant', role, { maxAge: 900000, httpOnly: false, path: '/' });
      UserTokens.push({ userId: emailID, role, Token: token });
      req.session.user = req.body.emailID;
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

module.exports = restLogin;
