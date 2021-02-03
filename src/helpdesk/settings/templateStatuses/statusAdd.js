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
  SketchPicker
} from "react-color";
import Select from 'react-select';
import {
  selectStyle
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
        const allStatuses = client.readQuery( {
            query: GET_STATUS_TEMPLATES
          } )
          .statusTemplates;
        const newStatus = {
          ...response.data.addStatusTemplate,
          __typename: "Status"
        };
        client.writeQuery( {
          query: GET_STATUS_TEMPLATES,
          data: {
            statusTemplates: [ ...allStatuses, newStatus ]
          }
        } );
        history.push( '/helpdesk/settings/statuses/' + newStatus.id )
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
        Add status
      </h2>

      <div className="scroll-visible p-20 fit-with-header-and-commandbar">
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
            styles={selectStyle}
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
        <div className="row">
          <Button className="btn m-t-5 ml-auto" disabled={cannotSave()} onClick={addStatusFunc}>
            {saving?'Adding...':'Add status'}
          </Button>
        </div>
      </div>
    </div>
  );
}