import {
  tagVar,
  folderVar,
  lLocalStringFilterVar,
  lGlobalStringFilterVar,
} from './variables';

export function setLSidebarTag( newValue ) {
  tagVar( newValue );
}

export function setLSidebarFolder( newValue ) {
  folderVar( newValue );
}

export function setLGlobalStringFilter() {
  lGlobalStringFilterVar( lLocalStringFilterVar() );
}

export function setLLocalStringFilter( key, value ) {
  lLocalStringFilterVar( {
    ...lLocalStringFilterVar(),
    [ key ]: value,
  } );
}

export function clearLLocalStringFilter() {
  lLocalStringFilterVar( {
    title: '',
    tags: '',
    folder: ''
  } );
}