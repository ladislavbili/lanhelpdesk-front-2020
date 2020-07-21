import {STORAGE_HELP_SUPPLIERS, STORAGE_HELP_SUPPLIERS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpSuppliersStart = () => {
  return (dispatch) => {

    database.collection('help-suppliers').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_HELP_SUPPLIERS,suppliers:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_SUPPLIERS_ACTIVE });
  };
};
