/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const { secret } = require('./config');
const Users = require('./routes/models/LoginModel');

// Setup work and export for the JWT passport strategy
function auth() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secret,
  };
  passport.use(
    new JwtStrategy(opts, (jwt_payload, callback) => {
      const user_id = jwt_payload._id;
      // eslint-disable-next-line consistent-return
      Users.findById(user_id, (err, results) => {
        if (err) {
          return callback(err, false);
        }
        if (results) {
          callback(null, results);
        } else {
          callback(null, false);
        }
      });
    })
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false });
