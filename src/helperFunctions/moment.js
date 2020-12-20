import moment from 'moment';

export const toMomentInput = ( unix ) => ( unix !== null && unix !== undefined ) ?
  moment( unix ) :
  null;

export const fromMomentToUnix = ( moment ) => moment !== null ?
  moment.valueOf() :
  null;

export const timestampToString = ( timestamp ) => {
  return moment( parseInt( timestamp ) ).format( 'HH:mm DD.MM.YYYY' );
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