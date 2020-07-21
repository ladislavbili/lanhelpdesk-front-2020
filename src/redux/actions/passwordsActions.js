import {SET_PASSWORDS_ORDER_BY, SET_PASSWORDS_ASCENDING } from '../types';

export const setPasswordsOrderBy = (orderBy) => {
  return (dispatch) => {
    dispatch({ type: SET_PASSWORDS_ORDER_BY,orderBy });
  };
};

export const setPasswordsAscending = (ascending) => {
  return (dispatch) => {
    dispatch({ type: SET_PASSWORDS_ASCENDING,ascending });
  };
};
