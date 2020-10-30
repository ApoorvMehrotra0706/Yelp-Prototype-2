import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Event from './Event';
import '../Orders/Orders.css';
import axios from 'axios';
import serverUrl from '../../config';
import NewEventForm from './NewEventForm';
import RegisteredCustomers from './RegisteredCustomers';
import CustomerProfile from '../Orders/CustomerProfile';
import { updateSnackbarData } from '../../reducer/action-types';
import { connect } from 'react-redux';
import RegCustomerDetails from './RegCustomerDetails';
import SnackBar from '../SharedComponents/Snackbar';
import ReactPaginate from 'react-paginate';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventSortBy: '',
      visible: true,
      formOpen: false,
      popSeen: false,
      popSeen1: false,
      pageNo: '0',
    };
  }

  // get events based on the filter
  getEventList(e, sortValue = 'upcoming',pageNo = '0') {
    this.setState({
      eventSortBy: sortValue,
    });
    e.preventDefault();
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'restaurant/fetchEvents',

        { params: { RestaurantID: localStorage.getItem('user_id'), pageNo: pageNo, sortValue }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allEvents = response.data[0].map((event) => {
          return {
            ID: event._id,
            Name: event.EventName,
            RestaurantID: event.RestaurantID,
            Description: event.Description,
            EventDate: new Date(event.EventDate),
            EventStartTime: event.EventStartTime,
            EventEndTime: event.EventEndTime,
            Address: event.Location,
            hashtags: event.Hashtags,
            RegisteredCustomers: event.RegisteredCustomers,
          };
        });
        let payload = {
          eventDetails: allEvents,
          PageCount: response.data[1],
          TotalCount: response.data[2],
          pageNo,

        }
        this.props.updateEventsData(payload);
      });
  }

  componentDidMount() {
    const sortValue = 'upcoming';
    this.setState({
      eventSortBy: sortValue,
    });
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.get(serverUrl + 'restaurant/cuisineFetch',
    {  params: { RestaurantID: localStorage.getItem('user_id') }, withCredentials: true })
    .then((response) => {
      console.log(response.data);
      let allCuisines = response.data.map((Cusine) => {
        return { key: Cusine._id, value: Cusine.CuisineName };
      });

      let payload = {
        cuisineNames : allCuisines,
      }

      this.props.updateCuisineInfo(payload);
    });
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'restaurant/fetchEvents',

        { params: { RestaurantID: localStorage.getItem('user_id'), pageNo: '0', sortValue: 'upcoming' }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allEvents = response.data[0].map((event) => {
          return {
            ID: event._id,
            Name: event.EventName,
            RestaurantName: event.RestaurantName,
            RestaurantID: event.RestaurantID,
            Description: event.Description,
            EventDate: new Date(event.EventDate),
            EventStartTime: event.EventStartTime,
            EventEndTime: event.EventEndTime,
            Address: event.Location,
            hashtags: event.Hashtags,
          };
        });

        let payload = {
          eventDetails: allEvents,
          PageCount: response.data[1],
          TotalCount: response.data[2],
          pageNo: this.state.pageNo,
          
        };
        this.props.updateEventsData(payload);
      });
  }

  openNewForm = () => {
    this.setState({
      formOpen: !this.state.formOpen,
    });
  };

  openRegisteredCustomers = (eventID,pageNo = '0') => {
    let popSeen = this.state.popSeen;
    if(pageNo !== '0') {
      popSeen = false;
      this.setState({
        popSeen: popSeen,
      });
    }
    if (popSeen) {
      this.setState({
        popSeen: !this.state.popSeen,
        RegisteredCustomerList: [],
      });
    } else {
      axios
        .get(
          serverUrl + 'restaurant/fetchRegisteredCustomers',

          { params: { eventID, pageNo }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          
          // let allCustomer = response.data[0].RegisteredCustomers;
          let allCustomer = response.data[0].RegisteredCustomers.map((customer)=> {
            return {
              CustomerID: customer.CustomerID,
              Email: customer.Email,
              CustomerName: customer.CustomerName,
              Gender: customer.Gender,
              Contact: customer.Contact,
              YelpingSince: customer.YelpingSince,
            }
    
          });
          let payload = {
            regCustDetails: allCustomer,
            PageCount: response.data[1],
            TotalCount: response.data[2],
            eventID,
          }

          this.props.updateRegCustData(payload);
          
          // this.setState({
          //   popSeen: !this.state.popSeen,
          // });
        });
    }
    this.setState({
      popSeen: !this.state.popSeen,
    });
    console.log('fetching customer details');
  };

  onShowAlert = () => {
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false });
      }, 2000);
    });
  };

  handlePageClick = (e) => {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'restaurant/fetchEvents',

        { params: { RestaurantID: localStorage.getItem('user_id'), pageNo: e.selected, sortValue: this.state.eventSortBy }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allEvents = response.data[0].map((event) => {
          return {
            ID: event._id,
            Name: event.EventName,
            RestaurantID: event.RestaurantID,
            Description: event.Description,
            EventDate: new Date(event.EventDate),
            EventStartTime: event.EventStartTime,
            EventEndTime: event.EventEndTime,
            Address: event.Location,
            hashtags: event.Hashtags,
            RegisteredCustomers: event.RegisteredCustomers,
          };
        });
        let payload = {
          eventDetails: allEvents,
          PageCount: response.data[1],
          TotalCount: response.data[2],
          pageNo: e.selected,
        }
        this.props.updateEventsData(payload);
      });
  }

  createNewEvent = (e, eventInfo) => {
    e.preventDefault();
    const data = {
      ...eventInfo,
      ...{ RestaurantID: localStorage.getItem('user_id') },
    };
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    //make a post request with the user data
    axios.post(serverUrl + 'restaurant/createNewEvent', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          let payload = {
            Name: '',
            Description: '',
            EventDate: null,
            EventStartTime: '00:00:00',
            EventEndTime: '00:00:01',
            Country: null,
            State: null,
            City: null,
            Zip: null,
            Street: '',
            hashtags: '',
          };
          this.props.updateNewEvents(payload);
          this.getEventList(e);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  fetchCustomerProfile = (e, CustomerID) => {
    console.log('getting   customer id', CustomerID);
    if (this.state.popSeen1) {
      this.setState({
        popSeen1: !this.state.popSeen1,
        customerDetails: [],
      });
    } else {
          const index = this.props.regCust.regCustDetails.findIndex((x) => x.CustomerID === CustomerID);
          let allItems = this.props.regCust.regCustDetails[index];
          delete allItems.CustomerID;
          delete allItems.Email;
          let payload = {
            CustDetails: [allItems],
          };

          this.props.updateRegCustData(payload);
          payload = {
            customer: CustomerID,
          };
          this.props.updateCustomerDetails(payload);
          this.setState({
            
            popSeen1: !this.state.popSeen1,
          });
        
    }
  };

  render() {
    return (
      <div>
        {/*redirectVar*/}

        {this.props.snackbarData != null && <SnackBar />}
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <div class="navbar-header">
              <a class="navbar-brand">Events</a>
            </div>
            <ul class="nav navbar-nav">
              <li className={this.state.eventSortBy === 'upcoming' && 'active'}>
                <Link to="/#" onClick={(event) => this.getEventList(event, 'upcoming')}>
                  Upcoming Events
                </Link>
              </li>
              <li className={this.state.eventSortBy === 'past' && 'active'}>
                <Link to="/#" onClick={(event) => this.getEventList(event, 'past')}>
                  Expired Events
                </Link>
              </li>
            </ul>
            
            <ul class="nav navbar-nav navbar-right">
              <li>
                <Link to="#" onClick={this.openNewForm}>
                  Create Event
                </Link>
              </li>
            </ul>
            {/*navLogin*/}
          </div>
        </nav>
        {this.state.popSeen ? (
          <RegisteredCustomers
            RegisteredCustomerList={this.props.regCust.regCustDetails}
            handlePageClick={(e)=> {this.openRegisteredCustomers(this.props.regCust.eventID,e.selected)}}
            toggle={this.openRegisteredCustomers}
            fetchCustomerProfile={(event, id) => this.fetchCustomerProfile(event, id)}
          />
        ) : null}
        {this.state.popSeen1 ? (
          <CustomerProfile
            // customerDetails={this.props.regCust.CustDetails}
            toggle={this.fetchCustomerProfile}
          />
        ) : null}
        {this.state.formOpen && (
          <div>
            <NewEventForm
              CUISINES={this.props.cuisine.cuisineNames}
              // onNameChangeHandler={this.onNameChangeHandler}
              toggle={this.openNewForm}
              createNewEvent={(e, eventInfo) => this.createNewEvent(e, eventInfo)}
            ></NewEventForm>
          </div>
        )}
        <div>
          <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
            {this.props.events.eventDetails.map((event) => (
              <Event
                event={event}
                openRegisteredCustomers={() => this.openRegisteredCustomers(event.ID)}
                onSave={() => this.updateStatus(event.ID)}

                //   }
              />
            ))}
          </ul>
          <ReactPaginate
              previousLabel={'prev'}
              nextLabel={'next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.props.events.PageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={(e)=> {this.handlePageClick(e)}}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              forcePage={this.props.events.pageNo}
              activeClassName={'active'}
            />
        </div>
      </div>
    );
  }
}

// export default EventList;
const mapStateToProps = (state) => {
  const snackbarData = state.snackBarReducer;
  const { events } = state.eventReducer;
  const { regCust } = state.regCustReducer;
  const { cuisine } = state.cuisineReducer;
  return {
    snackbarData: snackbarData, // Ask
    events: events,
    cuisine: cuisine,
    regCust: regCust,
  };
};

const mapDispatchToProps = (dispatch) => {
  // Ask
  return {
    updateSnackbarData: (payload) => {
      dispatch({
        type: updateSnackbarData,
        payload,
      });
    },
    updateEventsData: (payload) => {
      dispatch({
        type: 'update-events',
        payload,
      });
    },
    updateRegCustData: (payload) => {
      dispatch({
        type: 'update-reg-customer',
        payload,
      });
    },
    updateCuisineInfo: (payload) => {
      dispatch({
        type: 'update-cuisine-field',
        payload,
      });
    },
    updateNewEvents: (payload) => {
      dispatch({
        type: 'update-new-event',
        payload,
      });
    },
    updateCustomerDetails: (payload) => {
      dispatch({
        type: 'update-customer-details',
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
