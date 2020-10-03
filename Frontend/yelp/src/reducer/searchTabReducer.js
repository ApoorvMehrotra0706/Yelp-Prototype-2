import {
  updateSeprateStrings,
  updateSelectedFilter,
  updateSearchedString,
  updateSearchStrings,
} from './action-types';

const defaultState = {
  searchTabInfo: {
    selectedFilter: '-Select-',
    serchedString: '',
    SearchStrings: [],
    RestaurantNameStrings: [],
    FoodItemsStrings: [],
    CuisinesStrings: [],
    LocationStrings: [],
  },
};
const searchTabReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateSeprateStrings: {
      return {
        ...state,
        searchTabInfo: { ...state.searchTabInfo, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    case updateSelectedFilter: {
      return {
        ...state,
        searchTabInfo: { ...state.searchTabInfo, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    case updateSearchedString: {
      return {
        ...state,
        searchTabInfo: { ...state.searchTabInfo, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    case updateSearchStrings: {
      return {
        ...state,
        searchTabInfo: { ...state.searchTabInfo, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default searchTabReducer;
