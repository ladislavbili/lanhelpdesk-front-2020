import {STORAGE_SET_HELP_PRICES, STORAGE_HELP_PRICES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpPricesStart = () => {
  return (dispatch) => {
    
    database.collection('help-prices').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_PRICES,prices:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_PRICES_ACTIVE });
  };
};
