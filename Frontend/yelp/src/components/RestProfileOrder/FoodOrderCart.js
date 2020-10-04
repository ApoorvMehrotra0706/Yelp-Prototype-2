import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../config';
// import FoodInfo from './FoodInfo';
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

  componentDidMount() {
    axios
      .get(
        serverUrl + 'customer/menuFetch',

        {
          params: { restroId: localStorage.getItem('restaurantPageID') },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        let allAppetizers = response.data[0].map((Appetizer) => {
          return {
            ID: Appetizer.AppetizerID,
            Name: Appetizer.Dishname,
            Ingredients: Appetizer.Main_Ingredients,
            cuisine: Appetizer.CuisineID,
            Description: Appetizer.Description,
            Price: Appetizer.Price,
          };
        });
        let allBeverages = response.data[1].map((Beverage) => {
          return {
            ID: Beverage.BeveragesID,
            Name: Beverage.Dishname,
            Ingredients: Beverage.Main_Ingredients,
            cuisine: Beverage.CuisineID,
            Description: Beverage.Description,
            Price: Beverage.Price,
          };
        });
        let allMainCourse = response.data[2].map((MainCourse) => {
          return {
            ID: MainCourse.MainCourseID,
            Name: MainCourse.Dishname,
            Ingredients: MainCourse.Main_Ingredients,
            cuisine: MainCourse.CuisineID,
            Description: MainCourse.Description,
            Price: MainCourse.Price,
          };
        });
        let allSalads = response.data[3].map((Salad) => {
          return {
            ID: Salad.SaladsID,
            Name: Salad.Dishname,
            Ingredients: Salad.Main_Ingredients,
            cuisine: Salad.CuisineID,
            Description: Salad.Description,
            Price: Salad.Price,
          };
        });
        let allDesserts = response.data[4].map((Dessert) => {
          return {
            ID: Dessert.DessertsID,
            Name: Dessert.Dishname,
            Ingredients: Dessert.Main_Ingredients,
            cuisine: Dessert.CuisineID,
            Description: Dessert.Description,
            Price: Dessert.Price,
          };
        });

        this.setState({
          APPETIZERS: this.state.APPETIZERS.concat(allAppetizers),
          BEVERAGES: this.state.BEVERAGES.concat(allBeverages),
          MAIN_COURSE: this.state.MAIN_COURSE.concat(allMainCourse),
          SALADS: this.state.SALADS.concat(allSalads),
          DESSERTS: this.state.DESSERTS.concat(allDesserts),
        });
      });
  }
  showMenuCategory = (category) => {
    if (category === this.state.openedCategory) {
      this.setState({
        openedCategory: '',
      });
    } else {
      this.setState({
        openedCategory: category,
      });
    }
  };

  onchangeUpdateCartHandler = (event, FoodId, Price) => {
    console.log('Food cart befor any changes', this.state.foodCart);
    /**Check if input value is 0 or empty */
    if (event.target.value === '' || event.target.value === 0) {
      // Check if that item was present in food cart
      let index = this.state.foodCart.findIndex(
        (x) => x.ID === FoodId && x.MenuCategory === this.state.openedCategory
      );
      // get item details from food cart, and remove it from the food cart
      if (index >= 0) {
        let item = this.state.foodCart[index];
        let reducedPrice = item.Quantity * Price;
        let foodCart = [...this.state.foodCart];
        foodCart.splice(index, 1);
        console.log('Food cart after removing item any changes', foodCart);
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
        foodCart[index] = item;
        console.log('Food cart after updating item quantity', foodCart);
        let total_Price = (this.state.totalPrice + changeInPrice).toFixed(2);
        const totalPrice = +total_Price;
        this.setState({ foodCart, totalPrice });
        //fetch old item, and udate the count
      } else {
        let item = {
          ID: FoodId,
          MenuCategory: this.state.openedCategory,
          Price: Price,
          Quantity: event.target.value,
        };
        let newItemPrice = event.target.value * Price;
        let total_Price = (this.state.totalPrice + newItemPrice).toFixed(2);
        const totalPrice = +total_Price;
        this.setState({
          foodCart: this.state.foodCart.concat(item),
          totalPrice,
        });
      }
      console.log('Food cart after adding new item', this.state.foodCart);
    }

    let index = null;
    let foodItem = null;
    switch (this.state.openedCategory) {
      case 'APPETIZERS':
        console.log('Appetizers before quantity addition', this.state.APPETIZERS);
        index = this.state.APPETIZERS.findIndex((x) => x.ID === FoodId);
        let APPETIZERS = [...this.state.APPETIZERS];
        foodItem = { ...APPETIZERS[index] };
        foodItem.Quantity = event.target.value;
        APPETIZERS[index] = foodItem;
        this.setState({ APPETIZERS });
        console.log('Appetizers after quantity addition', this.state.APPETIZERS);
        break;
      case 'DESSERTS':
        console.log('DESSERTS before quantity addition', this.state.DESSERTS);
        index = this.state.DESSERTS.findIndex((x) => x.ID === FoodId);
        let DESSERTS = [...this.state.DESSERTS];
        foodItem = { ...DESSERTS[index] };
        foodItem.Quantity = event.target.value;
        DESSERTS[index] = foodItem;
        this.setState({ DESSERTS });
        console.log('DESSERTS after quantity addition', this.state.DESSERTS);
        break;
      case 'BEVERAGES':
        console.log('BEVERAGES before quantity addition', this.state.BEVERAGES);
        index = this.state.BEVERAGES.findIndex((x) => x.ID === FoodId);
        let BEVERAGES = [...this.state.BEVERAGES];
        foodItem = { ...BEVERAGES[index] };
        foodItem.Quantity = event.target.value;
        BEVERAGES[index] = foodItem;
        this.setState({ BEVERAGES });
        console.log('BEVERAGES after quantity addition', this.state.BEVERAGES);
        break;
      case 'MAIN_COURSE':
        index = this.state.MAIN_COURSE.findIndex((x) => x.ID === FoodId);
        let MAIN_COURSE = [...this.state.MAIN_COURSE];
        foodItem = { ...MAIN_COURSE[index] };
        foodItem.Quantity = event.target.value;
        MAIN_COURSE[index] = foodItem;
        this.setState({ MAIN_COURSE });
        break;
      case 'SALADS':
        index = this.state.SALADS.findIndex((x) => x.ID === FoodId);
        let SALADS = [...this.state.SALADS];
        foodItem = { ...SALADS[index] };
        foodItem.Quantity = event.target.value;
        SALADS[index] = foodItem;
        this.setState({ SALADS });
        break;
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
                    <th>Food Item</th>
                    <th>cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.state.APPETIZERS.map((food) => (
                    <tr>
                      <td>{food.Name}</td>
                      <td>{food.cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          value={food.Quantity}
                          min="0"
                          max="50"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food.ID, food.Price);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
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
                    <th>Food Item</th>
                    <th>cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.state.MAIN_COURSE.map((food) => (
                    <tr>
                      <td>{food.Name}</td>
                      <td>{food.cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          max="50"
                          value={food.Quantity}
                          min="0"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food.ID, food.Price);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
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
                    <th>Food Item</th>
                    <th>cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.state.SALADS.map((food) => (
                    <tr>
                      <td>{food.Name}</td>
                      <td>{food.cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          value={food.Quantity}
                          min="0"
                          max="50"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food.ID, food.Price);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
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
                    <th>Food Item</th>
                    <th>cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.state.BEVERAGES.map((food) => (
                    <tr>
                      <td>{food.Name}</td>
                      <td>{food.cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          value={food.Quantity}
                          min="0"
                          max="50"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food.ID, food.Price);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
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
                    <th>Food Item</th>
                    <th>cuisine</th>
                    <th>Description</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th>Select Quantity</th>
                  </tr>
                  {this.state.DESSERTS.map((food) => (
                    <tr>
                      <td>{food.Name}</td>
                      <td>{food.cuisine}</td>
                      <td>{food.Description}</td>
                      <td>{food.Ingredients}</td>
                      <td>{food.Price}$</td>
                      <td>
                        <input
                          value={food.Quantity}
                          min="0"
                          max="50"
                          onChange={(event) => {
                            this.onchangeUpdateCartHandler(event, food.ID, food.Price);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FoodOrderCart;
