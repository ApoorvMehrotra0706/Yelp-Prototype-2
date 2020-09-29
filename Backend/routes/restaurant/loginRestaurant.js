/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
// const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const genRandom = require('randomstring');
const url = require('url');
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

const getUserIdFromToken = (token, userRole) => {
  let User = null;
  User = UserTokens.filter((user) => user.Token === token && user.role === userRole);

  let userID = null;
  if (User) {
    userID = User[0].userId;
  }
  return userID;
};

const menuFetch = async (req, res) => {
  const { category } = url.parse(req.url, true).query;
  const id = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
  let items = null;
  if (category === 'APPETIZERS') {
    items = 'CALL fetchAppetizerItems(?)';
  } else if (category === 'BEVERAGESs') {
    items = 'CALL fetchBeveragesItems(?)';
  } else if (category === 'DESSERTS') {
    items = 'CALL fetchDessertsItems(?)';
  } else if (category === 'MAIN_COURSE') {
    items = 'CALL fetchMainCourseItems(?)';
  } else {
    items = 'CALL fetchSaladsItems(?)';
  }
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(items, id);
  con.end();
  res.end(JSON.stringify(results));
};

const menuInsert = async (req, res) => {
  const { category, name, price, cuisine, ingredients, description } = req.body;
  const id = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
  let items = null;
  if (category === 'APPETIZERS') {
    items = 'CALL insertAppetizerItems(?,?,?,?,?,?)';
  } else if (category === 'BEVERAGES') {
    items = 'CALL insertBeveragesItems(?,?,?,?,?,?)';
  } else if (category === 'DESSERTS') {
    items = 'CALL insertDessertsItems(?,?,?,?,?,?)';
  } else if (category === 'MAIN_COURSE') {
    items = 'CALL insertMainCourseItems(?,?,?,?,?,?)';
  } else {
    items = 'CALL insertSaladsItems(?,?,?,?,?,?)';
  }
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(items, [
    id,
    name,
    price,
    cuisine,
    ingredients,
    description,
  ]);
  con.end();
  res.end(JSON.stringify(results));
};

const menuItemDeletion = async (req, res) => {
  const { category, foodId } = req.body;
  const id = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
  let items = null;
  if (category === 'APPETIZERS') {
    items = 'CALL deleteAppetizerItems(?,?)';
  } else if (category === 'BEVERAGES') {
    items = 'CALL deleteBeveragesItems(?,?)';
  } else if (category === 'DESSERTS') {
    items = 'CALL deleteDessertsItems(?,?)';
  } else if (category === 'MAIN_COURSE') {
    items = 'CALL deleteMainCourseItems(?,?)';
  } else {
    items = 'CALL deleteSaladsItems(?,?)';
  }
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(items, [id, foodId]);
  con.end();
  res.end('Deletion successful');
};

const reviewFetch = async (req, res) => {
  const id = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
  const items = 'CALL fetchReviews(?)';
  const con = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await con.query(items, id);
  con.end();
  res.end(JSON.stringify(results));
};

// Fetching Restaurant Details
const getRestaurantCompleteInfo = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    if (userID) {
      const getRestaurantCompleteInfoQuery = 'CALL getRestaurantCompleteInfoQuery(?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getRestaurantCompleteInfoQuery, userID);
      con.end();

      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

// Update Restaurant Profile
const updateRestaurantProfile = async (restaurant, response) => {
  try {
    const {
      Name,
      // eslint-disable-next-line camelcase
      Country,
      // eslint-disable-next-line camelcase
      StateName,
      City,
      Zip,
      Street,
      // eslint-disable-next-line camelcase
      Contact,
      // eslint-disable-next-line camelcase
      Opening_Time,
      // eslint-disable-next-line camelcase
      Closing_Time,
    } = restaurant.body;
    const restroID = getUserIdFromToken(restaurant.body.token, restaurant.body.role);
    if (restroID) {
      const updateRestaurantProfileQuery = 'CALL updateRestPrfile(?,?,?,?,?,?,?,?,?,?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(updateRestaurantProfileQuery, [
        Name,
        // eslint-disable-next-line camelcase
        Country,
        // eslint-disable-next-line camelcase
        StateName,
        City,
        Number(Zip),
        Street,
        // eslint-disable-next-line camelcase
        Number(Contact),
        // eslint-disable-next-line camelcase
        Opening_Time,
        // eslint-disable-next-line camelcase
        Closing_Time,
        restroID,
      ]);

      connection.end();

      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
};

const updateMenu = async (req, res) => {
  try {
    // eslint-disable-next-line camelcase
    const { category, Name, MainIngredients, CuisineID, Description, Price, ID } = req.body;

    const restroID = getUserIdFromToken(req.cookies.cookie, req.cookies.role);
    if (restroID) {
      let updateRestaurantMenuQuery = null;
      if (category === 'APPETIZERS') {
        updateRestaurantMenuQuery = 'CALL updateAppetizerMenu(?,?,?,?,?,?,?)';
      } else if (category === 'BEVERAGES') {
        updateRestaurantMenuQuery = 'CALL updateBeveragesMenu(?,?,?,?,?,?,?)';
      } else if (category === 'DESSERTS') {
        updateRestaurantMenuQuery = 'CALL updateDessertsMenu(?,?,?,?,?,?,?)';
      } else if (category === 'MAIN_COURSE') {
        updateRestaurantMenuQuery = 'CALL updateMainCourseMenu(?,?,?,?,?,?,?)';
      } else {
        updateRestaurantMenuQuery = 'CALL updateSaladsMenu(?,?,?,?,?,?,?)';
      }
      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(updateRestaurantMenuQuery, [
        restroID,
        Name,
        // eslint-disable-next-line camelcase
        MainIngredients,
        CuisineID,
        Description,
        Price,
        ID,
      ]);

      connection.end();
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end(JSON.stringify(results));
    } else {
      res.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      res.end('Invalid User');
    }
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
};

// restaurant/orderFetch from ORDERS
const getRestaurantOrders = async (request, response) => {
  try {
    const { sortValue } = url.parse(request.url, true).query;
    let state = null;
    if (sortValue === 'All') state = '%';
    else if (sortValue === 'New') state = 'New';
    else if (sortValue === 'Delivered') state = 'Delivered';
    else state = 'Canceled';
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    if (userID) {
      const getRestaurantOdersQuery = 'CALL getOrderDetails(?,?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getRestaurantOdersQuery, [state, userID]);
      con.end();

      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

const getPersonOrder = async (request, response) => {
  try {
    const { orderID } = url.parse(request.url, true).query;
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.role);
    if (userID) {
      const getRestaurantOdersQuery = 'CALL getPersonOrderDetails(?,?)';

      const con = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await con.query(getRestaurantOdersQuery, [orderID, userID]);
      con.end();

      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

const updateDeliveryStatus = async (req, res) => {
  try {
    // eslint-disable-next-line camelcase
    const { deliveryStatus, orderID } = req.body;

    const updateDelivery = 'CALL updateDelivery(?,?,?)';

    let state = null;
    if (deliveryStatus === '5') state = 'Delivered';
    else if (deliveryStatus === '7') state = 'Canceled';
    else state = 'New';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(updateDelivery, [
      deliveryStatus,
      orderID,
      state,
    ]);
    connection.end();
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
};
module.exports = {
  restLogin,
  logoutRest,
  menuFetch,
  menuInsert,
  menuItemDeletion,
  reviewFetch,
  getRestaurantCompleteInfo,
  updateRestaurantProfile,
  updateMenu,
  getRestaurantOrders,
  getPersonOrder,
  updateDeliveryStatus,
};
