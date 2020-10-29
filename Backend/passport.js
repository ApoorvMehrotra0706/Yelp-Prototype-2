/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const kafka = require('./kafka/client');
const { secret } = require('../kafka-backend/config');

// Setup work and export for the JWT passport strategy
function auth() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secret,
  };
  passport.use(
    new JwtStrategy(opts, (jwt_payload, callback) => {
      const user_id = jwt_payload._id;
      const data = {
        api: 'passport',
        body: user_id,
      };
      // eslint-disable-next-line consistent-return
      kafka.make_request('staticRoutes', data, function (err, results) {
        console.log('in result');
        console.log(results);
        if (err) {
          console.log('Inside err');
          return callback(err, false);
        }
        if (results) {
          callback(null, results);
        } else {
          console.log('Inside else');
          callback(null, false);
        }
      });
      // eslint-disable-next-line consistent-return
      // Users.findById(user_id, (err, results) => {
      //   if (err) {
      //     return callback(err, false);
      //   }
      //   if (results) {
      //     callback(null, results);
      //   } else {
      //     callback(null, false);
      //   }
      // });
    })
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false });
