import {
  testingTranslations
} from 'configs/restAPI';
import buttons from './buttons';
import forms from './forms';
import general from './general';
import months from './months';
import statuses from './statuses';

const generalResources = {
  ...buttons,
  ...general,
  ...forms,
  ...months,
  ...statuses,
}

if ( testingTranslations ) {
  //compare keys if same throw error
  //get keys of all objects, filter duplicates, throw them in error
  const test = [
  ...Object.keys( buttons ),
  ...Object.keys( general ),
  ...Object.keys( forms ),
  ...Object.keys( months ),
  ...Object.keys( statuses ),
]

  const testResult = test.filter( ( key, index ) => test.findIndex( ( key2 ) => key2 === key ) !== index );
  if ( testResult.length > 0 ) {
    throw new Error( `Some thranslations have duplicate keys: ${testResult.join(', ')}` );
  }
}
export default generalResources;