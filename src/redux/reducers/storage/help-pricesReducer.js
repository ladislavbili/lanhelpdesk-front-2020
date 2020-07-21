import {STORAGE_SET_HELP_PRICES, STORAGE_HELP_PRICES_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  pricesActive:false,
  pricesLoaded:false,
  prices:[]
};

export default function storagePricesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_PRICES:{
      return {
        ...state,
        prices: action.prices,
        pricesLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_PRICES_ACTIVE:
      return {
        ...state,
        pricesActive: true,
      };
    default:
      return state;
  }
}
