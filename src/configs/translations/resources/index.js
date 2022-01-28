import {
  testingTranslations
} from 'configs/restAPI';
import components from './components';
import general from './general';
import invoices from './invoices';
import helpdesk from './helpdesk';
import lanwiki from './lanwiki';
import cmdb from './cmdb';

const resources = {
  ...components,
  ...general,
  ...invoices,
  ...helpdesk,
  ...lanwiki,
  ...cmdb,
}

//compare keys if same throw error
//get keys of all objects, filter duplicates, throw them in error
if ( testingTranslations ) {
  const test = [
    ...Object.keys( components ),
    ...Object.keys( general ),
    ...Object.keys( invoices ),
    ...Object.keys( helpdesk ),
    ...Object.keys( lanwiki ),
    ...Object.keys( cmdb ),
  ]
  console.log( test.length );

  const testResult = test.filter( ( key, index ) => test.findIndex( ( key2 ) => key2 === key ) !== index );
  if ( testResult.length > 0 ) {
    throw new Error( `Some thranslations have duplicate keys: ${testResult.join(', ')}` );
  }
}
export default resources;