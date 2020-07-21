import {SET_LAYOUT, SET_USER_DATA} from '../../types'

const initialState = {
  layout:0
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LAYOUT:
      return {
        ...state,
        layout: action.layout,
      };
    case SET_USER_DATA:
      return {
        ...state,
        layout: action.userData.generalLayout?action.userData.generalLayout:state.layout,
      };

    default:
      return state;
  }
}
