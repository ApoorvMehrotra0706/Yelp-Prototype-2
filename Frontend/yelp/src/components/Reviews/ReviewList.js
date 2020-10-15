import Review from './Review';
import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../config';
import './Reviews.css';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

class ReviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // REVIEWS: [],
      pageNo: '0',
    };
  }
  componentDidMount() {
    console.log('inside Reviews');
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.get(serverUrl + 'restaurant/fetchReview', 
    {  params: { RestaurantID: localStorage.getItem('user_id'), pageNo: this.state.pageNo }, withCredentials: true }).then((response) => {
      console.log('Review  Fetched', response.data);
      let allReviews = response.data[0].map((Review) => {
        return {
          ID: Review._id,
          Rating: Review.Ratings,
          Date: new Date(Review.Date),
          Description: Review.Review,
          CustomerId: Review.CustomerID,
          CustomerName: Review.CustomerName,
          ImageUrl: Review.ImageUrl,

        };
      });

      // this.setState({
      //   REVIEWS: this.state.REVIEWS.concat(allReviews),
      // });
      let payload = {
        reviews: allReviews,
        PageCount: response.data[1]
      };
      this.props.updateReviews(payload);
    });
  }

  handlePageClick = (e) => {
    this.setState({
      pageNo: e.selected,
    })
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.get(serverUrl + 'restaurant/fetchReview', 
    {  params: { RestaurantID: localStorage.getItem('user_id'), pageNo: e.selected }, withCredentials: true }).then((response) => {
      console.log('Review  Fetched', response.data);
      let allReviews = response.data[0].map((Review) => {
        return {
          ID: Review._id,
          Rating: Review.Ratings,
          Date: new Date(Review.Date),
          Description: Review.Review,
          CustomerId: Review.CustomerID,
          CustomerName: Review.CustomerName,
          ImageUrl: Review.ImageUrl,
        };
      });
      let payload = {
        reviews: allReviews,
        PageCount: response.data[1]
      };
      this.props.updateReviews(payload);
    });

  }
  render() {
    return (
      <div>
        <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
          {this.props.review.reviews.map((review) => (
            <Review
              review={review}

              //   }
            />
          ))}
        </ul>
        <ReactPaginate
            previousLabel={'prev'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={this.props.review.PageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateReviews: (payload) => {
      dispatch({
        type: 'update-review-field',
        payload,
      });
    },
  };
};

const mapStateToProps = (state) => {
  const { review } = state.reviewReducer;
  return { 
    review: review,
   };
};


export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);
