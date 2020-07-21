import {STORAGE_HELP_TASK_WORK_TRIPS, STORAGE_HELP_TASK_WORK_TRIPS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpTaskWorkTripsStart = () => {
  return (dispatch) => {

    database.collection('help-task_work_trips').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_HELP_TASK_WORK_TRIPS,workTrips:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_TASK_WORK_TRIPS_ACTIVE });
  };
};
