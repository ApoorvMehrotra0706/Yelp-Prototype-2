const defaultState = {
    orders: {
      orderDetails: [],
      PageCount: '',
      TotalCount: '',
    },
  };
  
  const orderReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-order-field': {
        return {
          ...state,
          orders: { ...state.orders, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default orderReducer;
  