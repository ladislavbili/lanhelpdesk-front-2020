import {STORAGE_HELP_SUPPLIER_INVOICES, STORAGE_HELP_SUPPLIER_INVOICES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpSupplierInvoicesStart = () => {
  return (dispatch) => {

    database.collection('help-supplier_invoices').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_HELP_SUPPLIER_INVOICES,supplierInvoices:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_SUPPLIER_INVOICES_ACTIVE });
  };
};
