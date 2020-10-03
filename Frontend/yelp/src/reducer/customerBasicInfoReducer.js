import { getCustomerBasicInfo } from './action-types';

const defaultState = {
  customerInfo: {
    Name: '',
    Address: '',
    ReviewCount: 0,
    ImageUrl: '',
  },
};

const customerBasicInfoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case getCustomerBasicInfo: {
      return {
        ...state,
        customerInfo: { ...state.customerInfo, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default customerBasicInfoReducer;
