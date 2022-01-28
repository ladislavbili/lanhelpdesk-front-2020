import {
  gql
} from '@apollo/client';

export const GET_CATEGORIES = gql `
query {
  cmdbCategories{
    id
    title
    descriptionLabel
    backupLabel
    monitoringLabel
  }
}
`;

export const GET_CATEGORY = gql `
query cmdbCategory(
  $id: Int!
){
  cmdbCategory (
    id: $id
  ){
    title
    descriptionLabel
    backupLabel
    monitoringLabel
  }
}
`;

export const ADD_CATEGORY = gql `
mutation addCmdbCategory(
  $title: String!
  $descriptionLabel: String!
  $backupLabel: String!
  $monitoringLabel: String!
) {
  addCmdbCategory(
    title: $title
    descriptionLabel: $descriptionLabel
    backupLabel: $backupLabel
    monitoringLabel: $monitoringLabel
  ){
    id
  }
}
`;

export const UPDATE_CATEGORY = gql `
mutation updateCmdbCategory(
  $id: Int!
  $title: String!
  $descriptionLabel: String!
  $backupLabel: String!
  $monitoringLabel: String!
) {
  updateCmdbCategory(
    id: $id
    title: $title
    descriptionLabel: $descriptionLabel
    backupLabel: $backupLabel
    monitoringLabel: $monitoringLabel
  ){
    id
  }
}
`;


export const DELETE_CATEGORY = gql `
mutation deleteCmdbCategory(
  $id: Int!
  $newId: Int
) {
  deleteCmdbCategory(
    id: $id
    newId: $newId
  ){
    id
  }
}
`;

export const CATEGORIES_SUBSCRIPTION = gql `
subscription cmdbCategoriesSubscription {
  cmdbCategoriesSubscription
}
`;