import { combineReducers, createStore } from 'redux';
import signupReducer from './signupReducer';
import loginReducer from './loginHandlingReducer';
import nameReducer from './nameInfoReducer';
import snackbarReducer from './snackbarReducer';

const combReducer = combineReducers({
  signup: signupReducer,
  login: loginReducer,
  nameInfo: nameReducer,
  snackbar: snackbarReducer,
});

export default combReducer;
