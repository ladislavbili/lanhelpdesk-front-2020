import moment from 'moment';

export const toMomentInput = ( unix ) => ( unix !== null && unix !== undefined ) ?
  moment( parseInt( unix ) ) :
  null;

export const fromMomentToUnix = ( moment ) => moment !== null ?
  moment.valueOf() :
  null;

export const timestampToString = ( timestamp, trimmed = false ) => {
  if ( trimmed ) {
    return moment( parseInt( timestamp ) ).format( 'H:mm D.M.YYYY' );
  }
  return moment( parseInt( timestamp ) ).format( 'HH:mm DD.MM.YYYY' );
}

export const timeRangeToString = ( fromDate, toDate ) => {
  if ( fromDate && toDate ) {
    return (
      `
      ${
        fromDate.format( 'DD.MM.YYYY' ) === toDate.format( 'DD.MM.YYYY' ) ?
        fromDate.format( 'HH:mm' ) :
        fromDate.format( 'HH:mm DD.MM.YYYY' )
      } -
      ${ toDate.format( 'HH:mm DD.MM.YYYY' ) }
    `
    );
  }
  return `Invalid date`;
}

export const timestampToDate = ( timestamp ) => {
  let date = ( new Date( timestamp ) );
  return date.getDate() + "." + (
    date.getMonth() + 1 ) + "." + date.getFullYear();
}

export const timestampToHoursAndMinutes = ( timestamp ) => {
  let date = ( new Date( timestamp ) );
  return date.getHours() + ":" + (
    date.getMinutes() < 10 ?
    '0' :
    '' ) + date.getMinutes();
}

export const afterNow = ( unix ) => {
  return unix > moment().unix()
}

export const getDayRange = ( date, getDate = false ) => {
  if ( getDate ) {
    return {
      start: date === null ? null : date.startOf( 'day' ),
      end: date === null ? null : date.endOf( 'day' ),
    }
  } else {
    return {
      start: date === null ? null : date.startOf( 'day' ).valueOf(),
      end: date === null ? null : date.endOf( 'day' ).valueOf(),
    }
  }
}