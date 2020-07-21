import {STORAGE_SET_HELP_PROJECTS, STORAGE_HELP_PROJECTS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpProjectsStart = () => {
  return (dispatch) => {

    database.collection('help-projects').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_PROJECTS,projects:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_PROJECTS_ACTIVE });
  };
};
