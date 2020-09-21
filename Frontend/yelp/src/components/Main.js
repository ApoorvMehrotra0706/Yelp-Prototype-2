import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import CustomerLogin from './LoginPage/CustomerLogin';
import RestaurantLogin from './LoginPage/RestaurantLogin';
// import Home from './Home/Home';
import CustomerSignup from './Signup/CustomerSignup';
import RestaurantSignup from './Signup/RestaurantSignup';
// import Delete from "./Delete/Delete";
// import Create from "./Create/Create";
import Navbar from './FirstPage/Navbar';
import WebPage from './FirstPage/WebPage';

// Create a Main Component
// eslint-disable-next-line react/prefer-stateless-function
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}

        <Route path="/" component={Navbar} />
        <Route path="/webPage" component={WebPage} />
        <Route path="/customerLogin" component={CustomerLogin} />
        <Route path="/restaurantLogin" component={RestaurantLogin} />
        <Route path="/customerSignup" component={CustomerSignup} />
        <Route path="/restaurantSignup" component={RestaurantSignup} />
        {/* <Route path="/delete" component={Delete} />
        <Route path="/create" component={Create} /> */}
      </div>
    );
  }
}
// Export The Main Component
export default Main;
