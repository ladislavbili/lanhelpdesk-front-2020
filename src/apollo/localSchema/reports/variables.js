import {
  makeVar
} from "@apollo/client";
import moment from 'moment';

import {
  reportTypes
} from 'configs/constants/reports';

export const reportsTypeVar = makeVar( reportTypes[ 0 ] );
export const reportsFromDateVar = makeVar( moment().startOf( 'month' ) );
export const reportsToDateVar = makeVar( moment().endOf( 'month' ) );
export const reportsAgentStatusesVar = makeVar( [] );