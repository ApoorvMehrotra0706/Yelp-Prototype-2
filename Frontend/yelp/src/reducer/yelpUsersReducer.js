const defaultState = {
    yelpUsers: {
      yelpCustomers: [],
      category: '',
      pageNo: '',
      PageCount: 0,
      TotalCount: 0,
      customer: [],
    },
  };
  
  const YelpUsersReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-yelp-users': {
        return {
          ...state,
          yelpUsers: { ...state.yelpUsers, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default YelpUsersReducer;
  