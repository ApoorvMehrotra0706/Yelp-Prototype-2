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
import reviewReducer from './reviewReducer';
import orderReducer from './orderReducer';
import foodCartReducer from './foodCartReducer';
import customerDetailsReducer from './customerDetailsReducer';
import eventReducer from './eventReducer';
import regCustReducer from './regCustReducer';
import newEventReducer from './newEventReducer';
import customerProfileReducer from './customerProfileReducer';
import customerContactInfoReducer from './customerContactInfoReducer';
import restaurantProfileReducer from './restaurantProfileReducer';
import customerReviewReducer from './customerReviewReducer';
import foodOrderMenuReducer from './foodOrderMenuReducer';
import orderHistoryReduer from './orderHistoryReducer';
import customerEventsReducer from './customerEventsReducer';
import yelpUsersReducer from './yelpUsersReducer';
import firstMessageReducer from './firstMessageReducer';
import messageReducer from './messageReducer';
import messageReplyReducer from './messageReplyReducer';

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
  reviewReducer: reviewReducer,
  orderReducer: orderReducer,
  foodCartReducer: foodCartReducer,
  customerDetailsReducer: customerDetailsReducer,
  eventReducer: eventReducer,
  regCustReducer: regCustReducer,
  newEventReducer: newEventReducer,
  customerProfileReducer: customerProfileReducer,
  customerContactInfoReducer: customerContactInfoReducer,
  restaurantProfileReducer: restaurantProfileReducer,
  customerReviewReducer: customerReviewReducer,
  foodOrderMenuReducer: foodOrderMenuReducer,
  orderHistoryReducer: orderHistoryReduer,
  customerEventsReducer: customerEventsReducer,
  yelpUsersReducer: yelpUsersReducer,
  firstMessageReducer: firstMessageReducer,
  messageReducer: messageReducer,
  messageReplyReducer: messageReplyReducer,
});

export default combReducer;
