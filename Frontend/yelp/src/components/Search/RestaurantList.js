import React, { Component } from 'react';
// import CustomerNavBar from '../CommonArea/CustomerNavBar';
import './Restaurant.css';
import Restaurant from './Restaurant';
import axios from 'axios';
import serverUrl from '../../config';
import { updateRestaurantArray } from '../../reducer/action-types';
import { history } from '../../App';

import { connect } from 'react-redux';

class RestaurantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BackupRestaurantsList: [],
    };
  }

  componentDidMount() {
    console.log('inside Signup');
    axios
      .get(serverUrl + 'customer/fetchRestaurantResults', {
        // Do
        params: {
          filter: localStorage.getItem('SearchFilter'),
          searchString: localStorage.getItem('SearchedString'),
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        let allRestaurants = response.data[0].map((restaurant) => {
          return {
            // From restaurant, delivery_methods, reviews
            ID: restaurant.ID,
            Name: restaurant.Name,
            DineIn: restaurant.DineIn,
            YelpDelivery: restaurant.YelpDelivery,
            CurbsidePickup: restaurant.CurbsidePickup,
            AvgRating: restaurant.AvgRating,
            ReviewCounts: restaurant.ReviewCounts,
            ImageUrl: restaurant.ImageUrl,
            OpeningTime: restaurant.OpeningTime,
            ClosingTime: restaurant.ClosingTime,
          };
        });

        this.setState({
          BackupRestaurantsList: allRestaurants,
        });
        const payload = { restaurantSearchResults: allRestaurants };
        this.props.updateRestaurantArray(payload);
      });

    this.setState({
      authFlag: false,
    });
  }
  filterDeliverMode = (filterMode) => {
    let filterResult = [];
    if (filterMode === 'Both') {
      const payload = { restaurantSearchResults: this.state.BackupRestaurantsList };
      this.props.updateRestaurantArray(payload);
    } else if (filterMode === 'CurbsidePickup') {
      filterResult = this.state.BackupRestaurantsList.filter(
        (restaurant) => restaurant.CurbsidePickup === 1
      );
      const payload = { restaurantSearchResults: filterResult };
      this.props.updateRestaurantArray(payload);
    } else {
      filterResult = this.state.BackupRestaurantsList.filter(
        (restaurant) => restaurant.YelpDelivery === 1
      );
      const payload = { restaurantSearchResults: filterResult };
      this.props.updateRestaurantArray(payload);
    }
    return this.props.searchTabInfo.SearchStrings.filter((string) =>
      string.toLowerCase().includes(this.props.searchTabInfo.serchedString.toLowerCase())
    );
  };

  openRestaurantPage = (ID) => {
    localStorage.setItem('restaurantPageID', ID);
    history.push('/RestaurantPage'); // Will be made
    window.location.reload(false);
  };

  render() {
    let redirectVar = null;
    return (
      <div>
        {' '}
        {/* {<CustomerNavBar />} */}
        <div className="lemon--div__09f24__1mboc spinnerContainer__09f24__2XcuX border-color--default__09f24__R1nRO background-color--white__09f24__2jFAt">
          <div className="lemon--div__09f24__1mboc mainContentContainer__09f24__1mGmV border-color--default__09f24__R1nRO">
            <div className="lemon--div__09f24__1mboc leftRailContainer__09f24__3fttY border-color--default__09f24__R1nRO">
              <div className="lemon--div__09f24__1mboc leftRailMainContent__09f24__1ncfZ padding-r5__09f24__hWLOF padding-b5__09f24__28TLK padding-l5__09f24__3g2Ty border-color--default__09f24__R1nRO">
                <div className="lemon--div__09f24__1mboc leftRailSearchResultsContainer__09f24__3vlwA border-color--default__09f24__R1nRO">
                  <div class="lemon--div__09f24__1mboc margin-b3__09f24__1DQ9x padding-t3__09f24__-R_5x border-color--default__09f24__R1nRO">
                    <div class="lemon--div__09f24__1mboc margin-t3__09f24__5bM2Z border-color--default__09f24__R1nRO">
                      <div class="lemon--div__09f24__1mboc suggestedFilterContainer__09f24__zCmtm border-color--default__09f24__R1nRO">
                        <span
                          class="lemon--span__09f24__3997G filterToggleBar__09f24__1srmg display--inline__09f24__3iACj border-color--default__09f24__R1nRO"
                          role="group"
                          aria-label="filters"
                        >
                          <button
                            onClick={() => {
                              this.filterDeliverMode('Both');
                            }}
                            class="filterToggle__09f24__40Unn leftRounded__09f24__2FatH rightRounded__09f24__2jT2w "
                            aria-disabled="false"
                            aria-pressed="false"
                            type="button"
                            style={{ cursor: 'pointer' }}
                          >
                            <span class="lemon--span__09f24__3997G text-wrapper__09f24__3oqzN display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                              <span class="lemon--span__09f24__3997G text__09f24__2tZKC text-color--normal__09f24__3oebo text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc text-size--small__09f24__1Z_UI">
                                All
                              </span>
                            </span>
                          </button>
                          <div class="lemon--div__09f24__1mboc tooltipContainer__09f24__1eDCf display--inline-block__09f24__FsgS4 border-color--default__09f24__R1nRO">
                            <button
                              onClick={() => {
                                this.filterDeliverMode('CurbsidePickup');
                              }}
                              style={{ cursor: 'pointer' }}
                              class="filterToggle__09f24__40Unn leftRounded__09f24__2FatH rightRounded__09f24__2jT2w"
                              aria-disabled="false"
                              aria-pressed="false"
                              type="button"
                            >
                              <span class="lemon--span__09f24__3997G text-wrapper__09f24__3oqzN display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                <span class="lemon--span__09f24__3997G text__09f24__2tZKC text-color--normal__09f24__3oebo text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc text-size--small__09f24__1Z_UI">
                                  Curbside Pickup
                                </span>
                              </span>
                            </button>
                          </div>
                          <div
                            style={{ cursor: 'pointer' }}
                            class="lemon--div__09f24__1mboc tooltipContainer__09f24__1eDCf display--inline-block__09f24__FsgS4 border-color--default__09f24__R1nRO"
                          >
                            <button
                              onClick={() => {
                                this.filterDeliverMode('yelpDelivery');
                              }}
                              class="filterToggle__09f24__40Unn leftRounded__09f24__2FatH rightRounded__09f24__2jT2w"
                              aria-disabled="false"
                              aria-pressed="false"
                              type="button"
                            >
                              <span class="lemon--span__09f24__3997G text-wrapper__09f24__3oqzN display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                <span class="lemon--span__09f24__3997G text__09f24__2tZKC text-color--normal__09f24__3oebo text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc text-size--small__09f24__1Z_UI">
                                  Yelp Delivery
                                </span>
                              </span>
                            </button>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                    <ul className="lemon--ul__09f24__1_cxs undefined list__09f24__17TsU">
                      {/**From CHild COmponent */}
                      {this.props.restaurantArray.restaurantSearchResults.map((restaurant) => (
                        <Restaurant
                          restaurant={restaurant}
                          openRestaurantPage={() => {
                            this.openRestaurantPage(restaurant.ID);
                          }}

                          //   }
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/**Google Maps */}
            <div className="lemon--div__09f24__1mboc rightRailContainer__09f24__3VshM border-color--default__09f24__R1nRO"></div>
          </div>
        </div>
      </div>
    );
  }
}

// export default RestaurantList;

const mapStateToProps = (state) => {
  const { searchTabInfo } = state.searchTabReducer;
  const { restaurantArray } = state.restaurantSearchResultReducer;
  return {
    searchTabInfo: searchTabInfo,
    restaurantArray: restaurantArray,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateRestaurantArray: (payload) => {
      dispatch({
        type: updateRestaurantArray,
        payload,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RestaurantList);
