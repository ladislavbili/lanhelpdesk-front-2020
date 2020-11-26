import {
  reportsChosenStatusesVar,
  reportsFromDateVar,
  reportsToDateVar,
  reportsAgentStatusesVar
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

export const reportsAgentStatuses = () => {
  return reportsAgentStatusesVar();
}