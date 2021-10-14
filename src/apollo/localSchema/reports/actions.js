import {
  reportsStatusActionsVar,
  reportsFromDateVar,
  reportsToDateVar,
  reportsAgentStatusesVar
} from './variables';


export function setReportsStatusActions( newValue ) {
  reportsStatusActionsVar( newValue );
}

export function setReportsFromDate( newValue ) {
  reportsFromDateVar( newValue );
}

export function setReportsToDate( newValue ) {
  reportsToDateVar( newValue );
}

export function setReportsAgentStatuses( newValue ) {
  reportsAgentStatusesVar( newValue );
}