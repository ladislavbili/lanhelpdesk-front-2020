import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import TripTypeEdit from './tripTypeEdit';

const GET_TRIP_TYPE = gql`
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

const UPDATE_TRIP_TYPE = gql`
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

export const DELETE_TRIP_TYPE = gql`
mutation deleteTripType($id: Int!) {
  deleteTripType(
    id: $id,
  ){
    id
  }
}
`;

export default function TripTypeEditContainer(props){
  const tripTypeData = useQuery(GET_TRIP_TYPE, { variables: {id: parseInt(props.match.params.id)} });
  const [updateTripType, {updateData}] = useMutation(UPDATE_TRIP_TYPE);
  const [deleteTripType, {deleteData, client}] = useMutation(DELETE_TRIP_TYPE);
  return (
    <TripTypeEdit tripTypeData={tripTypeData} updateTripType={updateTripType} deleteTripType={deleteTripType} client={client} history={props.history} match={props.match} />
  )
}
