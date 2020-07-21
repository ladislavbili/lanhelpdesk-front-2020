import {STORAGE_HELP_TRIP_TYPES, STORAGE_HELP_TRIP_TYPES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpTripTypesStart = () => {
  return (dispatch) => {

    database.collection('help-trip_types').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_HELP_TRIP_TYPES,tripTypes:snapshotToArray(querySnapshot).sort((item1,item2)=>item1.order>item2.order?1:-1)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_TRIP_TYPES_ACTIVE });
  };
};
