import {STORAGE_SET_HELP_TASK_CUSTOM_ITEMS, STORAGE_HELP_TASK_CUSTOM_ITEMS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpTaskCustomItemsStart = () => {
  return (dispatch) => {

    database.collection('help-task_custom_items').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TASK_CUSTOM_ITEMS,customItems:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_TASK_CUSTOM_ITEMS_ACTIVE });
  };
};
