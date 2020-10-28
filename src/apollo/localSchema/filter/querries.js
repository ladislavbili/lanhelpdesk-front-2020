import {
  gql
} from "@apollo/client";

export const GET_FILTER = gql `
  query filter {
    filter @client
  }
`;