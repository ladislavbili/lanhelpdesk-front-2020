import {
  companyVar,
  categoryVar,
  cmdbLocalStringFilterVar,
  cmdbGlobalStringFilterVar,
  cmdbManualLocalStringFilterVar,
  cmdbManualGlobalStringFilterVar,
  cmdbPasswordLocalStringFilterVar,
  cmdbPasswordGlobalStringFilterVar,
} from './variables';

export function setCmdbSidebarCompany( newValue ) {
  companyVar( newValue );
}

export function setCmdbSidebarCategory( newValue ) {
  categoryVar( newValue );
}

export function setCmdbGlobalStringFilter() {
  cmdbGlobalStringFilterVar( cmdbLocalStringFilterVar() );
}

export function setCmdbLocalStringFilter( key, value ) {
  cmdbLocalStringFilterVar( {
    ...cmdbLocalStringFilterVar(),
    [ key ]: value,
  } );
}

export function clearCmdbLocalStringFilter() {
  cmdbLocalStringFilterVar( {
    title: '',
    active: null,
    category: '',
    company: '',
    ips: '',
  } );
}

export function setCmdbManualGlobalStringFilter() {
  cmdbManualGlobalStringFilterVar( cmdbManualLocalStringFilterVar() );
}

export function setCmdbManualLocalStringFilter( key, value ) {
  cmdbManualLocalStringFilterVar( {
    ...cmdbManualLocalStringFilterVar(),
    [ key ]: value,
  } );
}

export function clearCmdbManualLocalStringFilter() {
  cmdbManualLocalStringFilterVar( {
    title: '',
  } );
}

export function setCmdbPasswordGlobalStringFilter() {
  cmdbPasswordGlobalStringFilterVar( cmdbPasswordLocalStringFilterVar() );
}

export function setCmdbPasswordLocalStringFilter( key, value ) {
  cmdbPasswordLocalStringFilterVar( {
    ...cmdbPasswordLocalStringFilterVar(),
    [ key ]: value,
  } );
}

export function clearCmdbPasswordLocalStringFilter() {
  cmdbPasswordLocalStringFilterVar( {
    title: '',
  } );
}