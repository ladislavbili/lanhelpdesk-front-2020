import {SET_PASSWORDS_ORDER_BY, SET_PASSWORDS_ASCENDING} from '../types'

const initialState = {
  orderBy:'title',
  ascending:true
};

export default function passReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PASSWORDS_ORDER_BY:
      return {
        ...state,
        orderBy: action.orderBy,
      };
    case SET_PASSWORDS_ASCENDING:
      return {
        ...state,
        ascending: action.ascending,
      };
    default:
      return state;
  }
}
