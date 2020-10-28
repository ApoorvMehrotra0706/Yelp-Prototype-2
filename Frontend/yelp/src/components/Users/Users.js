import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import UserDisplay from './UserDisplay';
import CustomerDetails from './CustomerDetails';
import axios from 'axios';
import serverUrl from '../../config';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      followedCustomerIDs: [], 
      searchString: '',
      SearchFilters: [ 
        { ID: 1, Value: 'First Name' },
        { ID: 2, Value: 'NickName' },
        { ID: 4, Value: 'Location' },
      ],
      popSeen: false,
      searchCriteria: '',
    };
  }
  componentDidMount() {
    const category = 'All';
    let payload = {
      category, 
    };
    this.props.updateYelpUsers(payload);
    
    this.getYelpUserList(category);
     
  }

  getYelpUserList = async (category, pageNo = 0) => {
    let payload = {
      category,
      pageNo,
    };
    await this.props.updateYelpUsers(payload);
    this.setState({
      searchString: '',
      searchCriteria: ''
    });
    if (category === 'All') {
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios
        .get(
          serverUrl + 'customer/fetchYelpUserList',

          { params: { CustomerID: localStorage.getItem('user_id'), pageNo, category }, withCredentials: true }
          )
          .then((response) => {
            console.log(response.data);
            let allUsers = response.data[0].map((user) => {
              return {
                ID: user.CustomerID,
                Name: user.name,
                ImageURL: user.ImageURL,
                YelpingSince: user.YelpingSince,
                DOB: user.DOB,
                Gender: user.gender,
                Contact: user.Contact,
                Address: (((user.streetAddress.concat(',')).concat(user.City)).concat(',')).concat(user.zip),           
              };
            });
            let payload = {
              yelpCustomers: allUsers,
              PageCount: response.data[1],
              TotalCount: response.data[2],
            }
            this.props.updateYelpUsers(payload);
        });
      } else {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios
        .get(
          serverUrl + 'customer/fetchYelpUserList',

          { params: { CustomerID: localStorage.getItem('user_id'), pageNo, category }, 
            withCredentials: true }
          )
          .then((response) => {
            console.log(response.data);
            let allUsers = response.data[0][0].Following.map((user) => {
              return {
                ID: user.CustomerID,
                Name: user.CustomerName,
                ImageURL: user.ImageURL,
                YelpingSince: user.YelpingSince,
                DOB: user.DOB,
                Gender: user.Gender,
                Contact: user.Contact,
                Address: user.Address,           
              };
            });
            let payload = {
              yelpCustomers: allUsers,
              PageCount: response.data[1],
              TotalCount: response.data[2],
            };
            this.props.updateYelpUsers(payload);
         });
      }
  }
  
  handlePageClick = async (e) =>{
    let payload = {
      pageNo: e.selected
    };
    await this.props.updateYelpUsers(payload);

    if(this.props.yelpUsers.category === 'All') {
      this.getYelpUserList(this.props.yelpUsers.category, e.selected);
    } else if(this.props.yelpUsers.category === 'Following'){
      this.getYelpUserList('Following', e.selected);
    } else {
      this.getSearchedYelpUserList(this.state.searchString, this.state.searchCriteria, e.selected);
    }
  };

  getSearchedYelpUserList = (searchString, searchCriteria, pageNo = 0) => {
    let payload = {
      category: '',
      pageNo,
    };
    this.props.updateYelpUsers(payload); 
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'customer/fetchSearchedYelpUser',

        { params: { CustomerID: localStorage.getItem('user_id'), searchString, searchCriteria, pageNo }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allUsers = response.data[0].map((user) => {
          return {
            ID: user.CustomerID,
              Name: user.name,
              ImageURL: user.ImageURL,
              YelpingSince: user.YelpingSince,
              DOB: user.DOB,
              Gender: user.gender,
              Contact: user.Contact,
              Address: (((user.streetAddress.concat(',')).concat(user.City)).concat(',')).concat(user.zip),           
            };
          });
          let payload = {
            yelpCustomers: allUsers,
            PageCount: response.data[1],
            TotalCount: response.data[2],
          }
          this.props.updateYelpUsers(payload);
    });
  };

  onChangeSearchStringHandler = (event) => {
    this.setState({
      searchString: event.target.value,
    });
  };

  onChangeselectedFilter = (event) => {
    this.setState({
      searchCriteria: event.target.value,
    });
  };


  openCustomerDetails = (event,userID) => {
    if(this.state.popSeen) {
      this.setState({
        popSeen: !this.state.popSeen,
      });
    } else {
      const index = this.props.yelpUsers.yelpCustomers.findIndex((x) => x.ID === userID);
      let allItems = {
        name: this.props.yelpUsers.yelpCustomers[index].Name,
        gender: this.props.yelpUsers.yelpCustomers[index].Gender,
        DOB: this.props.yelpUsers.yelpCustomers[index].DOB.split('T')[0],
        contact: this.props.yelpUsers.yelpCustomers[index].Contact,
      };
      let payload = {
        customer: [allItems],
      };
      this.props.updateYelpUsers(payload); 
      this.setState({
        popSeen: !this.state.popSeen,
      });
    }
  }

  followUser = (userID)  => {
    const index = this.props.yelpUsers.yelpCustomers.findIndex((x) => x.ID === userID);
    const Following = {
      CustomerID: this.props.yelpUsers.yelpCustomers[index].ID,
      CustomerName: this.props.yelpUsers.yelpCustomers[index].Name,
      DOB: this.props.yelpUsers.yelpCustomers[index].DOB,
      Gender: this.props.yelpUsers.yelpCustomers[index].Gender,
      Contact: this.props.yelpUsers.yelpCustomers[index].Contact,
      ImageURL: this.props.yelpUsers.yelpCustomers[index].ImageURL,
      YelpingSince: this.props.yelpUsers.yelpCustomers[index].YelpingSince,
      Address: this.props.yelpUsers.yelpCustomers[index].Address,
    };
    const FollowingCustomerIDs = {
      CustomerID: userID,
    };
    const data = {
      CustomerID: localStorage.getItem('user_id'),
      Following,
      FollowingCustomerIDs,
    }
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.post(serverUrl + 'customer/followUser', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          const tmp = { CustomerID: userID };
          let followingIDs = this.props.customerData.FollowingIDs;
          followingIDs.push(tmp);
          let payload = {
            FollowingIDs: followingIDs,
          }
          this.props.updateCustomerProfile(payload);
          alert('Added to your following list');
          // this.getEventList(-1,0);
        }
      },
      (error) => {
        console.log(error);
      }
    );  
  }
  
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
            width: '1260px',
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
                        <a class="navbar-brand">Yelp Users</a>
                      </div>
                      <ul class="nav navbar-nav">
                        <li className={this.props.yelpUsers.category === 'All' && 'active'}>
                          <Link to="#" onClick={(event) => this.getYelpUserList('All')}>
                            Users
                          </Link>
                        </li>
                        <li className={this.props.yelpUsers.cateogry === 'Following' && 'active'}>
                          <Link to="#" onClick={(event) => this.getYelpUserList('Following')}>
                            Following
                          </Link>
                        </li>  
                      </ul>
                      <ul class="nav navbar-nav navbar-right">
                        <li>
                          <select
                              style={{
                                width: '100%',
                                position: 'inherit',
                                fontWeight: '700',
                                marginTop: '14px',
                                marginBottom: '25px',
                                color: '#666',
                              }}
                              placeholder="searchFilter"
                              className="form-control"
                              onChange={this.onChangeselectedFilter}
                              required
                            >
                              <option
                                className="Dropdown-menu"
                                key=""
                                value={null}
                                style={{
                                  fontWeight: '700',
                                  color: '#666',
                                }}
                              >
                                -Filter-
                              </option>
                              {this.state.SearchFilters.map((searchFilter) => (
                                <option
                                  style={{
                                    fontWeight: '700',
                                    color: '#666',
                                  }}
                                  className="Dropdown-menu"
                                  key={searchFilter.ID}
                                  value={searchFilter.value}
                                >
                                  {searchFilter.Value}
                                </option>
                              ))}
                            </select>
                          </li>
                          <li
                            className={
                              this.props.yelpUsers.cateogry !== 'All' &&
                              this.props.yelpUsers.cateogry !== 'Following' &&
                              'active'
                            }
                          >
                            <input
                              style={{ marginTop: '14px', width: '100px' }}
                              type="text"
                              value={this.state.searchString}
                              onChange={this.onChangeSearchStringHandler}
                            ></input>
                        </li>
                        <li className={this.props.yelpUsers.category === 'search' && 'active'}>
                          <button
                            style={{ marginTop: '14px' }}
                            onClick={(event) => this.getSearchedYelpUserList(
                                                                this.state.searchString, 
                                                                this.state.searchCriteria,
                                                              )}
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
                      {this.props.yelpUsers.yelpCustomers.map((user) => (
                        <UserDisplay
                          user={user}
                          followedCustomerIDs={this.props.customerData.FollowingIDs}
                          openCustomerDetails={(e) => this.openCustomerDetails(e,user.ID)}
                          followUser={() => {
                            this.followUser(user.ID);
                          }}
                        />
                      ))}
                    </ul>
                    <ReactPaginate
                      previousLabel={'prev'}
                      nextLabel={'next'}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={this.props.yelpUsers.PageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={2}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      forcePage={this.props.yelpUsers.pageNo}
                      activeClassName={'active'}
                  />
                  </div>
                  {this.state.popSeen ? (
                    <CustomerDetails
                      customerDetails={this.props.yelpUsers.customer}
                      toggle={(e) => {this.openCustomerDetails(e)}}
                    />
                  ) : null}
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
  const { yelpUsers } = state.yelpUsersReducer;
  const { customerData } = state.customerProfileReducer;
  return {
    yelpUsers: yelpUsers,
    customerData: customerData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateYelpUsers: (payload) => {
      dispatch({
        type: 'update-yelp-users',
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

export default connect(mapStateToProps, mapDispatchToProps)(Users);
