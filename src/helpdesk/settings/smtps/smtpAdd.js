import React from 'react';
import {
  useMutation
} from "@apollo/react-hooks";

import {
  Button,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import Checkbox from '../../../components/checkbox';
import Select from 'react-select';
import {
  selectStyle
} from "configs/components/select";

import wellKnownOptions from 'configs/constants/wellKnown';

import {
  GET_SMTPS,
  ADD_SMTP
} from './querries';



export default function SMTPAdd( props ) {
  //data
  const {
    history,
    match
  } = props;
  const [ addSmtp, {
    client
  } ] = useMutation( ADD_SMTP );

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

  const [ showPass, setShowPass ] = React.useState( false );
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
        history.push( '/helpdesk/settings/smtps/' + newSMTP.id )
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
  }

  const cannotSave = (
    ( wellKnownBlock && ( saving || password === '' || username === '' ) ) ||
    ( !wellKnownBlock && ( saving || title === '' || host === '' || port === '' || password === '' || username === '' ) )
  )

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">
      <Checkbox
        className = "m-b-5 p-l-0"
        value = { def }
        onChange={ () => setDef(!def) }
        label = "Default"
        />

      <FormGroup>
        <Label for="name">Title</Label>
        <Input type="text" name="name" id="name" placeholder="Enter title" value={title} onChange={ (e) => setTitle(e.target.value) } />
      </FormGroup>
      <FormGroup>
        <Label>Well known providers - requires only user and password</Label>
        <Select
          styles={selectStyle}
          options={wellKnownOptions}
          value={wellKnown}
          onChange={wellKnown => setWellKnown(wellKnown)}
          />
      </FormGroup>
      <FormGroup>
        <Label for="name">Host</Label>
        <Input type="text" name="name" id="host" placeholder="Enter host" value={host} onChange={ (e) => setHost(e.target.value) } />
      </FormGroup>
      <FormGroup>
        <Label for="name">Port</Label>
        <Input type="number" name="name" id="port" placeholder="Enter port" value={port} onChange={ (e) => setPort(e.target.value) } />
      </FormGroup>
      <Checkbox
        className = "m-b-5 p-l-0"
        value = { secure }
        onChange={ () => setSecure(!secure) }
        label = "Secure"
        />
      <FormGroup>
        <Label for="name">Username</Label>
        <Input type="text" name="name" id="user" placeholder="Enter user" value={username} onChange={ (e) => setUsername(e.target.value) } />
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <InputGroup>
          <Input type={showPass?'text':"password"} className="from-control" placeholder="Enter password" value={password} onChange={ (e) => setPassword(e.target.value) } />
          <InputGroupAddon addonType="append" className="clickable" onClick={ () => setShowPass(!showPass) }>
            <InputGroupText>
              <i className={"mt-auto mb-auto "+ (!showPass ?'fa fa-eye':'fa fa-eye-slash')}/>
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
      <Checkbox
        className = "m-b-5 p-l-0"
        value = { rejectUnauthorized }
        onChange={ () => setRejectUnauthorized(!rejectUnauthorized) }
        label = "Reject unauthorized"
        />

      <Button className="btn" disabled={cannotSave} onClick={addSMTPFunc}>{saving?'Adding...':'Add SMTP'}</Button>
  </div>
  );
}