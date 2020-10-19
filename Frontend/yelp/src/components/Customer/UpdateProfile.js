import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import './UpdateProfile.css';
import axios from 'axios';
import serverUrl from '../../config';
import { updateSnackbarData } from '../../reducer/action-types';
import { connect } from 'react-redux';
import SnackBar from '../SharedComponents/Snackbar';

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: { zipError: '', dateError: '' },
      // genders: [],
      // Countries: [],
      // States: [],
      uploadedPic: '',
      Profile: {
        First_Name: '',
        // Last_Name: '',
        Nick_Name: '',
        Gender: '',
        Date_Of_Birth: '',
        Country_ID: '',
        State_ID: '',
        City: '',
        Zip: '',
        Street: '',
        Headline: '',
        I_Love: '',
        Find_Me_In: '',
        Website: '',
        ImageUrl: '',
      },
    };
  }
  componentWillMount() {
    // console.log('inside Signup');
    // axios
    //   .get(serverUrl + 'customer/fetchCustProfileData', {
    //     withCredentials: true,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     const Profile = {
    //       First_Name: response.data[0][0].Name,
    //       // Last_Name: response.data[0][0].Last_Name,
    //       Nick_Name: response.data[0][0].NickName,
    //       Gender: response.data[0][0].GenderID,
    //       // Date_Of_Birth: new Date(response.data[0][0].Date_Of_Birth),
    //       Date_Of_Birth: Moment(response.data[0][0].DOB).format('YYYY-MM-DD'),
    //       Country_ID: response.data[0][0].Country,
    //       State_ID: response.data[0][0].State,
    //       City: response.data[0][0].City,
    //       Zip: response.data[0][0].Zip_Code,
    //       Street: response.data[0][0].Street_Address,
    //       Headline: response.data[0][0].Headline,
    //       I_Love: response.data[0][0].Things_Customer_Love,
    //       Find_Me_In: response.data[0][0].Find_Me_In,
    //       Website: response.data[0][0].Website,
    //       ImageUrl: response.data[0][0].ImageURL,
    //     };
    //     let allCountries = response.data[1].map((country) => {
    //       return { key: country.CountryID, value: country.Country_Name };
    //     });
    //     let allStates = response.data[2].map((state) => {
    //       return { key: state.StateID, value: state.State_Name };
    //     });
    //     let allGenders = response.data[3].map((gender) => {
    //       return { key: gender.GenderID, value: gender.GenderName };
    //     });

    //     this.setState({
    //       genders: this.state.genders.concat(allGenders),
    //       Countries: this.state.Countries.concat(allCountries),
    //       States: this.state.States.concat(allStates),
    //       Profile,
    //     });
    //   });
  }

  onFNameChangeHandler = (e) => {
    // this.setState({
    //   Profile: { ...this.state.Profile, ...{ First_Name: e.target.value } },
    // });
    let payload = {
      Name: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };

  onNickNameChangeHandler = (e) => {
    // this.setState({
    //   Profile: { ...this.state.Profile, ...{ Nick_Name: e.target.value } },
    // });
    let payload = {
      NickName: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onChangeHandlerGender = (e) => {
    // this.setState({
    //   Profile: { ...this.state.Profile, ...{ Gender: e.target.value } },
    // });
    let payload = {
      Gender: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onHeadlineChangeHandler = (e) => {
    // this.setState({
    //   Profile: { ...this.state.Profile, ...{ Headline: e.target.value } },
    // });
    let payload = {
      Headline: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onLoveChangeHandler = (e) => {
    // this.setState({
    //   Profile: { ...this.state.Profile, ...{ I_Love: e.target.value } },
    // });
    let payload = {
      ILove: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onFMIChangeHandler = (e) => {
    let payload = {
      Find_Me_In: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onWebsiteChangeHandler = (e) => {
    // this.setState({
    //   Profile: { ...this.state.Profile, ...{ Website: e.target.value } },
    // });
    let payload = {
      Website: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onChangeHandlerCountry = (e) => {
    let payload = {
      Country: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onChangeHandlerState = (e) => {
    // this.setState({
    //   Profile: { ...this.state.Profile, ...{ State_ID: e.target.value } },
    // });
    let payload = {
      State: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onChangeHandlerZipCode = (e) => {
    if (!/^\d+$/.test(e.target.value) && e.target.value.length > 0) {
      this.setState({
        errors: { ...this.state.errors, ...{ zipError: '  Invalid Value!' } },
      });
    } else {
      this.setState({
        // Profile: { ...this.state.Profile, ...{ Zip: e.target.value } },

        errors: { ...this.state.errors, ...{ zipError: '' } },
      });
      let payload = {
        zip: e.target.value,
      }
      this.props.updateCustomerProfile(payload);
    }
  };
  onChangeHandlerCity = (e) => {
    let payload = {
      City: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onChangeHandlerStreet = (e) => {
    let payload = {
      streetAddress: e.target.value,
    }
    this.props.updateCustomerProfile(payload);
  };
  onChangeDate = (e) => {
    // let errors = {};
    const today = new Date();
    const inputDate = new Date(e.target.value);
    if (today <= inputDate) {
      //errors['dateError'] = '  Cannot select future Date!';
      this.setState({
        errors: { ...this.state.errors, ...{ dateError: '  Cannot select future Date !' } },
      });
    } else {
      this.setState({
        // Profile: { ...this.state.Profile, ...{ Date_Of_Birth: e.target.value } },

        errors: { ...this.state.errors, ...{ dateError: '' } },
      });
      let payload = {
        DOB: e.target.value,
      }
      this.props.updateCustomerProfile(payload);
    }
  };

  onChangeFileHandler = (event) => {
    if (event.target.files.length === 1) {
      event.preventDefault();
      let formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      axios({
        method: 'post',
        url: serverUrl + 'customer/uploadCustomerProfilePic',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            console.log('Product Saved');
            let payload = {
              ImageURL: response.data,
            }
            this.props.updateCustomerProfile(payload);
            //Router.push('/vendor/' + localStorage.getItem('user_id'));
          } else if (parseInt(response.status) === 400) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          this.setState({
            errorMsg: error.message,
            authFlag: false,
          });
        });
      // this.setState({
      //   uploadedPic: event.target.files,
      // });
    }
  };

  updateProfile = (e) => {
    e.preventDefault();
    const data = {
      ...this.props.customerData,
      ...{ token: localStorage.getItem('token'), 
      ...{ user_id: localStorage.getItem('user_id')}},
    };
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.put(serverUrl + 'customer/updateProfile', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';
    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      console.log('cookie not found');
      redirectVar = <Redirect to="/customerLogin" />;
    } else {
      if (localStorage.getItem('role') === 'Customer') {
        redirectVar = null;
      } else if (localStorage.getItem('role') === 'Restaurant') {
        redirectVar = <Redirect to="/restaurantProfile" />;
      } else {
        redirectVar = <Redirect to="/customerLogin" />;
      }
    }
    return (
      <div>
        {redirectVar}

        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
        <div className="main-content-wrap main-content-wrap--full">
          <div className="content-container" id="super-container">
            <div className=" clearfix layout-block layout-n column--responsive account-settings_container">
              <div className="column column-beta column--responsive">
                <div className="account-settings_content">
                  <div class="section-header clearfix">
                    <h2>Profile</h2>
                  </div>
                  <form
                    onSubmit={this.updateProfile}
                    className="profile-bio yform yform-vertical-spacing"
                  >
                    <div class="ysection">
                      <h4>
                        Your Profile Photo
                        <strong>
                          <a href="/#">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={this.onChangeFileHandler}
                              name="fileName"
                              id="filename"
                              multiple
                            />
                            defaultImage
                          </a>
                        </strong>
                      </h4>

                      <div class="photo-box pb-m">
                        <a
                          class="js-analytics-click"
                          data-analytics-label="user-photo"
                          href="/user_photos?return_url=%2Fprofile%3Freturn_url%3D%252Fuser_details%253Fuserid%253DSbr_JFt86Dss0N-hb9StQg"
                        >
                          <img
                            style={{ width: '150px', height: '120px' }}
                            alt=""
                            class="photo-box-img"
                            src={
                              this.props.customerData.ImageURL !== null 
                              
                                ? this.props.customerData.ImageURL
                                : defaultImage
                            }
                            // src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png"
                          />
                        </a>
                      </div>
                    </div>
                    <label for="first_name">Name</label>
                    <span class="help-block">This field is required.</span>
                    <input
                      maxLength="50"
                      id="first_name"
                      name="first_name"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerData.Name}
                      onChange={this.onFNameChangeHandler}
                      required
                    ></input>

                    <label for="nickname">Nickname</label>
                    <span class="help-block">The Boss, Calamity Jane, The Prolific Reviewer</span>
                    <input
                      id="nickname"
                      maxlength="50"
                      name="nickname"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerData.NickName}
                      onChange={this.onNickNameChangeHandler}
                    />
                    <label for="gender">Gender</label>
                    <select
                      placeholder="Gender"
                      className="form-control"
                      onChange={this.onChangeHandlerGender}
                      value={this.props.customerData.Gender}
                      required
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.props.staticData.genderNames.map((gender) => (
                        <option className="Dropdown-menu" key={gender.key} value={gender.value}>
                          {gender.value}
                        </option>
                      ))}
                    </select>
                    <label for="tagline">Your Headline</label>
                    <span class="help-block">
                      Taco Tuesday Aficionado, The Globetrotting Reviewer
                    </span>
                    <input
                      id="tagline"
                      maxlength="100"
                      name="tagline"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerData.Headline}
                      onChange={this.onHeadlineChangeHandler}
                    />
                    <label for="love_name">I Love...</label>
                    <span class="help-block">
                      Comma separated phrases (e.g. sushi, Radiohead, puppies)
                    </span>
                    <textarea
                      id="love_name"
                      maxlength="1024"
                      name="love_name"
                      size="30"
                      type="text"
                      value={this.props.customerData.ILove}
                      onChange={this.onLoveChangeHandler}
                    ></textarea>
                    <label for="find_me_in">Find Me In</label>
                    <span class="help-block">Nob Hill, the newest brunch spot, a turtleneck</span>
                    <input
                      id="find_me_in"
                      maxlength="80"
                      name="find_me_in"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerData.Find_Me_In}
                      onChange={this.onFMIChangeHandler}
                    />
                    <label for="blog">My Blog Or Website</label>
                    <span class="help-block">www.example.com/myawesomeblog</span>
                    <input
                      id="blog"
                      maxlength="80"
                      name="blog"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerData.Website}
                      onChange={this.onWebsiteChangeHandler}
                    />
                    <label for="Country">Country</label>
                    <select
                      placeholder="Country"
                      className="form-control"
                      onChange={this.onChangeHandlerCountry}
                      value={this.props.customerData.Country}
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.props.staticData.countryNames.map((country) => (
                        <option className="Dropdown-menu" key={country.key} value={country.value}>
                          {country.value}
                        </option>
                      ))}
                    </select>
                    <label for="State">State</label>
                    <select
                      placeholder="State"
                      className="form-control"
                      onChange={this.onChangeHandlerState}
                      value={this.props.customerData.State}
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.props.staticData.stateNames.map((state) => (
                        <option className="Dropdown-menu" key={state.key} value={state.value}>
                          {state.value}
                        </option>
                      ))}
                    </select>
                    <label for="Zip Code">
                      Zip Code<span style={{ color: 'red' }}>{this.state.errors['zipError']}</span>
                    </label>
                    <input
                      minlength="5"
                      maxlength="5"
                      id="zipCode"
                      name="zipCode"
                      placeholder="zipCode"
                      type="text"
                      onChange={this.onChangeHandlerZipCode}
                      value={this.props.customerData.zip}
                    />
                    <label for="City">City</label>
                    <input
                      id="city"
                      name="city"
                      placeholder="City"
                      type="text"
                      onChange={this.onChangeHandlerCity}
                      value={this.props.customerData.City}
                    />
                    <label for="Street">Street</label>
                    <input
                      id="street"
                      name="street"
                      placeholder="Street"
                      type="text"
                      onChange={this.onChangeHandlerStreet}
                      value={this.props.customerData.streetAddress}
                    />
                    <label for="DOB">
                      Date Of Birth
                      <span style={{ color: 'red' }}>{this.state.errors['dateError']}</span>
                    </label>
                    <input
                      id="DOB"
                      name="DOB"
                      type="date"
                      //step="1"
                      value={this.state.time}
                      placeholder="Date"
                      onChange={this.onChangeDate}
                      value={this.props.customerData.DOB}
                    />
                    <button
                      disabled={
                        this.state.errors.zipError.length !== 0 ||
                        this.state.errors.dateError.length !== 0
                      }
                      type="submit"
                      value="submit"
                      class="ybtn ybtn--primary ybtn-full-responsive-small"
                    >
                      <span>Save Changes</span>
                    </button>
                    <Link to="/customerProfile"> Cancel</Link>
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
  const { customerData } = state.customerProfileReducer;
  const { staticData } = state.staticDataReducer;
  return {
    snackbarData: snackbarData,
    customerData: customerData,
    staticData: staticData,
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
    updateCustomerProfile: (payload) => {
      dispatch({
        type: 'update-customer-profile',
        payload,
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
