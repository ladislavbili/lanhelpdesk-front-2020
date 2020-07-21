import {STORAGE_SET_HELP_COMPANY_INVOICES, STORAGE_HELP_COMPANY_INVOICES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpCompanyInvoicesStart = () => {
  return (dispatch) => {

    database.collection('help-company_invoices').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_COMPANY_INVOICES,companyInvoices:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_COMPANY_INVOICES_ACTIVE });
  };
};
