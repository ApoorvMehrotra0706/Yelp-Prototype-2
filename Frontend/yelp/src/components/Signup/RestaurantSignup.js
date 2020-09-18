import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

// Define a Login Component
class Login extends Component {
  // call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    // maintain the state required for this component
    this.state = {
      emailID: '',
      password: '',
      errorFlag: 0,
      authFlag: false,
      emailIDerror: 0,
      firstNameError: 0,
      lastNameError: 0,
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
      emailIDerror: 0,
    });
  };
  // password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
      errorFlag: 0,
    });
  };

  firstNameChangeHandler = (e) => {
    let pattern = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@0123456789]+/g;
    if (e.target.value.match(pattern)) {
      this.setState({
        firstNameError: 1,
      });
    } else {
      this.setState({
        firstNameError: 0,
        errorFlag: 0,
        firstName: e.target.value,
      });
    }
  };

  lasttNameChangeHandler = (e) => {
    let pattern = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@0123456789]+/g;
    if (e.target.value.match(pattern)) {
      this.setState({
        lastNameError: 1,
      });
    } else {
      this.setState({
        lastNameError: 0,
        errorFlag: 0,
        lastName: e.target.value,
      });
    }
  };

  // submit Login handler to send a request to the node backend
  submitLogin = (e) => {
    var headers = new Headers();
    // prevent page from refresh
    e.preventDefault();
    let pattern = /[@]/;
    if (this.state.emailID.match(pattern)) {
      const data = {
        emailID: this.state.emailID,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        role: this.state.role,
        gender: this.state.gender,
      };
      // set the with credentials to true
      axios.defaults.withCredentials = true;
      // make a post request with the user data
      axios
        .post('http://localhost:3004/restaurant//signupRestaurant', data)
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (response.status === 200) {
            this.setState({
              authFlag: true,
            });
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
    } else {
      this.setState({
        emailIDerror: 1,
      });
    }
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container">
          <form onSubmit={this.submitLogin}>
            <div class="login-form">
              <div class="main-div">
                <div class="panel">
                  <h2>Business Sign Up</h2>
                  <p>Please enter the asked details</p>
                </div>

                <div class="form-group">
                  <input
                    onChange={this.emailIDChangeHandler}
                    type="text"
                    class="form-control"
                    name="emailID"
                    placeholder="Email Address"
                    required
                  />
                </div>
                {this.state.emailIDerror === 1 && <p style={{ color: 'red' }}>Invalid email id.</p>}
                <div class="form-group">
                  <input
                    onChange={this.passwordChangeHandler}
                    type="password"
                    class="form-control"
                    name="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    onChange={this.firstNameChangeHandler}
                    type="text"
                    class="form-control"
                    name="firstName"
                    placeholder="First Name"
                    required
                  />
                </div>
                {this.state.firstNameError === 1 && (
                  <p style={{ color: 'red' }}>It can only have letters.</p>
                )}
                <div class="form-group">
                  <input
                    onChange={this.lastNameChangeHandler}
                    type="text"
                    class="form-control"
                    name="lastName"
                    placeholder="Last Name"
                    required
                  />
                </div>
                {this.state.lastNameError === 1 && (
                  <p style={{ color: 'red' }}>It can only have letters.</p>
                )}

                {this.state.errorFlag === 1 && (
                  <p style={{ color: 'red' }}>Signup failed.ID already in use</p>
                )}
                <button class="btn btn-primary">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
//export Login Component
export default Login;
