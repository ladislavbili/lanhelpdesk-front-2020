import moment from 'moment';

export const timestampToInput = ( timestamp ) => {
  return timestamp !== null && timestamp !== '' && timestamp !== undefined ?
    new Date( timestamp ).toISOString().replace( 'Z', '' ) :
    ''
}

export const inputToTimestamp = ( input ) => {
  return isNaN( new Date( input ).getTime() ) || input === '' ?
    '' :
    ( new Date( input ).getTime() )
}

export const toMillisec = ( number, time ) => {
  switch ( time ) {
    case 'seconds':
      return number * 1000;
    case 'minutes':
      return number * 60 * 1000;
    case 'hours':
      return number * 60 * 60 * 1000;
    case 'days':
      return number * 24 * 60 * 60 * 1000;
    default:
      return number;
  }
}

export const fromMillisec = ( number, time ) => {
  switch ( time ) {
    case 'seconds':
      return +( number / 1000 ).toFixed( 2 );
    case 'minutes':
      return +( number / 60 / 1000 ).toFixed( 2 );
    case 'hours':
      return +( number / 60 / 60 / 1000 ).toFixed( 2 );
    case 'days':
      return +( number / 24 / 60 / 60 / 1000 ).toFixed( 2 );
    default:
      return number;
  }
}

export const getDateClock = ( date ) => {
  return moment( date ).format( 'HH:mm' )
}