import {
  reportsChosenStatusesVar,
  reportsFromDateVar,
  reportsToDateVar
} from './variables';

export const reportsChosenStatuses = () => {
  return reportsChosenStatusesVar();
}

export const reportsFromDate = () => {
  return reportsFromDateVar();
}

export const reportsToDate = () => {
  return reportsToDateVar();
}