import {SET_CMDB_ORDER_BY, SET_CMDB_ASCENDING} from '../types'

const initialState = {
  orderBy:'title',
  ascending:true
};

export default function cmdbReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CMDB_ORDER_BY:
      return {
        ...state,
        orderBy: action.orderBy,
      };
    case SET_CMDB_ASCENDING:
      return {
        ...state,
        ascending: action.ascending,
      };
    default:
      return state;
  }
}
