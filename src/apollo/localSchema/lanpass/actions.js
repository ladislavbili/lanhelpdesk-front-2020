import {
  folderVar,
  pLocalStringFilterVar,
  pGlobalStringFilterVar,
} from './variables';

export function setPSidebarFolder( newValue ) {
  folderVar( newValue );
}

export function setPGlobalStringFilter() {
  pGlobalStringFilterVar( pLocalStringFilterVar() );
}

export function setPLocalStringFilter( key, value ) {
  pLocalStringFilterVar( {
    ...pLocalStringFilterVar(),
    [ key ]: value,
  } );
}

export function clearPLocalStringFilter() {
  pLocalStringFilterVar( {
    title: '',
  } );
}
