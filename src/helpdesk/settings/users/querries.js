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
mutation updateUser($id: Int!, $username: String, $email: String, $name: String, $surname: String, $receiveNotifications: Boolean, $signature: String, $roleId: Int, $companyId: Int, $language: LanguageEnum) {
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
  ){
    id
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