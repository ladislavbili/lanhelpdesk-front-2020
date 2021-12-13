import {
  testingTranslations
} from 'configs/restAPI';
import errors from './errors';
import login from './login';
import notifications from './notifications';
import accessDenied from './accessDenied';
import deleteReplacement from './deleteReplacement';
import datepickerPopover from './datepickerPopover';

const components = {
  ...errors,
  ...login,
  ...notifications,
  ...accessDenied,
  ...deleteReplacement,
  ...datepickerPopover,
}

if ( testingTranslations ) {
  //compare keys if same throw error
  //get keys of all objects, filter duplicates, throw them in error
  const test = [
    ...Object.keys( errors ),
    ...Object.keys( login ),
    ...Object.keys( notifications ),
    ...Object.keys( accessDenied ),
    ...Object.keys( deleteReplacement ),
    ...Object.keys( datepickerPopover ),
  ]

  const testResult = test.filter( ( key, index ) => test.findIndex( ( key2 ) => key2 === key ) !== index );
  if ( testResult.length > 0 ) {
    throw new Error( `Some thranslations have duplicate keys: ${testResult.join(', ')}` );
  }
}

export default components;