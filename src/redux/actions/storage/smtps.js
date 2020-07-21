import {STORAGE_SET_SMTPS, STORAGE_SMTPS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageSmtpsStart = () => {
  return (dispatch) => {

    database.collection('smtps').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_SMTPS,smtps:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_SMTPS_ACTIVE });
  };
};
