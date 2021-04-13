import moment from 'moment';
import {
  makeVar
} from "@apollo/client";

const currentDate = moment();
const weekStart = currentDate.clone().startOf( 'isoWeek' );
const weekEnd = currentDate.clone().endOf( 'isoWeek' );

export const fromVar = makeVar( weekStart.valueOf() );
export const toVar = makeVar( weekEnd.valueOf() );
export const calendarUserIdVar = makeVar( null );