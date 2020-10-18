import React, { Component } from 'react';
// import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import './RegisteredCustomers.css';
import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux';;

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
                      onClick={(event) => this.props.fetchCustomerProfile(event, customer.CustomerID)}
                    >
                      {customer.CustomerName}
                    </a>
                  </td>
                  <td>{customer.Email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
              previousLabel={'prev'}
              nextLabel={'next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.props.regCust.PageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={(e)=> {this.props.handlePageClick(e)}}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { regCust } = state.regCustReducer;
  return {
    regCust: regCust,
  };
};
export default connect(mapStateToProps, null)(RegisteredCustomers);
