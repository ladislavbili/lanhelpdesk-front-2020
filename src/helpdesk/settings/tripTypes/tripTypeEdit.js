import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input } from 'reactstrap';
import Loading from 'components/loading';

import {  GET_TRIP_TYPES } from './index';

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

export default function TripTypeEdit(props){
  // data & queries
  const { history, match } = props;
  const { data, loading, refetch } = useQuery(GET_TRIP_TYPE, { variables: {id: parseInt(match.params.id)} });
  const [updateTripType, {updateData}] = useMutation(UPDATE_TRIP_TYPE);
  const [deleteTripType, {deleteData, client}] = useMutation(DELETE_TRIP_TYPE);

  //state
  const [ title, setTitle ] = React.useState("");
  const [ order, setOrder ] = React.useState(0);
  const [ saving, setSaving ] = React.useState(false);

 // sync
 React.useEffect( () => {
     if (!loading){
       setTitle(data.tripType.title);
       setOrder(data.tripType.order);
     }
 }, [loading]);

 React.useEffect( () => {
     refetch({ variables: {id: parseInt(match.params.id)} });
 }, [match.params.id]);

 // functions
 const updateTripTypeFunc = () => {
   setSaving( true );

   updateTripType({ variables: {
     id: parseInt(match.params.id),
     title,
     order: (order !== '' ? parseInt(order) : 0),
   } }).then( ( response ) => {
   }).catch( (err) => {
     console.log(err.message);
   });

    setSaving( false );
 };

 const deleteTripTypeFunc = () => {
   if(window.confirm("Are you sure?")){
     deleteTripType({ variables: {
       id: parseInt(match.params.id),
     } }).then( ( response ) => {
       const allTripTypes = client.readQuery({query: GET_TRIP_TYPES}).tripTypes;
       client.writeQuery({ query: GET_TRIP_TYPES, data: {tripTypes: allTripTypes.filter( tripType => tripType.id !== match.params.id,)} });
       history.goBack();
     }).catch( (err) => {
       console.log(err.message);
     });
   }
 };

 if (loading) {
   return <Loading />
 }

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <FormGroup>
          <Label for="name">Task type name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter trip type" value={title} onChange={(e)=>setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="order">Order</Label>
          <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
        </FormGroup>
        <div className="row">
          <Button className="btn" disabled={saving} onClick={updateTripTypeFunc}>{saving ? 'Saving trip type...' : 'Save trip type'}</Button>
          <Button className="btn-red m-l-5"  disabled={saving} onClick={deleteTripTypeFunc}>Delete</Button>
        </div>
    </div>
  )
}
