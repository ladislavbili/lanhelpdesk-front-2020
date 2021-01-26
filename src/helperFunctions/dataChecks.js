export const isEmail = ( email ) => ( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ).test( email )

export const sameStringForms = ( item1, item2 ) => {
  return JSON.stringify( item1 ) === JSON.stringify( item2 )
}

export const textIncluded = ( source, text ) => {
  return source.toLowerCase().includes( text.toLowerCase() )
}

export const inputError = ( input, type ) => {
  let testFailed = false;
  switch ( type ) {
    case 'text': {
      testFailed = input.length === 0;
      break;
    }
    case 'number': {
      testFailed = isNaN( parseFloat( input ) );
      break;
    }
    case 'color': {
      testFailed = !( input.includes( '#' ) && input.length >= 4 && input.length <= 10 );
      break;
    }
    default: {
      testFailed = true;
    }
  }
  return testFailed ? 'input-error' : '';
}

const compareObjectAttribute = ( newObject, oldObject, attribute ) => {
  switch ( attribute.type ) {
    case "string": {
      return newObject[ attribute.key ] === oldObject[ attribute.key ];
      break;
    }
    case "integer": {
      return parseInt( newObject[ attribute.key ] ) === parseInt( oldObject[ attribute.key ] );
      break;
    }
    case "float": {
      return parseFloat( newObject[ attribute.key ] ) === parseFloat( oldObject[ attribute.key ] );
      break;
    }
    case "object": {
      return parseInt( newObject[ attribute.key ].id ) === parseInt( oldObject[ attribute.key ].id );
      break;
    }
    default:
      return false;
  }
}

export const compareObjectAttributes = ( newObject, oldObject, attributes ) => {
  return attributes.every( attribute => compareObjectAttribute( newObject, oldObject, attribute ) );
}