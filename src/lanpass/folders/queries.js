import {
  gql
} from '@apollo/client';

export const GET_FOLDERS = gql `
  query {
    passFolders{
      id
      title
      order
      myRights {
        read
        write
        manage
      }
    }
  }
`;

export const GET_FOLDER = gql `
  query passFolder(
    $id: Int!
  ){
    passFolder (
      id: $id
    ){
      title
      order
      description
      folderRights{
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

export const GET_PASS_USERS = gql `
  query {
    passUsers {
      id
      email
      fullName
    }
  }
`;


export const ADD_FOLDER = gql `
  mutation addPassFolder(
    $title: String!
    $order: Int!
    $description: String!
    $folderRights: [PassFolderRightInput]!
  ) {
    addPassFolder(
      title: $title
      order: $order
      description: $description
      folderRights: $folderRights
    ){
      id
    }
  }
`;

export const UPDATE_FOLDER = gql `
  mutation updatePassFolder(
    $id: Int!
    $title: String!
    $order: Int!
    $description: String!
    $folderRights: [PassFolderRightInput]!
  ) {
    updatePassFolder(
      title: $title
      order: $order
      description: $description
      folderRights: $folderRights
    ){
      id
    }
  }
`;


export const DELETE_FOLDER = gql `
  mutation deletePassFolder(
    $id: Int!
    $newId: Int
  ) {
    deletePassFolder(
      id: $id
      newId: $newId
    ){
      id
    }
  }
`;

export const FOLDERS_SUBSCRIPTION = gql `
  subscription passFolderSubscription {
    passFolderSubscription
  }
`;
