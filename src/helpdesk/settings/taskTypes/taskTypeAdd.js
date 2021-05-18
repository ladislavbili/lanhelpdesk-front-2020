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
  ADD_TASK_TYPE,
  GET_TASK_TYPES,
} from './queries';

export default function TaskTypeAdd( props ) {
  //data & queries
  const {
    history
  } = props;
  const [ addTaskType, {
    client
  } ] = useMutation( ADD_TASK_TYPE );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addTaskTypeFunc = () => {
    setSaving( true );
    addTaskType( {
        variables: {
          title: title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
        }
      } )
      .then( ( response ) => {
        history.push( '/helpdesk/settings/taskTypes/' + response.data.addTaskType.id )
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
        Add task type
      </h2>

      <div className="p-20 scroll-visible fit-with-header-and-commandbar">

        <FormGroup>
          <Label for="name">Task type name <span className="warning-big">*</span></Label>
          <Input type="text" name="name" id="name" placeholder="Enter task type name" value={title} onChange={(e)=>setTitle(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="order">Order</Label>
          <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
        </FormGroup>

        <div className="form-buttons-row">
          <button className="btn ml-auto" disabled={cannotSave()} onClick={addTaskTypeFunc}>
            {saving?'Adding...':'Add task type'}
          </button>
        </div>
      </div>
    </div>
  )
}