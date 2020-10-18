const defaultState = {
    regCust: {
      regCustDetails: [],
      PageCount: '',
      TotalCount: '',
      CustDetails: [],
    },
  };
  
  const regCustReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-reg-customer': {
        return {
          ...state,
          regCust: { ...state.regCust, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default regCustReducer;
  