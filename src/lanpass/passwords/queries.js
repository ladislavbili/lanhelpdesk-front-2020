import {
  gql
} from '@apollo/client';

export const GET_PASSWORDS = gql `
  query passEntries(
    $folderId: Int
    $order: EnumPassEntrySort!
    $limit: Int
    $page: Int
    $stringFilter: PassEntryStringFilterInput
  ){
    passEntries (
      folderId: $folderId
      order: $order
      limit: $limit
      page: $page
      stringFilter: $stringFilter
    ){
      count
      passwords{
        id
        title
        login
        password
        url
        expireDate
        isPrivate
      }
    }
  }
`;

export const GET_PASSWORD = gql `
  query passEntry(
    $id: Int!
  ){
    passEntry(
      id: $id
    ){
      id
      title
      login
      password
      url
      expireDate
      note
      isPrivate
      createdAt
      createdBy{
        id
        fullName
      }
      updatedAt
      updatedBy{
        id
        fullName
      }
      myRights{
        read
        write
      }
    }
  }
`;

export const ADD_PASSWORD = gql `
  mutation addPassEntry(
    $folderId: Int!
    $title: String!
    $login: String!
    $password: String!
    $url: String
    $expireDate: String
    $note: String
    $isPrivate: Boolean
  ) {
    addPassEntry(
      folderId: $folderId
      title: $title
      login: $login
      password: $password
      url: $url
      expireDate: $expireDate
      note: $note
      isPrivate: $isPrivate
    ){
      id
    }
  }
`;

export const UPDATE_PASSWORD = gql `
  mutation updatePassEntry(
    $id: Int!
    $title: String
    $login: String
    $password: String
    $url: String
    $expireDate: String
    $note: String
    $isPrivate: Boolean
  ) {
    updatePassEntry(
      id: $id
      title: $title
      login: $login
      password: $password
      url: $url
      expireDate: $expireDate
      note: $note
      isPrivate: $isPrivate
    ){
      id
    }
  }
`;

export const DELETE_PASSWORD = gql `
  mutation deletePassEntry(
    $id: Int!
  ) {
    deletePassEntry(
      id: $id
    ){
      id
    }
  }
`;

export const PASSWORDS_SUBSCRIPTION = gql `
  subscription passEntriesSubscription (
    $folderId: Int
  ){
    passEntriesSubscription (
      folderId: $folderId
    )
  }
`;
