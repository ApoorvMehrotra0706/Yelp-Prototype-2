const defaultState = {
    MessageReply: {
      Message: '',
    },
  };
  
  const messageReplyReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-reply': {
        return {
          ...state,
          MessageReply: { ...state.MessageReply, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default messageReplyReducer;
  