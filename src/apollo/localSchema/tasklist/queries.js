import {
  gql
} from "@apollo/client";

export const GET_LOCAL_TASK_SEARCH = gql `
query localTaskSearch {
  localTaskSearch @client
}
`;

export const GET_GLOBAL_TASK_SEARCH = gql `
query globalTaskSearch {
  globalTaskSearch @client
}
`;

export const GET_LOCAL_TASK_STRING_FILTER = gql `
query localTaskStringFilter {
  localTaskStringFilter @client
}
`;

export const GET_GLOBAL_TASK_STRING_FILTER = gql `
query globalTaskStringFilter {
  globalTaskStringFilter @client
}
`;

export const GET_FILTER_OPEN = gql `
query filterOpen {
  filterOpen @client
}
`;