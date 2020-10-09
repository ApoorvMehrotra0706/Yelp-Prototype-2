const bcrypt = require('bcrypt');
const geocoder = require('google-geocoder');
const mysqlConnection = require('../../connection');

const geofinder = geocoder({
  // key: `'${process.env.GOOGLEAPIKEY}'`,
  key: 'AIzaSyDHRJvSWfXNenjs51fuPKCvOODQKm2AhQY',
});

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

const userInsert = async (
  emailID,
  hashedPassword,
  role,
  name,
  contact,
  streetAddress,
  city,
  state,
  country,
  zip,
  latitude,
  longitude
) => {
  const userInsertProcedure = 'CALL userInsert(?,?,?,?,?,?,?,?,?,?,?,?)';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(userInsertProcedure, [
    emailID,
    hashedPassword,
    role,
    name,
    contact,
    streetAddress,
    city,
    state,
    country,
    zip,
    latitude,
    longitude,
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
  const { contact, city, country, state, streetAddress, zip } = req.body;
  const role = 'Restaurant';
  // eslint-disable-next-line prefer-template
  const name = req.body.firstName + ' ' + req.body.lastName;

  if (await checkEmail(emailID, role)) {
    res.writeHead(401, { 'content-type': 'text/json' });
    res.end(JSON.stringify({ message: 'ID already used' }));
  } else {
    try {
      // eslint-disable-next-line prefer-template
      let place = streetAddress.concat(', ');
      place = place.concat(zip);
      console.log(place);

      geofinder.find(place, async function (error, response) {
        const latitude = response[0].location.lat;
        const longitude = response[0].location.lng;
        console.log('lat ', latitude, 'long ', longitude);
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log('Password length is ', hashedPassword.length);
        const insertStatus = await userInsert(
          emailID,
          hashedPassword,
          role,
          name,
          contact,
          streetAddress,
          city,
          state,
          country,
          zip,
          latitude,
          longitude
        );
        if (insertStatus) {
          res.writeHead(200, { 'content-type': 'text/json' });
          res.end(JSON.stringify({ message: 'Insertion successful' }));
        } else {
          res.writeHead(401, { 'content-type': 'text/json' });
          res.end(JSON.stringify({ message: 'Insertion Failed' }));
        }
      });
    } catch (error) {
      console.log('Error ', error);
    }
  }
  return res;
};

module.exports = restSignUp;
