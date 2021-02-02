import {
  gql
} from "@apollo/client";

export const GET_IS_LOGGED_IN = gql `
  query isLoggedIn {
    isLoggedIn @client
  }
`;

export const GET_TESTED_TOKEN = gql `
  query testedToken {
    testedToken @client
  }
`;