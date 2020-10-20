import gql from "graphql-tag";

export const GET_SMTPS = gql `
query {
  smtps {
    title
    id
    order
    host
    port
    username
    def
    currentlyTested
    working
  }
}
`;

export const ADD_SMTP = gql `
mutation addSmtp($title: String!, $order: Int!, $def: Boolean!, $host: String!, $port: Int!, $username: String!, $password: String!, $rejectUnauthorized: Boolean!, $secure: Boolean!, $wellKnown: WellKnownEnum) {
  addSmtp(
    title: $title,
    order: $order,
    def: $def,
    host: $host,
    port: $port,
    username: $username,
    password: $password,
    rejectUnauthorized: $rejectUnauthorized,
    secure: $secure,
    wellKnown: $wellKnown
  ){
    id
    title
    order
    def
    host
    port
    username
    password
    rejectUnauthorized
    secure
    working
    currentlyTested
    errorMessage
    wellKnown
  }
}
`;

export const GET_SMTP = gql `
query smtp($id: Int!) {
  smtp (
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
    secure
    working
    currentlyTested
    errorMessage
    wellKnown
  }
}
`;

export const UPDATE_SMTP = gql `
mutation updateSmtp($id: Int!, $title: String, $order: Int, $def: Boolean, $host: String, $port: Int, $username: String, $password: String, $rejectUnauthorized: Boolean, $secure: Boolean, $wellKnown: WellKnownEnum) {
  updateSmtp(
    id: $id,
    title: $title,
    order: $order,
    def: $def,
    host: $host,
    port: $port,
    username: $username,
    password: $password,
    rejectUnauthorized: $rejectUnauthorized,
    secure: $secure,
    wellKnown: $wellKnown
  ){
    id
    title
    order
    def
    host
    port
    username
    password
    rejectUnauthorized
    secure
    working
    currentlyTested
    errorMessage
    wellKnown
  }
}
`;

export const DELETE_SMTP = gql `
mutation deleteSmtp($id: Int!, $newDefId: Int!, $newId: Int!) {
  deleteSmtp(
    id: $id,
    newDefId: $newDefId,
    newId: $newId,
  ){
    id
  }
}
`;

export const TEST_SMTP = gql `
mutation testSmtp($id: Int!) {
  testSmtp(
    id: $id,
  )
}
`;

export const TEST_SMTPS = gql `
mutation { testSmtps }
`;