import {
  gql
} from "@apollo/client";

export const GET_MILESTONE = gql `
  query localMilestone {
    localMilestone @client
  }
`;