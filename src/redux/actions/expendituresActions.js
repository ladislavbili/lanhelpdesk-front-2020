import {SET_EXPENDITURES_ORDER_BY, SET_EXPENDITURES_ASCENDING } from '../types';

export const setExpendituresOrderBy = (orderBy) => {
  return (dispatch) => {
    dispatch({ type: SET_EXPENDITURES_ORDER_BY,orderBy });
  };
};

export const setExpendituresAscending = (ascending) => {
  return (dispatch) => {
    dispatch({ type: SET_EXPENDITURES_ASCENDING,ascending });
  };
};
