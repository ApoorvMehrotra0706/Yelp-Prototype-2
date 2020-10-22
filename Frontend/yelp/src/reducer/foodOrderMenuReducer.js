const defaultState = {
    menuOrder: {
      FoodMenu: [],
      PageCount: '',
      Total: '',
    },
  };
  
  const foodOrderMenuReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-customer-menu': {
        return {
          ...state,
          menuOrder: { ...state.menuOrder, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default foodOrderMenuReducer;
  