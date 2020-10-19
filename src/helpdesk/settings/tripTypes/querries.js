import gql from "graphql-tag";

export const GET_TRIP_TYPES = gql `
query {
  tripTypes {
    title
    id
    order
  }
}
`;

export const ADD_TRIP_TYPE = gql `
mutation addTripType($title: String!, $order: Int) {
  addTripType(
    title: $title,
    order: $order,
  ){
    id
    title
    order
  }
}
`;

export const GET_TRIP_TYPE = gql `
query tripType($id: Int!) {
  tripType (
    id: $id
  ) {
    id
    title
    order
  }
}
`;

export const UPDATE_TRIP_TYPE = gql `
mutation updateTripType($id: Int!, $title: String, $order: Int) {
  updateTripType(
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

export const DELETE_TRIP_TYPE = gql `
mutation deleteTripType($id: Int!, $newId: Int!) {
  deleteTripType(
    id: $id,
    newId: $newId,
  ){
    id
  }
}
`;