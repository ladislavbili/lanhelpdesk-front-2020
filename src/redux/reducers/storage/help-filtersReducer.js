import {STORAGE_SET_HELP_FILTERS, STORAGE_HELP_FILTERS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  filtersActive:false,
  filtersLoaded:false,
  filters:[]
};

export default function storageFiltersReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_FILTERS:{
      return {
        ...state,
        filters: action.filters,
        filtersLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_FILTERS_ACTIVE:
      return {
        ...state,
        filtersActive: true,
      };
    default:
      return state;
  }
}
