const defaultState = {
    staticData: {
      stateNames: [],
      countryNames: [],
      genderNames: [],
    },
  };
  
  const staticDataReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-static-field': {
        return {
          ...state,
          staticData: { ...state.staticData, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default staticDataReducer;
  