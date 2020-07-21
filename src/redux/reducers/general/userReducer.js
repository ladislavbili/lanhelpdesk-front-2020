import { SET_USER_DATA, SET_USER_ID, DELETE_USER_DATA, SET_USER_NOTIFICATIONS, SET_USER_STATUSES } from '../../types'

const initialState = {
  id:null,
  loggedIn:false,
  userData:null,
  notifications:[],
  statuses:[]
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA:{
      return {
        ...state,
        userData: action.userData,
        statuses: action.userData.statuses || state.statuses,
        loggedIn:true
      };
    }
    case SET_USER_ID:{
      return {
        ...state,
        id: action.id
      };
    }
    case SET_USER_NOTIFICATIONS:{
      return {
        ...state,
        notifications:action.notifications,
      };
    }
    case SET_USER_STATUSES:{
      return {
        ...state,
        statuses:action.statuses || [],
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    default:
      return state;
  }
}
