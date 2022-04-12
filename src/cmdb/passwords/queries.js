import {
  gql
} from '@apollo/client';

export const CMDB_PASSWORDS = gql `
query cmdbPasswords(
  $companyId: Int
  $order: EnumCMDBPasswordSort!
  $limit: Int
  $page: Int
  $stringFilter: CMDBPasswordStringFilterInput
){
  cmdbPasswords (
    companyId: $companyId
    order: $order
    limit: $limit
    page: $page
    stringFilter: $stringFilter
  ){
    count
    passwords {
      id
      title
      login
      password
      url
      expireDate
      createdAt
      createdBy {
        id
        fullName
      }
      updatedAt
      updatedBy {
        id
        fullName
      }
    }
  }
}
`;

export const GET_PASSWORD = gql `
query cmdbPassword(
  $id: Int!
){
  cmdbPassword(
    id: $id
  ){
    id
    title
    login
    password
    url
    expireDate
    note
    createdAt
    createdBy {
      id
      fullName
    }
    updatedAt
    updatedBy {
      id
      fullName
    }
  }
}
`;

export const ADD_PASSWORD = gql `
mutation addCmdbPassword(
  $companyId: Int
  $title: String!
  $login: String!
  $password: String!
  $url: String!
  $expireDate: String
  $note: String!
) {
  addCmdbPassword(
    companyId: $companyId
    title: $title
    login: $login
    password: $password
    url: $url
    expireDate: $expireDate
    note: $note
  ){
    id
  }
}
`;

export const UPDATE_PASSWORD = gql `
mutation updateCmdbPassword(
  $id: Int!
  $title: String!
  $login: String!
  $password: String!
  $url: String!
  $expireDate: String
  $note: String!
) {
  updateCmdbPassword(
    id: $id
    title: $title
    login: $login
    password: $password
    url: $url
    expireDate: $expireDate
    note: $note
  ){
    id
  }
}
`;

export const DELETE_PASSWORD = gql `
mutation deleteCmdbPassword(
  $id: Int!
) {
  deleteCmdbPassword(
    id: $id
  ){
    id
  }
}
`;

export const PASSWORDS_SUBSCRIPTION = gql `
subscription cmdbPasswordsSubscription(
  $companyId: Int
) {
  cmdbPasswordsSubscription(
    companyId: $companyId
  )
}
`;