import React from 'react';
import {
  useMutation
} from "@apollo/client";

import {
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

import {
  GET_TRIP_TYPES,
  ADD_TRIP_TYPE,
} from './queries';

export default function TripTypeAdd( props ) {
  //data & queries
  const {
    history
  } = props;
  const [ addTripType, {
    client
  } ] = useMutation( ADD_TRIP_TYPE );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addTripTypeFunc = () => {
    setSaving( true );
    addTripType( {
        variables: {
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
        }
      } )
      .then( ( response ) => {
        const allTripTypes = client.readQuery( {
            query: GET_TRIP_TYPES
          } )
          .tripTypes;
        const newTripType = {
          ...response.data.addTripType,
          __typename: "TripType"
        };
        client.writeQuery( {
          query: GET_TRIP_TYPES,
          data: {
            tripTypes: [ ...allTripTypes, newTripType ]
          }
        } );
        history.push( '/helpdesk/settings/tripTypes/' + newTripType.id )
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
  }

  const cannotSave = () => {
    return saving || title.length === 0;
  }

  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { cannotSave() &&
          <div className="message error-message">
            Fill in all the required information!
          </div>
        }
      </div>

      <h2 className="p-l-20 m-t-10" >
        Add trip type
      </h2>

      <div className="p-20 scroll-visible fit-with-header-and-commandbar">

        <FormGroup>
          <Label for="name">Trip type <span className="warning-big">*</span></Label>
          <Input type="text" name="name" id="name" placeholder="Enter trip type" value={title} onChange={(e)=>setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="order">Order</Label>
          <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
        </FormGroup>
        <div className="form-buttons-row">
          <button className="btn ml-auto" disabled={cannotSave()} onClick={addTripTypeFunc}>
            {saving?'Adding...':'Add trip type'}
          </button>
        </div>
      </div>
    </div>
  )
}