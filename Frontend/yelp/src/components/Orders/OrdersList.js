import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Order from './Order';
import OrderDetails from './OrderDetails';
import CustomerDetails from './CustomerDetails';
import CustomerProfile from './CustomerProfile';
import './Orders.css';
import axios from 'axios';
import serverUrl from '../../config';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

class ordersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderSortBy: localStorage.getItem('orderSortBy'),
      popSeen: false,
      popSeen1: false,
      activePage: 1,
      //ORDERS: [],
      //orderDetails: [],
      //customerDetails: [],
      // customer: [{name: 'apoorv', gender: 'Male', yelpingsince: 'today', contact: '1234'}],
      pageNo: '0',
    };
  }

  fetchOrders(sortValue, pageNo = '0') {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'restaurant/fetchOrderandDetails',

        {
          params: { RestaurantID: localStorage.getItem('user_id'), sortValue, pageNo: pageNo },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        let allOrders = response.data[0].map((order) => {
          return {
            ID: order._id,
            CustomerId: order.CustomerID,
            CustomerName: order.CustomerName,
            OrderedTime: order.Date,
            OrderType: order.DeliveryMode,
            DeliverStatusID: order.StatusID, // Number conversion to text
            DeliverStatusValue: order.State,
            Bill: order.Bill,
            tmpStatus: order.StatusID,
            Orders: order.Orders,
            ImageUrl: order.ImageURL,
            Contact: order.CustomerContact,
            Gender: order.CustomerGender,
            YelpingSince: order.CustomerYelpingSince,
          };
        });

        this.setState({
          // ORDERS: this.state.ORDERS.concat(allOrders),
          // ORDERS: allOrders,
          orderSortBy: sortValue,
        });
        let payload = {
          orderDetails: allOrders,
          PageCount: response.data[1],
          TotalCount: response.data[2],
          pageNo,
        };
        this.props.updateOrderInfo(payload);
      })
      .catch((err) => {
        console.log('Error');
      });
    localStorage.setItem('orderSortBy', sortValue);
  }

  componentDidMount() {
    console.log('In here');
    let value = localStorage.getItem('orderSortBy');
    if (value) this.fetchOrders(value);
    else {
      value = 'All';
      this.fetchOrders(value);
    }
  }

  onStatusChangeHandler = (value, orderID) => {
    const index = this.props.orders.orderDetails.findIndex((x) => x.ID === orderID);
    let ORDERS = [...this.props.orders.orderDetails];
    // let order = { ...ORDERS[index] };
    // order.tmpStatus = value;
    ORDERS[index].tmpStatus = value;
    // this.setState({ ORDERS });
    let payload = {
      orderDetails: ORDERS,
    };
    this.props.updateOrderInfo(payload);
  };

  openOrderDetails = (orderID) => {
    if (this.state.popSeen) {
      this.setState({
        popSeen: !this.state.popSeen,
        // orderDetails: [],
      });
    } else {
      const index = this.props.orders.orderDetails.findIndex((x) => x.ID === orderID);
      let allItems = this.props.orders.orderDetails[index].Orders.map((order) => {
        return {
          first: order.Dishname,
          count: order.Quantity,
          price: order.Price,
          totalPrice: order.TotalPrice,
        };
      });
      let payload = {
        cartDetails: allItems,
      };

      this.props.updateCartInfo(payload); // Removed orderDetails state

      this.setState({
        popSeen: !this.state.popSeen,
      });
    }
  };

  // new
  openCustomerDetails = (event, orderID = 0) => {
    // event.preventDefault();
    if (this.props.customerDetails.popSeen) {
      let payload = {
        popSeen: !this.props.customerDetails.popSeen,
      };
      this.props.updateCustomerInfo(payload);
    } else {
      const index = this.props.orders.orderDetails.findIndex((x) => x.ID === orderID);
      let payload = {
        customer: this.props.orders.orderDetails[index].CustomerId,
        popSeen: !this.props.customerDetails.popSeen,
      };
      this.props.updateCustomerInfo(payload);
    }
  };

  updateStatus = (event, orderID) => {
    const index = this.props.orders.orderDetails.findIndex((x) => x.ID === orderID);
    let foodItem = { ...this.props.orders.orderDetails[index] };
    const newStatus = foodItem.tmpStatus;
    let data = {
      deliveryStatus: newStatus,
      orderID,
    };
    event.preventDefault();
    axios.post(serverUrl + 'restaurant/updateDeliveryStatus', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          if (localStorage.getItem('orderSortBy') === 'All') {
            if (newStatus === '7') {
              if (this.props.orders.TotalCount % 4 === 1) {
                let payload = {
                  pageNo: this.props.orders.pageNo - 1,
                };
                this.props.updateOrderInfo(payload);
              }
            }
          }
          if (localStorage.getItem('orderSortBy') === 'New') {
            if (newStatus === '7' || newStatus === '5' || newStatus === '6') {
              if (this.props.orders.TotalCount % 4 === 1) {
                let payload = {
                  pageNo: this.props.orders.pageNo - 1,
                };
                this.props.updateOrderInfo(payload);
              }
            }
          }
          this.fetchOrders(localStorage.getItem('orderSortBy'), this.props.orders.pageNo);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  handlePageClick = (e) => {
    this.setState({
      pageNo: e.selected,
    });
    let sortValue = localStorage.getItem('orderSortBy');
    this.fetchOrders(sortValue, e.selected);
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
          <OrderDetails orderDetails={this.props.cart.cartDetails} toggle={this.openOrderDetails} />
        ) : null}

        <div>
          <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
            {this.props.orders.orderDetails.map((order) => (
              <Order
                order={order}
                openOrderDetails={() => this.openOrderDetails(order.ID)}
                openCustomerDetails={(e) => this.openCustomerDetails(e, order.ID)}
                onSave={(event) => this.updateStatus(event, order.ID)}
                onStatusChangeHandler={(evt, id) => this.onStatusChangeHandler(evt, id)}
              />
            ))}
          </ul>
          <ReactPaginate
            previousLabel={'prev'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={this.props.orders.PageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            forcePage={this.props.orders.pageNo}
            activeClassName={'active'}
          />
        </div>

        {this.props.customerDetails.popSeen ? (
          <CustomerProfile
            // customerDetails={this.props.customerDetails.customer}
            toggle={(e) => {
              this.openCustomerDetails(e);
            }}
          />
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateOrderInfo: (payload) => {
      dispatch({
        type: 'update-order-field',
        payload,
      });
    },
    updateCartInfo: (payload) => {
      dispatch({
        type: 'update-cart-details',
        payload,
      });
    },
    updateCustomerInfo: (payload) => {
      dispatch({
        type: 'update-customer-details',
        payload,
      });
    },
  };
};

const mapStateToProps = (state) => {
  const { orders } = state.orderReducer;
  const { cart } = state.foodCartReducer;
  const { customerDetails } = state.customerDetailsReducer;
  return {
    orders: orders,
    cart: cart,
    customerDetails: customerDetails,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ordersList);
