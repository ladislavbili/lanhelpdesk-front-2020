import {
  gql
} from '@apollo/client';

export const GET_TAGS = gql `
query {
  lanwikiTags {
    id
    title
    color
    order
  }
}
`;

export const GET_TAG = gql `
query lanwikiTag(
  $id: Int!
){
  lanwikiTag (
    id: $id
  ){
    id
    title
    color
    order
    description
  }
}
`;


export const ADD_TAG = gql `
mutation addLanwikiTag(
  $title: String!
  $color: String!
  $order: Int!
  $description: String!
) {
  addLanwikiTag(
    title: $title
    color: $color
    order: $order
    description: $description
  ){
    id
  }
}
`;

export const UPDATE_TAG = gql `
mutation updateLanwikiTag(
  $id: Int!
  $title: String!
  $color: String!
  $order: Int!
  $description: String!
) {
  updateLanwikiTag(
    id: $id
    title: $title
    color: $color
    order: $order
    description: $description
  ){
    id
  }
}
`;


export const DELETE_TAG = gql `
mutation deleteLanwikiTag(
  $id: Int!
) {
  deleteLanwikiTag(
    id: $id
  ){
    id
  }
}
`;

export const TAGS_SUBSCRIPTION = gql `
subscription lanwikiTagSubscription {
  lanwikiTagSubscription
}
`;