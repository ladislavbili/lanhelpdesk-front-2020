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
  Input
} from 'reactstrap';
import Loading from 'components/loading';
import {
  SketchPicker
} from "react-color";

import {
  GET_TAGS
} from './index';

const GET_TAG = gql `
query tag($id: Int!) {
  tag (
    id: $id
  ) {
    id
    title
    color
    order
  }
}
`;

const UPDATE_TAG = gql `
mutation updateTag($id: Int!, $title: String, $color: String, $order: Int) {
  updateTag(
    id: $id,
    title: $title,
    color: $color,
    order: $order,
  ){
    id
    title
    color
    order
  }
}
`;

export const DELETE_TAG = gql `
mutation deleteTag($id: Int!) {
  deleteTag(
    id: $id,
  ){
    id
  }
}
`;

export default function TagEdit( props ) {
  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_TAG, {
    variables: {
      id: parseInt( props.match.params.id )
    }
  } );
  const [ updateTag ] = useMutation( UPDATE_TAG );
  const [ deleteTag, {
    client
  } ] = useMutation( DELETE_TAG );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ color, setColor ] = React.useState( "#f759f2" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ saving, setSaving ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setTitle( data.tag.title );
      setColor( data.tag.color );
      setOrder( data.tag.order );
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
  const updateTagFunc = () => {
    setSaving( true );
    updateTag( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          color,
          order: ( order !== '' ? parseInt( order ) : 0 ),
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  };

  const deleteTagFunc = () => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteTag( {
          variables: {
            id: parseInt( match.params.id ),
          }
        } )
        .then( ( response ) => {
          const allTags = client.readQuery( {
              query: GET_TAGS
            } )
            .tags;
          client.writeQuery( {
            query: GET_TAGS,
            data: {
              tags: allTags.filter( tag => tag.id !== parseInt( match.params.id ) )
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
          <Label for="name">Tag name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter tag name" value={title} onChange={ (e) => setTitle(e.target.value) } />
        </FormGroup>

        <FormGroup>
          <Label for="order">Order</Label>
          <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
        </FormGroup>

        <SketchPicker
          id="color"
          color={color}
          onChangeComplete={value => setColor( value.hex )}
          />

        <div className="row">
          <Button className="btn m-t-5"  disabled={saving} onClick={updateTagFunc}>{saving?'Saving tag...':'Save tag'}</Button>
          <Button className="btn-red m-l-5 m-t-5"  disabled={saving} onClick={deleteTagFunc}>Delete</Button>
        </div>
      </div>
  );
}