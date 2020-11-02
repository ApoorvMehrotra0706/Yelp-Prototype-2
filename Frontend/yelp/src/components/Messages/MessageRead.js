import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../config';

class MessageRead extends Component {
  constructor(props) {
    super(props);
    this.state = { DeliveryStatuses: [] };
  }
  // Call On render
  componentDidMount() {
    
  }
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
                    <span style={{ marginRight: '20px' }}>From</span>
                    <span>
                      <b>{this.props.Name}</b>
                    </span>

                    {/* 8/22/2020*/}
                  </span>
                  <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--mid__373c0__jCeOG text-align--left__373c0__2XGa-">
                    <span>
                      {' '}
                      {/*this.props.event.EventDate.toLocaleDateString()*/}
                      {/* {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                      }).format(this.props.Date)} */}
                      {this.props.Date.split('T')[0]}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div class="lemon--div__373c0__1mboc margin-b2__373c0__abANL border-color--default__373c0__3-ifU">
              <p
                style={{ marginLeft: '10px', marginRight: '100px' }}
                class="lemon--p__373c0__3Qnnj text__373c0__2Kxyz comment__373c0__3EKjH text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa-"
              >
                <span class="lemon--span__373c0__3997G raw__373c0__3rKqk" lang="en">
                  {this.props.Message}
                </span>
              </p>
            </div>
            <div class="lemon--div__373c0__1mboc margin-t1__373c0__oLmO6 margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
              <div class="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-1__373c0__2l5bx vertical-align-middle__373c0__1SDTo border-color--default__373c0__3-ifU">
                <div
                  class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU"
                  style={{ justifyContent: 'space-between', display: 'flex' }}
                >
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default MessageRead;
