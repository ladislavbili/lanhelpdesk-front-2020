import { gql } from '@apollo/client';;

export const GET_TAGS = gql `
query {
  tags {
    title
    id
    order
  }
}
`;

export const ADD_TAG = gql `
mutation addTag($title: String!, $color: String, $order: Int) {
  addTag(
    title: $title,
    color: $color,
    order: $order,
  ){
    id
    title
    color
    order
  }
}
`;

export const GET_TAG = gql `
query tag($id: Int!) {
  tag (
    id: $id
  ) {
    id
    title
    color
    order
  }
}
`;

export const UPDATE_TAG = gql `
mutation updateTag($id: Int!, $title: String, $color: String, $order: Int) {
  updateTag(
    id: $id,
    title: $title,
    color: $color,
    order: $order,
  ){
    id
    title
    color
    order
  }
}
`;

export const DELETE_TAG = gql `
mutation deleteTag($id: Int!) {
  deleteTag(
    id: $id,
  ){
    id
  }
}
`;