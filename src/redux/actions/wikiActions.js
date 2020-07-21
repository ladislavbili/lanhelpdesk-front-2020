import {SET_WIKI_ORDER_BY, SET_WIKI_ASCENDING } from '../types';

export const setWikiOrderBy = (orderBy) => {
  return (dispatch) => {
    dispatch({ type: SET_WIKI_ORDER_BY,orderBy });
  };
};

export const setWikiAscending = (ascending) => {
  return (dispatch) => {
    dispatch({ type: SET_WIKI_ASCENDING,ascending });
  };
};
