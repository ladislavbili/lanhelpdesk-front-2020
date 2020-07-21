import {STORAGE_SET_HELP_TASKS, STORAGE_HELP_TASKS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpTasksStart = () => {
  return (dispatch) => {
    
    database.collection('help-tasks').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TASKS,tasks:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_TASKS_ACTIVE });
  };
};
