import {SET_EXPENDITURES_ORDER_BY, SET_EXPENDITURES_ASCENDING} from '../types'

const initialState = {
  orderBy:'title',
  ascending:true
};

export default function expenditureReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EXPENDITURES_ORDER_BY:
      return {
        ...state,
        orderBy: action.orderBy,
      };
    case SET_EXPENDITURES_ASCENDING:
      return {
        ...state,
        ascending: action.ascending,
      };
    default:
      return state;
  }
}
