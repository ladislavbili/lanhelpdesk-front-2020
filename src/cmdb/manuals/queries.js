import {
  gql
} from '@apollo/client';

export const CMDB_MANUALS = gql `
query cmdbManuals(
  $companyId: Int!
  $order: EnumCMDBManualSort!
  $limit: Int
  $page: Int
  $stringFilter: CMDBManualStringFilterInput
){
  cmdbManuals (
    companyId: $companyId
    order: $order
    limit: $limit
    page: $page
    stringFilter: $stringFilter
  ){
    count
    manuals {
      id
      title
      body
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

export const GET_MANUAL = gql `
query cmdbManual(
  $id: Int!
){
  cmdbManual(
    id: $id
  ){
    id
    title
    body
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
    images{
      id
      filename
      path
      mimetype
      encoding
      size
    }
  }
}
`;

export const ADD_MANUAL = gql `
mutation addCmdbManual(
  $title: String!
  $body: String!
  $companyId: Int!
) {
  addCmdbManual(
    title: $title
    body: $body
    companyId: $companyId
  ){
    id
  }
}
`;

export const UPDATE_MANUAL = gql `
mutation updateCmdbManual(
  $id: Int!
  $title: String!
  $body: String!
  $deletedImages: [Int]
) {
  updateCmdbManual(
    id: $id
    title: $title
    body: $body
    deletedImages: $deletedImages
  ){
    id
  }
}
`;

export const DELETE_MANUAL = gql `
mutation deleteCmdbManual(
  $id: Int!
) {
  deleteCmdbManual(
    id: $id
  ){
    id
  }
}
`;

export const MANUALS_SUBSCRIPTION = gql `
subscription cmdbManualsSubscription(
  $companyId: Int!
) {
  cmdbManualsSubscription(
    companyId: $companyId
  )
}
`;