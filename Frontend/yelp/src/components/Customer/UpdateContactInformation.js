import React, { Component } from 'react';
// import CustomerNavBar from '../../Customer/CommonArea/CustomerNavBar';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import './UpdateProfile.css';
import axios from 'axios';
import serverUrl from '../../config';
import { updateSnackbarData } from '../../reducer/action-types';
import { connect } from 'react-redux';
import SnackBar from '../../reducer/snackbarReducer';

class UpdateContactInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: { contactError: '', passwordMisMatchError: '', submitError: '' },
      CountryCodes: [],
      Profile: {
        Email: '',
        NewEmail: '',
        ContactNo: '',
        Password: '',
        RetypePassword: '',
        CountryCode: '',
      },
    };
  }
  componentWillMount() {
    console.log('inside Signup');
    axios
      .get(serverUrl + 'customer/getContactInfo', {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        const Profile = {
          Email: response.data[0][0].EmailID,
          NewEmail: response.data[0][0].EmailID,
          ContactNo: response.data[0][0].Contact,
          //   CountryCode: response.data[0][0].CountryCode,
        };
        this.setState({
          Profile,
        });
      });
  }

  onEmailChangeHandler = (e) => {
    this.setState({
      Profile: { ...this.state.Profile, ...{ NewEmail: e.target.value } },
      errors: { ...this.state.errors, ...{ submitError: '' } },
    });
  };
  onContactNoCHangeHandler = (e) => {
    if (!/^\d+$/.test(e.target.value) && e.target.value.length > 0) {
      this.setState({
        errors: { ...this.state.errors, ...{ contactError: '  Invalid Value!', submitError: '' } },
      });
    } else {
      this.setState({
        Profile: { ...this.state.Profile, ...{ ContactNo: e.target.value } },

        errors: { ...this.state.errors, ...{ contactError: '' } },
      });
    }
  };

  onPasswordChangeHandler = (e) => {
    this.setState({
      Profile: { ...this.state.Profile, ...{ Password: e.target.value } },
      errors: { ...this.state.errors, ...{ submitError: '' } },
    });
  };
  onRePasswordChangeHandler = (e) => {
    let errors = { ...this.state.errors, ...{ passwordMisMatchError: '' } };
    if (e.target.value !== this.state.Profile.Password) {
      errors = {
        ...this.state.errors,
        ...{
          passwordMisMatchError: '  Both Passwords Are Different!',
          submitError: '',
        },
      };
    }
    this.setState({
      Profile: { ...this.state.Profile, ...{ RetypePassword: e.target.value } },
      errors,
    });
  };
  onChangeHandlerCountryCode = (e) => {
    this.setState({
      Profile: { ...this.state.Profile, ...{ CountryCode: e.target.value } },
      errors: { ...this.state.errors, ...{ submitError: '' } },
    });
  };

  updateContactInformation = (e) => {
    e.preventDefault();
    const data = {
      ...this.state.Profile,
      ...{ token: localStorage.getItem('token'), userrole: localStorage.getItem('role') },
    };
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.put(serverUrl + 'customer/updateContactInfo', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          let payload = {
            success: true,
            message: 'Contact Information Updated Successfully!',
          };
          this.props.updateSnackbarData(payload);
          //updateRedirect = <Redirect to="/customerLogin" />;
          alert('Updated Successfully');
        }
      },
      (error) => {
        console.log(error);
        if (error.response.status === 401) {
          this.setState({
            errors: { ...this.state.errors, ...{ submitError: error.response.data } },
          });
        }
      }
    );
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      console.log('cookie not found');
      redirectVar = <Redirect to="/customerLogin" />;
    } else {
      if (cookie.load('role') === 'Customer') {
        redirectVar = null;
      } else if (cookie.load('role') === 'Restaurant') {
        redirectVar = <Redirect to="/RestaurantLandingPage" />;
      } else {
        redirectVar = <Redirect to="/customerLogin" />;
      }
    }
    return (
      <div>
        {redirectVar}
        {this.props.snackbarData != null && <SnackBar />}
        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
        {/* <div className="main-content-wrap main-content-wrap--full">
          <div className="content-container" id="super-container">
            <div className=" clearfix layout-block layout-n column--responsive account-settings_container">
              <div className="column column-beta column--responsive"> */}
        <div class="container">
          <div class="signup-flow on-flow-start">
            <div class="flow-start signup-visible">
              <div class="main-div">
                <div class="panel">
                  <div class="section-header clearfix">
                    <h2>Contact Information</h2>
                  </div>
                  <form
                    onSubmit={this.updateContactInformation}
                    className="profile-bio yform yform-vertical-spacing"
                  >
                    <div class="form-group">
                      <label for="first_name">Email</label>

                      <input
                        maxLength="50"
                        id="Email"
                        name="Email"
                        placeholder=""
                        size="30"
                        type="email"
                        value={this.state.Profile.NewEmail}
                        onChange={this.onEmailChangeHandler}
                        required
                      ></input>
                    </div>
                    <div class="form-group">
                      <label for="last_name" style={{ width: '100%' }}>
                        Contact No:
                        <span style={{ color: 'red' }}>
                          {this.state.errors['passwordMisMatchError']}
                        </span>
                      </label>

                      <input
                        style={{ display: 'inline', width: '90%' }}
                        id="ContactNo"
                        maxlength="10"
                        minLength="10"
                        name="ContactNo"
                        placeholder=""
                        size="30"
                        type="text"
                        value={this.state.Profile.ContactNo}
                        onChange={this.onContactNoCHangeHandler}
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label for="nickname">Password</label>
                      <input
                        id="password"
                        maxlength="50"
                        name="password"
                        placeholder=""
                        size="30"
                        type="password"
                        value={this.state.Profile.Password}
                        onChange={this.onPasswordChangeHandler}
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label for="nickname">
                        ReType Password
                        <span style={{ color: 'red' }}>
                          {this.state.errors['passwordMisMatchError']}
                        </span>
                      </label>
                      <input
                        id="repassword"
                        maxlength="50"
                        name="repassword"
                        placeholder=""
                        size="30"
                        type="password"
                        value={this.state.Profile.RetypePassword}
                        onChange={this.onRePasswordChangeHandler}
                        required
                      />
                    </div>
                    <span style={{ color: 'red' }}>{this.state.errors['submitError']}</span>
                    <br />
                    <button
                      disabled={this.state.errors.passwordMisMatchError.length !== 0}
                      type="submit"
                      value="submit"
                      class="ybtn ybtn--primary ybtn-full-responsive-small"
                    >
                      <span>Save Changes</span>
                    </button>
                    <Link to="/AboutMe"> Cancel</Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// export default UpdateProfile;

const mapStateToProps = (state) => {
  const snackbarData = state.snackBarReducer;
  return {
    snackbarData: snackbarData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSnackbarData: (payload) => {
      dispatch({
        type: updateSnackbarData,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateContactInformation);
