import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import OrderForCustomer from './OrderForCustomer';
import axios from 'axios';
import serverUrl from '../../config';
import OrderDetails from '../Orders/OrderDetails';

class OrdersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter1: '',
      filter2: '',
      OrdersOrignalCopy: [],
      popSeen: false,
      ORDERS: [],
      orderDetails: [],
    };
  }

  componentDidMount() {
    axios
      .get(
        serverUrl + 'customer/fetchAllOrders',

        { withCredentials: true }
      )
      .then(
        (response) => {
          console.log(response.data);
          let allOrders = response.data[0].map((order) => {
            return {
              restroId: order.RestaurantId,
              ID: order.OrderID,
              Bill: order.Bill,
              DeliverStatusValue: order.Delivery_Status,
              OrderedTime: order.Date,
              OrderType: order.DeliveryMode,
            };
          });

          this.setState({
            OrdersOrignalCopy: allOrders,
            ORDERS: allOrders,
            filter1: 'All',
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  fetchOrdersFilter1 = (event, filter1) => {
    let newOrdersList = [];
    event.preventDefault();
    if (filter1 === 'Pickup') {
      newOrdersList = this.state.OrdersOrignalCopy.filter(
        (order) => order.DeliverStatusValue === 'Order Received' && order.OrderType === 'Pickup'
      );
    } else if (filter1 === 'Delivery') {
      newOrdersList = this.state.OrdersOrignalCopy.filter(
        (order) => order.DeliverStatusValue === 'Order Received' && order.OrderType === 'Delivery'
      );
    } else {
      newOrdersList = this.state.OrdersOrignalCopy;
    }
    this.setState({ filter1, filter2: 'Recieved', ORDERS: newOrdersList });
  };

  fetchOrdersFilter2 = (event, filter2) => {
    let newOrdersList = [];
    if (this.state.filter1 === 'Delivery') {
      switch (filter2) {
        case 'Recieved':
          newOrdersList = this.state.OrdersOrignalCopy.filter(
            (order) =>
              order.DeliverStatusValue === 'Order Received' && order.OrderType === 'Delivery'
          );
          break;
        case 'preparing':
          newOrdersList = this.state.OrdersOrignalCopy.filter(
            (order) => order.DeliverStatusValue === 'Preparing' && order.OrderType === 'Delivery'
          );
          break;
        case 'onTheWay':
          newOrdersList = this.state.OrdersOrignalCopy.filter(
            (order) => order.DeliverStatusValue === 'On the way' && order.OrderType === 'Delivery'
          );
          break;
        case 'Delivered':
          newOrdersList = this.state.OrdersOrignalCopy.filter(
            (order) => order.DeliverStatusValue === 'Delivered' && order.OrderType === 'Delivery'
          );
          console.log(newOrdersList);
          break;

        default:
          break;
      }
    } else {
      switch (filter2) {
        case 'Recieved':
          newOrdersList = this.state.OrdersOrignalCopy.filter(
            (order) => order.DeliverStatusValue === 'Order Received' && order.OrderType === 'Pickup'
          );
          break;
        case 'preparing':
          newOrdersList = this.state.OrdersOrignalCopy.filter(
            (order) => order.DeliverStatusValue === 'Preparing' && order.OrderType === 'Pickup'
          );
          break;
        case 'pickupReady':
          newOrdersList = this.state.OrdersOrignalCopy.filter(
            (order) => order.DeliverStatusValue === 'Pick up Ready' && order.OrderType === 'Pickup'
          );
          break;
        case 'pickedUp':
          newOrdersList = this.state.OrdersOrignalCopy.filter(
            (order) => order.DeliverStatusValue === 'Picked up' && order.OrderType === 'Pickup'
          );
          break;

        default:
          break;
      }
    }

    event.preventDefault();
    this.setState({ filter2, ORDERS: newOrdersList });
  };

  onStatusChangeHandler = (value, orderID) => {
    const index = this.state.ORDERS.findIndex((x) => x.ID === Number(orderID));
    let ORDERS = [...this.state.ORDERS];
    let order = { ...ORDERS[index] };
    order.tmpStatus = value;
    ORDERS[index] = order;
    this.setState({ ORDERS });
  };

  openOrderDetails = (orderID, restroId) => {
    if (this.state.popSeen) {
      this.setState({
        popSeen: !this.state.popSeen,
        orderDetails: [],
      });
    } else {
      axios
        .get(
          serverUrl + 'customer/fetchOrderDetails',

          { params: { orderID, restroId }, withCredentials: true }
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
        })
        .catch((error) => {
          console.log('Got the error');
        });
    }
  };

  render() {
    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      console.log('Token not found');
      redirectVar = <Redirect to="/customerLogin" />;
    } else {
      if (localStorage.getItem('role') === 'Customer') {
        redirectVar = null;
      } else if (localStorage.getItem('role') === 'Restaurant') {
        redirectVar = <Redirect to="/restaurantProfile" />;
      } else {
        redirectVar = <Redirect to="/customerLogin" />;
      }
    }
    return (
      <div style={{ background: 'white' }}>
        {' '}
        {/*this.props.snackbarData != null && <SnackBar />*/}
        {redirectVar}
        {/* {<CustomerNavBar />} */}
        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
        {/* <div className="main-content-wrap main-content-wrap--full">{<GreyArea />}</div> */}
        <div
          className="super-container"
          style={{
            paddingTop: '15px',
            paddingBottom: '36px',
            width: '960px',
            margin: '0 auto',
            padding: '0 15px',
          }}
        >
          <div
            style={{ marginTop: '40px' }}
            className="clearfix layout-block layout-n user-details_container"
          >
            {/* {<LeftPannel />} */}
            <div className="column column-beta ">
              <div className="user-details-overview">
                <div class="user-details-overview_sidebar">
                  <nav class="navbar navbar-inverse">
                    <div class="container-fluid">
                      {/*<div class="navbar-header">
                        <a class="navbar-brand">Filter By</a>
        </div>*/}
                      <ul class="nav navbar-nav">
                        <li className={this.state.filter1 === 'All' && 'active'}>
                          <Link to="/#" onClick={(event) => this.fetchOrdersFilter1(event, 'All')}>
                            All Orders
                          </Link>
                        </li>
                        <li className={this.state.filter1 === 'Delivery' && 'active'}>
                          <Link
                            to="/#"
                            onClick={(event) => this.fetchOrdersFilter1(event, 'Delivery')}
                          >
                            Delivery Type
                          </Link>
                        </li>
                        <li className={this.state.filter1 === 'Pickup' && 'active'}>
                          <Link
                            to="/#"
                            onClick={(event) => this.fetchOrdersFilter1(event, 'Pickup')}
                          >
                            Pickup Type
                          </Link>
                        </li>
                      </ul>

                      <ul class="nav navbar-nav">
                        {(this.state.filter1 === 'Pickup' || this.state.filter1 === 'Delivery') && (
                          <li className={this.state.filter2 === 'Recieved' && 'active'}>
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'Recieved')}
                            >
                              Recieved
                            </Link>
                          </li>
                        )}
                        {(this.state.filter1 === 'Pickup' || this.state.filter1 === 'Delivery') && (
                          <li className={this.state.filter2 === 'preparing' && 'active'}>
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'preparing')}
                            >
                              Preparing
                            </Link>
                          </li>
                        )}
                        {this.state.filter1 === 'Delivery' && (
                          <li className={this.state.filter2 === 'onTheWay' && 'active'}>
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'onTheWay')}
                            >
                              On The Way
                            </Link>
                          </li>
                        )}
                        {this.state.filter1 === 'Delivery' && (
                          <li className={this.state.filter2 === 'Delivered' && 'active'}>
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'Delivered')}
                            >
                              Delivered
                            </Link>
                          </li>
                        )}
                        {this.state.filter1 === 'Pickup' && (
                          <li className={this.state.filter2 === 'pickupReady' && 'active'}>
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'pickupReady')}
                            >
                              Pickup Ready
                            </Link>
                          </li>
                        )}
                        {this.state.filter1 === 'Pickup' && (
                          <li className={this.state.filter2 === 'pickedUp' && 'active'}>
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'pickedUp')}
                            >
                              Picked up
                            </Link>
                          </li>
                        )}
                      </ul>

                      {/*navLogin*/}
                    </div>
                  </nav>
                  {this.state.popSeen ? (
                    <OrderDetails
                      modeTop={'20%'}
                      orderDetails={this.state.orderDetails}
                      toggle={this.openOrderDetails}
                    />
                  ) : null}
                  <div>
                    <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                      {this.state.ORDERS.map((order) => (
                        <OrderForCustomer
                          order={order}
                          openOrderDetails={() => this.openOrderDetails(order.ID, order.restroId)}
                        />
                      ))}
                    </ul>
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

export default OrdersList;
