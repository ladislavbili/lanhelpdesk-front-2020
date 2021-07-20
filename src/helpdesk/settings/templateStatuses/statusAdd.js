import React from 'react';
import {
  useMutation,
  useApolloClient,
} from "@apollo/client";
import classnames from "classnames";

import {
  FormGroup,
  Label,
} from 'reactstrap';
import {
  SketchPicker
} from "react-color";
import Select from 'react-select';
import SettingsInput from '../components/settingsInput';

import {
  pickSelectStyle
} from "configs/components/select";
import {
  actions
} from 'configs/constants/statuses';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_STATUS_TEMPLATES,
  ADD_STATUS_TEMPLATE
} from './queries';

export default function StatusAdd( props ) {
  //data & queries
  const {
    history
  } = props;
  const client = useApolloClient();

  const [ addStatusTemplate ] = useMutation( ADD_STATUS_TEMPLATE );

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
        history.push( `/helpdesk/settings/statuses/${response.data.addStatusTemplate.id}` )
      } )
      .catch( ( err ) => {
        setSaving( false );
        addLocalError( err );
      } );
  }

  const cannotSave = () => {
    return saving || title.length === 0;
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20">
        Add status template
      </h2>

      <SettingsInput
        required
        label="Status name"
        id="title"
        value={title}
        onChange={(e)=> {
          setTitle(e.target.value);
        }}
        />

      <SettingsInput
        label="Icon"
        placeholder="fas fa-arrow-left"
        id="icon"
        value={icon}
        onChange={(e)=> {
          setIcon(e.target.value);
        }}
        />

      <SettingsInput
        label="Order"
        placeholder="Lower means first"
        type="number"
        id="order"
        value={order}
        onChange={(e)=> {
          setOrder(e.target.value);
        }}
        />

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
          onClick={addStatusFunc}
          >
          { saving ? 'Adding...' : 'Add status' }
        </button>

      </div>
    </div>
  );
}