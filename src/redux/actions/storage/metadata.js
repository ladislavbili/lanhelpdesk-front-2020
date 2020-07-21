import {STORAGE_SET_METADATA, STORAGE_METADATA_ACTIVE } from '../../types';
import {database} from '../../../index.js';


export const storageMetadataStart = () => {
  return (dispatch) => {

    database.collection('metadata').doc('0').onSnapshot(docSnapshot => {
      dispatch({ type: STORAGE_SET_METADATA,metadata:{id:docSnapshot.id,...docSnapshot.data()}});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_METADATA_ACTIVE });
  };
};
