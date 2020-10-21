const defaultState = {
    restaurantProfile: {
        ID: '',
        Name: '',
        CurbsidePickup: '',
        DineIn: '',
        YelpDelivery: '',
        ImageUrl: '',
        OpeningTime: '',
        ClosingTime: '',
        ReviewCounts: '',
        AvgRating: '',
    },
  };
  
  const RestaurantProfileReduucer = (state = defaultState, action) => {
    switch (action.type) {
      case 'update-restaurant-info': {
        return {
          ...state,
          restaurantProfile: { ...state.restaurantProfile, ...action.payload },
        };
      }
      default: {
        return { ...state };
      }
    }
  };
  
  export default RestaurantProfileReduucer;
  