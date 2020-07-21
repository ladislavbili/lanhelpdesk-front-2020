import {STORAGE_SET_HELP_TASKS, STORAGE_HELP_TASKS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  tasksActive:false,
  tasksLoaded:false,
  tasks:[]
};

export default function storageTasksReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_TASKS:{
      return {
        ...state,
        tasks: action.tasks,
        tasksLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_TASKS_ACTIVE:
      return {
        ...state,
        tasksActive: true,
      };
    default:
      return state;
  }
}
