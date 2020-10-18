const defaultState = {
    newEvent: {
        Name: '',
        Description: '',
        EventDate: null,
        EventStartTime: '00:00:00',
        EventEndTime: '00:00:01',
        Country: null,
        State: null,
        City: null,
        Zip: null,
        Street: '',
        hashtags: '',
    },
  };
  
  const newEventReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-new-event': {
        return {
          ...state,
          newEvent: { ...state.newEvent, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default newEventReducer;
  