import {STORAGE_SET_HELP_PRICELISTS, STORAGE_HELP_PRICELISTS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpPricelistsStart = () => {
  return (dispatch) => {
    
    database.collection('help-pricelists').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_PRICELISTS,pricelists:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_PRICELISTS_ACTIVE });
  };
};
