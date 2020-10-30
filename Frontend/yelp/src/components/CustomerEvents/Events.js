import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import EventForCustomer from './EventForCustomer';
import axios from 'axios';
import serverUrl from '../../config';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = { EVENTS: [], registeredEventIds: [], searchString: '' };
  }
  componentDidMount() {
    const sortOrder = 'upcoming';
    let payload = {
      sortOrder, 
    };
    this.props.updateCustomerEvents(payload);
    
    this.getEventList('upcoming');
    
  }

  getEventList = async (sortOrder, filter = -1, pageNo = 0) => {
    let payload = {
      filter,
      sortOrder,
      PageNo: pageNo,
    };
    await this.props.updateCustomerEvents(payload);
    if(sortOrder ===  'upcoming'){
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios
        .get(
          serverUrl + 'customer/fetchEventList',

          { params: { filter, pageNo }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let allEvents = response.data[0].map((event) => {
            return {
              ID: event._id,
              Name: event.EventName,
              Description: event.Description,
              EventDate: new Date(event.EventDate),
              EventStartTime: event.EventStartTime,
              EventEndTime: event.EventEndTime,
              Address: event.Location,
              hashtags: event.Hashtags,
            };
          });

          let payload = {
            Events: allEvents,
            PageCount: response.data[1],
            TotalCount: response.data[2],
          }
          this.props.updateCustomerEvents(payload);
      });
    } else {
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios
      .get(
        serverUrl + 'customer/getCustRegisteredEvents',
  
        { params: { CustomerID: localStorage.getItem('user_id'),filter, pageNo }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allRegisteredEvents = response.data[0].map((event) => {
          return {
            ID: event.EventID,
              Name: event.EventName,
              Description: event.Description,
              EventDate: new Date(event.EventDate),
              EventStartTime: event.EventStartTime,
              EventEndTime: event.EventEndTime,
              Address: event.Address,
              hashtags: event.Hashtags,
          };
        });  
        let payload = {
          Events: allRegisteredEvents,
          PageCount: response.data[1],
          TotalCount: response.data[2],
        }
  
        this.props.updateCustomerEvents(payload);
      })
      .catch((e) => {
        console.log('Error');
      });
    }
  }

  registerForEvent = (eventId) => {
    let index = this.props.customerEvents.Events.findIndex((x) => x.ID === eventId);
    let date = this.props.customerEvents.Events[index].EventDate;
    const RegisteredCustomers = {
      EventID: eventId, 
      EventName: this.props.customerEvents.Events[index].Name,
      Description: this.props.customerEvents.Events[index].Description,
      EventStartTime: this.props.customerEvents.Events[index].EventStartTime,
      EventEndTime: this.props.customerEvents.Events[index].EventEndTime,
      Address: this.props.customerEvents.Events[index].Address,
      Hashtags: this.props.customerEvents.Events[index].hashtags,
      CustomerID: localStorage.getItem('user_id'),
      CustomerName: this.props.customerData.Name,
      Email: localStorage.getItem('username'),
      Gender: this.props.customerData.Gender,
      EventDate: date,
      Contact: this.props.customerData.Contact,
      YelpingSince: this.props.customerData.YelpingSince,
    };
    const data = {
      EventID: eventId,
      CustomerID: localStorage.getItem('user_id'),
      RegisteredCustomers,
    };
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    //make a post request with the user data
    axios.post(serverUrl + 'customer/eventRegistration', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          const tmp = { EventID: eventId };
          let events = this.props.customerData.Events;
          events.push(tmp);
          let payload = {
            Events: events,
          }
          this.props.updateCustomerProfile(payload);
          alert('Registration Successful');
          this.getEventList('upcoming',-1,this.props.customerEvents.PageNo);
        }
      },
      (error) => {
        console.log(error);
      }
    );

  };

  handlePageClick = async (e) =>{
    let payload = {
      PageNo: e.selected
    };
    await this.props.updateCustomerEvents(payload);

    if(this.props.customerEvents.sortOrder === 'upcoming') {
      this.getEventList(this.props.customerEvents.sortOrder, this.props.customerEvents.filter,
        e.selected);
    } else if(this.props.customerEvents.sortOrder === 'registered'){
      this.getEventList('registered', this.props.customerEvents.filter, e.selected);
    } else {
      this.getSearchedEventList(this.state.searchString,this.props.customerEvents.filter, e.selected);
    }
  }

  getSearchedEventList = (searchString, filter = -1, pageNo = 0) => {
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios
        .get(
          serverUrl + 'customer/fetchSearchedEventList',

          { params: { searchString, filter, pageNo }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let allEvents = response.data[0].map((event) => {
            return {
              ID: event._id,
              Name: event.EventName,
              Description: event.Description,
              EventDate: new Date(event.EventDate),
              EventStartTime: event.EventStartTime,
              EventEndTime: event.EventEndTime,
              Address: event.Location,
              hashtags: event.Hashtags,
            };
          });

          let payload = {
            sortOrder: 'searched',
            Events: allEvents,
            PageCount: response.data[1],
            TotalCount: response.data[2],
          }
          this.props.updateCustomerEvents(payload);
      });
  }

  getFilter = async (event, filter) => {
    let payload = {
      filter,
      PageNo: 0,
    };
    await this.props.updateCustomerEvents(payload);

    if(this.props.customerEvents.sortOrder === 'upcoming') {
      this.getEventList('upcoming',filter);
    }
    else if(this.props.customerEvents.sortOrder === 'registered'){
      this.getEventList('registered', filter);
    }
    else
      this.getSearchedEventList(this.state.searchString,filter);
  }

  onChangeSearchStringHandler = (event) => {
    this.setState({
      searchString: event.target.value,
    });
  };

  render() {
    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      console.log('token not found');
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
        {redirectVar}
        {}
        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
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
                        <li className={this.props.customerEvents.sortOrder === 'upcoming' && 'active'}>
                          <Link to="#" onClick={(event) => this.getEventList('upcoming',-1)}>
                            Upcoming Events
                          </Link>
                        </li>
                        <li className={this.props.customerEvents.sortOrder === 'registered' && 'active'}>
                          <Link to="#" onClick={(event) => this.getEventList('registered',-1)}>
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
                            onClick={(event) => this.getSearchedEventList(this.state.searchString,-1)}
                          >
                            Search
                          </button>
                        </li>
                      </ul>
                      <ul class="nav navbar-nav navbar-right">
                        <li className={this.props.customerEvents.filter === -1 && 'active'}>
                          <Link to="#" onClick={(event) => this.getFilter(event, -1)}>
                          <span class="glyphicon glyphicon-arrow-down"></span>
                            Descending
                          </Link>
                        </li>
                        <li className={this.props.customerEvents.filter === 1 && 'active'}>
                          <Link to="#" onClick={(event) => this.getFilter(event, 1)}>
                          <span class="glyphicon glyphicon-arrow-up"></span>
                            Ascending
                          </Link>
                        </li>
                      </ul>
                      {/*navLogin*/}
                    </div>
                  </nav>
                  <div>
                    <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                      {this.props.customerEvents.Events.map((event) => (
                        <EventForCustomer
                          event={event}
                          registeredEventIds={this.props.customerData.Events}
                          registerForEvent={() => {
                            this.registerForEvent(event.ID);
                          }}
                          //openRegisteredCustomers={() => this.openRegisteredCustomers(event.ID)}
                          //onSave={() => this.updateStatus(event.ID)}

                          //   }
                        />
                      ))}
                    </ul>
                    <ReactPaginate
                      previousLabel={'prev'}
                      nextLabel={'next'}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={this.props.customerEvents.PageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={2}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      forcePage={this.props.customerEvents.PageNo}
                      activeClassName={'active'}
                  />
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

const mapStateToProps = (state) => {
  const { customerEvents } = state.customerEventsReducer;
  const { customerData } = state.customerProfileReducer;
  return {
    customerEvents: customerEvents,
    customerData: customerData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCustomerEvents: (payload) => {
      dispatch({
        type: 'customer-profile-events',
        payload,
      });
    },
    updateCustomerProfile: (payload) => {
      dispatch({
        type: 'update-customer-profile',
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);
