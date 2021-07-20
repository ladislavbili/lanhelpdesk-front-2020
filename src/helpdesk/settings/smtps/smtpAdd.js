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
import Select from 'react-select';
import SettingsInput from '../components/settingsInput';
import SettingsHiddenInput from '../components/settingsHiddenInput';
import Checkbox from 'components/checkbox';

import wellKnownOptions from 'configs/constants/wellKnown';
import {
  pickSelectStyle
} from "configs/components/select";
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_SMTPS,
  ADD_SMTP
} from './queries';

export default function SMTPAdd( props ) {
  const {
    history,
    match
  } = props;
  const client = useApolloClient();

  const [ addSmtp ] = useMutation( ADD_SMTP );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order ] = React.useState( 0 );
  const [ def, setDef ] = React.useState( false );
  const [ host, setHost ] = React.useState( "" );
  const [ port, setPort ] = React.useState( 465 );
  const [ username, setUsername ] = React.useState( "" );
  const [ password, setPassword ] = React.useState( "" );
  const [ rejectUnauthorized, setRejectUnauthorized ] = React.useState( false );
  const [ secure, setSecure ] = React.useState( true );

  const [ saving, setSaving ] = React.useState( false );
  const [ wellKnown, setWellKnown ] = React.useState( wellKnownOptions[ 0 ] );

  const wellKnownBlock = wellKnown.id !== null;

  //functions
  const addSMTPFunc = () => {
    setSaving( true );
    addSmtp( {
        variables: {
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          def,
          host,
          port: ( port !== '' ? parseInt( port ) : 465 ),
          username,
          password,
          rejectUnauthorized,
          secure,
          wellKnown: wellKnown.value
        }
      } )
      .then( ( response ) => {
        const allSMTPs = client.readQuery( {
            query: GET_SMTPS
          } )
          .smtps;
        const newSMTP = {
          ...response.data.addSmtp,
          __typename: "Smtp"
        };
        client.writeQuery( {
          query: GET_SMTPS,
          data: {
            smtps: [ ...allSMTPs.filter( SMTP => SMTP.id !== parseInt( match.params.id ) ), newSMTP ]
          }
        } );
        history.push( `/helpdesk/settings/smtps/${newSMTP.id}` )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const cannotSave = () => (
    (
      wellKnownBlock &&
      ( saving || password === '' || username === '' )
    ) ||
    (
      !wellKnownBlock &&
      ( saving || title === '' || host === '' || port === '' || password === '' || username === '' )
    )
  );

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20">
        Add SMTP
      </h2>

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { def }
        onChange={ () => setDef(!def) }
        label = "Default"
        />

      <SettingsInput
        required={!wellKnownBlock}
        label="Title"
        id="title"
        value={title}
        onChange={(e)=> {
          setTitle(e.target.value);
        }}
        />

      <FormGroup>
        <Label>Well known providers - requires only user and password</Label>
        <Select
          styles={pickSelectStyle()}
          options={wellKnownOptions}
          value={wellKnown}
          onChange={wellKnown => setWellKnown(wellKnown)}
          />
      </FormGroup>

      <SettingsInput
        required={!wellKnownBlock}
        label="Host"
        id="host"
        value={host}
        onChange={(e)=> {
          setHost(e.target.value);
        }}
        />

      <SettingsInput
        required={!wellKnownBlock}
        label="Port"
        id="port"
        value={port}
        onChange={(e)=> {
          setPort(e.target.value);
        }}
        />

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { secure }
        onChange={ () => setSecure(!secure) }
        label = "Secure"
        />

      <SettingsInput
        required
        label="Username"
        id="username"
        value={username}
        onChange={(e)=> {
          setUsername(e.target.value);
        }}
        />

      <SettingsHiddenInput
        required
        label="Password"
        id="password"
        value={password}
        onChange={(e)=> {
          setPassword(e.target.value);
        }}
        />

      <Checkbox
        className="m-b-5 p-l-0"
        value={ rejectUnauthorized }
        onChange={ () => setRejectUnauthorized(!rejectUnauthorized) }
        label="Reject unauthorized"
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
          onClick={addSMTPFunc}
          >
          { saving ? 'Adding...' : 'Add SMTP' }
        </button>
      </div>
    </div>
  );
}