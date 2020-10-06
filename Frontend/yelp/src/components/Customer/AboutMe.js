import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './AboutMe.css';
import { connect } from 'react-redux';
import axios from 'axios';
import serverUrl from '../../config';

class AboutMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NickName: '',
      DOB: '',
      Address1: '',
      Address2: '',
      Headline: '',
      ILove: '',
      FMI: '',
      JoinDate: '',
      Website: '',
      ImageURL: '',
    };
  }
  componentDidMount() {
    axios
      .get(
        serverUrl + 'customer/getCustomerCompleteProfile',

        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        this.setState({
          NickName: response.data[0][0].NickName,
          DOB: response.data[0][0].DOB,
          Address1: response.data[0][0].Address1,
          Address2: response.data[0][0].Address2,
          Headline: response.data[0][0].Headline,
          ILove: response.data[0][0].Things_Customer_Love,
          FMI: response.data[0][0].Find_Me_In,
          JoinDate: response.data[0][0].YelpingSince,
          Website: response.data[0][0].Website,
          ImageURL: response.data[0][0].ImageURL,
        });
      });
  }
  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';

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
                  {this.state.NickName != null && this.state.NickName.length > 0 ? (
                    <h3>About {this.state.NickName}</h3>
                  ) : (
                    <h3>About {this.props.customerInfo.Name}</h3>
                  )}
                  {this.state.Headline != null && this.state.Headline.length > 0 ? (
                    <h3 style={{ color: 'black' }}> {this.state.Headline}</h3>
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
                            this.state.ImageURL !== null && this.state.ImageURL.length > 0
                              ? this.state.ImageURL
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
                        {this.state.Address1 != null && this.state.Address1.length > 0 ? (
                          <p>{this.state.Address1}</p>
                        ) : (
                          <p>No idea, :(</p>
                        )}
                      </li>
                      <li>{this.state.Address2}</li>

                      <li>
                        <h4>Date Of Birth</h4>
                        {(this.state.DOB != null && this.state.DOB.length) > 0 ? (
                          <p>{this.state.DOB}</p>
                        ) : (
                          <p>Tell us to avail Birthday offers!</p>
                        )}
                      </li>

                      <li>
                        <h4>Yelping Since</h4>
                        <p>{this.state.JoinDate}</p>
                      </li>

                      <li>
                        <h4>Things I Love</h4>
                        {this.state.ILove != null && this.state.ILove.length > 0 ? (
                          <p>{this.state.ILove}</p>
                        ) : (
                          <p>We love to hear about your love</p>
                        )}
                      </li>

                      <li>
                        <h4>Find Me In</h4>
                        {this.state.FMI != null && this.state.FMI.length > 0 ? (
                          <p>{this.state.FMI}</p>
                        ) : (
                          <p>Common, tell us</p>
                        )}
                      </li>
                      <li>
                        <h4>Follow My Website/Blog</h4>
                        {this.state.Website != null && this.state.Website.length > 0 ? (
                          <p>{this.state.Website}</p>
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
  return {
    customerInfo: customerInfo,
  };
};

export default connect(mapStateToProps, null)(AboutMe);
