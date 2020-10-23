import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../config';
import FoodOrderCart from './FoodOrderCart';
import { connect } from 'react-redux';

class RestaurantRightPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMode: 'Delivery',
      address: '',
      showFoodMenu: false,
    };
  }
  openFoodMenu = () => {
    this.setState({
      showFoodMenu: !this.state.showFoodMenu,
      //RegisteredCustomerList: [],
    });
  };

  updateMode = (mode) => {
    if (this.state.currentMode !== mode) {
      this.setState({
        currentMode: mode,
      });
    }
  };
  onChangeAddressHandler = (event) => {
    this.setState({ address: event.target.value });
  };

  orderFood = (foodCart, Price) => {
    if (Price === 0) alert('Please select food items to place order');
    else {
      const data = {
        RestaurantID: localStorage.getItem('restaurantPageID'),
        RestaurantName: this.props.restaurantProfile.Name,
        CustomerID: localStorage.getItem('user_id'),
        CustomerName: this.props.customerData.Name,
        ImageURL: this.props.customerData.ImageURL,
        CustomerGender: this.props.customerData.Gender,
        CustomerContact: this.props.customerData.Contact,
        CustomerYelpingSince: this.props.customerData.YelpingSince,
        Date: new Date(),
        Bill: Price,
        StatusID: 1,
        Status: 'Order Received',
        State: 'New',
        
        Orders: foodCart,
        Address: this.state.address,
        DeliveryMode: this.state.currentMode,
      };
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post(serverUrl + 'customer/generateOrder', data).then(
        (response) => {
          if (response.status === 200) {
            this.setState({
              showFoodMenu: !this.state.showFoodMenu,
            });
            alert('Order Placed');
          }
        },
        (error) => {
        }
      );
      this.setState({
        address: '',
      })
      const payload = {
        FoodMenu: [],
        PageCount: '',
        Total: '',
      };
      this.props.updateCustomerMenu(payload);
    }
  };

  render() {
    let selected = 'translateX(0px)';
    if (this.state.currentMode === 'Pickup') {
      selected = 'translateX(95px)';
    }

    return (
      <div class="lemon--div__373c0__1mboc stickySidebar--fullHeight__373c0__1szWY arrange-unit__373c0__o3tjT arrange-unit-grid-column--4__373c0__33Wpc border-color--default__373c0__3-ifU">
        <div class="lemon--div__373c0__1mboc stickySidebar--fullHeight__373c0__1szWY border-color--default__373c0__3-ifU">
          <div class="lemon--div__373c0__1mboc stickySidebar__373c0__3PY1o border-color--default__373c0__3-ifU">
            <div class="lemon--div__373c0__1mboc margin-b3__373c0__q1DuY border-color--default__373c0__3-ifU">
              <div class="lemon--div__373c0__1mboc" id="biz-details-sidebar-widgets">
                <section class="lemon--section__373c0__fNwDM border-color--default__373c0__3-ifU">
                  <div class="lemon--div__373c0__1mboc padding-t3__373c0__1gw9E padding-r3__373c0__57InZ padding-b3__373c0__342DA padding-l3__373c0__1scQ0 border--top__373c0__3gXLy border--right__373c0__1n3Iv border--bottom__373c0__3qNtD border--left__373c0__d1B7K border-radius--regular__373c0__3KbYS background-color--white__373c0__2uyKj">
                    <div
                      class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU"
                      id="platform-widget"
                    >
                      <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                        <div class="lemon--div__373c0__1mboc display--inline-block__373c0__1ZKqC border-color--default__373c0__3-ifU">
                          <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                            <h2 class="lemon--h2__373c0__hjA2W heading--h4__373c0__27bDo">
                              Order Food
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div class="lemon--div__373c0__1mboc display--inline-block__373c0__1ZKqC margin-t3__373c0__1l90z margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
                        <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                          <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                            <div class="lemon--div__373c0__1mboc tabNavContainer__373c0__1-f1w display--inline-block__373c0__1ZKqC border-color--default__373c0__3-ifU">
                              <div
                                class="lemon--div__373c0__1mboc tabNav__373c0__Tk3fo border-color--default__373c0__3-ifU text-align--center__373c0__2n2yQ"
                                role="tablist"
                              >
                                <div
                                  onClick={() => this.updateMode('Delivery')}
                                  class="lemon--div__373c0__1mboc tab__373c0__24QGW tabNavItem__373c0__3X-YR tab--section__373c0__3V0A9 isSelected__373c0__3zDyA tab--no-outline__373c0__3adQG"
                                  tabindex="0"
                                  role="tab"
                                >
                                  <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--inherit__373c0__1lczC text-align--left__373c0__2XGa- text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B">
                                    <div
                                      class="lemon--div__373c0__1mboc tabLabel__373c0__2-upa"
                                      title="Delivery"
                                    >
                                      Delivery
                                    </div>
                                  </span>
                                </div>
                                <div
                                  onClick={() => this.updateMode('Pickup')}
                                  class="lemon--div__373c0__1mboc tab__373c0__24QGW tabNavItem__373c0__3X-YR tab--section__373c0__3V0A9 tab--no-outline__373c0__3adQG"
                                  tabindex="-1"
                                  role="tab"
                                >
                                  <span class="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--inherit__373c0__1lczC text-align--left__373c0__2XGa- text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B">
                                    <div
                                      class="lemon--div__373c0__1mboc tabLabel__373c0__2-upa"
                                      title="Pickup"
                                    >
                                      Pickup
                                    </div>
                                  </span>
                                </div>
                                <div
                                  class="lemon--div__373c0__1mboc tabUnderline__373c0__Lpb7i tabUnderline--rounded__373c0__Bd_LH border-color--default__373c0__3-ifU"
                                  role="presentation"
                                  style={{
                                    opacity: '1',
                                    width: '95.1406px',
                                    transform: `${selected}`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div
                              class="lemon--div__373c0__1mboc padding-t1__373c0__2aTOb border-color--default__373c0__3-ifU"
                              role="tabpanel"
                            ></div>
                          </div>
                        </div>
                      </div>

                      {this.state.currentMode === 'Delivery' && (
                        <div class="lemon--div__373c0__1mboc margin-t3__373c0__1l90z border-color--default__373c0__3-ifU">
                          <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                            <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                              <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                                <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                                  <div class="lemon--div__373c0__1mboc autocomplete-container__373c0__2zMRd border-color--default__373c0__3-ifU">
                                    <div class="lemon--div__373c0__1mboc floating-label-container__373c0__HMENw border-color--default__373c0__3-ifU">
                                      <label class="lemon--label__373c0__2BjWI">
                                        <input
                                          onChange={this.onChangeAddressHandler}
                                          style={{
                                            width: '100%',
                                            height: '48px',
                                            padding: '13px 16px',
                                            backgroundColor: '#fff',
                                            border: '0',
                                            boxShadow: 'inset 0 0 0 1px #bbbac0',
                                            borderRadius: '4px',
                                          }}
                                          type="text"
                                          id="address-autocomplete"
                                          value={this.state.address}
                                          autocomplete="off"
                                          aria-label="Order delivery"
                                          class="input__373c0__1kQwh no-margin__373c0__2tp2T"
                                          placeholder="Enter delivery address, with Zip code"
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div class="lemon--div__373c0__1mboc margin-t2__373c0__1CFWK border-color--default__373c0__3-ifU">
                        <div class="lemon--div__373c0__1mboc margin-t1__373c0__oLmO6 border-color--default__373c0__3-ifU">
                          <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                            <div class="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                              
                              {this.state.showFoodMenu ? (
                                <FoodOrderCart
                                  openFoodMenu={() => this.openFoodMenu()}
                                  currentMode={this.currentMode}
                                  deliveryAddress={this.state.currentMode}
                                  orderFood={(foodCart, Price) => {
                                    this.orderFood(foodCart, Price);
                                  }}
                                />
                              ) : null}
                              {(localStorage.getItem('token')) && this.state.currentMode === 'Delivery' ? (
                                <p>Please Enter Delivery Address before ordering!!!</p>
                              ) : null}
                              {localStorage.getItem('token') ? (
                                <button
                                  disabled={
                                    this.state.currentMode === 'Delivery' &&
                                    this.state.address.length === 0
                                  }
                                  onClick={this.openFoodMenu}
                                  class="button__373c0__3lYgT primary__373c0__2ZWOb full__373c0__1AgIz"
                                  // style="--mousedown-x:0px;--mousedown-y:0px;--button-width:0px"
                                  // type="submit"
                                  // value="submit"
                                  style={{ width: '100%', cursor: 'pointer' }}
                                >
                                  {' '}
                                  <div class="lemon--div__373c0__1mboc button-content__373c0__1QNtB border-color--default__373c0__3-ifU">
                                    <span class="lemon--span__373c0__3997G text__373c0__2Kxyz button-content-text__373c0__Z-7FO text-color--inherit__373c0__1lczC text-align--center__373c0__3VrfZ text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B text--truncated__373c0__3sLaf">
                                      Start Order
                                    </span>
                                  </div>
                                </button>
                              ) : (
                                <h2>Please Login to Order!!!!! </h2>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <section class="lemon--section__373c0__fNwDM margin-b3__373c0__q1DuY border-color--default__373c0__3-ifU"></section>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { restaurantProfile } = state.restaurantProfileReducer;
  const { customerData } = state.customerProfileReducer;
  const { menuOrder } = state.foodOrderMenuReducer;
  return {
    restaurantProfile: restaurantProfile,
    customerData: customerData,
    menuOrder: menuOrder,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCustomerMenu: (payload) => {
      dispatch({
        type: 'update-customer-menu',
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantRightPart);
