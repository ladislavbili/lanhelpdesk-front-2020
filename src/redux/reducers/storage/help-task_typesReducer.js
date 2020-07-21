import {STORAGE_SET_HELP_TASK_TYPES, STORAGE_HELP_TASK_TYPES_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  taskTypesActive:false,
  taskTypesLoaded:false,
  taskTypes:[]
};

export default function storageTaskTypesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_TASK_TYPES:{
      return {
        ...state,
        taskTypes: action.taskTypes,
        taskTypesLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_TASK_TYPES_ACTIVE:
      return {
        ...state,
        taskTypesActive: true,
      };
    default:
      return state;
  }
}
