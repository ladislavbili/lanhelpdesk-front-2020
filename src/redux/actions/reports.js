import {SET_REPORT_YEAR, SET_REPORT_MONTH, SET_REPORT_FROM, SET_REPORT_TO } from '../types';

export const setReportYear = (year) => {
  return (dispatch) => {
    dispatch({ type: SET_REPORT_YEAR,year  });
  };
};

export const setReportMonth = (month) => {
  return (dispatch) => {
    dispatch({ type: SET_REPORT_MONTH,month  });
  };
};

export const setReportFrom = (from) => {
  return (dispatch) => {
    dispatch({ type: SET_REPORT_FROM,from  });
  };
};

export const setReportTo = (to) => {
  return (dispatch) => {
    dispatch({ type: SET_REPORT_TO,to  });
  };
};
