import {STORAGE_SET_HELP_WORK_TYPES, STORAGE_HELP_WORK_TYPES_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  workTypesActive:false,
  workTypesLoaded:false,
  workTypes:[]
};

export default function storageWorkTypesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_WORK_TYPES:{
      return {
        ...state,
        workTypes: action.workTypes,
        workTypesLoaded:true,
      };
    }
    case STORAGE_HELP_WORK_TYPES_ACTIVE:
      return {
        ...state,
        workTypesActive: true,
      };
      case DELETE_USER_DATA:
        return initialState;
    default:
      return state;
  }
}
