import {STORAGE_SET_HELP_MILESTONES, STORAGE_HELP_MILESTONES_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  milestonesActive:false,
  milestonesLoaded:false,
  milestones:[]
};

export default function storageHelpMilestonesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_MILESTONES:{
      return {
        ...state,
        milestones: action.milestones,
        milestonesLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_MILESTONES_ACTIVE:
      return {
        ...state,
        milestonesActive: true,
      };
    default:
      return state;
  }
}
