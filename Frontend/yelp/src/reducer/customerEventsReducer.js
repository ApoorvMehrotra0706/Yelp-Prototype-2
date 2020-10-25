const defaultState = {
    customerEvents: {
        Events: [],
        sortOrder: '',
        filter: -1, 
        PageCount: 0,
        TotalCount: '',
        PageNo: 0,
        RegEvents: [],       
    },
  };
  
  const CustommerEventsReduucer = (state = defaultState, action) => {
    switch (action.type) {
      case 'customer-profile-events': {
        return {
          ...state,
          customerEvents: { ...state.customerEvents, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default CustommerEventsReduucer;
  