import {
  testingTranslations
} from 'configs/restAPI';
import components from './components';
import project from './project';
import settings from './settings';
import task from './task';

const invoices = {
  ...components,
  ...project,
  ...settings,
  ...task,
}

if ( testingTranslations ) {

  //compare keys if same throw error
  //get keys of all objects, filter duplicates, throw them in error
  const test = [
  ...Object.keys( components ),
  ...Object.keys( project ),
  ...Object.keys( settings ),
  ...Object.keys( task ),
]

  const testResult = test.filter( ( key, index ) => test.findIndex( ( key2 ) => key2 === key ) !== index );
  if ( testResult.length > 0 ) {
    throw new Error( `Some thranslations have duplicate keys: ${testResult.join(', ')}` );
  }
}

export default invoices;