import {STORAGE_SET_ERROR_MESSAGES, STORAGE_ERROR_MESSAGES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageErrorMessagesStart = () => {
  return (dispatch) => {

    database.collection('error_messages').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_ERROR_MESSAGES,errorMessages:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_ERROR_MESSAGES_ACTIVE });
  };
};
