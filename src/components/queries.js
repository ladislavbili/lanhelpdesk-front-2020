import {
  gql
} from '@apollo/client';

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    tasklistLayout
    name
    surname
    role {
      accessRights {
        viewVykaz
        viewErrors
        publicFilters
        users
        companies
        pausals
        projects
        statuses
        units
        prices
        suppliers
        tags
        invoices
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

export const GET_ERROR_MESSAGES_COUNT = gql `
query {
  errorMessageCount
}
`;

export const LOGOUT_USER = gql `
mutation logoutUser {
  logoutUser
}
`;