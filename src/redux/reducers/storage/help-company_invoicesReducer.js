import {STORAGE_SET_HELP_COMPANY_INVOICES, STORAGE_HELP_COMPANY_INVOICES_ACTIVE, DELETE_USER_DATA} from '../../types'

const initialState = {
  companyInvoicesActive:false,
  companyInvoicesLoaded:false,
  companyInvoices:[]
};

export default function storageCompanyInvoicesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_COMPANY_INVOICES:{
      return {
        ...state,
        companyInvoices: action.companyInvoices,
        companyInvoicesLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_COMPANY_INVOICES_ACTIVE:
      return {
        ...state,
        companyInvoicesActive: true,
      };
    default:
      return state;
  }
}
