import { getCustomerBasicInfo } from './action-types';

const defaultState = {
  customerContactInfo: {
    EmailID: '',
    NewEmailID: '',
    Contact: '',
    NewContact: '',
  },
};

const customerContactInfoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'customer-contact-info': {
      return {
        ...state,
        customerContactInfo: { ...state.customerContactInfo, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default customerContactInfoReducer;
