import {STORAGE_SET_HELP_STATUSES, STORAGE_HELP_STATUSES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpStatusesStart = () => {
  return (dispatch) => {

    database.collection('help-statuses').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_STATUSES,statuses:snapshotToArray(querySnapshot).sort((item1,item2)=>item1.order>item2.order?1:-1)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_STATUSES_ACTIVE });
  };
};
