import {SET_FILTER, SET_SEARCH, SET_PROJECT,SET_COMPANY, SET_MILESTONE} from '../../types'

const initialState = {
  filter: {
    requester:null,
    company:null,
    assigned:null,
    workType:null,
    statusDateFrom: null,
    statusDateTo: null,
    pendingDateFrom: null,
    pendingDateTo: null,
    closeDateFrom: null,
    closeDateTo: null,
    deadlineFrom: null,
    deadlineTo: null,
    oneOf: [],
    updatedAt:(new Date()).getTime()
  },
  search:'',
  project:null,
  milestone:null,
  company:null,
};

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
    case SET_SEARCH:
      return {
        ...state,
        search: action.search,
      };

    case SET_MILESTONE:
      return {
        ...state,
        milestone: action.milestone,
      };
    case SET_PROJECT:
      return {
        ...state,
        project: action.project,
      };
    case SET_COMPANY:
      return {
        ...state,
        company: action.company,
      };
    default:
      return state;
  }
}
