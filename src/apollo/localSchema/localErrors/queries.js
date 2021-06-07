import {
  gql
} from "@apollo/client";

export const GET_LOCAL_ERRORS = gql `
query localErrors {
  localErrors @client
}
`;