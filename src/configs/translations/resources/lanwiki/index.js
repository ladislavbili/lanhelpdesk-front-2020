import {
  testingTranslations
} from 'configs/restAPI';
import tags from './tags';
import folders from './folders';
import pages from './pages';
import general from './general';

const invoices = {
  ...tags,
  ...folders,
  ...pages,
  ...general,
}

if ( testingTranslations ) {
  //compare keys if same throw error
  //get keys of all objects, filter duplicates, throw them in error
  const test = [
  ...Object.keys( tags ),
  ...Object.keys( folders ),
  ...Object.keys( pages ),
  ...Object.keys( general ),
]

  const testResult = test.filter( ( key, index ) => test.findIndex( ( key2 ) => key2 === key ) !== index );
  if ( testResult.length > 0 ) {
    throw new Error( `Some thranslations have duplicate keys: ${testResult.join(', ')}` );
  }
}

export default invoices;