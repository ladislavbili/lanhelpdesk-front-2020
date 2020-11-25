import {
  gql
} from '@apollo/client';

export const ADD_USER = gql `
mutation registerUser($username: String!, $email: String!, $name: String!, $language: LanguageEnum!, $surname: String!, $password: String!, $receiveNotifications: Boolean, $signature: String, $roleId: Int!, $companyId: Int!) {
  registerUser(
    username: $username,
    email: $email,
    name: $name,
    surname: $surname,
    password: $password,
    receiveNotifications: $receiveNotifications,
    signature: $signature,
    roleId: $roleId,
    companyId: $companyId,
    language: $language,
  ){
    id
    email
    username
    fullName
    role {
      id
      title
    }
    company {
      title
    }
  }
}
`;

export const GET_USERS = gql `
query {
  users{
    id
    email
    username
    role {
      id
      title
    }
    company {
      id
      title
    }
  }
}
`;

export const GET_BASIC_USERS = gql `
query {
  basicUsers{
    id
    email
    username
    fullName
    role {
      level
      id
      title
    }
    company {
      id
      title
    }
  }
}
`;

export const GET_USER = gql `
query user($id: Int!) {
  user (
    id: $id
  ) {
    id
    createdAt
    updatedAt
    active
    username
    email
    name
    surname
    fullName
    receiveNotifications
    signature
    role {
      id
      title
      level
    }
    company {
      id
      title
    }
    language
  }
}
`;

export const UPDATE_USER = gql `
mutation updateUser(
  $id: Int!,
  $username: String,
  $email: String,
  $name: String,
  $surname: String,
  $receiveNotifications: Boolean,
  $signature: String, $roleId: Int,
  $companyId: Int,
  $language: LanguageEnum
  $password: String
  ) {
  updateUser(
    id: $id,
    username: $username,
    email: $email,
    name: $name,
    surname: $surname,
    receiveNotifications: $receiveNotifications,
    signature: $signature,
    roleId: $roleId,
    companyId: $companyId,
    language: $language,
    password: $password
  ){
    id
    email
    username
    role {
      id
      title
    }
    company {
      id
      title
    }
  }
}
`;

export const UPDATE_PROFILE = gql `
mutation updateProfile(
  $username: String,
  $email: String,
  $name: String,
  $surname: String,
  $receiveNotifications: Boolean,
  $signature: String,
  $language: LanguageEnum
  $password: String
  ) {
  updateProfile(
    username: $username,
    email: $email,
    name: $name,
    surname: $surname,
    receiveNotifications: $receiveNotifications,
    signature: $signature,
    language: $language,
    password: $password
  ){
    accessToken
    user {
      id
    }
  }
}
`;

export const DELETE_USER = gql `
mutation deleteUser($id: Int!) {
  deleteUser(
    id: $id,
  ){
    id
  }
}
`;

export const SET_USER_ACTIVE = gql `
mutation setUserActive($id: Int!, $active: Boolean!) {
  setUserActive(
    id: $id,
    active: $active
  ){
    id
  }
}
`;

export const SET_TASKLIST_LAYOUT = gql `
mutation setTasklistLayout($tasklistLayout: Int!) {
  setTasklistLayout(
    tasklistLayout: $tasklistLayout
  ){
    tasklistLayout
  }
}
`;

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    tasklistLayout
    username
    name
    surname
    email
    receiveNotifications
    signature
    language
    role {
      level
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