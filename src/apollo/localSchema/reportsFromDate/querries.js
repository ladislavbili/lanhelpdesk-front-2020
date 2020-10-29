import {
  gql
} from "@apollo/client";

export const GET_REPORTS_FROM_DATE = gql `
  query reportsFromDate {
    reportsFromDate @client
  }
`;
