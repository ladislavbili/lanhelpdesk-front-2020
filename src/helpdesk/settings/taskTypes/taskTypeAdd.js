import React from 'react';
import {
  useMutation,
  useApolloClient,
} from "@apollo/client";
import classnames from "classnames";

import SettingsInput from '../components/settingsInput';

import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  ADD_TASK_TYPE,
  GET_TASK_TYPES,
} from './queries';

export default function TaskTypeAdd( props ) {
  const {
    history
  } = props;
  const client = useApolloClient();

  const [ addTaskType ] = useMutation( ADD_TASK_TYPE );

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
        history.push( `/helpdesk/settings/taskTypes/${response.data.addTaskType.id}` )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const cannotSave = () => {
    return saving || title.length === 0;
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20">
        Add task type
      </h2>

      <SettingsInput
        required
        label="Task type name"
        id="title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        />

      <SettingsInput
        label="Order"
        placeholder="Lower means first"
        id="order"
        value={order}
        onChange={(e) => {
          setOrder(e.target.value);
        }}
        />

      <div className="form-buttons-row">
        { cannotSave() &&
          <div className="message error-message ml-auto m-r-14">
            Fill in all the required information!
          </div>
        }
        <button
          className={classnames(
            "btn",
            {"ml-auto": !cannotSave()}
          )}
          disabled={cannotSave()}
          onClick={addTaskTypeFunc}
          >
          { saving ? 'Adding...' : 'Add task type' }
        </button>
      </div>
    </div>
  )
}