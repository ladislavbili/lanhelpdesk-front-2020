import {
  reportsChosenStatusesVar,
  reportsFromDateVar,
  reportsToDateVar
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