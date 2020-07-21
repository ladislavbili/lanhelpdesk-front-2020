import {SET_TASKS_ORDER_BY, SET_TASKS_ASCENDING, SET_TASKLIST_LAYOUT, SET_CALENDAR_LAYOUT } from '../types';

export const setTasksOrderBy = (orderBy) => {
  return (dispatch) => {
    dispatch({ type: SET_TASKS_ORDER_BY,orderBy });
  };
};

export const setTasksAscending = (ascending) => {
  return (dispatch) => {
    dispatch({ type: SET_TASKS_ASCENDING,ascending });
  };
};

export const setTasklistLayout = (tasklistLayout) => {
  return (dispatch) => {
    dispatch({ type: SET_TASKLIST_LAYOUT, tasklistLayout });
  };
};

export const setCalendarLayout = (calendarLayout) => {
  return (dispatch) => {
    dispatch({ type: SET_CALENDAR_LAYOUT, calendarLayout });
  };
};
