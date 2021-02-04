import {
  gql
} from "@apollo/client";

export const GET_MY_DATA = gql `
query {
  getMyData{
    role {
      accessRights {
        vykazy
        viewErrors
        publicFilters
        users
        companies
        pausals
        projects
        statuses
        prices
        roles
        taskTypes
        tripTypes
        imaps
        smtps
      }
    }
  }
}
`;