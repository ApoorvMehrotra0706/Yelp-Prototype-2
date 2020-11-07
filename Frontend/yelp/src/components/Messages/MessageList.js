import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import MessageDisplay from './MessageDisplay';
import MessageContent from './MessageContent';
import axios from 'axios';
import serverUrl from '../../config';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
// import WallTime from 'walltime-js';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followedCustomerIDs: [],
      userID: '',
      popSeen: false,
      searchCriteria: '',
    };
  }
  componentDidMount() {
    this.getMessages();
  }

  getMessages = async (pageNo = 0) => {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    if (localStorage.getItem('role') === 'Restaurant') {
      axios
        .get(serverUrl + 'restaurant/fetchMessages', {
          params: { RestaurantID: localStorage.getItem('user_id'), pageNo },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
          let allMessages = response.data[0].map((message) => {
            return {
              CustomerID: message.CustomerID,
              CustomerName: message.CustomerName,
              Image: message.CustomerImg,
              RestaurantID: message.RestaurantID,
              RestaurantName: message.RestaurantName,
              Date: message.Date,
              Message: message.Messages,
            };
          });
          let payload = {
            Message: allMessages,
            NoOfPages: response.data[1],
            TotalCount: response.data[2],
            PageNo: pageNo,
          };
          this.props.updateMessages(payload);
        });
    } else {
      axios
        .get(serverUrl + 'customer/fetchMessages', {
          params: { CustomerID: localStorage.getItem('user_id'), pageNo },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
          let allMessages = response.data[0].map((message) => {
            return {
              CustomerID: message.CustomerID,
              CustomerName: message.CustomerName,
              Image: message.RestaurantImg,
              RestaurantID: message.RestaurantID,
              RestaurantName: message.RestaurantName,
              Date: message.Date,
              Message: message.Messages,
            };
          });
          let payload = {
            Message: allMessages,
            NoOfPages: response.data[1],
            TotalCount: response.data[2],
            PageNo: pageNo,
          };
          this.props.updateMessages(payload);
        });
    }
  };

  handlePageClick = async (e) => {
    let payload = {
      PageNo: e.selected,
    };
    await this.props.updateMessages(payload);

    this.getMessages(e.selected);
  };

  openMessagesDetails = (event, RestaurantID, CustomerID) => {
    let payload = null;
    if (this.state.popSeen) {
      this.setState({
        popSeen: !this.state.popSeen,
      });
    } else {
      if (localStorage.getItem('role') === 'Customer') {
        const index = this.props.MessageContent.Message.findIndex(
          (x) => x.RestaurantID === RestaurantID
        );
        payload = {
          MessageBody: [this.props.MessageContent.Message[index].Message],
        };
      } else {
        const index = this.props.MessageContent.Message.findIndex(
          (x) => x.CustomerID === CustomerID
        );
        payload = {
          MessageBody: [this.props.MessageContent.Message[index].Message],
        };
      }
      this.props.updateMessages(payload);
      this.setState({
        popSeen: !this.state.popSeen,
      });
    }
  };

  render() {
    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      console.log('token not found');
      redirectVar = <Redirect to="/webPage" />;
    }
    return (
      <div style={{ background: 'white' }}>
        {redirectVar}
        {}
        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
        <div
          className="super-container"
          style={{
            paddingTop: '15px',
            paddingBottom: '36px',
            width: '1260px',
            margin: '0 auto',
            padding: '0 15px',
          }}
        >
          <div
            style={{ marginTop: '40px' }}
            className="clearfix layout-block layout-n user-details_container"
          >
            {/* {<LeftPannel />} */}
            <div className="column column-beta ">
              <div className="user-details-overview">
                <div class="user-details-overview_sidebar">
                  <nav class="navbar navbar-inverse">
                    <div class="container-fluid">
                      <div class="navbar-header">
                        <a class="navbar-brand">User Connect</a>
                      </div>
                      <ul class="nav navbar-nav">
                        <li
                          className={this.props.MessageContent.category === 'Messages' && 'active'}
                        >
                          <Link to="#" onClick={(event) => this.getMessages()}>
                            Messages
                          </Link>
                        </li>
                      </ul>

                      {/*navLogin*/}
                    </div>
                  </nav>
                  <div>
                    <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                      {this.props.MessageContent.Message.map((message) => (
                        <MessageDisplay
                          message={message}
                          userID={this.state.userID}
                          openMessagesDetails={(e) =>
                            this.openMessagesDetails(e, message.RestaurantID, message.CustomerID)
                          }
                        />
                      ))}
                    </ul>
                    <ReactPaginate
                      previousLabel={'prev'}
                      nextLabel={'next'}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={this.props.MessageContent.NoOfPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={2}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      forcePage={this.props.MessageContent.PageNo}
                      activeClassName={'active'}
                    />
                  </div>
                  {this.state.popSeen ? (
                    <MessageContent
                      messageDetails={this.props.MessageContent.MessageBody}
                      openMessagesDetails={(e) => {
                        this.openMessagesDetails(e);
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { MessageContent } = state.messageReducer;
  return {
    MessageContent: MessageContent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMessages: (payload) => {
      dispatch({
        type: 'update-message-flow',
        payload,
      });
    },
    updateCustomerProfile: (payload) => {
      dispatch({
        type: 'update-customer-profile',
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
