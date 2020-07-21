import {STORAGE_SET_COMPANIES, STORAGE_COMPANIES_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  companiesActive:false,
  companiesLoaded:false,
  companies:[]
};

export default function storageCompaniesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_COMPANIES:{
      return {
        ...state,
        companies: action.companies,
        companiesLoaded:true,
      };
    }
    case STORAGE_COMPANIES_ACTIVE:
      return {
        ...state,
        companiesActive: true,
      };
    case DELETE_USER_DATA:
      return initialState;
    default:
      return state;
  }
}
