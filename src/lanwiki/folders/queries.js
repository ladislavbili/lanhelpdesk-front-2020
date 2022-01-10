import {
  gql
} from '@apollo/client';

export const GET_FOLDERS = gql `
query lanwikiFolders(
  $archived: Boolean
){
  lanwikiFolders (
    archived: $archived
  ){
    id
    title
    order
    myRights {
      write
      manage
    }
  }
}
`;

export const GET_FOLDER = gql `
query lanwikiFolder(
  $id: Int!
){
  lanwikiFolder (
    id: $id
  ){
    title
    archived
    order
    description
    folderRights{
      active
      read
      write
      manage
      user{
        id
        email
        fullName
      }
    }
  }
}
`;

export const GET_LANWIKI_USERS = gql `
query {
  lanwikiUsers {
    id
    email
    fullName
  }
}
`;


export const ADD_FOLDER = gql `
mutation addLanwikiFolder(
  $title: String!
  $archived: Boolean!
  $order: Int!
  $description: String!
  $folderRights: [LanwikiFolderRightInput]!
) {
  addLanwikiFolder(
    title: $title
    archived: $archived
    order: $order
    description: $description
    folderRights: $folderRights
  ){
    id
  }
}
`;

export const UPDATE_FOLDER = gql `
mutation updateLanwikiFolder(
  $id: Int!
  $title: String!
  $archived: Boolean!
  $order: Int!
  $description: String!
  $folderRights: [LanwikiFolderRightInput]!
) {
  updateLanwikiFolder(
    id: $id
    title: $title
    archived: $archived
    order: $order
    description: $description
    folderRights: $folderRights
  ){
    id
  }
}
`;


export const DELETE_FOLDER = gql `
mutation deleteLanwikiFolder(
  $id: Int!
  $newId: Int
) {
  deleteLanwikiFolder(
    id: $id
    newId: $newId
  ){
    id
  }
}
`;

export const FOLDERS_SUBSCRIPTION = gql `
subscription lanwikiFolderSubscription {
  lanwikiFolderSubscription
}
`;