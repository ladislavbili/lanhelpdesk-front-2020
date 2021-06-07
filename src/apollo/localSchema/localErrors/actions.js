import {
  localErrorsVar,
} from './variables';

export function addLocalError( newValue ) {
  if ( localErrorsVar().length >= 99 ) {
    return;
  }
  localErrorsVar( [ newValue, ...localErrorsVar() ] );
}

export function clearLocalErrors() {
  localErrorsVar( [] );
}