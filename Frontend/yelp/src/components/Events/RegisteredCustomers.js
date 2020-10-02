import React, { Component } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import './RegisteredCustomers.css';

class RegisteredCustomers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          <table id="customers">
            <tbody>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
              </tr>
              {this.props.RegisteredCustomerList.map((customer) => (
                <tr>
                  <td>
                    <a
                      href="#"
                      onClick={(event) => this.props.fetchCustomerProfile(event, customer.ID)}
                    >
                      {customer.cusName}
                    </a>
                  </td>
                  <td>{customer.Email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default RegisteredCustomers;
