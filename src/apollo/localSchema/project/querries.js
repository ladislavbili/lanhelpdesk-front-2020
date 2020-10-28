import {
  gql
} from "@apollo/client";

export const GET_PROJECT = gql `
query localProject {
  localProject @client
}
`;