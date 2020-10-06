import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Order from './Order';
import OrderDetails from './OrderDetails';
import CustomerDetails from './CustomerDetails';
import './Orders.css';
import axios from 'axios';
import serverUrl from '../../config';
import { setRawCookie } from 'react-cookies';
import cookie from 'react-cookies';

class ordersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderSortBy: localStorage.getItem('orderSortBy'),
      popSeen: false,
      popSeen1: false,
      activePage: 1,
      ORDERS: [],
      orderDetails: [],
      customerDetails: [],
    };
  }

  fetchOrders(sortValue) {
    const orderUpdate = [];
    this.setState({
      ORDERS: orderUpdate,
    });
    axios
      .get(
        serverUrl + 'restaurant/orderFetch',

        { params: { sortValue }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allOrders = response.data[0].map((order) => {
          return {
            ID: order.OrderID,
            CustomerId: order.CustomerID,
            CustomerName: order.Name,
            OrderedTime: order.Date,
            OrderType: order.DeliveryMode,
            DeliverStatusID: order.StatusID,
            DeliverStatusValue: order.State,
            Bill: order.Bill,
            tmpStatus: order.StatusID,
            ImageUrl: order.ImageURL,
          };
        });

        this.setState({
          // ORDERS: this.state.ORDERS.concat(allOrders),
          ORDERS: allOrders,
          orderSortBy: sortValue,
        });
      })
      .catch((err) => {
        console.log('Error');
      });
    localStorage.setItem('orderSortBy', sortValue);
  }

  componentDidMount() {
    let value = localStorage.getItem('orderSortBy');
    if (value) this.fetchOrders(value);
    else {
      value = 'All';
      this.fetchOrders(value);
    }
  }

  onStatusChangeHandler = (value, orderID) => {
    const index = this.state.ORDERS.findIndex((x) => x.ID === Number(orderID));
    let ORDERS = [...this.state.ORDERS];
    let order = { ...ORDERS[index] };
    order.tmpStatus = value;
    ORDERS[index] = order;
    this.setState({ ORDERS });
  };

  openOrderDetails = (orderID) => {
    if (this.state.popSeen) {
      this.setState({
        popSeen: !this.state.popSeen,
        orderDetails: [],
      });
    } else {
      axios
        .get(
          serverUrl + 'restaurant/fetchPersonOrder',

          { params: { orderID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let allItems = response.data[0].map((Item) => {
            return {
              first: Item.DishName,
              count: Item.Quantity,
              price: Item.Price,
              totalPrice: Item.Total_Price,
            };
          });

          this.setState({
            orderDetails: this.state.orderDetails.concat(allItems),
            popSeen: !this.state.popSeen,
          });
        });
    }

    console.log('fetching food details');
  };

  // new
  openCustomerDetails = (orderID) => {
    if (this.state.popSeen1) {
      this.setState({
        popSeen1: !this.state.popSeen1,
        customerDetails: [],
      });
    } else {
      axios
        .get(
          serverUrl + 'restaurant/fetchCustomerDetails',

          { params: { orderID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let allItems = response.data[0].map((Item) => {
            return {
              name: Item.Name,
              gender: Item.GenderName,
              yelpingsince: Item.YelpingSince,
              contact: Item.Contact,
            };
          });

          this.setState({
            customerDetails: this.state.customerDetails.concat(allItems),
            popSeen1: !this.state.popSeen1,
          });
        })
        .catch((err) => {
          console.log('Error');
        });
    }

    console.log('fetching customer details');
  };

  updateStatus = (event, orderID) => {
    const index = this.state.ORDERS.findIndex((x) => x.ID === orderID);
    let foodItem = { ...this.state.ORDERS[index] };
    const newStatus = foodItem.tmpStatus;
    let data = {
      deliveryStatus: newStatus,
      orderID,
      token: cookie.load('cookie'),
      userrole: cookie.load('role'),
    };
    event.preventDefault();
    axios.post(serverUrl + 'restaurant/updateDeliveryStatus', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          foodItem = { ...foodItem, DeliverStatusID: foodItem.tmpStatus };
          let ORDERS = [...this.state.ORDERS];
          ORDERS.splice(index, 1);
          // ORDERS.push(foodItem);
          if (Number(foodItem.tmpStatus) < 5) {
            ORDERS.splice(index, 0, foodItem);
          }
          this.setState({
            ORDERS,
          });
          // newFoodId = { ...newFoodId, ...this.state.newFood };
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
  render() {
    return (
      <div>
        {/*redirectVar*/}
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <div class="navbar-header">
              <a class="navbar-brand">Filter By</a>
            </div>
            <ul class="nav navbar-nav">
              <li className={localStorage.getItem('orderSortBy') === 'All' && 'active'}>
                <Link to="#" onClick={() => this.fetchOrders('All')}>
                  All Orders
                </Link>
              </li>
              <li className={localStorage.getItem('orderSortBy') === 'New' && 'active'}>
                <Link to="#" onClick={() => this.fetchOrders('New')}>
                  New Orders
                </Link>
              </li>
              <li className={localStorage.getItem('orderSortBy') === 'Delivered' && 'active'}>
                <Link to="#" onClick={() => this.fetchOrders('Delivered')}>
                  Delivered Orders
                </Link>
              </li>
              <li className={localStorage.getItem('orderSortBy') === 'Canceled' && 'active'}>
                <Link to="#" onClick={() => this.fetchOrders('Canceled')}>
                  Canceled Orders
                </Link>
              </li>
            </ul>
            {/*navLogin*/}
          </div>
        </nav>
        {this.state.popSeen ? (
          <OrderDetails orderDetails={this.state.orderDetails} toggle={this.openOrderDetails} />
        ) : null}

        <div>
          <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
            {this.state.ORDERS.map((order) => (
              <Order
                order={order}
                openOrderDetails={() => this.openOrderDetails(order.ID)}
                openCustomerDetails={() => this.openCustomerDetails(order.ID)}
                onSave={(event) => this.updateStatus(event, order.ID)}
                onStatusChangeHandler={(evt, id) => this.onStatusChangeHandler(evt, id)}
              />
            ))}
          </ul>
        </div>

        {this.state.popSeen1 ? (
          <CustomerDetails
            customerDetails={this.state.customerDetails}
            toggle={this.openCustomerDetails}
          />
        ) : null}
      </div>
    );
  }
}

export default ordersList;
