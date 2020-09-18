import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';

// create the Navbar Component
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  // handle logout to destroy the cookie
  handleLogout = () => {
    axios.delete('http://localhost:3001/logout').then((response) => {
      console.log('Status Code : ', response.status);
      if (response.status === 200) {
        this.setState({
          authFlag: false,
        });
      } else {
        this.setState({
          authFlag: true,
        });
      }
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
    return (
      <div>
        {redirectVar}
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <div class="navbar-header">
              <a className="navbar-brand">Yelp</a>
            </div>
            <ul class="nav navbar-nav">
              <li class="active">
                <Link to="/restaurantLogin">Write a Review</Link>
              </li>
              <li>
                <Link to="/restaurantLogin">Events</Link>
              </li>
            </ul>
            {navLogin}
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
