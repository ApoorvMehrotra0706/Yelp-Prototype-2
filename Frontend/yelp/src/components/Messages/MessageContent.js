import React, { Component } from 'react';
import MessageRead from './MessageRead';
import axios from 'axios';
import serverUrl from '../../config';
import moment from 'moment';
import { connect } from 'react-redux';

class MessageContent extends Component {
  constructor(props) {
    super(props);
  }

  onChangeMessageHandler = (event) => {
    let payload = {
      Message: event.target.value,
    };
    this.props.updateReply(payload);
  };

  sendMessage = (event) => {
    event.preventDefault();
    let date = new Date();
    date = moment().format();
    console.log(date);
    let messageData = {
      Date: date,
      Name: localStorage.getItem('Name'),
      Message: this.props.MessageReply.Message,
      RestaurantID: this.props.messageDetails[0][0].RestaurantID,
      CustomerID: this.props.messageDetails[0][0].CustomerID,
    };
    let messageArray = [];
    messageArray.push(messageData);
    let data = {
      RestaurantID: this.props.messageDetails[0][0].RestaurantID,
      CustomerID: this.props.messageDetails[0][0].CustomerID,
      Messages: messageData,
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
            Message: '',
          };
          this.props.updateReply(payload);
          let tempMsg = this.props.MessageContent.MessageBody[0];
          tempMsg.push(messageData);
          payload = {
            MessageBody: [tempMsg],
          };
          this.props.updateMessages(payload);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  render() {
    return (
      <div className="modal" style={{ top: '0', left: '0', width: '100%', height: '100%' }}>
        <div
          className="modal_content"
          style={{ top: '30%', left: '20%', width: '40%', height: '40%' }}
        >
          <span
            className="close"
            onClick={(e) => {
              this.props.openMessagesDetails(e);
            }}
          >
            &times;{' '}
          </span>
          <form
            onSubmit={(event) => this.props.submitMessage(event)}
            className="profile-bio yform yform-vertical-spacing"
            style={{ height: '110%', overflowY: 'scroll' }}
          >
            <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
              {this.props.messageDetails[0].map((message) => (
                <MessageRead Date={message.Date} Name={message.Name} Message={message.Message} />
              ))}
            </ul>
          </form>
          <li>
            <label for="review">Write your Message</label>
            <span class="help-block">Max Characters 1000</span>
            <textarea
              style={{ marginLeft: '25px', width: '50%', marginTop: '10px' }}
              id="review"
              maxlength="1000"
              name="review"
              size="30"
              type="text"
              required
              value={this.props.MessageReply.Message}
              onChange={this.onChangeMessageHandler}
            ></textarea>
          </li>

          <button
            onClick={(event) => this.sendMessage(event)}
            class="ybtn ybtn--primary ybtn-full-responsive-small"
          >
            <span>Send</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { MessageContent } = state.messageReducer;
  const { MessageReply } = state.messageReplyReducer;
  return {
    MessageContent: MessageContent,
    MessageReply: MessageReply,
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
    updateReply: (payload) => {
      dispatch({
        type: 'update-reply',
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageContent);
