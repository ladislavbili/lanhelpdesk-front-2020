import {STORAGE_SET_HELP_MILESTONES, STORAGE_HELP_MILESTONES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpMilestonesStart = () => {
  return (dispatch) => {

    database.collection('help-milestones').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_MILESTONES,milestones:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_MILESTONES_ACTIVE });
  };
};
