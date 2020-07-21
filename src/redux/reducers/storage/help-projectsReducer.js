import {STORAGE_SET_HELP_PROJECTS, STORAGE_HELP_PROJECTS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  projectsActive:false,
  projectsLoaded:false,
  projects:[]
};

export default function storageProjectsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_PROJECTS:{
      return {
        ...state,
        projects: action.projects,
        projectsLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_PROJECTS_ACTIVE:
      return {
        ...state,
        projectsActive: true,
      };
    default:
      return state;
  }
}
