import React, { Component } from 'react';
import RestaurantLeftReviewPart from './RestaurantLeftReviewPart';
import RestaurantRightPart from './RestaurantRightPart';
import './RestaurantPage.css';

class RestaurantPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        {' '}
        {}
        <div className="main-content-wrap main-content-wrap--full">
          <div>
            <div className="lemon--div__373c0__1mboc margin-t3__373c0__1l90z margin-b6__373c0__2Azj6 border-color--default__373c0__3-ifU">
              <div className="lemon--div__373c0__1mboc biz-details-page-container-outer__373c0___byUp border-color--default__373c0__3-ifU">
                <div className="lemon--div__373c0__1mboc biz-details-page-container-inner__373c0__2fjQF border-color--default__373c0__3-ifU">
                  <div class="lemon--div__373c0__1mboc margin-b3__373c0__q1DuY border-color--default__373c0__3-ifU"></div>
                  <div className="lemon--div__373c0__1mboc margin-b6__373c0__2Azj6 border-color--default__373c0__3-ifU">
                    <div className="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                      <div className="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                        <div className="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                          <div className="lemon--div__373c0__1mboc stickySidebar--heightContext__373c0__133M8 tableLayoutFixed__373c0__12cEm arrange__373c0__2C9bH padding-b4__373c0__uiolV border--bottom__373c0__3qNtD border-color--default__373c0__3-ifU">
                            {/**Left Component */}
                            {<RestaurantLeftReviewPart />}

                            {/**Right Component */}
                            {<RestaurantRightPart />}
                          </div>
                        </div>
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

export default RestaurantPage;
