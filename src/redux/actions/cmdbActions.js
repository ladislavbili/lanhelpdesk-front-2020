import {SET_CMDB_ORDER_BY, SET_CMDB_ASCENDING } from '../types';

export const setCMDBOrderBy = (orderBy) => {
  return (dispatch) => {
    dispatch({ type: SET_CMDB_ORDER_BY,orderBy });
  };
};

export const setCMDBAscending = (ascending) => {
  return (dispatch) => {
    dispatch({ type: SET_CMDB_ASCENDING,ascending });
  };
};
