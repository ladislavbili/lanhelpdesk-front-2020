import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Loading from 'components/loading';
import {
  toSelArr
} from 'helperFunctions';
import DeleteReplacement from 'components/deleteReplacement';
import {
  GET_TRIP_TYPES,
  GET_TRIP_TYPE,
  UPDATE_TRIP_TYPE,
  DELETE_TRIP_TYPE,
} from './queries';

export default function TripTypeEdit( props ) {
  // data & queries
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_TRIP_TYPE, {
    variables: {
      id: parseInt( match.params.id )
    },
    fetchPolicy: 'network-only',
  } );
  const [ updateTripType ] = useMutation( UPDATE_TRIP_TYPE );
  const [ deleteTripType, {
    client
  } ] = useMutation( DELETE_TRIP_TYPE );
  const allTripTypes = toSelArr( client.readQuery( {
      query: GET_TRIP_TYPES
    } )
    .tripTypes );
  const filteredTripTypes = allTripTypes.filter( tripType => tripType.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allTripTypes.length < 2;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ saving, setSaving ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setData();
    }
  }, [ loading ] );

  React.useEffect( () => {
    refetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( loading ) {
      return;
    }
    setTitle( data.tripType.title );
    setOrder( data.tripType.order );
    setDataChanged( false );
  }

  const updateTripTypeFunc = () => {
    setSaving( true );

    updateTripType( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
        }
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
    setDataChanged( false );
  };
  const deleteTripTypeFunc = ( replacement ) => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteTripType( {
          variables: {
            id: parseInt( match.params.id ),
            newId: parseInt( replacement.id ),
          }
        } )
        .then( ( response ) => {
          history.push( '/helpdesk/settings/tripTypes/add' );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  };

  if ( loading ) {
    return <Loading />
  }

  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { dataChanged &&
          <div className="message error-message">
            Save changes before leaving!
          </div>
        }
        { !dataChanged &&
          <div className="message success-message">
            Saved
          </div>
        }
      </div>

      <h2 className="p-l-20 m-t-10" >
        Edit trip type
      </h2>

      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <FormGroup>
          <Label for="name">Task type name <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Enter trip type"
            value={title}
            onChange={(e)=> {
              setTitle(e.target.value);
              setDataChanged( true );
            }}
            />
        </FormGroup>
        <FormGroup>
          <Label for="order">Order</Label>
          <Input
            type="number"
            name="order"
            id="order"
            placeholder="Lower means first"
            value={order}
            onChange={(e)=> {
              setOrder(e.target.value);
              setDataChanged( true );
            }}
            />
        </FormGroup>
        <div className="form-buttons-row">
          <button
            className="btn-red"
            disabled={saving || theOnlyOneLeft}
            onClick={() => setDeleteOpen(true)}
            >
            Delete
          </button>
          <button className="btn ml-auto" disabled={saving} onClick={updateTripTypeFunc}>{saving ? 'Saving trip type...' : 'Save trip type'}</button>
        </div>
        <DeleteReplacement
          isOpen={deleteOpen}
          label="trip type"
          options={filteredTripTypes}
          close={()=>setDeleteOpen(false)}
          finishDelete={deleteTripTypeFunc}
          />
      </div>
    </div>

  )
}