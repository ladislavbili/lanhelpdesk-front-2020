import {STORAGE_SET_HELP_UNITS, STORAGE_HELP_UNITS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpUnitsStart = () => {
  return (dispatch) => {
    
    database.collection('help-units').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_UNITS,units:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_UNITS_ACTIVE });
  };
};
