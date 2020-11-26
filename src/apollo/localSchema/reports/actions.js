import {
  reportsChosenStatusesVar,
  reportsFromDateVar,
  reportsToDateVar,
  reportsAgentStatusesVar
} from './variables';


export function setReportsChosenStatuses( newValue ) {
  reportsChosenStatusesVar( newValue );
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