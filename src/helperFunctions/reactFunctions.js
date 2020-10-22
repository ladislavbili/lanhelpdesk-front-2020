import React from 'react';

export const fromObjectToState = ( object ) => {
  let result = {};
  Object.keys( object ).forEach( ( key ) => {
    let value = object[ key ];
    const [ store, setter ] = React.useState( value );
    result[ key ] = store;
    result[ `set${key.charAt(0).toUpperCase() + key.slice(1)}` ] = setter;
  } )
  return result;
}