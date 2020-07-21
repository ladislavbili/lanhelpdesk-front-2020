import {STORAGE_SET_SMTPS, STORAGE_SMTPS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  smtpsActive:true,
  smtpsLoaded:true,
  smtps:[]
};

export default function storageSmtpsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_SMTPS:{
      return {
        ...state,
        smtps: action.smtps,
        smtpsLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_SMTPS_ACTIVE:
      return {
        ...state,
        smtpsActive: true,
      };
    default:
      return state;
  }
}
