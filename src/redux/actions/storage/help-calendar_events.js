import {STORAGE_HELP_CALENDAR_EVENTS, STORAGE_HELP_CALENDAR_EVENTS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpCalendarEventsStart = () => {
  return (dispatch) => {
    database.collection('help-calendar_events').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_HELP_CALENDAR_EVENTS,calendarEvents:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_CALENDAR_EVENTS_ACTIVE });
  };
};
