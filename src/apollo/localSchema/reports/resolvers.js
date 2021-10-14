import {
  reportsStatusActionsVar,
  reportsFromDateVar,
  reportsToDateVar,
  reportsAgentStatusesVar
} from './variables';

export const reportsStatusActions = () => {
  return reportsStatusActionsVar();
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