import React, { Component } from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import TripTypeList from './tripTypeList';

export const GET_TRIP_TYPES = gql`
query {
  tripTypes {
    title
    id
    order
  }
}
`;

export default function TripTypeListContainer(props){
  const tripTypesData = useQuery(GET_TRIP_TYPES);
  return (
    <TripTypeList tripTypesData={tripTypesData} {...props}/>
  )
}
