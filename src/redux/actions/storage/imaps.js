import {STORAGE_IMAPS, STORAGE_IMAPS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageImapsStart = () => {
  return (dispatch) => {

    database.collection('imaps').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_IMAPS,imaps:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_IMAPS_ACTIVE });
  };
};
