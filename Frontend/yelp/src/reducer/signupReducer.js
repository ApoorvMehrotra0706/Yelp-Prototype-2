const defaultState = {
  signup: {
    emailID: '',
    role: '',
    signupStatus: '',
  },
};

const LoginHandlingReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'signup-field-update': {
      return {
        ...state,
        signup: { ...state.signup, ...action.payload },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default LoginHandlingReducer;
