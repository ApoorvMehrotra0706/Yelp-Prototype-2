import React, { Component } from 'react';
import { connect } from 'react-redux';

class Message extends Component {
  constructor(props) {
    super(props);
  }
  onChangeMessageHandler = (event) => {
    let payload = {
      message: event.target.value,
      RestaurantID: localStorage.getItem('user_id'),
      CustomerID: this.props.CustomerID,
    };
    this.props.updateRestMessage(payload);
  };
  
  render() {
    return (
      <div className="modal" style={{ top: '0', left: '0', width: '100%', height: '100%' }}>
        <div
          className="modal_content"
          style={{ top: '30%', left: '20%', width: '40%', height: '40%' }}
        >
          <span className="close" onClick={this.props.openReviewForm}>
            &times;{' '}
          </span>
          <form
            onSubmit={(event) =>
              this.props.submitMessage(event)
            }
            className="profile-bio yform yform-vertical-spacing"
          >
            <ul>
              <li>
                <label for="review">Write your Message</label>
                <span class="help-block">Max Characters 1000</span>
                <textarea
                  style={{ marginLeft: '25px', width: '50%' }}
                  id="review"
                  maxlength="1000"
                  name="review"
                  size="30"
                  type="text"
                  value={this.props.firstMessage.message}
                  onChange={this.onChangeMessageHandler}
                ></textarea>
              </li>
              <li>
                
              </li>
            </ul>
            <button
              type="submit"
              value="submit"
              class="ybtn ybtn--primary ybtn-full-responsive-small"
            >
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { firstMessage } = state.firstMessageReducer;
  return {
    firstMessage: firstMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateRestMessage: (payload) => {
      dispatch({
        type: 'update-message',
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);
