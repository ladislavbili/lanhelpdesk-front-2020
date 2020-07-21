import {STORAGE_HELP_STORED_ITEMS, STORAGE_HELP_STORED_ITEMS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpStoredItemsStart = () => {
  return (dispatch) => {

    database.collection('help-stored_items').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_HELP_STORED_ITEMS,storedItems:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });
    dispatch({ type: STORAGE_HELP_STORED_ITEMS_ACTIVE });
  };
};
