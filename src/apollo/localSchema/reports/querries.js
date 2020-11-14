import {
  gql
} from "@apollo/client";

export const GET_REPORTS_CHOSEN_STATUSES = gql `
  query reportsChosenStatuses {
    reportsChosenStatuses @client
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