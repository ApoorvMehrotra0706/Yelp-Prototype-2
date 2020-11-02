import React, { Component } from 'react';
import Message from '../Events/Message';
import '../Customer/AboutMe.css';
import { connect } from 'react-redux';
import axios from 'axios';
import serverUrl from '../../config';
import moment from 'moment';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';


class CustomerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessageBox: false,
    };
  }
  componentDidMount() {
    let CustomerID = this.props.customerDetails.customer;
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
        .get(
          serverUrl + 'customer/getCustomerCompleteProfile',

          { params: { CustomerID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
        
          let DOB = moment.utc(response.data.DOB);
          DOB= DOB.format('YYYY-MM-DD');
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
        }).catch((er) => {
          console.log(er)
        });
  }

  handleClick = (e) => {
    this.props.toggle(e);
  };

  sendMessage = (e) => {
    this.setState({
      showMessageBox: !this.state.showMessageBox,
    });
  }

  submitMessage = (e) => {
    e.preventDefault();
    this.setState({
      showMessageBox: !this.state.showMessageBox,
    });
    console.log("Submitting message");
    const Messages = {
      Date: new Date(),
      Name: localStorage.getItem('Name'),
      Message: this.props.firstMessage.message,
      CustomerID: this.props.firstMessage.CustomerID,
      RestaurantID: this.props.firstMessage.RestaurantID,
    };
    const data = {
      CustomerID: this.props.firstMessage.CustomerID,
      RestaurantID: this.props.firstMessage.RestaurantID,
      CustomerName: this.props.customerData.Name,
      RestaurantName: localStorage.getItem('Name'),
      Messages: Messages,
      Date: new Date(),
      CustomerImg: this.props.customerData.ImageURL,
      RestaurantImg: localStorage.getItem('Image'), 
    };
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    //make a post request with the user data
    axios.post(serverUrl + 'restaurant/sendMessage', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          let payload = {
            message: '',
            RestaurantID: '',
            CustomerID: '',
          };
          this.props.updateRestMessage(payload);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';

    
    return (
      <div style={{ background: 'white' }}>
        {/* {redirectVar} */}
        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
        <div className="main-content-wrap main-content-wrap--full"></div>
          <div className="modal" style={{ top: '0', left: '0', width: '100%', height: '100%' }}>
            <div
              className="modal_content"
              style={{ top: '10%', left: '20%', width: '60%', height: '70%' }}
            >
            <span className="close" onClick={this.handleClick}>
            &times;{' '}
          </span>
          <MDBTable scrollY maxHeight="100%" striped></MDBTable>
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
            style={{ marginTop: '0px' }}
            className="clearfix layout-block layout-n user-details_container"
          >
            <div className="column column-beta ">
              <div className="user-details-overview">
                <div class="user-details-overview_sidebar">
                  {this.props.customerData.NickName != null && this.props.customerData.NickName.length > 0 ? (
                    <h3>About {this.props.customerData.NickName}</h3>
                  ) : (
                    <h3>About {this.props.customerData.Name}</h3>
                  )}
                  {this.props.customerData.Headline != null && this.props.customerData.Headline.length > 0 ? (
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
                        {this.props.customerData.Address != null && this.props.customerData.Address.length > 0 ? (
                          <p>{this.props.customerData.Address}</p>
                        ) : (
                          <p>No idea, :(</p>
                        )}
                      </li>
                      <li>{this.props.customerData.streetAddress}</li>

                      <li>
                        <h4>Date Of Birth</h4>
                        {(this.props.customerData.DOB != null && this.props.customerData.DOB.length) > 0 ? (
                          <p>{this.props.customerData.DOB}</p>
                        ) : (
                          <p>Yey to say</p>
                        )}
                      </li>

                      <li>
                        <h4>Things I Love</h4>
                        {this.props.customerData.ILove != null && this.props.customerData.ILove.length > 0 ? (
                          <p>{this.props.customerData.ILove}</p>
                        ) : (
                          <p>Yet to share</p>
                        )}
                      </li>

                      <li>
                        <button
                            style={{ marginTop: '14px' }}
                            onClick={(event) => this.sendMessage(event)}                                        
                          >
                            Message
                          </button>
                      </li>
                    </ul>
                    {this.state.showMessageBox ? (
                    <Message
                      // customerDetails={this.props.regCust.CustDetails}
                      CustomerID={this.props.customerDetails.customer}
                      toggle={this.sendMessage}
                      submitMessage= {(e)=> {this.submitMessage(e)}}
                    />
                    ) : null}
                  </div>
                </div>
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
    const { customerDetails } = state.customerDetailsReducer;
    const { firstMessage } = state.firstMessageReducer;
    return {
      customerInfo: customerInfo,
      customerData: customerData,
      customerDetails: customerDetails,
      firstMessage: firstMessage,
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
      updateCustomerDetails: (payload) => {
        dispatch({
          type: 'update-customer-details',
          payload,
        });
      },
      updateRestMessage: (payload) => {
        dispatch({
          type: 'update-message',
          payload,
        });
      },
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(CustomerProfile);;
