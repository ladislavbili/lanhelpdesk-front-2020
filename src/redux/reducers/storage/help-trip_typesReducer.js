import {STORAGE_HELP_TRIP_TYPES, STORAGE_HELP_TRIP_TYPES_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  tripTypesActive:false,
  tripTypesLoaded:false,
  tripTypes:[]
};

export default function storageTripTypesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_HELP_TRIP_TYPES:{
      return {
        ...state,
        tripTypes: action.tripTypes,
        tripTypesLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_TRIP_TYPES_ACTIVE:
      return {
        ...state,
        tripTypesActive: true,
      };
    default:
      return state;
  }
}
