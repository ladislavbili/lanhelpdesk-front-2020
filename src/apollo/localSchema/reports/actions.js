import {
  reportsTypeVar,
  reportsFromDateVar,
  reportsToDateVar,
  reportsAgentStatusesVar
} from './variables';


export function setReportsType( newValue ) {
  reportsTypeVar( newValue );
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