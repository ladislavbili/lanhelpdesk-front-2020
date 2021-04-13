import {
  fromVar,
  toVar,
  calendarUserIdVar,
} from './variables';

export function setCalendarUserId( newValue ) {
  calendarUserIdVar( newValue );
}
export function setCalendarTimeRange( {
  from,
  to
} ) {
  fromVar( from );
  toVar( to );
}