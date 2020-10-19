import {
  ADD_SHOW_DATA_FILTER,
  SET_SHOW_DATA_FILTER
} from '../../types'

const initialState = {
  filter: {}
};

export default function showDataReducer( state = initialState, action ) {
  switch ( action.type ) {
    case ADD_SHOW_DATA_FILTER: {
      let newFilter = {
        ...state.filter
      };
      newFilter[ action.filterName ] = action.filter;
      return {
        ...state,
        filter: newFilter,
      }
    };
  case SET_SHOW_DATA_FILTER: {
    let newFilter = {
      ...state.filter
    };
    newFilter[ action.filterName ] = {
      ...newFilter[ action.filterName ],
      ...action.filter
    };
    return {
      ...state,
      filter: newFilter,
    }
  };

  default:
    return state;
  }
}