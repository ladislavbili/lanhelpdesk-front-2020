import {STORAGE_HELP_CALENDAR_EVENTS, STORAGE_HELP_CALENDAR_EVENTS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  calendarEventsActive:true,
  calendarEventsLoaded:true,
  calendarEvents:[]
};

export default function storageHelpCalendarEventsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_HELP_CALENDAR_EVENTS:{
      return {
        ...state,
        calendarEvents: action.calendarEvents,
        calendarEventsLoaded:true,
      };
    }
    case STORAGE_HELP_CALENDAR_EVENTS_ACTIVE:{
      return {
        ...state,
        calendarEventsActive: true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    default:
      return state;
  }
}
