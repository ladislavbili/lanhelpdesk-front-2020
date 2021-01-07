import {
  gql
} from "@apollo/client";

export const GET_REPORTS_TYPE = gql `
  query reportsType {
    reportsType @client
  }
`;

export const GET_REPORTS_FROM_DATE = gql `
  query reportsFromDate {
    reportsFromDate @client
  }
`;

export const GET_REPORTS_TO_DATE = gql `
  query reportsToDate {
    reportsToDate @client
  }
`;

export const GET_REPORTS_AGENT_STATUSES = gql `
  query reportsAgentStatuses {
    reportsAgentStatuses @client
  }
`;