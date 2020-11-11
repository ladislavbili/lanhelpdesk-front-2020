export const orderArr = ( array, attribute = 'order', order = 1 ) => {
  let arr = [ ...array ];
  return arr.sort( ( a1, a2 ) => (
    ( a1[ attribute ] >= a2[ attribute ] ) ?
    1 * order :
    ( -1 ) * order
  ) );
}

export const sortBy = ( array, byAttributes = [ 'title' ] ) => {
  if ( byAttributes === [] ) {
    return array;
  }
  return array.sort( ( item1, item2 ) => {
    const results = byAttributes.map( ( attribute ) => {
      if ( item1[ attribute ] > item2[ attribute ] ) {
        return 1;
      }
      if ( item1[ attribute ] < item2[ attribute ] ) {
        return -1;
      }
      return 0;
    } )
    let result = results.find( ( res ) => res !== 0 );
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

export const updateArrayItem = ( array, item ) => {
  const index = array.findIndex( ( item2 ) => item2.id === item.id );
  if ( index === -1 ) {
    return array;
  }
  let newArray = [ ...array ];
  newArray[ index ] = item;
  return newArray;
}