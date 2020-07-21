import {SET_WIKI_ORDER_BY, SET_WIKI_ASCENDING} from '../types'

const initialState = {
  orderBy:'name',
  ascending:true
};

export default function wikiReducer(state = initialState, action) {
  switch (action.type) {
    case SET_WIKI_ORDER_BY:
      return {
        ...state,
        orderBy: action.orderBy,
      };
    case SET_WIKI_ASCENDING:
      return {
        ...state,
        ascending: action.ascending,
      };
    default:
      return state;
  }
}
