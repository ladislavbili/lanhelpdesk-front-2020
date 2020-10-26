import gql from "graphql-tag";

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

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    role {
      level
    }
  }
}
`;