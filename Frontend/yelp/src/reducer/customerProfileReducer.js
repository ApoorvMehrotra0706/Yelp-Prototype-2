const defaultState = {
    customerData: {
        Name: '',
        NickName: '',
        DOB: '',
        City: '',
        State: '',
        Address: '',
        Gender: '',
        streetAddress: '',
        Country: '',
        zip: '',
        Headline: '',
        ILove: '',
        Contact: '',
        Find_Me_In: '',
        YelpingSince: '',
        ImageURL: ' ',
        Website: '',
        Events: [],
        FollowingIDs: [],
    },
  };
  
  const CustommerProfileReduucer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-customer-profile': {
        return {
          ...state,
          customerData: { ...state.customerData, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default CustommerProfileReduucer;
  