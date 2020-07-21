import {STORAGE_HELP_TASK_WORK_TRIPS, STORAGE_HELP_TASK_WORK_TRIPS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  workTripsActive:true,
  workTripsLoaded:true,
  workTrips:[]
};

export default function storageWorkTripsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_HELP_TASK_WORK_TRIPS:{
      return {
        ...state,
        workTrips: action.workTrips,
        workTripsLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_TASK_WORK_TRIPS_ACTIVE:
      return {
        ...state,
        workTripsActive: true,
      };
    default:
      return state;
  }
}
