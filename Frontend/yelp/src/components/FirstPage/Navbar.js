import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import serverUrl from '../../config';
import { connect } from 'react-redux';
import moment from 'moment';

// create the Navbar Component
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateNames: [],
      countryNames: [],
      genderNames: [],
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    axios.get(serverUrl + 'staticData/fetchStaticData').then((response) => {
      console.log(response.data);
      //update the state with the response data
      let stateDetails = response.data[0].map((state) => {
        return { key: state._id, value: state.StateName };
      });
      this.setState({
        stateNames: this.state.stateNames.concat(stateDetails),
      });
      let countryDetails = response.data[1].map((country) => {
        return { key: country._id, value: country.CountryName };
      });
      this.setState({
        countryNames: this.state.countryNames.concat(countryDetails),
      });
      let genderDetails = response.data[2].map((gender) => {
        return { key: gender._id, value: gender.GenderName };
      });
      this.setState({
        genderNames: this.state.genderNames.concat(genderDetails),
      });
      let payload = {
        stateNames: this.state.stateNames,
        countryNames: this.state.countryNames,
        genderNames: this.state.genderNames,
      };
      this.props.updateStaticDataInfo(payload);

      // Loading customer Profile
      if(localStorage.getItem('token') && localStorage.getItem('role') === 'Customer') {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios
        .get(
          serverUrl + 'customer/getCustomerCompleteProfile',

          { params: { CustomerID: localStorage.getItem('user_id') }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let DOB = moment.utc(response.data.DOB);
          DOB= DOB.format('YYYY-MM-DD');
          localStorage.setItem('Name', response.data.name);
          let payload = {
            Name: response.data.name,
            NickName: response.data.NickName,
            DOB: DOB,
            City: response.data.City,
            State: response.data.state, 
            Address: (response.data.City.concat(', ')).concat(response.data.state), 
            Gender: response.data.gender,         
            streetAddress: response.data.streetAddress,
            Country: response.data.country,
            zip: response.data.zip,
            Headline: response.data.Headline,
            Contact: response.data.contact,
            ILove: response.data.Things_Customer_Love,
            Find_Me_In: response.data.Find_Me_In,
            YelpingSince: response.data.YelpingSince,
            Website: response.data.Website,
            ImageURL: response.data.ImageURL,
            Events: response.data.Events,
            FollowingIDs: response.data.FollowingCustomerIDs,
          };
          this.props.updateCustomerProfile(payload);
          payload = {
            Contact: response.data.contact,
            EmailID: localStorage.getItem('username'),
            NewEmailID: localStorage.getItem('username'),
            NewContact: response.data.contact,
          };
          this.props.updateCustomerContactInfo(payload);
        });
      }
    });
  }

  // handle logout to destroy the cookie
  handleLogout = () => {
    const data = {
      token: localStorage.getItem('token'),
      role: localStorage.getItem('role'),
    };
    let url = '';
    if (data.role === 'Customer') url = serverUrl + 'customer/logoutCustomer';
    else url = serverUrl + 'restaurant/restaurantLogout';
    axios
      .post(url, data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          this.setState({
            authFlag: false,
          });
          
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
      localStorage.clear();
  };
  render() {
    // if Token is set render Logout Button
    let navLogin = null;
    if (localStorage.getItem('token')) {
      console.log('Able to read token');
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
      console.log('Not Able to read token');
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
    if (localStorage.getItem('token') && this.props.location.pathname === '/login') {
      redirectVar = <Redirect to="/home" />;
    }

    if (!localStorage.getItem('token')) {
      if (this.props.location.pathname === '/RestaurantList') {
        redirectVar = <Redirect to="/RestaurantList" />;
      } else if (this.props.location.pathname === '/RestaurantPage') {
        redirectVar = <Redirect to="/RestaurantPage" />;
      } else {
        redirectVar = <Redirect to="/webPage" />;
      }
    }

    let options = null;
    if (!localStorage.getItem('token')) {
      options = (
        <ul class="nav navbar-nav">
          <li class={this.props.location.pathname === '/search' && 'active'}>
            <Link to="/search">Search</Link>
          </li>
        </ul>
      );
    } else if (localStorage.getItem('token') && localStorage.getItem('role') === 'Restaurant') {
      options = (
        <ul class="nav navbar-nav">
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
          <li class={this.props.location.pathname === '/messages' && 'active'}>
            <Link to="/messages">Message</Link>
          </li>
        </ul>
      );
    } else if (localStorage.getItem('token') && localStorage.getItem('role') === 'Customer') {
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
          <li class={this.props.location.pathname === '/users' && 'active'}>
            <Link to="/users">Yelp Users</Link>
          </li>
          <li class={this.props.location.pathname === '/messages' && 'active'}>
            <Link to="/messages">Message</Link>
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
    updateStaticDataInfo: (payload) => {
      dispatch({
        type: 'update-static-field',
        payload,
      });
    },
    updateCustomerProfile: (payload) => {
      dispatch({
        type: 'update-customer-profile',
        payload,
      });
    },
    updateCustomerContactInfo: (payload) => {
      dispatch({
        type: 'customer-contact-info',
        payload,
      });
    },
  };
};

export default connect(null, mapDispatchToProps)(Navbar);
