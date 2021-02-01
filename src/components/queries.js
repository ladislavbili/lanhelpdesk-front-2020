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

export const LOGIN_USER = gql `
mutation loginUser($email: String!, $password: String!) {
  loginUser(
    email: $email,
    password: $password
  ){
    user{
      fullName
      email
      name
      surname
      id
      role {
        id
        accessRights {
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
    },
    accessToken
  }
}
`;

export const LOGOUT_USER = gql `
mutation logoutUser {
  logoutUser
}
`;