import gql from "graphql-tag";

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
  }
}
`;

export const ADD_IMAP = gql `
mutation addImap($title: String!, $order: Int!, $def: Boolean!, $host: String!, $port: Int!, $username: String!, $password: String!, $rejectUnauthorized: Boolean!, $tls: Boolean!) {
  addImap(
    title: $title,
    order: $order,
    def: $def,
    host: $host,
    port: $port,
    username: $username,
    password: $password,
    rejectUnauthorized: $rejectUnauthorized,
    tls: $tls,
  ){
    id
    title
    order
    def
    host
    port
    username
  }
}
`;

export const GET_IMAP = gql `
query imap($id: Int!) {
  imap (
    id: $id
  ) {
    id
    title
    order
    def
    host
    port
    username
    password
    rejectUnauthorized
    tls
  }
}
`;

export const UPDATE_IMAP = gql `
mutation updateImap($id: Int!, $title: String!, $order: Int!, $def: Boolean!, $host: String!, $port: Int!, $username: String!, $password: String!, $rejectUnauthorized: Boolean!, $tls: Boolean!) {
  updateImap(
    id: $id,
    title: $title,
    order: $order,
    def: $def,
    host: $host,
    port: $port,
    username: $username,
    password: $password,
    rejectUnauthorized: $rejectUnauthorized,
    tls: $tls,
  ){
    id
    title
    order
    def
    host
    port
    username
  }
}
`;

export const DELETE_IMAP = gql `
mutation deleteImap($id: Int!, $newDefId: Int!, $newId: Int!) {
  deleteImap(
    id: $id,
    newDefId: $newDefId,
    newId: $newId,
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