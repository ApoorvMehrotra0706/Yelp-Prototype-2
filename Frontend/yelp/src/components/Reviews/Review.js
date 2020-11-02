import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';
    let rating = { backgroundPosition: '0 -320px' };
    switch (this.props.review.Rating) {
      case 1:
        rating = { backgroundPosition: '0 -360px' };
        break;
      case 2:
        rating = { backgroundPosition: '0 -400px' };
        break;
      case 3:
        rating = { backgroundPosition: '0 -440px' };
        break;
      case 4:
        rating = { backgroundPosition: '0 -480px' };
        break;
      case 5:
        rating = { backgroundPosition: '0 -500px' };
        break;
    }
    return (
      <li className="lemon--li__373c0__1r9wz margin-b3__373c0__q1DuY padding-b3__373c0__342DA border--bottom__373c0__3qNtD border-color--default__373c0__3-ifU">
        <div class="lemon--div__373c0__1mboc review__373c0__13kpL sidebarActionsHoverTarget__373c0__2kfhE arrange__373c0__2C9bH gutter-2__373c0__1DiLQ grid__373c0__1Pz7f layout-stack-small__373c0__27wVp border-color--default__373c0__3-ifU">
          <div class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-grid-column--4__373c0__33Wpc border-color--default__373c0__3-ifU">
            <div class="lemon--div__373c0__1mboc margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
              <div
                class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU"
                role="region"
                aria-label="Onelia D."
              >
                <div class="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-1__373c0__2l5bx border-color--default__373c0__3-ifU">
                  <div class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU">
                    <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                      <div class="lemon--div__373c0__1mboc on-click-container border-color--default__373c0__3-ifU">
                        <a
                          class="lemon--a__373c0__IEZFH link__373c0__1G70M photo-box-link__373c0__1YC9Y link-color--blue-dark__373c0__85-Nu link-size--default__373c0__7tls6"
                          href="/user_details?userid=1x4hrPkx02C9HVcrhvwmaA"
                          target=""
                          name=""
                          rel=""
                        >
                          <img
                            class="lemon--img__373c0__3GQUb photo-box-img__373c0__35y5v"
                            // src="https://s3-media0.fl.yelpcdn.com/photo/9mASYcGE_pmhSwscsapTrQ/60s.jpg"
                            // srcset="https://s3-media0.fl.yelpcdn.com/photo/9mASYcGE_pmhSwscsapTrQ/90s.jpg 1.50x,https://s3-media0.fl.yelpcdn.com/photo/9mASYcGE_pmhSwscsapTrQ/168s.jpg 2.80x,https://s3-media0.fl.yelpcdn.com/photo/9mASYcGE_pmhSwscsapTrQ/ms.jpg 1.67x,https://s3-media0.fl.yelpcdn.com/photo/9mASYcGE_pmhSwscsapTrQ/180s.jpg 3.00x,https://s3-media0.fl.yelpcdn.com/photo/9mASYcGE_pmhSwscsapTrQ/120s.jpg 2.00x"
                            src={
                              this.props.review.ImageUrl !== null &&
                              this.props.review.ImageUrl.length > 0
                                ? this.props.review.ImageUrl
                                : defaultImage
                            }
                            srcset={
                              this.props.review.ImageUrl !== null &&
                              this.props.review.ImageUrl.length > 0
                                ? this.props.review.ImageUrl
                                : defaultImage
                            }
                            alt="Photo of Onelia D."
                            height="60"
                            width="60"
                            loading="lazy"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU">
                    <div class="lemon--div__373c0__1mboc user-passport-info border-color--default__373c0__3-ifU">
                      <span class="lemon--span__373c0__3997G text__373c0__2Kxyz fs-block text-color--blue-dark__373c0__1jX7S text-align--left__373c0__2XGa- text-weight--bold__373c0__1elNz">
                        <a
                          class="lemon--a__373c0__IEZFH link__373c0__1G70M link-color--inherit__373c0__3dzpk link-size--inherit__373c0__1VFlE"
                          href="#"
                          target=""
                          name=""
                          rel=""
                          onClick={(e) => this.props.openCustomerDetails(e)}
                        >
                          {/* Onelia D.*/}
                          {this.props.review.CustomerName}
                        </a>
                      </span>
                      <div class="lemon--div__373c0__1mboc responsive-hidden-small__373c0__2vDff border-color--default__373c0__3-ifU">
                        <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-weight--bold__373c0__1elNz text-size--small__373c0__3NVWO">
                          {/*(Campbell, CA)*/}
                          {this.props.review.CustomerAddr}
                        </span>
                      </div>
                    </div>
                    <div class="lemon--div__373c0__1mboc user-passport-stats__373c0__2LjLz border-color--default__373c0__3-ifU">
                      <div class="lemon--div__373c0__1mboc margin-r1__373c0__zyKmV border-color--default__373c0__3-ifU">
                        <span
                          class="lemon--span__373c0__3997G icon__373c0__ehCWV icon--18-review icon--orange-dark__373c0__1e8sK"
                          aria-hidden="true"
                          style={{ width: '18px', height: '18px', fill: '#f15c00' }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            class="icon_svg"
                          >
                            <path d="M13 3H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.505 9.643l-2.526-1.55L6.526 12.7 7 9.934 5 7.977l2.766-.404L8.97 4.7l1.264 2.873L13 7.977l-2 1.957.495 2.71z"></path>
                          </svg>
                        </span>
                        <span class="lemon--span__373c0__3997G display--inline__373c0__3JqBP padding-l0-5__373c0__3fXBk border-color--default__373c0__3-ifU">
                          <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-size--small__373c0__3NVWO">
                            <span class="lemon--span__373c0__3997G">
                              <b>{this.props.review.reviewCount}</b> reviews
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-grid-column--8__373c0__2dUx_ border-color--default__373c0__3-ifU">
            <div class="lemon--div__373c0__1mboc margin-t1__373c0__oLmO6 margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
              <div class="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-1__373c0__2l5bx vertical-align-middle__373c0__1SDTo border-color--default__373c0__3-ifU">
                <div class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU">
                  <span class="lemon--span__373c0__3997G display--inline__373c0__3JqBP border-color--default__373c0__3-ifU">
                    <div
                      class="lemon--div__373c0__1mboc i-stars__373c0__1T6rz i-stars--regular-5__373c0__N5JxY border-color--default__373c0__3-ifU overflow--hidden__373c0__2y4YK _0Star"
                      aria-label="5 star rating"
                      role="img"
                      style={rating}
                    >
                      <img
                        class="lemon--img__373c0__3GQUb offscreen__373c0__1KofL"
                        src="https://s3-media0.fl.yelpcdn.com/assets/public/stars_v2.yji-52d3d7a328db670d4402843cbddeed89.png"
                        width="132"
                        height="560"
                        alt=""
                      />
                    </div>
                  </span>
                </div>
                <div class="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU">
                  <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--mid__373c0__jCeOG text-align--left__373c0__2XGa-">
                    {this.props.review.Date.toLocaleDateString()}
                    {/* 8/22/2020*/}
                  </span>
                </div>
              </div>
            </div>
            <div class="lemon--div__373c0__1mboc margin-b2__373c0__abANL border-color--default__373c0__3-ifU">
              <p class="lemon--p__373c0__3Qnnj text__373c0__2Kxyz comment__373c0__3EKjH text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa-">
                <span class="lemon--span__373c0__3997G raw__373c0__3rKqk" lang="en">
                  {this.props.review.Description}
                  {/*La Foret did a fantastic job accommodating their restaurant for Covid times. We
                  visited them last night, &nbsp;The ambience, Food and service were fabulous, Happy
                  to see this SJ landmarks &nbsp;back in business. Thank you!*/}
                </span>
              </p>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default Review;
