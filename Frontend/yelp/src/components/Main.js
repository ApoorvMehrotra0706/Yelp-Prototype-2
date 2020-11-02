import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import CustomerLogin from './LoginPage/CustomerLogin';
import RestaurantLogin from './LoginPage/RestaurantLogin';
import CustomerSignup from './Signup/CustomerSignup';
import RestaurantSignup from './Signup/RestaurantSignup';
import RestaurantProfile from './Profile/Profile';
import Navbar from './FirstPage/Navbar';
import WebPage from './FirstPage/WebPage';
import FoodMenu from './Menu/FoodMenu';
import ReviewList from './Reviews/ReviewList';
import OrderList from './Orders/OrdersList';
import EventList from './Events/EventList';
import AboutMe from './Customer/AboutMe';
import UpdateProfile from './Customer/UpdateProfile';
import UpdateContactInformation from './Customer/UpdateContactInformation';
import Home from './FirstPage/Home';
import RestaurantList from '../components/Search/RestaurantList';
import RestaurantPage from './RestProfileOrder/RestaurantPage';
import OrderHistoryList from './OrderHistory/OrderHistoryList';
import Events from './CustomerEvents/Events';
import Users from './Users/Users';
import MessageList from './Messages/MessageList';

// import MenuMain from './Menu/MenuMain';
// Create a Main Component
// eslint-disable-next-line react/prefer-stateless-function
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route path="/" component={Navbar} />
        <Route path="/webPage" component={WebPage} />
        <Route path="/search" component={Home} />
        <Route path="/customerLogin" component={CustomerLogin} />
        <Route path="/restaurantLogin" component={RestaurantLogin} />
        <Route path="/customerSignup" component={CustomerSignup} />
        <Route path="/restaurantSignup" component={RestaurantSignup} />
        <Route path="/restaurantProfile" component={RestaurantProfile} />
        <Route path="/restaurantMenu" component={FoodMenu} />
        <Route path="/restaurantReview" component={ReviewList} />
        <Route path="/restaurantOrders" component={OrderList} />
        <Route path="/restaurantEvents" component={EventList} />
        <Route path="/customerProfile" component={AboutMe} />
        <Route path="/customerProfileUpdate" component={UpdateProfile} />
        <Route path="/customerContactUpdate" component={UpdateContactInformation} />
        <Route path="/restaurantList" component={RestaurantList} />
        <Route path="/RestaurantPage" component={RestaurantPage} />
        <Route path="/orderHistory" component={OrderHistoryList} />
        <Route path="/customerEvents" component={Events} />
        <Route path="/users" component={Users} />
        <Route path="/messages" component={MessageList} />
      </div>
    );
  }
}
// Export The Main Component
export default Main;
