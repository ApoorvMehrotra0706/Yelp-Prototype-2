const defaultState = {
    cart: {
      cartDetails: [],
    },
  };
  
  const foodCartReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-cart-details': {
        return {
          ...state,
          cart: { ...state.cart, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default foodCartReducer;
  