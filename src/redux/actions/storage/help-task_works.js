import {STORAGE_SET_HELP_TASK_WORKS, STORAGE_SET_HELP_TASK_WORKS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpTaskWorksStart = () => {
  return (dispatch) => {

    database.collection('help-task_works').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TASK_WORKS,taskWorks:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_SET_HELP_TASK_WORKS_ACTIVE });
  };
};
