import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import loginHandlingReducer from '../../reducer/loginHandlingReducer';
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux';
import serverUrl from './../../config';

// Define a Login Component
class CustomerLogin extends Component {
  // call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    // maintain the state required for this component
    this.state = {
      emailID: '',
      password: '',
      role: '',
      authFlag: false,
      errorFlag: 0,
    };
    //Bind the handlers to this class
    this.emailIDChangeHandler = this.emailIDChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false,
    });
  }
  // emailID change handler to update state variable with the text entered by the user
  emailIDChangeHandler = (e) => {
    this.setState({
      emailID: e.target.value,
      errorFlag: 0,
    });
  };
  // password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
      errorFlag: 0,
    });
  };

  onRoleChangeValue = (event) => {
    this.setState({
      role: event.target.value,
    });
  };
  // submit Login handler to send a request to the node backend
  submitLogin = (e) => {
    var headers = new Headers();
    // prevent page from refresh
    e.preventDefault();
    const data = {
      emailID: this.state.emailID,
      password: this.state.password,
    };
    // set the with credentials to true
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios
      .post(serverUrl + 'customer/loginCustomer', data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          localStorage.setItem('token',response.data);
          this.setState({
            authFlag: true,
          });
          let payload = {
            emailID: this.state.emailID,
            role: 'Customer',
            loginStatus: 'true',
          };
          this.props.updateLoginInfo(payload);
        } else {
          this.setState({
            authFlag: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          errorFlag: 1,
        });
      });
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    if (localStorage.getItem('token')) {
      const decoded = jwt_decode(localStorage.getItem('token').split(' ')[1]);
      localStorage.setItem('user_id', decoded._id);
      localStorage.setItem('username', decoded.username);
      localStorage.setItem('role',decoded.role);
      redirectVar = <Redirect to="/customerProfile" />;
    }
    return (
      <div>
        {redirectVar}
        <div
          class="y-container homepage-hero"
          style={{
            backgroundImage: `url(https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_large_assets/e456d8b923f5/assets/img/home/hero_photos/DLIUyjgS7v50YRV2xfNquA.jpg)`,
          }}
        >
          <div class="container">
            <div class="signup-flow on-flow-start">
              <form onSubmit={this.submitLogin}>
                <div class="flow-start signup-visible">
                  <div class="main-div">
                    <div class="panel">
                      <h2>User Login Page</h2>
                      <p>Please enter your username and password</p>
                    </div>

                    <div class="form-group">
                      <input
                        onChange={this.emailIDChangeHandler}
                        type="text"
                        class="form-control"
                        name="emailID"
                        placeholder="Email Address"
                      />
                    </div>
                    <div class="form-group">
                      <input
                        onChange={this.passwordChangeHandler}
                        type="password"
                        class="form-control"
                        name="password"
                        placeholder="Password"
                      />
                    </div>
                    {this.state.errorFlag === 1 && (
                      <p style={{ color: 'red' }}>Invalid credentails, please try again.</p>
                    )}
                    <button class="btn btn-primary">Login</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
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
  };
};
//export Login Component
export default connect(null, mapDispatchToProps)(CustomerLogin);
