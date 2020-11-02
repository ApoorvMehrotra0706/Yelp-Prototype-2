import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { DeliveryStatuses: [] };
  }
  // Call On render
  componentDidMount() {}

  verifyRegistered = (id) => {
    for (const item of this.props.customerData.FollowingIDs) {
      if (item.CustomerID === id) {
        return false;
      }
    }
    return true;
  };

  render() {
    const text = 'Address:- ';
    return (
      <li className="lemon--li__373c0__1r9wz margin-b3__373c0__q1DuY padding-b3__373c0__342DA border--bottom__373c0__3qNtD border-color--default__373c0__3-ifU">
        <div class="lemon--div__373c0__1mboc review__373c0__13kpL sidebarActionsHoverTarget__373c0__2kfhE arrange__373c0__2C9bH gutter-2__373c0__1DiLQ grid__373c0__1Pz7f layout-stack-small__373c0__27wVp border-color--default__373c0__3-ifU">
          <div class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-grid-column--8__373c0__2dUx_ border-color--default__373c0__3-ifU">
            <div class="lemon--div__373c0__1mboc margin-t1__373c0__oLmO6 margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
              <div class="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-1__373c0__2l5bx vertical-align-middle__373c0__1SDTo border-color--default__373c0__3-ifU">
                <div
                  class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU"
                  style={{ justifyContent: 'space-between', display: 'flex' }}
                >
                  <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--mid__373c0__jCeOG text-align--left__373c0__2XGa-">
                    <span style={{ marginRight: '20px' }}>
                      <img src={this.props.user.ImageURL} style={{width: '100px', height: '100px'}}></img></span>
                    <span>
                      <a
                        class="lemon--a__373c0__IEZFH link__373c0__1G70M link-color--inherit__373c0__3dzpk link-size--inherit__373c0__1VFlE"
                        href="#"
                        target=""
                        name=""
                        rel=""
                        onClick={(e) => this.props.openCustomerDetails(e)}
                      >
                        {/* Onelia D.*/}
                        {this.props.user.Name}
                      </a>
                      {/* <b>{this.props.user.Name}</b> */}
                    </span>

                    {/* 8/22/2020*/}
                  </span>
                  <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--mid__373c0__jCeOG text-align--left__373c0__2XGa-">
                    <span style={{ marginLeft: '20px' }}>
                      Yelping Since: {this.props.user.YelpingSince.split('T')[0]}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div class="lemon--div__373c0__1mboc margin-t1__373c0__oLmO6 margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
              <div class="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-1__373c0__2l5bx vertical-align-middle__373c0__1SDTo border-color--default__373c0__3-ifU">
                <div
                  class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU"
                  style={{ justifyContent: 'space-between', display: 'flex' }}
                >
                  <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--mid__373c0__jCeOG text-align--left__373c0__2XGa-">
                    {this.verifyRegistered(this.props.user.ID) ? (
                      <button
                        onClick={() => this.props.followUser()}
                        data-ui="add-section"
                        aria-describedby="education_label"
                        class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                      >
                        Follow
                      </button>
                    ) : (
                      <p>Following!!!</p>
                    )}
                  </span>
                  <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--mid__373c0__jCeOG text-align--left__373c0__2XGa-">
                    <b>{this.props.user.Address}</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state) => {
  const { yelpUsers } = state.yelpUsersReducer;
  const { customerData } = state.customerProfileReducer;
  return {
    yelpUsers: yelpUsers,
    customerData: customerData,
  };
};

export default connect(mapStateToProps, null)(UserDisplay);
