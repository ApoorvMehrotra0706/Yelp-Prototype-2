import React, { Component } from 'react';
import { connect } from 'react-redux';

class WriteAReview extends Component {
  constructor(props) {
    super(props);
  }
  onChangeReviewHandler = (event) => {
    let payload = {
      review: event.target.value,
    };
    this.props.updateCustomerReview(payload);
  };
  onChangeRatingHandler = (event) => {
    let payload = {
      rating: event.target.value,
    };
    this.props.updateCustomerReview(payload);
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
              this.props.submitReview(event)
            }
            className="profile-bio yform yform-vertical-spacing"
          >
            <ul>
              <li>
                <label for="review">Share your Experience</label>
                <span class="help-block">Max Characters 1000</span>
                <textarea
                  style={{ marginLeft: '25px', width: '50%' }}
                  id="review"
                  maxlength="1000"
                  name="review"
                  size="30"
                  type="text"
                  value={this.props.customerReview.review}
                  onChange={this.onChangeReviewHandler}
                ></textarea>
              </li>
              <li>
                <label for="rating">Rating</label>
                <select
                  style={{ marginLeft: '25px', width: '10%' }}
                  placeholder="Gender"
                  className="form-control"
                  onChange={this.onChangeRatingHandler}
                  value={this.props.customerReview.rating}
                  required
                >
                  <option className="Dropdown-menu" key="1" value="1">
                    1
                  </option>{' '}
                  <option className="Dropdown-menu" key="2" value="2">
                    2
                  </option>{' '}
                  <option className="Dropdown-menu" key="3" value="3">
                    3
                  </option>{' '}
                  <option className="Dropdown-menu" key="4" value="4">
                    4
                  </option>{' '}
                  <option className="Dropdown-menu" key="5" value="5">
                    5
                  </option>{' '}
                </select>
              </li>
            </ul>
            <button
              type="submit"
              value="submit"
              class="ybtn ybtn--primary ybtn-full-responsive-small"
            >
              <span>Submit Review</span>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { customerReview } = state.customerReviewReducer;
  return {
    customerReview: customerReview,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCustomerReview: (payload) => {
      dispatch({
        type: 'update-restaurant-review',
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WriteAReview);
