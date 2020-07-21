import {STORAGE_SET_HELP_TAGS, STORAGE_HELP_TAGS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpTagsStart = () => {
  return (dispatch) => {
    
    database.collection('help-tags').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TAGS,tags:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_TAGS_ACTIVE });
  };
};
