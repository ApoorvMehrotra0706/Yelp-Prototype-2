import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Order from './Order';
import OrderDetails from './OrderDetails';
import './Orders.css';
import Pagination from 'react-js-pagination';
import axios from 'axios';
import serverUrl from '../../../config';

class ordersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderSortBy: localStorage.getItem('orderSortBy'),
      popSeen: false,
      activePage: 1,
      ORDERS: [],
      orderDetails: [],
    };
  }

  fetchOrders(sortValue) {
    axios
      .get(
        serverUrl + 'biz/getOrderDetailsNew',

        { params: { sortValue }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allOrders = response.data[0].map((order) => {
          return {
            ID: order.ID,
            CustomerId: order.CustomerID,
            CustomerName: order.CustomerName,
            OrderedTime: order.Date,
            OrderType: order.Order_Type,
            DeliverStatusID: order.DeliverStatusID,
            DeliverStatusValue: order.DeliverStatusValue,
            Bill: order.Bill,
            tmpStatus: order.DeliverStatusID,
          };
        });

        this.setState({
          ORDERS: this.state.ORDERS.concat(allOrders),
          orderSortBy: sortValue,
        });
      });
    localStorage.setItem('orderSortBy', sortValue);
  }

  componentDidMount() {
    this.fetchOrders(localStorage.getItem('orderSortBy'));
  }

  // handlePageChange(pageNumber) {
  //   console.log(`active page is ${pageNumber}`);
  //   this.setState({ activePage: pageNumber });
  // }

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
          serverUrl + 'biz/orderFetch',

          { params: { orderID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let allItems = response.data.map((Item) => {
            return {
              first: Item.Name,
              count: Item.Count,
              price: Item.PPrice,
              totalPrice: Item.TPrice,
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

  updateStatus = (orderID) => {
    const index = this.state.ORDERS.findIndex((x) => x.ID === orderID);
    let foodItem = { ...this.state.ORDERS[index] };
    const newStatus = foodItem.tmpStatus;
    let data = {
      deliveryStatus: newStatus,
      orderID,
      token: localStorage.getItem('token'),
      userrole: localStorage.getItem('userrole'),
    };
    axios.post(serverUrl + 'biz/updateDeliveryStatus', data).then(
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
                <Link to="/#" onClick={() => this.fetchOrders('All')}>
                  All Orders
                </Link>
              </li>
              <li className={localStorage.getItem('orderSortBy') === 'New' && 'active'}>
                <Link to="/#" onClick={() => this.fetchOrders('New')}>
                  New Orders
                </Link>
              </li>
              <li className={localStorage.getItem('orderSortBy') === 'Delivered' && 'active'}>
                <Link to="/#" onClick={() => this.fetchOrders('Delivered')}>
                  Delevered Orders
                </Link>
              </li>
              <li className={localStorage.getItem('orderSortBy') === 'Canceled' && 'active'}>
                <Link to="/#" onClick={() => this.fetchOrders('Canceled')}>
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
                onSave={() => this.updateStatus(order.ID)}
                onStatusChangeHandler={(evt, id) => this.onStatusChangeHandler(evt, id)}

                //   }
              />
            ))}
          </ul>
          {/*<Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={5}
            //totalItemsCount={450}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange.bind(this)}
         />*/}
        </div>
      </div>
    );
  }
}

export default ordersList;
