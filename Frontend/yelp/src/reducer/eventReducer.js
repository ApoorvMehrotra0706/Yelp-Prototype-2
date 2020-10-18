const defaultState = {
    events: {
      eventDetails: [],
      PageCount: '',
      TotalCount: '',
      eventID: '',
    },
  };
  
  const eventReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-events': {
        return {
          ...state,
          events: { ...state.events, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default eventReducer;
  