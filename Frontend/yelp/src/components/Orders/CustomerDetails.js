import React, { Component } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

class CustomerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Gender',
          field: 'gender', 
          sort: 'asc',
        },
        {
          label: 'Yelping Since',
          field: 'yelpingsince', 
          sort: 'asc',
        },
        {
          label: 'Contact No',
          field: 'contact', 
          sort: 'asc',
        },
      ],
    };
  }
  handleClick = (e) => {
    this.props.toggle(e);
  };
  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';
    return (
      <div className="modal" style={{ top: '0', left: '0', width: '100%', height: '100%' }}>
        <div
          className="modal_content"
          style={{ top: '10%', left: '20%', width: '60%', height: '70%' }}
        >
          <span className="close" onClick={this.handleClick}>
            &times;{' '}
          </span>
          <MDBTable scrollY maxHeight="100%" striped>
            <MDBTableHead columns={this.state.columns} />
            <MDBTableBody rows={this.props.customerDetails} />
          </MDBTable>
        </div>
      </div>
    );
  }
}

export default CustomerDetails;
