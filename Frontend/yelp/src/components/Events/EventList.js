import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Event from './Event';
import '../Orders/Orders.css';
import axios from 'axios';
import serverUrl from '../../config';
import NewEventForm from './NewEventForm';
// import 'bootstrap/dist/css/bootstrap.css';
import RegisteredCustomers from './RegisteredCustomers';
import { updateSnackbarData } from '../../reducer/action-types';
import { connect } from 'react-redux';
import SnackBar from '../SharedComponents/Snackbar';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventSortBy: '',
      visible: true,
      formOpen: false,
      popSeen: false,
      RegisteredCustomerList: [
        // { ID: 1, cusName: 'Pranjay', Email: 'asd@gmail.com' },
        // { ID: 2, cusName: 'Salman', Email: 'sss@gmail.com' },
        // { ID: 3, cusName: 'Apoorv', Email: 'acdd@gmail.com' },
        // { ID: 4, cusName: 'Sorabh', Email: 'ccd@gmail.com' },
        // { ID: 5, cusName: 'Joshi', Email: 'aeef@gmail.com' },
        // { ID: 6, cusName: 'Dimple', Email: 'cscds@gmail.com' },
      ],
      EVENTS: [],
    };
  }

  // get events based on the filter
  getEventList(e, sortValue = 'upcoming') {
    this.setState({
      EVENTS: [],
      eventSortBy: sortValue,
    });
    e.preventDefault();
    axios
      .get(
        serverUrl + 'restaurant/fetchEvents',

        { params: { sortValue }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allEvents = response.data[0].map((event) => {
          return {
            ID: event.EventID,
            Name: event.EventName,
            Description: event.Description,
            EventDate: new Date(event.EventDate),
            EventStartTime: event.EventStartTime,
            EventEndTime: event.EventEndTime,
            Address: event.Location,
            hashtags: event.Hashtags,
          };
        });

        this.setState({
          EVENTS: this.state.EVENTS.concat(allEvents),
        });
      });
  }

  componentDidMount() {
    const sortValue = 'upcoming';
    this.setState({
      EVENTS: [],
      eventSortBy: sortValue,
    });

    axios
      .get(
        serverUrl + 'restaurant/fetchEvents',

        { params: { sortValue }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allEvents = response.data[0].map((event) => {
          return {
            ID: event.EventID,
            Name: event.EventName,
            Description: event.Description,
            EventDate: new Date(event.EventDate),
            EventStartTime: event.EventStartTime,
            EventEndTime: event.EventEndTime,
            Address: event.Location,
            hashtags: event.Hashtags,
          };
        });

        this.setState({
          EVENTS: this.state.EVENTS.concat(allEvents),
        });
      });
  }

  // open form to create new event
  openNewForm = () => {
    this.setState({
      formOpen: !this.state.formOpen,
    });
  };

  openRegisteredCustomers = (eventID) => {
    if (this.state.popSeen) {
      this.setState({
        popSeen: !this.state.popSeen,
        RegisteredCustomerList: [],
      });
    } else {
      axios
        .get(
          serverUrl + 'restaurant/fetchRegisteredCustomers',

          { params: { eventID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let allCustomer = response.data[0].map((customer) => {
            return {
              cusName: customer.Name,
              Email: customer.EmailID,
              ID: customer.CustomerID,
            };
          });

          this.setState({
            RegisteredCustomerList: this.state.RegisteredCustomerList.concat(allCustomer),
            popSeen: !this.state.popSeen,
          });
        });
    }

    console.log('fetching customer details');
  };

  onShowAlert = () => {
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false });
      }, 2000);
    });
  };

  createNewEvent = (e, eventInfo) => {
    e.preventDefault();
    const data = {
      ...eventInfo,
      ...{ token: localStorage.getItem('token'), userrole: localStorage.getItem('role') },
    };
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'restaurant/createNewEvent', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 201) {
          console.log(response.data);
          let payload = {
            success: true,
            message: 'Event Created Successfully!',
          };
          this.props.updateSnackbarData(payload); // Ask
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  fetchCustomerProfile = (e, CustomerID) => {
    console.log('getting customer id', CustomerID);
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
            RegisteredCustomerList={this.state.RegisteredCustomerList}
            toggle={this.openRegisteredCustomers}
            fetchCustomerProfile={(event, id) => this.fetchCustomerProfile(event, id)}
          />
        ) : null}
        {this.state.formOpen && (
          <div>
            <NewEventForm
              CUISINES={this.state.CUISINES}
              // onNameChangeHandler={this.onNameChangeHandler}
              toggle={this.openNewForm}
              createNewEvent={(e, eventInfo) => this.createNewEvent(e, eventInfo)}
            ></NewEventForm>
          </div>
        )}
        <div>
          <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
            {this.state.EVENTS.map((event) => (
              <Event
                event={event}
                openRegisteredCustomers={() => this.openRegisteredCustomers(event.ID)}
                onSave={() => this.updateStatus(event.ID)}

                //   }
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

// export default EventList;
const mapStateToProps = (state) => {
  const snackbarData = state.snackBarReducer;
  return {
    snackbarData: snackbarData, // Ask
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
