import {
  makeVar
} from "@apollo/client";

export const companyVar = makeVar( {
  id: null,
  value: null,
  title: 'allCompanies',
  label: 'allCompanies'
} );
export const categoryVar = makeVar( null );

export const cmdbLocalStringFilterVar = makeVar( {
  title: '',
  active: null,
  category: '',
  company: '',
  ips: '',
} );
export const cmdbGlobalStringFilterVar = makeVar( {
  title: '',
  active: null,
  category: '',
  company: '',
  ips: '',
} );

export const cmdbManualLocalStringFilterVar = makeVar( {
  title: '',
} );
export const cmdbManualGlobalStringFilterVar = makeVar( {
  title: '',
} );