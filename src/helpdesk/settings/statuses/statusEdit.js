import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  Button,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import Loading from 'components/loading';
import {
  actions
} from 'configs/constants/statuses';
import {
  SketchPicker
} from "react-color";
import Select from 'react-select';
import {
  selectStyle
} from "configs/components/select";
import {
  toSelArr
} from 'helperFunctions';

import {
  GET_STATUSES
} from './index';

const GET_STATUS = gql `
query status($id: Int!) {
  status (
    id: $id
  ) {
    id
    title
    color
    icon
    action
    order
  }
}
`;

const UPDATE_STATUS = gql `
mutation updateStatus($id: Int!, $title: String!, $order: Int!, $icon: String!, $color: String!, $action: StatusAllowedType!) {
  updateStatus(
    id: $id,
    title: $title,
    color: $color,
    icon: $icon,
    action: $action,
    order: $order,
  ){
    id
    title
    order
  }
}
`;

export const DELETE_STATUS = gql `
mutation deleteStatus($id: Int!, $newId: Int!) {
  deleteStatus(
    id: $id,
    newId: $newId,
  ){
    id
  }
}
`;


export default function StatusEdit( props ) {
  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_STATUS, {
    variables: {
      id: parseInt( props.match.params.id )
    }
  } );
  const [ updateStatus ] = useMutation( UPDATE_STATUS );
  const [ deleteStatus, {
    client
  } ] = useMutation( DELETE_STATUS );
  const allStatuses = toSelArr( client.readQuery( {
      query: GET_STATUSES
    } )
    .statuses );
  const filteredStatuses = allStatuses.filter( status => status.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allStatuses.length === 0;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ color, setColor ] = React.useState( "#f759f2" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ icon, setIcon ] = React.useState( "fas fa-arrow-left" );
  const [ action, setAction ] = React.useState( actions[ 0 ] );
  const [ saving, setSaving ] = React.useState( false );
  const [ choosingNewStatus, setChooseingNewStatus ] = React.useState( false );
  const [ newStatus, setNewStatus ] = React.useState( null );

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setTitle( data.status.title );
      setColor( data.status.color );
      setOrder( data.status.order );
      setIcon( data.status.icon );
      setAction( actions.find( a => a.value === data.status.action ) );
    }
  }, [ loading ] );

  React.useEffect( () => {
    refetch( {
      variables: {
        id: parseInt( match.params.id )
      }
    } );
  }, [ match.params.id ] );

  // functions
  const updateStatusFunc = () => {
    setSaving( true );
    updateStatus( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          icon,
          color,
          action: action.value,
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  };

  const deleteStatusFunc = () => {
    setChooseingNewStatus( false );

    if ( window.confirm( "Are you sure?" ) ) {
      deleteStatus( {
          variables: {
            id: parseInt( match.params.id ),
            newId: newStatus.id,
          }
        } )
        .then( ( response ) => {
          client.writeQuery( {
            query: GET_STATUSES,
            data: {
              statuses: filteredStatuses
            }
          } );
          history.goBack();
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  };

  if ( loading ) {
    return <Loading />
  }

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">
      <FormGroup>
        <Label for="name">Status name</Label>
        <Input type="text" name="name" id="name" placeholder="Enter status name" value={title} onChange={ (e) => setTitle(e.target.value) } />
      </FormGroup>
      <FormGroup>
        <Label for="name">Icon</Label>
        <Input type="text" name="name" id="name" placeholder="fas fa-arrow-left" value={icon} onChange={ (e) => setIcon(e.target.value) } />
      </FormGroup>
      <FormGroup>
        <Label for="order">Order</Label>
        <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={ (e) => setOrder(e.target.value) } />
      </FormGroup>
      <FormGroup>
        <Label for="actionIfSelected">Action if selected</Label>
        <Select
          id="actionIfSelected"
          name="Action"
          styles={selectStyle}
          isDisabled={action.value==='Invoiced'}
          options={action.value==='Invoiced'?actions.concat([{label:'Invoiced (only one needed, but necessary)',value:'invoiced'}]):actions}
          value={action}
          onChange={ e => setAction(e) }
            />
      </FormGroup>
      <SketchPicker
        id="color"
        color={color}
        onChangeComplete={ value => setColor( value.hex ) }
        />

      <div className="row">
        <Button className="btn m-t-5" disabled={saving} onClick={updateStatusFunc}>{saving?'Saving status...':'Save status'}</Button>
        {action.value!=='Invoiced' && <Button className="btn-red m-l-5 m-t-5" disabled={saving || theOnlyOneLeft} onClick={() => setChooseingNewStatus(true)}>Delete</Button>}
      </div>

      <Modal isOpen={choosingNewStatus}>
        <ModalHeader>
          Please choose a status to replace this one
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Select
              styles={selectStyle}
              options={filteredStatuses}
              value={newStatus}
              onChange={s => setNewStatus(s)}
              />
          </FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button className="btn-link mr-auto"onClick={() => setChooseingNewStatus(false)}>
            Cancel
          </Button>
          <Button className="btn ml-auto" disabled={!newStatus} onClick={deleteStatusFunc}>
            Complete deletion
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}