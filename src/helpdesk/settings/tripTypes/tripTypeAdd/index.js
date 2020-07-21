import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import TripTypeAdd from './tripTypeAdd';

const ADD_TRIP_TYPE = gql`
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


export default function TripTypeAddContainer(props){
  const [addTripType, {client}] = useMutation(ADD_TRIP_TYPE);
  return (
    <TripTypeAdd addTripType={addTripType} client={client} {...props}/>
  )
}
