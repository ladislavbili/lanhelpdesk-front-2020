import {
  gql
} from '@apollo/client';;

export const GET_STATUSES = gql `
query {
  statuses {
    title
    id
    order
    color
    action
  }
}
`;

export const ADD_STATUS = gql `
mutation addStatus($title: String!, $order: Int!, $icon: String!, $color: String!, $action: StatusAllowedType!) {
  addStatus(
    title: $title,
    order: $order,
    icon: $icon,
    color: $color,
    action: $action,
  ){
    id
    title
    order
  }
}
`;

export const GET_STATUS = gql `
query status($id: Int!) {
  status (
    id: $id
  ) {
    id
    title
    color
    icon
    action
    order
  }
}
`;

export const UPDATE_STATUS = gql `
mutation updateStatus($id: Int!, $title: String!, $order: Int!, $icon: String!, $color: String!, $action: StatusAllowedType!) {
  updateStatus(
    id: $id,
    title: $title,
    color: $color,
    icon: $icon,
    action: $action,
    order: $order,
  ){
    id
    title
    order
  }
}
`;

export const DELETE_STATUS = gql `
mutation deleteStatus($id: Int!, $newId: Int!) {
  deleteStatus(
    id: $id,
    newId: $newId,
  ){
    id
  }
}
`;

export const SET_USER_STATUSES = gql `
mutation setUserStatuses($ids: [Int]!) {
  setUserStatuses(
    ids: $ids
  ){
		id
  }
}
`;