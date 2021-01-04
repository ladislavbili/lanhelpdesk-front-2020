import {
  gql
} from "@apollo/client";

export const GET_TASKS_ATTRIBUTES_FILTER = gql `
query tasksAttributesFilter {
  tasksAttributesFilter @client
}
`;