import {STORAGE_HELP_INVOICE_ITEMS, STORAGE_HELP_INVOICE_ITEMS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpInvoiceItemsStart = () => {
  return (dispatch) => {

    database.collection('help-invoice_items').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_HELP_INVOICE_ITEMS,invoiceItems:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });
    dispatch({ type: STORAGE_HELP_INVOICE_ITEMS_ACTIVE });
  };
};
