const defaultState = {
    MessageContent: {
      CustomerID: '',
      CustomerName: '',
      CustomerImg: '',
      RestaurantImg: '',
      Message: [],
    },
  };
  
  const firstMessageReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-message': {
        return {
          ...state,
          firstMessage: { ...state.firstMessage, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default firstMessageReducer;
  