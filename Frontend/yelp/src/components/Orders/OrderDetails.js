import React, { Component } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          label: 'Food Item',
          field: 'Dishname',
          sort: 'asc',
        },
        {
          label: 'Count',
          field: 'Price',
          sort: 'asc',
        },
        {
          label: 'Price per Unit',
          field: 'Quantity',
          sort: 'asc',
        },
        {
          label: 'Total Price',
          field: 'TotalPrice',
          sort: 'asc',
        },
      ],
    };
  }
  handleClick = () => {
    this.props.toggle();
  };
  render() {
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
            <MDBTableBody rows={this.props.orderDetails} />
          </MDBTable>
        </div>
      </div>
    );
  }
}

export default OrderDetails;
