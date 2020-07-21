import {SET_LAYOUT } from '../types';

export const setLayout = (layout) => {
  return (dispatch) => {
    dispatch({ type: SET_LAYOUT,layout });
  };
};
