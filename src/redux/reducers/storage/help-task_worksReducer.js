import {STORAGE_SET_HELP_TASK_WORKS, STORAGE_SET_HELP_TASK_WORKS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  taskWorksActive:true,
  taskWorksLoaded:true,
  taskWorks:[]
};

export default function storageTaskWorksReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_TASK_WORKS:{
      return {
        ...state,
        taskWorks: action.taskWorks,
        taskWorksLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_SET_HELP_TASK_WORKS_ACTIVE:
      return {
        ...state,
        taskWorksActive: true,
      };
    default:
      return state;
  }
}
