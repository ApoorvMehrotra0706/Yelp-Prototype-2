import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import '../FirstPage/WebPage.css';
import serverUrl from '../../config';
import { connect } from 'react-redux';

// Define a Login Component
class CustomerSignup extends Component {
  // call the constructor method
  constructor(props) {
    //Call the constructor of Super class i.e The Component
    super(props);
    // maintain the state required for this component
    this.state = {
      emailID: '',
      password: '',
      firstName: '',
      lastName: '',
      contact: null,
      country: '',
      countryError: 0,
      stateName: '',
      stateNames: [],
      countryNames: [],
      city: '',
      cityError: '',
      streetAddress: '',
      streetAddressError: '',
      zip: '',
      zipError: '',
      stateNameError: 0,
      contactError: 0,
      errorFlag: 0,
      authFlag: false,
      emailIDerror: 0,
      firstNameError: 0,
      lastNameError: 0,
    };
    //Bind the handlers to this class
    this.emailIDChangeHandler = this.emailIDChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
    this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.onGenderChangeValue = this.onGenderChangeValue.bind(this);
    this.contactChangeHandler = this.contactChangeHandler.bind(this);
    this.onStateSelect = this.onStateSelect.bind(this);
    this.countryChangeHandler = this.countryChangeHandler.bind(this);
    this.streetAddressChangeHandler = this.streetAddressChangeHandler.bind(this);
    this.cityChangeHandler = this.cityChangeHandler.bind(this);
    this.zipChangeHandler = this.zipChangeHandler.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false,
    });
  }

  componentDidMount() {
    // axios.get(serverUrl + 'customer/stateNames').then((response) => {
    //   //update the state with the response data
    //   let stateDetails = response.data[0].map((state) => {
    //     return { key: state.StateID, value: state.State_Name };
    //   });
    //   this.setState({
    //     stateNames: this.state.stateNames.concat(stateDetails),
    //   });
    // });
    this.setState({
      stateNames: this.props.staticData.stateNames,
      countryNames: this.props.staticData.countryNames,
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

  lastNameChangeHandler = (e) => {
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

  onGenderChangeValue = (e) => {
    this.setState({
      gender: e.target.value,
    });
  };

  contactChangeHandler = (e) => {
    if (isNaN(e.target.value)) {
      this.setState({
        contactError: 1,
      });
    } else {
      this.setState({
        contact: e.target.value,
        contactError: 0,
      });
    }
  };

  onStateSelect = (e) => {
    if (e.target.value === 'Select State') {
      this.setState({
        stateNameError: 1,
      });
    } else {
      this.setState({
        stateName: e.target.value,
        stateNameError: 0,
      });
    }
  };

  countryChangeHandler = (e) => {
    let pattern = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@0123456789]+/g;
    if (e.target.value.match(pattern)) {
      this.setState({
        countryError: 1,
      });
    } else {
      this.setState({
        countryError: 0,
        errorFlag: 0,
        country: e.target.value,
      });
    }
  };

  streetAddressChangeHandler = (e) => {
    this.setState({
      streetAddress: e.target.value,
    });
  };

  cityChangeHandler = (e) => {
    let pattern = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@0123456789]+/g;
    if (e.target.value.match(pattern)) {
      this.setState({
        cityError: 1,
      });
    } else {
      this.setState({
        cityError: 0,
        errorFlag: 0,
        city: e.target.value,
      });
    }
  };

  zipChangeHandler = (e) => {
    if (isNaN(e.target.value)) {
      this.setState({
        zipError: 1,
      });
    } else {
      this.setState({
        zip: e.target.value,
        zipError: 0,
      });
    }
  };
  // submit Login handler to send a request to the node backend
  submitLogin = (e) => {
    var headers = new Headers();
    // prevent page from refresh
    e.preventDefault();
    let pattern = /[@]/;
    if (
      this.state.emailID.match(pattern) &&
      this.state.firstNameError == 0 &&
      this.state.lastNameError == 0 &&
      this.state.contactError == 0 &&
      this.state.stateNameError == 0 &&
      this.state.countryError == 0 &&
      this.state.streetAddressError == 0 &&
      this.state.cityError == 0 &&
      this.state.zipError == 0
    ) {
      const data = {
        emailID: this.state.emailID,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        role: this.state.role,
        gender: this.state.gender,
        contact: this.state.contact,
        country: this.state.country,
        stateName: this.state.stateName,
        streetAddress: this.state.streetAddress,
        city: this.state.city,
        zip: this.state.zip,
      };
      // set the with credentials to true
      axios.defaults.withCredentials = true;
      // make a post request with the user data
      axios
        .post(serverUrl + 'customer/signupCustomer', data)
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (response.status === 200) {
            this.setState({
              authFlag: true,
            });
            let payload = {
              emailID: this.state.emailID,
              role: 'Customer',
              signupStatus: 'true',
            };
            this.props.updateSignupInfo(payload);
          } else {
            this.setState({
              authFlag: false,
            });
          }
        })
        .catch((error) => {
          this.setState({
            errorFlag: 1,
            emailIDerror: 1,
          });
        });
    } else {
      this.setState({
        emailIDerror: 1,
      });
    }
  };

  render() {
    console.log('inside signup');
    //redirect based on successful signup
    let redirectVar = null;
    if (this.state.authFlag) {
      redirectVar = <Redirect to="/customerLogin" />;
    }

    return (
      <div>
        {redirectVar}
        <div
          class="y-container homepage-hero"
          style={{
            backgroundImage: `url(https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_large_assets/252051bf4fce/assets/img/home/hero_photos/oYJx-YOK9dqe0F56bS2tDQ.jpg)`,
          }}
        >
          <div class="container">
            <div class="signup-flow on-flow-start">
              <form onSubmit={this.submitLogin}>
                <div class="flow-start signup-visible">
                  <div class="main-div">
                    <div class="panel">
                      <h2>User Signup Page</h2>
                      <p>Please enter the asked details</p>
                    </div>

                    <div class="form-group">
                      <input
                        onChange={this.emailIDChangeHandler}
                        type="text"
                        class="form-control"
                        name="emailID"
                        placeholder="emailID"
                        required
                      />
                    </div>
                    {this.state.emailIDerror === 1 && (
                      <p style={{ color: 'red' }}>Invalid email id.</p>
                    )}
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
                        placeholderTextColor={'red'}
                        required
                      />
                    </div>
                    {this.state.firstNameError === 1 && (
                      <p style={{ color: 'red' }}>It can only have letters.</p>
                    )}
                    <div class="form-group">
                      <input
                        onChange={this.lastNameChangeHandler}
                        lasttNameChangeHandler
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
                    <div>
                      Male
                      <input
                        type="radio"
                        // class="form-control"
                        name="gender"
                        value="Male"
                        checked={this.state.gender === 'Male'}
                        onClick={this.onGenderChangeValue}
                        required
                      />
                      Female
                      <input
                        type="radio"
                        //class="form-control"
                        name="gender"
                        value="Female"
                        checked={this.state.gender === 'Female'}
                        onClick={this.onGenderChangeValue}
                      />
                      Perfer Not to Say
                      <input
                        type="radio"
                        //class="form-control"
                        name="gender"
                        checked={this.state.gender === 'Other'}
                        onClick={this.onGenderChangeValue}
                        value="Other"
                      />
                    </div>

                    <div class="form-group">
                      <input
                        onChange={this.contactChangeHandler}
                        type="number"
                        class="form-control"
                        name="contactNo"
                        placeholder="Contact Number"
                        required
                      />
                    </div>
                    {this.state.contactError === 1 && (
                      <p style={{ color: 'red' }}>Incorrect entry for phone number</p>
                    )}

                    <div class="form-group">
                      <input
                        onChange={this.streetAddressChangeHandler}
                        type="text"
                        class="form-control"
                        name="streetAddress"
                        placeholder="Street Address"
                        required
                      />
                    </div>
                    {this.state.streetAddressError === 1 && (
                      <p style={{ color: 'red' }}>Invalid entry for address</p>
                    )}

                    <div class="form-group">
                      <input
                        onChange={this.cityChangeHandler}
                        type="text"
                        class="form-control"
                        name="city"
                        placeholder="city"
                        required
                      />
                    </div>
                    {this.state.cityError === 1 && (
                      <p style={{ color: 'red' }}>Only letter allowed</p>
                    )}

                    <div class="form-group">
                      <input
                        onChange={this.zipChangeHandler}
                        type="number"
                        class="form-control"
                        name="zip"
                        placeholder="Zip Code"
                        maxLength="5"
                        onInput={this.maxLengthCheck}
                        required
                      />
                    </div>
                    {this.state.zipError === 1 && (
                      <p style={{ color: 'red' }}>Invalid entry for Zip code</p>
                    )}
                    <div class="form-group">
                      <select
                        className="form-control"
                        value={this.state.stateName}
                        onChange={this.onStateSelect}
                      ><option className="Dropdown-menu" key="" value="">
                      --Select-State--
                    </option>
                        {this.state.stateNames.map((states) => (
                          <option className="Dropdown-menu" key={states.key} value={states.value}>
                            {states.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* <div class="form-group">
                      <input
                        onChange={this.countryChangeHandler}
                        type="text"
                        class="form-control"
                        name="country"
                        placeholder="Country"
                        required
                      />
                      {this.state.countryError === 1 && (
                        <p style={{ color: 'red' }}>Invalid entry</p>
                      )}
                      {this.state.errorFlag === 1 && (
                        <p style={{ color: 'red' }}>Signup failed.ID already in use</p>
                      )}
                    </div> */}
                    <div class="form-group">
                      <select
                        className="form-control"
                        value={this.state.countryName}
                        onChange={this.countryChangeHandler}
                      >
                        <option className="Dropdown-menu" key="" value="">
                            --Select-Country--
                          </option>
                        {this.state.countryNames.map((country) => (
                          <option className="Dropdown-menu" key={country.key} value={country.value}>
                            {country.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button class="btn btn-primary">Register</button>
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
    updateSignupInfo: (payload) => {
      dispatch({
        type: 'signup-field-update',
        payload,
      });
    },
  };
};

const mapStateToProps = (state) => {
  const { staticData } = state.staticDataReducer;
  return {
    staticData: staticData,
    
  };
};
//export Login Component
export default connect(mapStateToProps, mapDispatchToProps)(CustomerSignup);
