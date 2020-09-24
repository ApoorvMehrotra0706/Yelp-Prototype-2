const defaultState = {
  login: {
    emailID: '',
    role: '',
    loginStatus: '',
  },
};

const LoginHandlingReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'update-login-field': {
      return {
        ...state,
        login: { ...state.login, ...action.payload },
      };
    }
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
