const defaultState = {
  name: {
    Name: '',
  },
};

const NameInfoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'update-name-field': {
      return {
        ...state,
        name: { ...state.Name, ...action.payload },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default NameInfoReducer;
