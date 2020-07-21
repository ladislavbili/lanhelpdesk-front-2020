import {STORAGE_USERS, STORAGE_USERS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  usersActive:false,
  usersLoaded:false,
  users:[]
};

export default function storageUsersReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_USERS:{
      return {
        ...state,
        users: action.users,
        usersLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_USERS_ACTIVE:
      return {
        ...state,
        usersActive: true,
      };
    default:
      return state;
  }
}
