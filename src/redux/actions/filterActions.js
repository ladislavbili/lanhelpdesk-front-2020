import {SET_FILTER, SET_SEARCH, SET_PROJECT,SET_COMPANY, SET_MILESTONE} from '../types';

export const setFilter = (filter) => {
   return (dispatch) => {
     dispatch({ type: SET_FILTER,filter });
   };
 };

export const setSearch = (search) => {
  return (dispatch) => {
    dispatch({ type: SET_SEARCH,search });
  };
};

export const setProject = (project) => {
   return (dispatch) => {
     dispatch({ type: SET_PROJECT,project });
   };
 };

 export const setMilestone = (milestone) => {
    return (dispatch) => {
      dispatch({ type: SET_MILESTONE, milestone });
    };
  };

export const setCompany = (company) => {
  return (dispatch) => {
    dispatch({ type: SET_COMPANY,company });
  };
};
