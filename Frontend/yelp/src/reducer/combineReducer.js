import { combineReducers, createStore } from 'redux';
import signupReducer from './signupReducer';
import loginReducer from './loginHandlingReducer';
import nameReducer from './nameInfoReducer';
import snackbarReducer from './snackbarReducer';
import customerBasicInfoReducer from './customerBasicInfoReducer';
import searchTabReducer from './searchTabReducer';
import restaurantSearchResultReducer from './restaurantSearchResultReducer';
import staticDataReducer from './staticDataReducer';
import restaurantDataReducer from './restaurantDataReducer';
import cuisineReucer from './cuisineReducer';
import foodMenuReducer from './foodMenuReducer';

const combReducer = combineReducers({
  signup: signupReducer,
  login: loginReducer,
  nameInfo: nameReducer,
  snackbar: snackbarReducer,
  customer: customerBasicInfoReducer,
  searchTabReducer: searchTabReducer,
  restaurantSearchResultReducer: restaurantSearchResultReducer,
  staticDataReducer: staticDataReducer,
  restaurantDataReducer: restaurantDataReducer,
  cuisineReducer: cuisineReucer,
  foodMenuReducer: foodMenuReducer,

});

export default combReducer;
