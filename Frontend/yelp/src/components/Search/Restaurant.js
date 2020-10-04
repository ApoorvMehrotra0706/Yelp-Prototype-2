import React, { Component } from 'react';

class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let timmingInfo = null;

    if (
      this.props.restaurant.OpeningTime !== null &&
      this.props.restaurant.OpeningTime.length > 0 &&
      this.props.restaurant.ClosingTime !== null &&
      this.props.restaurant.ClosingTime.length > 0
    ) {
      timmingInfo = `Open FROM ${this.props.restaurant.OpeningTime} To ${this.props.restaurant.ClosingTime}`;
    }
    const rightPath = (
      <path d="M9.46 17.52a1 1 0 01-.71-.29l-4-4a1.004 1.004 0 111.42-1.42l3.25 3.26 8.33-8.34a1.004 1.004 0 011.42 1.42l-9 9a1 1 0 01-.71.37z"></path>
    );
    const wrongPath = (
      <path d="M13.41 12l5.3-5.29a1.004 1.004 0 10-1.42-1.42L12 10.59l-5.29-5.3a1.004 1.004 0 00-1.42 1.42l5.3 5.29-5.3 5.29a1 1 0 000 1.42 1 1 0 001.42 0l5.29-5.3 5.29 5.3a1 1 0 001.42 0 1 1 0 000-1.42L13.41 12z"></path>
    );
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';

    let rating = { backgroundPosition: '0 -320px' };
    switch (this.props.restaurant.AvgRating) {
      case '1':
        rating = { backgroundPosition: '0 -360px' };
        break;
      case '2':
        rating = { backgroundPosition: '0 -400px' };
        break;
      case '3':
        rating = { backgroundPosition: '0 -440px' };
        break;
      case '4':
        rating = { backgroundPosition: '0 -480px' };
        break;
      case '5':
        rating = { backgroundPosition: '0 -500px' };
        break;
    }
    return (
      <li class="lemon--li__09f24__1r9wz border-color--default__09f24__R1nRO">
        <div class="lemon--div__09f24__1mboc container__09f24__21w3G hoverable__09f24__2nTf3 margin-t3__09f24__5bM2Z margin-b3__09f24__1DQ9x padding-t3__09f24__-R_5x padding-r3__09f24__1pBFG padding-b3__09f24__1vW6j padding-l3__09f24__1yCJf border--top__09f24__1H_WE border--right__09f24__28idl border--bottom__09f24__2FjZW border--left__09f24__33iol border-color--default__09f24__R1nRO">
          <div class="lemon--div__09f24__1mboc ABP border-color--default__09f24__R1nRO">
            <div class="lemon--div__09f24__1mboc arrange__09f24__AiSIM border-color--default__09f24__R1nRO">
              <div class="lemon--div__09f24__1mboc arrange-unit__09f24__1gZC1 border-color--default__09f24__R1nRO">
                <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                  <div class="lemon--div__09f24__1mboc display--inline-block__09f24__FsgS4 margin-r3__09f24__2CcgQ border-color--default__09f24__R1nRO">
                    <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                      <div
                        class="lemon--div__09f24__1mboc container__09f24__2BlDc dontTriggerCardClick__09f24__2GWZF container--responsive__09f24__1BXoY container__09f24__1SkkV border-color--default__09f24__R1nRO"
                        data-slidenum="0"
                      >
                        <div
                          class="lemon--div__09f24__1mboc container__09f24__15LDH border-color--default__09f24__R1nRO"
                          aria-label="Slideshow"
                        >
                          <div
                            class="lemon--div__09f24__1mboc child__09f24__27sCM border-color--default__09f24__R1nRO"
                            //style="transition:transform 150ms ease-in-out"
                          >
                            <div class="lemon--div__09f24__1mboc on-click-container border-color--default__09f24__R1nRO">
                              <a
                                class="lemon--a__09f24__IEZFH link__09f24__1kwXV photo-box-link__09f24__28L0f link-color--blue-dark__09f24__2DRa0 link-size--default__09f24__3xWLF"
                                href="/adredir?ad_business_id=O7l60eIslDceBESZRi_QiQ&amp;campaign_id=qNAXN_9n5zQc7UeX23W6FQ&amp;click_origin=search_results&amp;placement=above_search&amp;redirect_url=https%3A%2F%2Fwww.yelp.com%2Fbiz%2Fapplebees-grill-bar-san-jose-2&amp;request_id=22211f322ab1a3ac&amp;signature=a6af61ea5ed85c3648ba00ad683c87d972a866724075039030079645c990b873&amp;slot=0"
                                target=""
                                name=""
                                rel=""
                              >
                                <img
                                  class="lemon--img__09f24__3GQUb photo-box-img__09f24__3F3c5"
                                  src={
                                    this.props.restaurant.ImageUrl !== null &&
                                    this.props.restaurant.ImageUrl.length > 0
                                      ? this.props.restaurant.ImageUrl
                                      : defaultImage
                                  }
                                  srcset={
                                    this.props.restaurant.ImageUrl !== null &&
                                    this.props.restaurant.ImageUrl.length > 0
                                      ? this.props.restaurant.ImageUrl
                                      : defaultImage
                                  }
                                  //src="https://s3-media0.fl.yelpcdn.com/bphoto/fXZ2b5G3X7MYOBNmEY6ATQ/ls.jpg"
                                  //srcset="https://s3-media0.fl.yelpcdn.com/bphoto/fXZ2b5G3X7MYOBNmEY6ATQ/258s.jpg 1.03x,https://s3-media0.fl.yelpcdn.com/bphoto/fXZ2b5G3X7MYOBNmEY6ATQ/348s.jpg 1.39x,https://s3-media0.fl.yelpcdn.com/bphoto/fXZ2b5G3X7MYOBNmEY6ATQ/300s.jpg 1.20x"
                                  alt="Applebee’s Grill + Bar"
                                  height="100%"
                                  width="100%"
                                  loading="auto"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="lemon--div__09f24__1mboc arrange-unit__09f24__1gZC1 arrange-unit-fill__09f24__O6JFU border-color--default__09f24__R1nRO">
                <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                  <div class="lemon--div__09f24__1mboc scrollablePhotos__09f24__1PpB8 arrange__09f24__AiSIM border-color--default__09f24__R1nRO">
                    <div class="lemon--div__09f24__1mboc mainAttributes__09f24__26-vh arrange-unit__09f24__1gZC1 arrange-unit-fill__09f24__O6JFU border-color--default__09f24__R1nRO">
                      <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                        <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                          <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                            <div class="lemon--div__09f24__1mboc businessName__09f24__3Wql2 display--inline-block__09f24__FsgS4 border-color--default__09f24__R1nRO">
                              <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                                <h4 class="lemon--h4__09f24__1yd__ heading--h4__09f24__2ijYq alternate__09f24__39r7c">
                                  <span class="lemon--span__09f24__3997G text__09f24__2tZKC text-color--black-regular__09f24__1QxyO text-align--left__09f24__3Drs0 text-weight--bold__09f24__WGVdT text-size--inherit__09f24__2rwpp">
                                    1&nbsp;
                                    <a
                                      style={{ cursor: 'pointer' }}
                                      class="lemon--a__09f24__IEZFH link__09f24__1kwXV link-color--inherit__09f24__3PYlA link-size--inherit__09f24__2Uj95"
                                      onClick={() => {
                                        this.props.openRestaurantPage();
                                      }}
                                      target=""
                                      name="McDonald’s"
                                      rel=""
                                    >
                                      {this.props.restaurant.Name}
                                    </a>
                                  </span>
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                            <div class="lemon--div__09f24__1mboc display--inline-block__09f24__FsgS4 border-color--default__09f24__R1nRO">
                              <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                                <div class="lemon--div__09f24__1mboc attribute__09f24__3znwq display--inline-block__09f24__FsgS4 margin-r1__09f24__BCulR border-color--default__09f24__R1nRO">
                                  <span class="lemon--span__09f24__3997G display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                    <div
                                      style={rating}
                                      class="lemon--div__09f24__1mboc i-stars__09f24__1T6rz i-stars--regular-2__09f24__3LFi9 border-color--default__09f24__R1nRO overflow--hidden__09f24__3u-sw"
                                      aria-label="2 star rating"
                                      role="img"
                                    >
                                      {/*<img
                                                        class="lemon--img__09f24__3GQUb offscreen__09f24__1VFco"
                                                        src="https://s3-media0.fl.yelpcdn.com/assets/public/stars_v2.yji-52d3d7a328db670d4402843cbddeed89.png"
                                                        width="132"
                                                        height="560"
                                                        alt=""
                                                     />*/}
                                    </div>
                                  </span>
                                </div>
                                <div class="lemon--div__09f24__1mboc attribute__09f24__3znwq display--inline-block__09f24__FsgS4 border-color--default__09f24__R1nRO">
                                  <span class="lemon--span__09f24__3997G text__09f24__2tZKC reviewCount__09f24__EUXPN text-color--black-extra-light__09f24__38DtK text-align--left__09f24__3Drs0">
                                    {this.props.restaurant.ReviewCounts}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                  <div class="lemon--div__09f24__1mboc display--inline-block__09f24__FsgS4 margin-t0-5__09f24__24b_v border-color--default__09f24__R1nRO">
                    <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                      <ul class="lemon--ul__09f24__1_cxs undefined list__09f24__17TsU">
                        <li class="lemon--li__09f24__1r9wz border-color--default__09f24__R1nRO">
                          <div class="lemon--div__09f24__1mboc TRUSTED_PROPERTY border-color--default__09f24__R1nRO">
                            <div class="lemon--div__09f24__1mboc tag__09f24__21uQS margin-t0-5__09f24__24b_v margin-r1__09f24__BCulR border-color--default__09f24__R1nRO">
                              <div class="lemon--div__09f24__1mboc icon__09f24__1ZuAZ margin-r1__09f24__BCulR border-color--default__09f24__R1nRO">
                                <span aria-hidden="true" class="icon--24-checkmark-v2 css-yyirv3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    class="icon_svg"
                                  >
                                    {this.props.restaurant.YelpDelivery ? rightPath : wrongPath}
                                  </svg>
                                </span>
                              </div>
                              <span class="lemon--span__09f24__3997G label__09f24__2iNlZ display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                <p class="lemon--p__09f24__3Qnnj text__09f24__2tZKC text-color--black-regular__09f24__1QxyO text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc">
                                  <span class="lemon--span__09f24__3997G raw__09f24__3Obuy">
                                    Yelp Delivery
                                  </span>
                                </p>
                              </span>
                            </div>
                            <div class="lemon--div__09f24__1mboc tag__09f24__21uQS margin-t0-5__09f24__24b_v margin-r1__09f24__BCulR border-color--default__09f24__R1nRO">
                              <div class="lemon--div__09f24__1mboc icon__09f24__1ZuAZ margin-r1__09f24__BCulR border-color--default__09f24__R1nRO">
                                <span aria-hidden="true" class="icon--24-checkmark-v2 css-yyirv3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    class="icon_svg"
                                  >
                                    {this.props.restaurant.CurbsidePickup ? rightPath : wrongPath}
                                  </svg>
                                </span>
                              </div>
                              <span class="lemon--span__09f24__3997G label__09f24__2iNlZ display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                <p class="lemon--p__09f24__3Qnnj text__09f24__2tZKC text-color--black-regular__09f24__1QxyO text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc">
                                  <span class="lemon--span__09f24__3997G raw__09f24__3Obuy">
                                    Curbside Pickup
                                  </span>
                                </p>
                              </span>
                            </div>
                            <div class="lemon--div__09f24__1mboc tag__09f24__21uQS margin-t0-5__09f24__24b_v margin-r1__09f24__BCulR border-color--default__09f24__R1nRO">
                              <div class="lemon--div__09f24__1mboc icon__09f24__1ZuAZ margin-r1__09f24__BCulR border-color--default__09f24__R1nRO">
                                <span aria-hidden="true" class="icon--24-checkmark-v2 css-yyirv3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    class="icon_svg"
                                  >
                                    {this.props.restaurant.DineIn ? rightPath : wrongPath}
                                  </svg>
                                </span>
                              </div>
                              <span class="lemon--span__09f24__3997G label__09f24__2iNlZ display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                <p class="lemon--p__09f24__3Qnnj text__09f24__2tZKC text-color--black-regular__09f24__1QxyO text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc">
                                  <span class="lemon--span__09f24__3997G raw__09f24__3Obuy">
                                    Dine-In
                                  </span>
                                </p>
                              </span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                  <div class="lemon--div__09f24__1mboc display--inline-block__09f24__FsgS4 margin-t1__09f24__3OFkY border-color--default__09f24__R1nRO">
                    <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                      <div class="lemon--div__09f24__1mboc arrange__09f24__AiSIM gutter-auto__09f24__2WJTk vertical-align-middle__09f24__zNCcM border-color--default__09f24__R1nRO">
                        <div class="lemon--div__09f24__1mboc arrange-unit__09f24__1gZC1 arrange-unit-fill__09f24__O6JFU border-color--default__09f24__R1nRO">
                          <p class="lemon--p__09f24__3Qnnj text__09f24__2tZKC text-color--black-extra-light__09f24__38DtK text-align--left__09f24__3Drs0">
                            {/* Open FROM {this.props.restaurant.OpeningTime} To{' '}
                                                    {this.props.restaurant.ClosingTime}*/}
                            {timmingInfo}
                            <span class="lemon--span__09f24__3997G text__09f24__2tZKC text-color--inherit__09f24__1jgBv text-align--left__09f24__3Drs0 text-size--inherit__09f24__2rwpp">
                              &nbsp;
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO"></div>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default Restaurant;
