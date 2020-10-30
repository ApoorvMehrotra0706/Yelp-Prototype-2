const defaultState = {
    customerDetails: {
      customer: '',
      popSeen: false,
    },
  };
  
  const customerDetailsReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-customer-details': {
        return {
          ...state,
          customerDetails: { ...state.customerDetails, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default customerDetailsReducer;
  