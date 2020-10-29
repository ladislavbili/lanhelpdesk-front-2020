import {
  gql
} from "@apollo/client";

export const GET_REPORTS_CHOSEN_STATUSES = gql `
  query reportsChosenStatuses {
    reportsChosenStatuses @client
  }
`;
