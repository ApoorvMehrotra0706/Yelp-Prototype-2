import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import CustomerNavBar from '../CommonArea/CustomerNavBar';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
// import LeftPannel from '../LeftPannel/LeftPannel';
// import GreyArea from '../CommonArea/GreyArea';
import EventForCustomer from './EventForCustomer';
import axios from 'axios';
import serverUrl from '../../config';
import { updateSnackbarData } from '../../reducer/action-types';
import { connect } from 'react-redux';
import SnackBar from '../SharedComponents/Snackbar';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = { EVENTS: [], registeredEventIds: [], searchString: '' };
  }
  componentDidMount() {
    const sortValue = 'upcoming';
    this.setState({
      EVENTS: [],
      eventSortBy: sortValue,
    });

    axios
      .get(
        serverUrl + 'customer/fetchEventList',

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
          EVENTS: allEvents,
        });
      });

    axios
      .get(
        serverUrl + 'customer/getCustRegisteredEvents',

        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allRegisteredEvents = response.data[0].map((event) => {
          return {
            ID: event.EventID,
          };
        });

        this.setState({
          registeredEventIds: this.state.registeredEventIds.concat(allRegisteredEvents),
        });
      });
  }

  getEventList(e, sortValue = 'upcoming') {
    this.setState({
      EVENTS: [],
      eventSortBy: sortValue,
    });
    e.preventDefault();
    axios
      .get(
        serverUrl + 'customer/fetchEventList',

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
          EVENTS: allEvents,
        });
      });
  }
  registerForEvent = (eventId) => {
    const data = {
      eventId,
      token: cookie.load('cookie'),
      userrole: cookie.load('role'),
    };
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'customer/eventRegistration', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          const tmp = { ID: eventId };
          this.setState({
            registeredEventIds: this.state.registeredEventIds.concat(tmp),
          });
          let payload = {
            success: true,
            message: 'Registeration Successfull!',
          };
          this.props.updateSnackbarData(payload);
          alert('Registration Successful');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  onChangeSearchStringHandler = (event) => {
    this.setState({
      searchString: event.target.value,
    });
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      console.log('cookie not found');
      redirectVar = <Redirect to="/customerLogin" />;
    } else {
      if (cookie.load('role') === 'Customer') {
        redirectVar = null;
      } else if (cookie.load('role') === 'Restaurant') {
        redirectVar = <Redirect to="/restaurantProfile" />;
      } else {
        redirectVar = <Redirect to="/customerLogin" />;
      }
    }
    return (
      <div style={{ background: 'white' }}>
        {this.props.snackbarData != null && <SnackBar />}
        {redirectVar}
        {}
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
                      <div class="navbar-header">
                        <a class="navbar-brand">Events</a>
                      </div>
                      <ul class="nav navbar-nav">
                        <li className={this.state.eventSortBy === 'upcoming' && 'active'}>
                          <Link to="/#" onClick={(event) => this.getEventList(event, 'upcoming')}>
                            Upcoming Events
                          </Link>
                        </li>
                        <li className={this.state.eventSortBy === 'registered' && 'active'}>
                          <Link to="/#" onClick={(event) => this.getEventList(event, 'registered')}>
                            Registered Events
                          </Link>
                        </li>
                        <li
                          className={
                            this.state.eventSortBy !== 'registered' &&
                            this.state.eventSortBy !== 'upcoming' &&
                            'active'
                          }
                        >
                          <input
                            style={{ marginTop: '14px' }}
                            type="text"
                            value={this.state.searchString}
                            onChange={this.onChangeSearchStringHandler}
                          ></input>
                        </li>
                        <li className={this.state.eventSortBy === 'registered' && 'active'}>
                          <button
                            style={{ marginTop: '14px' }}
                            onClick={(event) => this.getEventList(event, this.state.searchString)}
                          >
                            Search
                          </button>
                        </li>
                      </ul>

                      {/*navLogin*/}
                    </div>
                  </nav>
                  <div>
                    <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                      {this.state.EVENTS.map((event) => (
                        <EventForCustomer
                          event={event}
                          registeredEventIds={this.state.registeredEventIds}
                          registerForEvent={() => {
                            this.registerForEvent(event.ID);
                          }}
                          //openRegisteredCustomers={() => this.openRegisteredCustomers(event.ID)}
                          //onSave={() => this.updateStatus(event.ID)}

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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// export default Events;
// export default EventList;
const mapStateToProps = (state) => {
  const snackbarData = state.snackBarReducer;
  return {
    snackbarData: snackbarData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSnackbarData: (payload) => {
      dispatch({
        type: updateSnackbarData,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);
