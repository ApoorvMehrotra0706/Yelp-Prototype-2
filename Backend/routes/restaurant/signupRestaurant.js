const bcrypt = require('bcrypt');
const mysqlConnection = require('../../connection');

const checkEmail = async (emailID, role) => {
  const emailProcedure = 'CALL existingEmail(?,?)';
  // console.log("Email is ", emailID);
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(emailProcedure, [emailID, role]);
  con.end();
  // resultName = results[0][0].Name;
  if (results[0].length !== 0) {
    return true;
  }
  return false;
};

const userInsert = async (emailID, hashedPassword, role, name) => {
  const userInsertProcedure = 'CALL userInsert(?,?,?,?)';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(userInsertProcedure, [
    emailID,
    hashedPassword,
    role,
    name,
  ]);
  con.end();
  if (results.affectedRows === 1) {
    return true;
  }
  return false;
};

// console.log(results[0][0].Name);
const restSignUp = async (req, res) => {
  const { emailID } = req.body;
  const { password } = req.body;
  const role = 'Restaurant';
  const name = `${req.body.firstname} ${req.body.lastname}`;

  if (await checkEmail(emailID, role)) {
    res.writeHead(401, { 'content-type': 'text/json' });
    res.end(JSON.stringify({ message: 'ID already used' }));
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('Password length is ', hashedPassword.length);
    const insertStatus = await userInsert(emailID, hashedPassword, role, name);
    if (insertStatus) {
      res.writeHead(200, { 'content-type': 'text/json' });
      res.end(JSON.stringify({ message: 'Insertion successful' }));
    } else {
      res.writeHead(401, { 'content-type': 'text/json' });
      res.end(JSON.stringify({ message: 'Insertion Failed' }));
    }
  }
  return res;
};

module.exports = restSignUp;
