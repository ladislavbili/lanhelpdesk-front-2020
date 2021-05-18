import React from 'react';
import {
  useMutation
} from "@apollo/client";
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  SketchPicker
} from "react-color";
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";
import {
  actions
} from 'configs/constants/statuses';

import {
  GET_STATUS_TEMPLATES,
  ADD_STATUS_TEMPLATE
} from './queries';

export default function StatusAdd( props ) {
  //data & queries
  const {
    history
  } = props;
  const [ addStatusTemplate, {
    client
  } ] = useMutation( ADD_STATUS_TEMPLATE );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ color, setColor ] = React.useState( "#f759f2" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ icon, setIcon ] = React.useState( "fas fa-arrow-left" );
  const [ action, setAction ] = React.useState( actions[ 0 ] );
  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addStatusFunc = () => {
    setSaving( true );
    addStatusTemplate( {
        variables: {
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          icon,
          color,
          action: action.value,
        }
      } )
      .then( ( response ) => {
        setSaving( false );
        history.push( '/helpdesk/settings/statuses/' + response.data.addStatusTemplate.id )
      } )
      .catch( ( err ) => {
        setSaving( false );
        console.log( err.message );
      } );
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

      <div className="scroll-visible p-l-20 p-r-20 p-b-20 p-t-10 fit-with-header-and-commandbar">

        <h2 className="m-b-20">
          Add status
        </h2>

        <FormGroup>
          <Label for="name">Status name <span className="warning-big">*</span></Label>
          <Input type="text" name="name" id="name" placeholder="Enter status name" value={title} onChange={(e)=>setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="icon">Icon</Label>
          <Input type="text" name="icon" id="icon" placeholder="fas fa-arrow-left" value={icon} onChange={(e)=>setIcon(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="order">Order</Label>
          <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="actionIfSelected">Action if selected</Label>
          <Select
            id="actionIfSelected"
            name="Action"
            styles={pickSelectStyle()}
            options={actions}
            value={action}
            onChange={e => setAction(e) }
            />
        </FormGroup>
        <SketchPicker
          id="color"
          color={color}
          onChangeComplete={value => setColor( value.hex )}
          />
        <div className="form-buttons-row">
          <button className="btn m-t-5 ml-auto" disabled={cannotSave()} onClick={addStatusFunc}>
            {saving?'Adding...':'Add status'}
          </button>
        </div>
      </div>
    </div>
  );
}