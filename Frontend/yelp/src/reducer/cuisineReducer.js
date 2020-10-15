const defaultState = {
    cuisine: {
      cuisineNames: [],
      
    },
  };
  
  const cuisineReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-cuisine-field': {
        return {
          ...state,
          cuisine: { ...state.cuisine, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default cuisineReducer;
  