import React from 'react';
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input } from 'reactstrap';

import {  GET_TRIP_TYPES } from './index';

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


export default function TripTypeAdd(props){
  //data & queries
  const { history } = props;
  const [ addTripType, {client} ] = useMutation(ADD_TRIP_TYPE);

  //state
  const [ title, setTitle ] = React.useState("");
  const [ order, setOrder ] = React.useState(0);
  const [ saving, setSaving ] = React.useState(false);

  //functions
  const addTripTypeFunc = () => {
    setSaving( true );
    addTripType({ variables: {
      title,
      order: (order !== '' ? parseInt(order) : 0),
    } }).then( ( response ) => {
      const allTripTypes = client.readQuery({query: GET_TRIP_TYPES}).tripTypes;
      const newTripType = {...response.data.addTripType, __typename: "TripType"};
      client.writeQuery({ query: GET_TRIP_TYPES, data: {tripTypes: [...allTripTypes, newTripType ] } });
      history.push('/helpdesk/settings/tripTypes/' + newTripType.id)
    }).catch( (err) => {
      console.log(err.message);
    });
    setSaving( false );
  }

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">

      <FormGroup>
        <Label for="name">Trip type</Label>
        <Input type="text" name="name" id="name" placeholder="Enter trip type" value={title} onChange={(e)=>setTitle(e.target.value)} />
      </FormGroup>
      <FormGroup>
        <Label for="order">Order</Label>
        <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
      </FormGroup>
      <Button className="btn" disabled={saving} onClick={addTripTypeFunc}>{saving?'Adding...':'Add trip type'}</Button>
  </div>
  )
}
