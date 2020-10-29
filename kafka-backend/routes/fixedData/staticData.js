const States = require('../models/StateModel');
const Country = require('../models/CountryModel');
const Gender = require('../models/GenderModel');
const Users = require('../models/LoginModel');

// const getStateAndCountry = async () => {
//   const data = [];
//   const res = {};
//   States.find({}, (error, result) => {
//     if (error) {
//       res.status = 500;
//       res.end = 'Network error';
//     } else {
//       data.push(result);
//       Country.find({}, (error1, result1) => {
//         if (error1) {
//           res.status = 500;
//           res.end = 'Network error';
//         } else {
//           data.push(result1);
//           Gender.find({}, (error2, result2) => {
//             if (error2) {
//               res.status = 500;
//               res.end = 'Network error';
//             } else {
//               res.status = 200;
//               // res.end(JSON.stringify(result));
//               data.push(result2);
//               res.end = JSON.stringify(data);
//             }
//           });
//         }
//       });
//     }
//   });
// };

async function handle_request(msg, callback) {
  switch (msg.api) {
    case 'fetchStaticData': {
      // const results = await getStateAndCountry();
      const data = [];
      const res = {};
      States.find({}, (error, result) => {
      if (error) {
        res.status = 500;
        res.end = 'Network error';
        callback(null, res);
      } else {
        data.push(result);
        Country.find({}, (error1, result1) => {
          if (error1) {
            res.status = 500;
            res.end = 'Network error';
            callback(null, res);
          } else {
            data.push(result1);
            Gender.find({}, (error2, result2) => {
              if (error2) {
                res.status = 500;
                res.end = 'Network error';
                callback(null, res);
              } else {
                res.status = 200;
                // res.end(JSON.stringify(result));
                data.push(result2);
                res.end = JSON.stringify(data);
                callback(null, res);
              }
            });
          }
        });
      }
    });
      
      break;
    }
    case 'passport': {
      Users.findById(msg.body, (err, results) => {
        if (err) {
          return callback(err, null);
        }
        if (results) {
          callback(null, results);
        } else {
          callback(null, null);
        }
      });
      break;
    }
    default:
      break;
  }
}

exports.handle_request = handle_request;
