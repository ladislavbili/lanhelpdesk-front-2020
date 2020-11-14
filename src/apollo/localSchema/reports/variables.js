import {
  makeVar
} from "@apollo/client";
import moment from 'moment';

export const reportsChosenStatusesVar = makeVar( [] );
export const reportsFromDateVar = makeVar( moment().startOf( 'month' ) );
export const reportsToDateVar = makeVar( moment().endOf( 'month' ) );