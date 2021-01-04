import {
  gql
} from "@apollo/client";

export const GET_TASK_SEARCH = gql `
query taskSearch {
  taskSearch @client
}
`;