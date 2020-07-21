import {STORAGE_USERS, STORAGE_USERS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageUsersStart = () => {
  return (dispatch) => {

    database.collection('users').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_USERS,users:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_USERS_ACTIVE });
  };
};
