import { updateSnackbarData } from './action-types';

const defaultState = {
  snackbarData: {
    success: '',
    message: '',
  },
};

const snackBarReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateSnackbarData: {
      return {
        ...state,
        snackbarData: { ...state.snackbarData, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default snackBarReducer;
