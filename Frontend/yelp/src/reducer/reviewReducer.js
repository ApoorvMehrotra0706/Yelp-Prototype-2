const defaultState = {
    review: {
        reviews: [],
        PageCount: '',
    },
  };
  
  const reviewReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-review-field': {
        return {
          ...state,
          review: { ...state.review, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default reviewReducer;
  