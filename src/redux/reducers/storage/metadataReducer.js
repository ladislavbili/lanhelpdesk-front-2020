import {STORAGE_SET_METADATA, STORAGE_METADATA_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  metadataActive:false,
  metadataLoaded:false,
  metadata:null
};

export default function storageMetadataReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_METADATA:{
      return {
        ...state,
        metadata: action.metadata,
        metadataLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_METADATA_ACTIVE:
      return {
        ...state,
        metadataActive: true,
      };
    default:
      return state;
  }
}
