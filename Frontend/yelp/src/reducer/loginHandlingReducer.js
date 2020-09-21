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
    default: {
      return { ...state };
    }
  }
};

export default LoginHandlingReducer;
