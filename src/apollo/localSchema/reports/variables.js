import {
  makeVar
} from "@apollo/client";
import moment from 'moment';

import {
  actions
} from 'configs/constants/statuses';

export const reportsStatusActionsVar = makeVar( [ actions.find( ( action ) => action.value === 'CloseDate' ) ] );
export const reportsFromDateVar = makeVar( moment().startOf( 'month' ) );
export const reportsToDateVar = makeVar( moment().endOf( 'month' ) );
export const reportsAgentStatusesVar = makeVar( [] );