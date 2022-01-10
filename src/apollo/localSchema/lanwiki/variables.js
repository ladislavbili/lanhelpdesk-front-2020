import {
  makeVar
} from "@apollo/client";

export const tagVar = makeVar( null );
export const folderVar = makeVar( null );
export const lLocalStringFilterVar = makeVar( {
  title: '',
  tags: '',
  folder: ''
} );
export const lGlobalStringFilterVar = makeVar( {
  title: '',
  tags: '',
  folder: ''
} );