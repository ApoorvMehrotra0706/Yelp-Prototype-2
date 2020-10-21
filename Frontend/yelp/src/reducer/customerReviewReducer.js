const defaultState = {
    customerReview: {
        review: '',
        rating: '',
    },
  };
  
  const CustommerReviewReduucer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-restaurant-review': {
        return {
          ...state,
          customerReview: { ...state.customerReview, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default CustommerReviewReduucer;
  