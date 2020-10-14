const defaultState = {
    restaurantData: {
      Name: '',
      Email: '',
      Country: '',
      StateName: '',
      City: '',
      Street: '',
      Zip: '',
      Contact: '',
      Opening_Time: '',
      Closing_Time: '',
      ImageUrl: '',
      CurbsidePickup: '',
      DineIn: '',
      YelpDelivery: '',


    },
  };
  
  const RestaurantDataReduucer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-restaurant-info': {
        return {
          ...state,
          restaurantData: { ...state.restaurantData, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default RestaurantDataReduucer;
  