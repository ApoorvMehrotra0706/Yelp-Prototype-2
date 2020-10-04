import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import { connect } from 'react-redux';

// create the Navbar Component
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  // handle logout to destroy the cookie
  handleLogout = () => {
    const data = {
      token: cookie.load('cookie'),
      role: cookie.load('role'),
    };
    let url = '';
    if (data.role === 'Customer') url = 'http://localhost:3004/customer/logoutCustomer';
    else url = 'http://localhost:3004/restaurant/logoutRestaurant';
    axios
      .post(url, data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          this.setState({
            authFlag: false,
          });
          localStorage.clear();
          let payload = {
            emailID: '',
            role: '',
            loginStatus: 'false',
          };
          this.props.updateLoginInfo(payload);
          payload = {
            emailID: '',
            role: '',
            signupStatus: '',
          };
          this.props.updateSignUpInfo(payload);
          payload = {
            Name: '',
          };
          this.props.updateNameInfo(payload);
        } else {
          this.setState({
            authFlag: true,
          });
        }
      })
      .catch((error) => {
        this.setState({
          errorFlag: 1,
        });
      });
    cookie.remove('cookie', { path: '/' });
  };
  render() {
    //if Cookie is set render Logout Button
    let navLogin = null;
    if (cookie.load('cookie')) {
      console.log('Able to read cookie');
      navLogin = (
        <ul class="nav navbar-nav navbar-right">
          <li>
            <Link to="/" onClick={this.handleLogout}>
              <span class="glyphicon glyphicon-user"></span>Logout
            </Link>
          </li>
        </ul>
      );
    } else {
      // Else display login button
      console.log('Not Able to read cookie');
      navLogin = (
        <ul class="nav navbar-nav navbar-right">
          <li>
            <Link to="/customerLogin">
              <span class="glyphicon glyphicon-log-in"></span> User Login
            </Link>
          </li>
          <li>
            <Link to="/restaurantLogin">
              <span class="glyphicon glyphicon-log-in"></span> Biz Login
            </Link>
          </li>
          <li>
            <Link to="/customerSignup">
              <span class="glyphicon glyphicon-log-in"></span>User Signup
            </Link>
          </li>
          <li>
            <Link to="/restaurantSignup">
              <span class="glyphicon glyphicon-log-in"></span>Biz Signup
            </Link>
          </li>
        </ul>
      );
    }
    let redirectVar = null;
    if (cookie.load('cookie') && this.props.location.pathname === '/login') {
      redirectVar = <Redirect to="/home" />;
    }

    // if (!cookie.load('cookie') && 1) {
    //   if (this.props.location.pathname === '/RestaurantList') {
    //     this.props.location.pathname === '/RestaurantList';
    //   } else if (this.props.location.pathname === '/RestaurantPage') {
    //     redirectVar = <Redirect to="/RestaurantPage" />;
    //   } else {
    //     redirectVar = <Redirect to="/webPage" />;
    //   }
    // }

    // if (!cookie.load('cookie') && this.props.location.pathname === '/RestaurantList') {
    //   redirectVar = <Redirect to="/RestaurantList" />;
    // }

    // if (!cookie.load('cookie') && this.props.location.pathname === '/RestaurantPage') {
    //   redirectVar = <Redirect to="/RestaurantPage" />;
    // }

    // if (!cookie.load('cookie')) redirectVar = <Redirect to="/webPage" />;

    let options = null;
    if (!cookie.load('cookie')) {
      options = (
        <ul class="nav navbar-nav">
          <li class={this.props.location.pathname === '/restaurantLogin' && 'active'}>
            <Link to="/restaurantLogin">Write a Review</Link>
          </li>
          <li class={this.props.location.pathname === '/restaurantLogin' && 'active'}>
            <Link to="/restaurantLogin">Events</Link>
          </li>
          <li class={this.props.location.pathname === '/search' && 'active'}>
            <Link to="/search">Search</Link>
          </li>
        </ul>
      );
    } else if (cookie.load('cookie') && cookie.load('role') === 'Restaurant') {
      options = (
        <ul class="nav navbar-nav">
          <li class={this.props.location.pathname === '/home' && 'active'}>
            <Link to="/restaurantLandingPage">Home</Link>
          </li>
          <li class={this.props.location.pathname === '/restaurantProfile' && 'active'}>
            <Link to="/restaurantProfile">Profile</Link>
          </li>
          <li class={this.props.location.pathname === '/restaurantMenu' && 'active'}>
            <Link to="/restaurantMenu">Food Menu</Link>
          </li>
          <li class={this.props.location.pathname === '/restaurantOrders' && 'active'}>
            <Link to="/restaurantOrders">Orders</Link>
          </li>
          <li class={this.props.location.pathname === '/restaurantReview' && 'active'}>
            <Link to="/restaurantReview">Review</Link>
          </li>
          <li class={this.props.location.pathname === '/restaurantEvents' && 'active'}>
            <Link to="/restaurantEvents">Events</Link>
          </li>
        </ul>
      );
    } else if (cookie.load('cookie') && cookie.load('role') === 'Customer') {
      options = (
        <ul class="nav navbar-nav">
          <li class={this.props.location.pathname === '/customerProfile' && 'active'}>
            <Link to="/customerProfile">Profile</Link>
          </li>
          <li class={this.props.location.pathname === '/customerProfileUpdate' && 'active'}>
            <Link to="/customerProfileUpdate">Profile Update</Link>
          </li>
          <li class={this.props.location.pathname === '/customerContactUpdate' && 'active'}>
            <Link to="/customerContactUpdate">Contact Info Update</Link>
          </li>
          <li class={this.props.location.pathname === '/search' && 'active'}>
            <Link to="/search">Search</Link>
          </li>
          <li class={this.props.location.pathname === '/customerEvents' && 'active'}>
            <Link to="/customerEvents">Events</Link>
          </li>
          <li class={this.props.location.pathname === '/orderHistory' && 'active'}>
            <Link to="/orderHistory">Order History</Link>
          </li>
        </ul>
      );
    }
    return (
      <div>
        {redirectVar}
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <div class="navbar-header">
              <a className="navbar-brand">
                <Link to="/WebPage">Yelp</Link>
              </a>
            </div>

            {options}
            {navLogin}
          </div>
        </nav>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginInfo: (payload) => {
      dispatch({
        type: 'update-login-field',
        payload,
      });
    },
    updateSignUpInfo: (payload) => {
      dispatch({
        type: 'signup-field-update',
        payload,
      });
    },
    updateNameInfo: (payload) => {
      dispatch({
        type: 'update-name-field',
        payload,
      });
    },
  };
};

export default connect(null, mapDispatchToProps)(Navbar);
