import {ADD_SHOW_DATA_FILTER,SET_SHOW_DATA_FILTER} from '../types';


export const setShowDataFilter = (filterName,filter) => {
   return (dispatch) => {
     dispatch({ type: SET_SHOW_DATA_FILTER,filterName,filter });
   };
};

export const addShowDataFilter = (filterName,filter) => {
   return (dispatch) => {
     dispatch({ type: ADD_SHOW_DATA_FILTER,filterName,filter });
   };
};
