import { STORAGE_SET_ERROR_MESSAGES, STORAGE_ERROR_MESSAGES_ACTIVE, DELETE_USER_DATA } from '../../types'

const initialState = {
  errorMessagesActive: true,
  errorMessagesLoaded: true,
  errorMessages:[]
};

export default function storageErrorMessagesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_ERROR_MESSAGES:{
      return {
        ...state,
        errorMessages: action.errorMessages,
        errorMessagesLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_ERROR_MESSAGES_ACTIVE:
      return {
        ...state,
        errorMessagesActive: true,
      };
    default:
      return state;
  }
}
