import {STORAGE_SET_HELP_WORK_TYPES, STORAGE_HELP_WORK_TYPES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpWorkTypesStart = () => {
  return (dispatch) => {
    
    database.collection('help-work_types').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_WORK_TYPES,workTypes:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_WORK_TYPES_ACTIVE });
  };
};
