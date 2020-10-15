const defaultState = {
    menuData: {
      APPETIZERS: [],
      BEVERAGES: [],
      MAIN_COURSE: [],
      SALADS: [],
      DESSERTS: [],
      PageCount: '',
    },
  };
  
  const foodMenuReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-menu-items': {
        return {
          ...state,
          menuData: { ...state.menuData, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default foodMenuReducer;
  