export const orderArr = ( array, attribute = 'order', order = 1 ) => {
  let arr = [ ...array ];
  return arr.sort( ( a1, a2 ) => (
    ( a1[ attribute ] >= a2[ attribute ] ) ?
    1 * order :
    ( -1 ) * order
  ) );
}

const defaultByAttributes = [ {
  key: 'title',
  asc: true
} ];

export const sortBy = ( originalArray, byAttributes = defaultByAttributes ) => {
  let array = [ ...originalArray ];
  if ( byAttributes.length === 0 ) {
    return array;
  }

  return array.sort( ( item1, item2 ) => {
    const results = byAttributes.map( ( attribute ) => {
      const value = attribute.asc ? 1 : -1;
      if ( item1[ attribute.key ] > item2[ attribute.key ] ) {
        return value;
      }
      if ( item1[ attribute.key ] < item2[ attribute.key ] ) {
        return -1 * value;
      }
      return 0;
    } );
    const result = results.find( ( res ) => res !== 0 );
    return result || 0;
  } );
}

export const arraySelectToString = ( arr ) => {
  return arr.map( a => " " + a ).toString();
}

export const filterUnique = ( array, key = null ) => {
  if ( key === null ) {
    return array.filter( ( item, index ) => array.indexOf( item ) === index );
  } else {
    let keys = array.map( ( item ) => item[ key ] );
    return array.filter( ( item, index ) => keys.indexOf( item[ key ] ) === index );
  }
}

export const splitArrayByFilter = ( array, filter ) => {
  return array.reduce( ( [ p, f ], e ) => ( filter( e ) ? [
    [ ...p, e ], f
  ] : [ p, [ ...f, e ] ] ), [
    [],
    []
  ] );
}

export const updateArrayItem = ( array, item, key = 'id' ) => {
  const index = array.findIndex( ( item2 ) => item2[ key ] === item[ key ] );
  if ( index === -1 ) {
    return array;
  }
  let newArray = [ ...array ];
  newArray[ index ] = item;
  return newArray;
}