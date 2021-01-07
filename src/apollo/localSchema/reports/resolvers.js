import {
  reportsTypeVar,
  reportsFromDateVar,
  reportsToDateVar,
  reportsAgentStatusesVar
} from './variables';

export const reportsType = () => {
  return reportsTypeVar();
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