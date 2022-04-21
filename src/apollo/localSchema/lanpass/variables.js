import {
  makeVar
} from "@apollo/client";

export const folderVar = makeVar( null );
export const pLocalStringFilterVar = makeVar( {
  title: '',
} );
export const pGlobalStringFilterVar = makeVar( {
  title: '',
} );
