import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import serverUrl from '../../config';
import cookie from 'react-cookies';
import '../FirstPage/RestaurantHome.css';
import { connect } from 'react-redux';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      Email: '',
      StateName: '',
      City: '',
      Zip: '',
      Street: '',
      Contact: '',
      Opening_Time: '',
      Closing_Time: '',
      Countries: [],
      States: [],
      isFormDisable: true,
      submitError: false,
      submitErrorBlock: '',
      CurbsidePickup: false,
      DineIn: false,
      YelpDelivery: false,
      ImageUrl: '',
      UploadPic: '',
      tmpEditProfile: {
        Name: '',
        Email: '',
        Country: '',
        StateName: '',
        City: '',
        Zip: '',
        Street: '',
        Contact: '',
        Opening_Time: '',
        Closing_Time: '',
        CurbsidePickup: false,
        DineIn: false,
        YelpDelivery: false,
        ImageUrl: '',
      },
    };
  }

  componentDidMount() {
    axios.get(serverUrl + 'restaurant/restaurantProfile', { withCredentials: true }).then(
      (response) => {
        if (response.status === 200) {
          let CurbsidePickup = false;
          let DineIn = false;
          let YelpDelivery = false;
          let DeliveryOptions = response.data[1];
          DeliveryOptions.forEach(function (option) {
            let deliveryID = option.DeliveryID;
            if (deliveryID === 1) {
              CurbsidePickup = true;
            }
            if (deliveryID === 2) {
              DineIn = true;
            }
            if (deliveryID === 3) {
              YelpDelivery = true;
            }
          });
          this.setState({
            Name: response.data[0][0].Name,
            Email: response.data[0][0].EmailID,
            Country: response.data[0][0].Country,
            StateName: response.data[0][0].State,
            City: response.data[0][0].City,
            Street: response.data[0][0].Street_Address,
            Zip: response.data[0][0].Zip_Code,
            Contact: response.data[0][0].Contact,
            Opening_Time: response.data[0][0].Open_Time,
            Closing_Time: response.data[0][0].Closing_Time,
            ImageUrl: response.data[0][0].ImageURL,
            CurbsidePickup,
            DineIn,
            YelpDelivery,
            isFormDisable: true,
          });
          let payload = {
            Name: this.state.Name,
          };
          this.props.updateNameInfo(payload);

          console.log(this.state);
          console.log(response.data);
        }
      },
      (error) => {
        console.log(error.response.data);
      }
    );

    axios.get(serverUrl + 'customer/stateNames').then((response) => {
      console.log(response.data);
      let allStates = response.data[0].map((state) => {
        return { key: state.StateID, value: state.State_Name };
      });

      this.setState({
        States: this.state.States.concat(allStates),
      });
    });
  }

  editProfile = () => {
    if (this.state.isFormDisable) {
      let tempEditProfile = {
        Name: this.state.Name,
        Email: this.state.Email,
        Country: this.state.Country,
        StateName: this.state.StateName,
        City: this.state.City,
        Zip: this.state.Zip,
        Street: this.state.Street,
        Contact: this.state.Contact,
        Country: this.state.Country,
        ImageUrl: this.state.ImageUrl,
        Opening_Time: this.state.Open_Time,
        Closing_Time: this.state.Closing_Time,
        CurbsidePickup: this.state.CurbsidePickup,
        DineIn: this.state.DineIn,
        YelpDelivery: this.state.YelpDelivery,
      };
      this.setState({
        isFormDisable: !this.state.isFormDisable,
        submitError: false,
        tmpEditProfile: tempEditProfile,
      });
    } else {
      let orignalData = this.state.tmpEditProfile;
      let tmpEditProfile = {
        Name: '',
        Email: '',
        Country: '',
        StateName: '',
        City: '',
        Zip: '',
        Street: '',
        Contact: '',
        Country: '',
        Opening_Time: '',
        Closing_Time: '',
        CurbsidePickup: false,
        DineIn: false,
        YelpDelivery: false,
        ImageUrl: '',
      };
      this.setState({
        Name: orignalData.Name,
        Email: orignalData.Email,
        Country: orignalData.Country,
        StateName: orignalData.StateName,
        City: orignalData.City,
        Zip: orignalData.Zip,
        Street: orignalData.Street,
        Contact: orignalData.Contact,
        Opening_Time: orignalData.Opening_Time,
        Closing_Time: orignalData.Closing_Time,
        CurbsidePickup: orignalData.CurbsidePickup,
        DineIn: orignalData.DineIn,
        YelpDelivery: orignalData.YelpDelivery,
        ImageUrl: orignalData.ImageUrl,
        tmpEditProfile,
        isFormDisable: !this.state.isFormDisable,

        submitError: false,
      });
    }
  };

  onChangeFileHandler = (event) => {
    if (event.target.files.length === 1) {
      event.preventDefault();
      let formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      axios({
        method: 'post',
        url: serverUrl + 'restaurant/uploadRestaurantProfilePic',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            console.log('Product Saved');
            this.setState({
              ImageUrl: response.data,
            });
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
    }
  };

  onChangeHandlerName = (e) => {
    this.setState(
      {
        Name: e.target.value,
        submitError: false,
      },
      () => {
        let payload = {
          Name: this.state.Name,
        };
        this.props.updateNameInfo(payload);
      }
    );
  };

  onChangeHandlerEmail = (e) => {
    this.setState({
      Email: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerPhoneNo = (e) => {
    this.setState({
      Contact: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerState = (e) => {
    this.setState({
      StateName: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerZipCode = (e) => {
    this.setState({
      Zip: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerCity = (e) => {
    this.setState({
      City: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerCountry = (e) => {
    this.setState({
      Country: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerStreet = (e) => {
    this.setState({
      Street: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerOpeningTime = (e) => {
    this.setState({
      Opening_Time: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerClosingTime = (e) => {
    this.setState({
      Closing_Time: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerYelpDelivery = () => {
    this.setState({
      YelpDelivery: !this.state.YelpDelivery,
      submitError: false,
    });
  };

  onChangeHandlerCurbsidePickup = () => {
    this.setState({
      CurbsidePickup: !this.state.CurbsidePickup,
    });
  };

  onChangeHandlerDineIn = () => {
    this.setState({
      DineIn: !this.state.DineIn,
    });
  };

  ValidityUpdateProfile = () => {
    let ErrorStr = '';
    if (this.state.Name.length == 0) {
      ErrorStr = ErrorStr + 'Name cannot be Empty';
    }

    if (this.state.City.length === 0) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'City cannot be empty';
    }

    if (!/^\d+$/.test(this.state.Zip)) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Validate Zip Code';
    }

    if (!/^\d+$/.test(this.state.Contact)) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Validate Phone Number';
    }

    if (ErrorStr.length == 0) {
      ErrorStr = 'Correct';
    }
    return ErrorStr;
  };

  onSubmitUpdateProfile = (e) => {
    const validateCheck = this.ValidityUpdateProfile();

    if (validateCheck === 'Correct') {
      //prevent page from refresh
      e.preventDefault();
      const data = {
        Name: this.state.Name,
        Country: this.state.Country,
        StateName: this.state.StateName,
        City: this.state.City,
        Zip: this.state.Zip,
        Street: this.state.Street,
        Contact: this.state.Contact,
        Opening_Time: this.state.Opening_Time,
        Closing_Time: this.state.Closing_Time,
        CurbsidePickup: this.state.CurbsidePickup,
        DineIn: this.state.DineIn,
        YelpDelivery: this.state.YelpDelivery,
        ImageUrl: this.state.ImageUrl,
        token: cookie.load('cookie'),
        role: cookie.load('role'),
      };
      // set the with credentials to true
      axios.defaults.withCredentials = true;
      // make a post request with the user data

      axios.post(serverUrl + 'restaurant/updateRestProfile', data).then(
        (response) => {
          console.log('Status Code : ', response.status);
          if (response.status === 200) {
            console.log('Profile Updated');
            this.setState({
              isFormDisable: true,
              submitError: false,
            });
          }
        },
        (error) => {
          this.setState({
            submitErrorBlock: error.response.data,
            submitError: false,
          });
        }
      );
    } else {
      this.setState({
        submitErrorBlock: validateCheck,
        submitError: true,
      });
    }
  };

  render(/**<fieldset disabled> */) {
    let errorClass = 'alert alert-error ';
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';
    if (!this.state.submitError) {
      errorClass += 'hidden';
    }
    return (
      <div style={{ marginTop: '3%' }}>
        <h2> Welcome {this.props.Name.Name}</h2>
        {/* <h2> {JSON.stringify(this.props)}</h2> */}
        <div class={errorClass}>
          <a onClick={this.removeError} class="js-alert-dismiss dismiss-link" href="#">
            ×
          </a>
          <p class="alert-message">
            <ul>{this.state.submitErrorBlock}</ul>
          </p>
        </div>
        <form
          onSubmit={this.onSubmitUpdateProfile}
          class="yform signup-form  city-hidden"
          id="signup-form"
        >
          <fieldset disabled={this.state.isFormDisable && 'disabled'}>
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
                    this.state.ImageUrl !== null && this.state.ImageUrl.length > 0
                      ? this.state.ImageUrl
                      : defaultImage
                  }
                  // src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png"
                />
              </a>
            </div>
            <div class="js-password-meter-container">
              <ul>
                <li style={{ width: '40%' }}>
                  <label class="placeholder-sub">Restaurant Name</label>
                  <input
                    id="Name"
                    name="Name"
                    placeholder="Name"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerName}
                    value={this.state.Name}
                  />
                </li>
              </ul>
              <fieldset class="login-separator hr-line">
                <legend align="left">Contact Information</legend>
              </fieldset>
              <ul class="inline-layout clearfix">
                <li style={{ width: '40%' }}>
                  <label class="placeholder-sub">Email</label>
                  <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    required="required"
                    type="email"
                    // onChange={this.onChangeHandlerEmail}
                    value={this.state.Email}
                    disabled="disabled"
                  />
                </li>

                <li style={{ width: '40%' }}>
                  <label class="placeholder-sub">Phone-No</label>
                  <input
                    id="Contact"
                    name="Contact"
                    placeholder="Contact"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerPhoneNo}
                    value={this.state.Contact}
                    minlength="10"
                    maxlength="10"
                  />
                </li>
              </ul>
            </div>
            <fieldset class="login-separator hr-line">
              <legend align="left">Address</legend>
            </fieldset>
            <div class="js-more-fields more-fields">
              <ul class="inline-layout clearfix">
                <li style={{ width: '30%' }}>
                  <label class="placeholder-sub">Country</label>
                  <input
                    id="Country"
                    name="Country"
                    placeholder="Countryt"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerCountry}
                    value={this.state.Country}
                    disabled="disabled"
                  />
                </li>
                <li style={{ width: '5%' }}></li>
                <li style={{ width: '30%' }}>
                  <label class="placeholder-sub">State</label>
                  <select
                    placeholder="State"
                    className="form-control"
                    onChange={this.onChangeHandlerState}
                    value={this.state.StateName}
                    required
                  >
                    {this.state.States.map((states) => (
                      <option className="Dropdown-menu" key={states.key} value={states.value}>
                        {states.value}
                      </option>
                    ))}
                  </select>
                </li>
                <li style={{ width: '5%' }}></li>
                <li style={{ width: '30%' }}>
                  <label class="placeholder-sub">Zip Code</label>
                  <input
                    minlength="5"
                    maxlength="5"
                    id="Zip"
                    name="Zip"
                    placeholder="Zip Code"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerZipCode}
                    value={this.state.Zip}
                  />
                </li>
                <li style={{ width: '30%' }}>
                  <label class="placeholder-sub">City</label>
                  <input
                    id="city"
                    name="City"
                    placeholder="City"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerCity}
                    value={this.state.City}
                  />
                </li>
                <li style={{ width: '70%' }}>
                  <label class="placeholder-sub">Street</label>
                  <input
                    id="street"
                    name="street"
                    placeholder="Street"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerStreet}
                    value={this.state.Street}
                  />
                </li>
              </ul>
              <fieldset class="login-separator hr-line">
                <legend align="left">Business Information</legend>
              </fieldset>
              <ul class="inline-layout clearfix">
                <li style={{ width: '30%' }}>
                  <label class="">Curbside Pickup</label>
                  <input
                    style={{ width: '20px', height: '20px' }}
                    name="isGoing"
                    type="checkbox"
                    checked={this.state.CurbsidePickup}
                    onChange={this.onChangeHandlerCurbsidePickup}
                  />
                </li>
                <li style={{ width: '30%' }}>
                  <label class="">Dine In</label>
                  <input
                    style={{ width: '20px', height: '20px' }}
                    name="isGoing"
                    type="checkbox"
                    checked={this.state.DineIn}
                    onChange={this.onChangeHandlerDineIn}
                  />
                </li>
                <li style={{ width: '30%' }}>
                  <label class="">Yelp Delivery</label>
                  <input
                    style={{ width: '20px', height: '20px' }}
                    name="isGoing"
                    type="checkbox"
                    checked={this.state.YelpDelivery}
                    onChange={this.onChangeHandlerYelpDelivery}
                  />
                </li>
              </ul>
              <fieldset class="login-separator hr-line">
                <legend align="left">Business Hours</legend>
              </fieldset>
              <ul class="inline-layout clearfix">
                <li style={{ width: '40%' }}>
                  <label class="">Opening Time</label>
                  <input
                    type="time"
                    step="1"
                    value={this.state.time}
                    className="form-control"
                    placeholder="Time"
                    onChange={this.onChangeHandlerOpeningTime}
                    value={this.state.Opening_Time}
                  />
                </li>
                <li style={{ width: '40%' }}>
                  <label class="">Closing Time</label>
                  <input
                    type="time"
                    step="1"
                    value={this.state.time}
                    className="form-control"
                    placeholder="Time"
                    onChange={this.onChangeHandlerClosingTime}
                    value={this.state.Closing_Time}
                  />
                </li>
              </ul>
            </div>
            {!this.state.isFormDisable && (
              <div>
                <button
                  id="signup-button"
                  type="submit"
                  class="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
                  style={{
                    marginTop: '2%',
                    marginLeft: '40%',
                  }}
                >
                  <span>Save</span>
                </button>

                <button
                  class="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
                  style={{
                    marginTop: '2%',
                    marginLeft: '2%',
                  }}
                  onClick={this.editProfile}
                >
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </fieldset>
        </form>
        {this.state.isFormDisable && (
          <button
            class="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
            style={{
              marginTop: '2%',
              marginLeft: '45%',
            }}
            onClick={this.editProfile}
          >
            <span>Edit</span>
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Name: state.nameInfo.name };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateNameInfo: (payload) => {
      dispatch({
        type: 'update-name-field',
        payload,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
