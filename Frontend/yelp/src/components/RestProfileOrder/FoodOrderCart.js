import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../config';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

class FoodOrderCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPrice: 0,
      openedCategory: '',
      foodCart: [],
      APPETIZERS: [],
      BEVERAGES: [],
      DESSERTS: [],
      MAIN_COURSE: [],
      SALADS: [],
    };
  }

  componentDidMount() {}

  getQuantityInFoodCart = (foodID, category) => {
    let index = this.state.foodCart.findIndex(
      (x) => x.ID === foodID && x.MenuCategory === category
    );
    if(index >= 0)
      return this.state.foodCart[index].Quantity;
    return 0;
  }
  
  fetchMenu = (category, pageNo = 0) => {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'customer/menuFetch',

        { 
          params: { RestaurantID: localStorage.getItem('restaurantPageID'),
                    pageNo, category},
          withCredentials: true,
        }
      )
      .then((response) => {
        let allFoodItems = response.data[0].map((item) => {
          return {
            ...item,
            Quantity: this.getQuantityInFoodCart(item._id, category),
          };
        });
        let payload = {
          FoodMenu: allFoodItems,
          PageCount: response.data[1],
          Total: response.data[2]
        };
        this.props.updateMenuOrderData(payload);
      });
  };

  showMenuCategory = (category) => {
    if (category === this.state.openedCategory) {
      this.setState({
        openedCategory: '',
      });
      let payload = {
        FoodMenu: [],
      };
      this.props.updateMenuOrderData(payload);
    } else {
      this.fetchMenu(category,0);
      this.setState({
        openedCategory: category,
      });
    }
  };

  handlePageClick = (e) => {
    this.fetchMenu(this.state.openedCategory,e.selected);
  }

  onchangeUpdateCartHandler = (event, FoodId, Price, FoodName) => {
    if (event.target.value === '' || event.target.value === 0) {
      let index = this.state.foodCart.findIndex(
        (x) => x.ID === FoodId && x.MenuCategory === this.state.openedCategory
      );
      if (index >= 0) {
        let item = this.state.foodCart[index];
        let reducedPrice = item.Quantity * Price;
        let foodCart = [...this.state.foodCart];
        foodCart.splice(index, 1);
        let total_Price = (this.state.totalPrice - reducedPrice).toFixed(2);
        const totalPrice = +total_Price;
        this.setState({
          foodCart,
          totalPrice,
        });
      }
    } else {
      let index = this.state.foodCart.findIndex(
        (x) => x.ID === FoodId && x.MenuCategory === this.state.openedCategory
      );
      // check if item already present in food cart
      if (index >= 0) {
        let foodCart = [...this.state.foodCart];
        let item = { ...foodCart[index] };
        let oldCount = item.Quantity;
        let changeInPrice = (event.target.value - oldCount) * Price;
        item.Quantity = event.target.value;
        item.TotalPrice = changeInPrice;
        foodCart[index] = item;
        let total_Price = (this.state.totalPrice + changeInPrice).toFixed(2);
        const totalPrice = +total_Price;
        this.setState({ foodCart, totalPrice });
        //fetch old item, and udate the count
      } else {
        let item = {
          Dishname: FoodName,
          ID: FoodId,
          MenuCategory: this.state.openedCategory,
          Price: Price,
          TotalPrice: Price * event.target.value,
          Quantity: event.target.value,
          RestaurantID: localStorage.getItem('user_id'),
        };
        let newItemPrice = event.target.value * Price;
        let total_Price = (this.state.totalPrice + newItemPrice).toFixed(2);
        const totalPrice = +total_Price;
        this.setState({
          foodCart: this.state.foodCart.concat(item),
          totalPrice,
        });
      }
      
      index = this.props.menuOrder.FoodMenu.findIndex((x) => x._id === FoodId);
      let menu = [...this.props.menuOrder.FoodMenu];
      menu[index].Quantity = event.target.value;
      let payload = {
        FoodMenu: menu,
      };
      this.props.updateMenuOrderData(payload);
    }
  };

  render() {
    return (
      <div style={{ top: '60px', left: '0', width: '100%', height: '100%' }}>
        <div
          className="modal"
          style={{ top: '60px', left: '0', width: '100%', height: '100%', position: 'fixed' }}
        >
          <div
            className="modal_content"
            style={{ top: '10%', left: '20%', width: '60%', height: '70%', overflowY: 'scroll' }}
          >
            <span className="close" onClick={this.props.openFoodMenu}>
              &times;{' '}
            </span>
            <br />
            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                //   backgroundColor: '#0000004a',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                marginBottom: '4px',
              }}
            >
              <p style={{ color: '#000', cursor: 'pointer' }}>
                <strong>Total Amount</strong>
              </p>

              <h3 style={{ color: 'black' }}>{this.state.totalPrice}$</h3>
            </div>
            <button
              onClick={() => this.props.orderFood(this.state.foodCart, this.state.totalPrice)}
              class="button__373c0__3lYgT primary__373c0__2ZWOb full__373c0__1AgIz"
              // style="--mousedown-x:0px;--mousedown-y:0px;--button-width:0px"
              // type="submit"
              // value="submit"
              style={{ width: '20%', cursor: 'pointer' }}
            >
              {' '}
              <div class="lemon--div__373c0__1mboc button-content__373c0__1QNtB border-color--default__373c0__3-ifU">
                <span class="lemon--span__373c0__3997G text__373c0__2Kxyz button-content-text__373c0__Z-7FO text-color--inherit__373c0__1lczC text-align--center__373c0__3VrfZ text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B text--truncated__373c0__3sLaf">
                  Submit Order
                </span>
              </div>
            </button>
            <br />
            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('APPETIZERS');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Appetizers</strong>
                </p>
              </a>
            </div>

            {/**Appetizers */}
            {this.state.openedCategory === 'APPETIZERS' && (
              <table id="customers">
                <tbody>
                  <tr>
                    <th>Image</th>
                    <th>Food Item</th>
                    <th>Cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.props.menuOrder.FoodMenu.map((food) => (
                    <tr>
                      <td><img src={food.ImageURL} style={{width: '100px', height: '100px'}}></img></td>
                      <td>{food.Dishname}</td>
                      <td>{food.Cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Main_Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          value={food.Quantity}
                          min="0"
                          max="50"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food._id, food.Price, food.Dishname);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.menuOrder.PageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </table>
            )}
            

            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('MAIN_COURSE');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Main Course</strong>
                </p>
              </a>
            </div>

            {/**MAIN_COURSE */}
            {this.state.openedCategory === 'MAIN_COURSE' && (
              <table id="customers">
                <tbody>
                  <tr>
                    <th>Image</th>
                    <th>Food Item</th>
                    <th>Cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.props.menuOrder.FoodMenu.map((food) => (
                    <tr>
                      <td><img src={food.ImageURL} style={{width: '100px', height: '100px'}}></img></td>
                      <td>{food.Dishname}</td>
                      <td>{food.Cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Main_Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          max="50"
                          value={food.Quantity}
                          min="0"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food._id, food.Price, food.Dishname);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.menuOrder.PageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </table>
            )}

            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('SALADS');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Salad</strong>
                </p>
              </a>
            </div>

            {/**SALADS */}
            {this.state.openedCategory === 'SALADS' && (
              <table id="customers">
                <tbody>
                  <tr>
                    <th>Image</th>
                    <th>Food Item</th>
                    <th>Cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.props.menuOrder.FoodMenu.map((food) => (
                    <tr>
                      <td><img src={food.ImageURL} style={{width: '100px', height: '100px'}}></img></td>
                      <td>{food.Dishname}</td>
                      <td>{food.Cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Main_Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          value={food.Quantity}
                          min="0"
                          max="50"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food._id, food.Price, food.Dishname);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.menuOrder.PageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </table>
            )}

            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('BEVERAGES');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Beverage</strong>
                </p>
              </a>
            </div>

            {/**BEVERAGES */}
            {this.state.openedCategory === 'BEVERAGES' && (
              <table id="customers">
                <tbody>
                  <tr>
                    <th>Image</th>
                    <th>Food Item</th>
                    <th>cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.props.menuOrder.FoodMenu.map((food) => (
                    <tr>
                      <td><img src={food.ImageURL} style={{width: '100px', height: '100px'}}></img></td>
                      <td>{food.Dishname}</td>
                      <td>{food.Cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Main_Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          value={food.Quantity}
                          min="0"
                          max="50"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food._id, food.Price, food.Dishname);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.menuOrder.PageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </table>
            )}
            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('DESSERTS');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Dessert</strong>
                </p>
              </a>
            </div>
            {/**DESSERTS */}
            {this.state.openedCategory === 'DESSERTS' && (
              <table id="customers">
                <tbody>
                  <tr>
                    <th>Image</th>
                    <th>Food Item</th>
                    <th>Cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.props.menuOrder.FoodMenu.map((food) => (
                    <tr>
                      <td><img src={food.ImageURL} style={{width: '100px', height: '100px'}}></img></td>
                      <td>{food.Dishname}</td>
                      <td>{food.Cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Main_Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          value={food.Quantity}
                          min="0"
                          max="50"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food._id, food.Price, food.Dishname);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.menuOrder.PageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { menuOrder } = state.foodOrderMenuReducer;
  return {
    menuOrder: menuOrder,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMenuOrderData: (payload) => {
      dispatch({
        type: 'update-customer-menu',
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodOrderCart);
