const defaultState = {
    orderHistory: {
      orderDetails: [],
      filter1: '',
      filter2: '',
      sortOrder: 1,
      PageCount: 0,
      TotalCount: '',
      PageNo: 0,
      custOrder: [],
    },
  };
  
  const OrderHistoryReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-order-history': {
        return {
          ...state,
          orderHistory: { ...state.orderHistory, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default OrderHistoryReducer;
  