import {STORAGE_SET_HELP_TASK_MATERIALS, STORAGE_SET_HELP_TASK_MATERIALS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpTaskMaterialsStart = () => {
  return (dispatch) => {

    database.collection('help-task_materials').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TASK_MATERIALS,materials:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_SET_HELP_TASK_MATERIALS_ACTIVE });
  };
};
