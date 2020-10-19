import gql from "graphql-tag";

export const GET_TASK_TYPE = gql `
query taskType($id: Int!) {
  taskType (
    id: $id
  ) {
    id
    title
    order
  }
}
`;

export const UPDATE_TASK_TYPE = gql `
mutation updateTaskType($id: Int!, $title: String, $order: Int) {
  updateTaskType(
    id: $id,
    title: $title,
    order: $order,
  ){
    id
    title
    order
  }
}
`;

export const DELETE_TASK_TYPE = gql `
mutation deleteTaskType($id: Int!, $newId: Int!) {
  deleteTaskType(
    id: $id,
    newId: $newId,
  ){
    id
  }
}
`;

export const ADD_TASK_TYPE = gql `
mutation addTaskType($title: String!, $order: Int) {
  addTaskType(
    title: $title,
    order: $order,
  ){
    id
    title
    order
  }
}
`;

export const GET_TASK_TYPES = gql `
query {
  taskTypes {
    title
    id
    order
  }
}
`;