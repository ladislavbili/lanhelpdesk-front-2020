import {
  testingTranslations
} from 'configs/restAPI';
import categories from './categories';
import general from './general';
import items from './items';
import scheme from './scheme';
import manuals from './manuals';

const invoices = {
  ...categories,
  ...general,
  ...items,
  ...scheme,
  ...manuals,
}

if ( testingTranslations ) {
  //compare keys if same throw error
  //get keys of all objects, filter duplicates, throw them in error
  const test = [
  ...Object.keys( categories ),
  ...Object.keys( general ),
  ...Object.keys( items ),
  ...Object.keys( scheme ),
  ...Object.keys( manuals ),
]

  const testResult = test.filter( ( key, index ) => test.findIndex( ( key2 ) => key2 === key ) !== index );
  if ( testResult.length > 0 ) {
    throw new Error( `Some thranslations have duplicate keys: ${testResult.join(', ')}` );
  }
}

export default invoices;