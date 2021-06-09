import {
  gql
} from '@apollo/client';

export const ADD_MILESTONE = gql `
mutation addMilestone($title: String!, $order: Int, $description: String!, $startsAt: String, $endsAt: String, $projectId: Int!) {
  addMilestone(
    title: $title,
    order: $order,
    description: $description,
    startsAt: $startsAt,
    endsAt: $endsAt,
    projectId: $projectId
){
  id
  title
  }
}
`;


export const UPDATE_MILESTONE = gql `
mutation updateMilestone($id: Int!, $title: String, $order: Int, $description: String, $startsAt: String, $endsAt: String) {
  updateMilestone(
    id: $id,
    title: $title,
    order: $order,
    description: $description,
    startsAt: $startsAt,
    endsAt: $endsAt
){
  id
  title
  }
}
`;

export const GET_MILESTONE = gql `
query milestone($id: Int!) {
  milestone(
    id: $id
){
  id
  title
  order
  description
  startsAt
  endsAt
  }
}
`;

export const DELETE_MILESTONE = gql `
mutation deleteMilestone($id: Int!) {
  deleteMilestone(
    id: $id
  ){
    id
  }
}
`;