import {STORAGE_HELP_INVOICE_ITEMS, STORAGE_HELP_INVOICE_ITEMS_ACTIVE,DELETE_USER_DATA} from '../../types'

const initialState = {
  invoiceItemsActive:false,
  invoiceItemsLoaded:false,
  invoiceItems:[]
};

export default function storageInvoiceItemsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_HELP_INVOICE_ITEMS:{
      return {
        ...state,
        invoiceItems: action.invoiceItems,
        invoiceItemsLoaded:true,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    case STORAGE_HELP_INVOICE_ITEMS_ACTIVE:
      return {
        ...state,
        invoiceItemsActive: true,
      };
    default:
      return state;
  }
}
