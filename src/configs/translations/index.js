import i18n from "i18next";
import {
  initReactI18next
} from "react-i18next";
import resources from './resources';

function convertToResouce( data ) {
  let resources = {}
  Object.keys( data ).forEach( ( translation ) => {
    let keys = Object.keys( data[ translation ] );
    keys.forEach( ( key ) => {
      if ( !( key in resources ) ) {
        resources[ key ] = {
          [ 'translation' ]: {}
        };
      }
      resources[ key ][ 'translation' ][ translation ] = data[ translation ][ key ];
    } )
  } )
  return resources;
}

export default function initializeTranslations() {
  return i18n
    .use( initReactI18next )
    .init( {
      resources: convertToResouce( resources ),
      lng: "sk",
      fallbackLng: "sk",
      interpolation: {
        escapeValue: false
      }
    } );
}