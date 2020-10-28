import { gql } from '@apollo/client';;

export const GET_IMAPS = gql `
query {
  imaps {
    title
    id
    order
    host
    port
    def
    username
    currentlyTested
    working
    active
  }
}
`;

export const ADD_IMAP = gql `
mutation addImap($active: Boolean!, $title: String!, $order: Int!, $def: Boolean!, $host: String!, $port: Int!, $username: String!, $password: String!, $rejectUnauthorized: Boolean!, $tls: Boolean!, $destination: String!, $ignoredRecievers: String!, $ignoredRecieversDestination: String!, $projectId: Int!, $roleId: Int!, $companyId: Int!) {
  addImap(
    active: $active,
    title: $title,
    order: $order,
    def: $def,
    host: $host,
    port: $port,
    username: $username,
    password: $password,
    rejectUnauthorized: $rejectUnauthorized,
    tls: $tls,
    destination: $destination,
    ignoredRecievers: $ignoredRecievers,
    ignoredRecieversDestination: $ignoredRecieversDestination,
    projectId: $projectId,
    roleId: $roleId,
    companyId: $companyId,
  ){
    id
    title
    order
    host
    port
    def
    username
    currentlyTested
    working
    active
  }
}
`;

export const GET_IMAP = gql `
query imap($id: Int!) {
  imap (
    id: $id
  ) {
    id
    active
    title
    order
    def
    host
    port
    username
    password
    rejectUnauthorized
    tls
    destination
    ignoredRecievers
    ignoredRecieversDestination
    project{
      id
    }
    role{
      id
    }
    company{
      id
    }
  }
}
`;

export const UPDATE_IMAP = gql `
mutation updateImap($id: Int!, $active: Boolean!, $title: String!, $order: Int!, $def: Boolean!, $host: String!, $port: Int!, $username: String!, $password: String!, $rejectUnauthorized: Boolean!, $tls: Boolean!, $destination: String!, $ignoredRecievers: String!, $ignoredRecieversDestination: String!, $projectId: Int!, $roleId: Int!, $companyId: Int!) {
  updateImap(
    id: $id,
    active: $active,
    title: $title,
    order: $order,
    def: $def,
    host: $host,
    port: $port,
    username: $username,
    password: $password,
    rejectUnauthorized: $rejectUnauthorized,
    tls: $tls,
    destination: $destination,
    ignoredRecievers: $ignoredRecievers,
    ignoredRecieversDestination: $ignoredRecieversDestination,
    projectId: $projectId,
    roleId: $roleId,
    companyId: $companyId,
  ){
    id
    title
    order
    host
    port
    def
    username
    currentlyTested
    working
    active
  }
}
`;

export const DELETE_IMAP = gql `
mutation deleteImap($id: Int!) {
  deleteImap(
    id: $id
  ){
    id
  }
}
`;

export const TEST_IMAP = gql `
mutation testImap($id: Int!) {
  testImap(
    id: $id,
  )
}
`;

export const TEST_IMAPS = gql `
mutation { testImaps }
`;