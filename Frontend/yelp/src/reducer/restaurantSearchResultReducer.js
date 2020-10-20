import { updateRestaurantArray } from './action-types';

const defaultState = {
  restaurantArray: {
    restaurantSearchResults: [],
    mapCoordinates:[],
    Count: '',
  },
};
const restaurantSearchResultReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateRestaurantArray: {
      return {
        ...state,
        restaurantArray: { ...state.restaurantArray, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default restaurantSearchResultReducer;
