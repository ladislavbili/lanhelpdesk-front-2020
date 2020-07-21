import { SET_HELP_SIDEBAR_STATE_PROJECT, SET_HELP_SIDEBAR_STATE_MILESTONE,SET_HELP_SIDEBAR_STATE_FILTER } from '../../types';

export const setHelpSidebarProject = (project) => {
   return (dispatch) => {
     dispatch({ type: SET_HELP_SIDEBAR_STATE_PROJECT,project });
   };
 };

 export const setHelpSidebarMilestone = (milestone) => {
    return (dispatch) => {
      dispatch({ type: SET_HELP_SIDEBAR_STATE_MILESTONE,milestone });
    };
  };

  export const setHelpSidebarFilter = (filter) => {
     return (dispatch) => {
       dispatch({ type: SET_HELP_SIDEBAR_STATE_FILTER,filter });
     };
   };
