import {SET_HELP_SIDEBAR_STATE_PROJECT, SET_HELP_SIDEBAR_STATE_MILESTONE, SET_HELP_SIDEBAR_STATE_FILTER } from '../../types'

const initialState = {
  filter:null,
  project:{id:null,title:'Dashboard', label:'Dashboard',value:null},
  milestone:{id:null,title:'Any', label:'Any',value:null},
};

export default function helpSidebarStateReducer(state = initialState, action) {
  switch (action.type) {
    case SET_HELP_SIDEBAR_STATE_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
    case SET_HELP_SIDEBAR_STATE_PROJECT:
      return {
        ...state,
        project: action.project,
      };

    case SET_HELP_SIDEBAR_STATE_MILESTONE:
      return {
        ...state,
        milestone: action.milestone,
      };
    default:
      return state;
  }
}
