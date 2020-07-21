import {STORAGE_SET_HELP_STATUSES, STORAGE_HELP_STATUSES_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  statusesActive:false,
  statusesLoaded:false,
  statuses:[]
};

export default function storageStatusesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_STATUSES:{
      return {
        ...state,
        statuses: action.statuses,
        statusesLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_STATUSES_ACTIVE:
      return {
        ...state,
        statusesActive: true,
      };
    default:
      return state;
  }
}
