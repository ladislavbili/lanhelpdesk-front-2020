import {SET_REPORT_YEAR, SET_REPORT_MONTH, SET_REPORT_FROM, SET_REPORT_TO } from '../types';

const months = [{value:1,label:'January'},{value:2,label:'February'},{value:3,label:'March'},{value:4,label:'April'},{value:5,label:'May'},{value:6,label:'June'},
{value:7,label:'July'},{value:8,label:'August'},{value:9,label:'September'},{value:10,label:'October'},{value:11,label:'November'},{value:12,label:'December'}]

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();

const initialState = {
  year:{value:new Date().getFullYear(),label:new Date().getFullYear()},
  month:months.find((month)=>month.value===(new Date()).getMonth()+1),
  from:firstDay,
  to:lastDay,
};

export default function reportReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REPORT_YEAR:{
      return {
        ...state,
        year: action.year,
      };
    }
    case SET_REPORT_MONTH:{
      return {
        ...state,
        month: action.month,
      };
    }
    case SET_REPORT_FROM:{
      return {
        ...state,
        from: action.from,
      };
    }
    case SET_REPORT_TO:{
      return {
        ...state,
        to: action.to,
      };
    }
    default:
      return state;
  }
}
