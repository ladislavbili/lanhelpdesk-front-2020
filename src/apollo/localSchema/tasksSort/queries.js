import {
  gql
} from "@apollo/client";

export const GET_TASKS_SORT = gql `
query tasksSort {
  tasksSort @client
}
`;