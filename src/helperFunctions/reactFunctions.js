import React from 'react';

export const fromObjectToState = ( object ) => {
  let result = {};
  Object.keys( object )
    .forEach( ( key ) => {
      let value = object[ key ];
      const [ store, setter ] = React.useState( value );
      result[ key ] = store;
      result[ `set${key.charAt(0).toUpperCase() + key.slice(1)}` ] = setter;
    } )
  return result;
}

export const setDefaultFromObject = ( functions, object ) => {
  Object.keys( object )
    .forEach( ( key ) => {
      const functionKey = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
      if ( functions[ functionKey ] !== undefined ) {
        let value = object[ key ];
        functions[ functionKey ]( value );
      }
    } )
}