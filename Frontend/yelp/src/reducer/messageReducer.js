const defaultState = {
    MessageContent: {
      Message: [],
      NoOfPages: '',
      TotalCount: '',
      PageNo: '',
      MessageBody: [],
      category: 'Messages',
    },
  };
  
  const messageReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-message-flow': {
        return {
          ...state,
          MessageContent: { ...state.MessageContent, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default messageReducer;
  