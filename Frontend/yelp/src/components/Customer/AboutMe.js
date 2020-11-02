import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './AboutMe.css';
import { connect } from 'react-redux';
import axios from 'axios';
import serverUrl from '../../config';
import moment from 'moment';

class AboutMe extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'customer/getCustomerCompleteProfile',

        { params: { CustomerID: localStorage.getItem('user_id') }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);

        let DOB = moment.utc(response.data.DOB);
        DOB = DOB.format('YYYY-MM-DD');
        localStorage.setItem('Name', response.data.name);
        let payload = {
          Name: response.data.name,
          NickName: response.data.NickName,
          DOB: DOB,
          City: response.data.City,
          State: response.data.state,
          Address: response.data.City.concat(', ').concat(response.data.state),
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
      })
      .catch((er) => {
        console.log(er);
      });
  }
  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';

    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      console.log('Token not found');
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
      <div style={{ background: 'white' }}>
        {redirectVar}
        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
        <div className="main-content-wrap main-content-wrap--full"></div>
        <div
          className="super-container"
          style={{
            paddingTop: '15px',
            paddingBottom: '36px',
            width: '960px',
            margin: '0 auto',
            padding: '0 15px',
          }}
        >
          <div
            style={{ marginTop: '40px' }}
            className="clearfix layout-block layout-n user-details_container"
          >
            <div className="column column-beta ">
              <div className="user-details-overview">
                <div class="user-details-overview_sidebar">
                  {this.props.customerData.NickName != null &&
                  this.props.customerData.NickName.length > 0 ? (
                    <h3>About {this.props.customerData.NickName}</h3>
                  ) : (
                    <h3>About {this.props.customerData.Name}</h3>
                  )}
                  {this.props.customerData.Headline != null &&
                  this.props.customerData.Headline.length > 0 ? (
                    <h3 style={{ color: 'black' }}> {this.props.customerData.Headline}</h3>
                  ) : (
                    <h3>Please Update Heading!!!</h3>
                  )}
                  <br />
                  <div class="ysection">
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
                        />
                      </a>
                    </div>
                  </div>

                  <div class="ysection">
                    <ul class="ylist">
                      <li>
                        <h4>Location</h4>
                        {this.props.customerData.Address != null &&
                        this.props.customerData.Address.length > 0 ? (
                          <p>{this.props.customerData.Address}</p>
                        ) : (
                          <p>No idea, :(</p>
                        )}
                      </li>
                      <li>{this.props.customerData.streetAddress}</li>

                      <li>
                        <h4>Date Of Birth</h4>
                        {(this.props.customerData.DOB != null &&
                          this.props.customerData.DOB.length) > 0 ? (
                          <p>{this.props.customerData.DOB}</p>
                        ) : (
                          <p>Tell us to avail Birthday offers!</p>
                        )}
                      </li>

                      <li>
                        <h4>Yelping Since</h4>
                        <p>{this.props.customerData.YelpingSince}</p>
                      </li>

                      <li>
                        <h4>Things I Love</h4>
                        {this.props.customerData.ILove != null &&
                        this.props.customerData.ILove.length > 0 ? (
                          <p>{this.props.customerData.ILove}</p>
                        ) : (
                          <p>We love to hear about your love</p>
                        )}
                      </li>

                      <li>
                        <h4>Find Me In</h4>
                        {this.props.customerData.Find_Me_In != null &&
                        this.props.customerData.Find_Me_In.length > 0 ? (
                          <p>{this.props.customerData.Find_Me_In}</p>
                        ) : (
                          <p>Common, tell us</p>
                        )}
                      </li>
                      <li>
                        <h4>Follow My Website/Blog</h4>
                        {this.props.customerData.Website != null &&
                        this.props.customerData.Website.length > 0 ? (
                          <p>{this.props.customerData.Website}</p>
                        ) : (
                          <p>We would love to follow you, tell us</p>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// export default AboutMe;
const mapStateToProps = (state) => {
  const { customerInfo } = state.customer;
  const { customerData } = state.customerProfileReducer;
  return {
    customerInfo: customerInfo,
    customerData: customerData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
export default connect(mapStateToProps, mapDispatchToProps)(AboutMe);
