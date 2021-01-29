import {
  gql
} from "@apollo/client";

export const GET_MY_DATA = gql `
query {
  getMyData{
    role {
      accessRights {
        viewErrors
        publicFilters
        users
        companies
        pausals
        projects
        statuses
        units
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