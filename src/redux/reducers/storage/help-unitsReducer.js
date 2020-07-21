import {STORAGE_SET_HELP_UNITS, STORAGE_HELP_UNITS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  unitsActive:false,
  unitsLoaded:false,
  units:[]
};

export default function storageUnitsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_UNITS:{
      return {
        ...state,
        units: action.units,
        unitsLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_UNITS_ACTIVE:
      return {
        ...state,
        unitsActive: true,
      };
    default:
      return state;
  }
}
