import {
  gql
} from "@apollo/client";

export const GET_REPORTS_TO_DATE = gql `
  query reportsYear {
    reportsYear @client
  }
`;
