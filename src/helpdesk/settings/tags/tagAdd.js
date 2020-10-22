import React from 'react';
import {
  useMutation
} from "@apollo/react-hooks";
import {
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  SketchPicker
} from "react-color";

import {
  GET_TAGS,
  ADD_TAG
} from './querries';



export default function TagAdd( props ) {
  //data & queries
  const {
    history
  } = props;
  const [ addTag, {
    client
  } ] = useMutation( ADD_TAG );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ color, setColor ] = React.useState( "#f759f2" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addTagFunc = () => {
    setSaving( true );
    addTag( {
        variables: {
          title,
          color,
          order: ( order !== '' ? parseInt( order ) : 0 ),
        }
      } )
      .then( ( response ) => {
        const allTags = client.readQuery( {
            query: GET_TAGS
          } )
          .tags;
        const newTag = {
          ...response.data.addTag,
          __typename: "Tag"
        };
        client.writeQuery( {
          query: GET_TAGS,
          data: {
            tags: [ ...allTags, newTag ]
          }
        } );
        history.push( '/helpdesk/settings/tags/' + newTag.id )
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
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

        <Button className="btn m-t-5"  disabled={saving} onClick={addTagFunc}>{saving?'Adding...':'Add tag'}</Button>
      </div>
  );
}