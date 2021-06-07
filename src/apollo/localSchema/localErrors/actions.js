import {
  localErrorsVar,
} from './variables';

export function addLocalError( newValue ) {
  if ( localErrorsVar().length >= 99 ) {
    return;
  }
  localErrorsVar( [ {
    error: newValue,
    apollo: false
  }, ...localErrorsVar() ] );
}

export function clearLocalErrors() {
  localErrorsVar( [] );
}

export function addApolloErrors( newErrors ) {
  localErrorsVar( [ {
    errors: newErrors,
    apollo: true
  }, ...localErrorsVar() ] );
}