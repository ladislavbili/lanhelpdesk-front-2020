import {STORAGE_SET_HELP_TASK_CUSTOM_ITEMS, STORAGE_HELP_TASK_CUSTOM_ITEMS_ACTIVE, DELETE_USER_DATA} from '../../types'

const initialState = {
  customItemsActive:false,
  customItemsLoaded:false,
  customItems:[]
};

export default function storageHelpTaskCustomItemsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_TASK_CUSTOM_ITEMS:{
      return {
        ...state,
        customItems: action.customItems,
        customItemsLoaded:true,
      };
    }
    case STORAGE_HELP_TASK_CUSTOM_ITEMS_ACTIVE:
      return {
        ...state,
        customItemsActive: true,
      };
    case DELETE_USER_DATA:
      return initialState;
    default:
      return state;
  }
}
