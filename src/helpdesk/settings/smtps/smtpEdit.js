import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Loading from 'components/loading';
import Checkbox from '../../../components/checkbox';
import { toSelArr } from 'helperFunctions';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import {  GET_SMTPS } from './index';

const GET_SMTP = gql`
query smtp($id: Int!) {
  smtp (
    id: $id
  ) {
    id
    title
    order
    def
    host
    port
    username
    password
    rejectUnauthorized
    secure
  }
}
`;

const UPDATE_SMTP = gql`
mutation updateSmtp($id: Int!, $title: String, $order: Int, $def: Boolean, $host: String, $port: Int, $username: String, $password: String, $rejectUnauthorized: Boolean, $secure: Boolean) {
  updateSmtp(
    id: $id,
    title: $title,
    order: $order,
    def: $def,
    host: $host,
    port: $port,
    username: $username,
    password: $password,
    rejectUnauthorized: $rejectUnauthorized,
    secure: $secure,
  ){
    id
    title
    order
    def
    host
    port
    username
  }
}
`;

export const DELETE_SMTP = gql`
mutation deleteSmtp($id: Int!, $newDefId: Int!, $newId: Int!) {
  deleteSmtp(
    id: $id,
    newDefId: $newDefId,
    newId: $newId,
  ){
    id
  }
}
`;

export default function SMTPEdit(props){
  //data
  const { history, match } = props;
  const { data, loading, refetch } = useQuery(GET_SMTP, { variables: {id: parseInt(props.match.params.id)} });
  const [updateSmtp] = useMutation(UPDATE_SMTP);
  const [deleteSmtp, {client}] = useMutation(DELETE_SMTP);
  const allSMTPs = toSelArr(client.readQuery({query: GET_SMTPS}).smtps);
  const filteredSMTPs = allSMTPs.filter( SMTP => SMTP.id !== parseInt(match.params.id) );
  const theOnlyOneLeft = allSMTPs.length === 0;

  //state
  const [ title, setTitle ] = React.useState("");
  const [ order, setOrder ] = React.useState(0);
  const [ def, setDef ] = React.useState(false);
  const [ host, setHost ] = React.useState("");
  const [ port, setPort ] = React.useState(465);
  const [ username, setUsername ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ rejectUnauthorized, setRejectUnauthorized ] = React.useState(false);
  const [ secure, setSecure ] = React.useState(true);

  const [ showPass, setShowPass ] = React.useState(false);

  const [ saving, setSaving ] = React.useState(false);
  const [ newSMTP, setNewSMTP ] = React.useState(null);
  const [ choosingNewSMTP, setChooseingNewSMTP ] = React.useState(false);
  const [ newDefSMTP, setNewDefSMTP ] = React.useState(null);

  // sync
  React.useEffect( () => {
      if (!loading){
        setTitle(data.smtp.title);
        setOrder(data.smtp.order);
        setDef(data.smtp.def);
        setHost(data.smtp.host);
        setPort(data.smtp.port);
        setUsername(data.smtp.username);
        setPassword(data.smtp.password);
        setRejectUnauthorized(data.smtp.rejectUnauthorized);
        setSecure(data.smtp.secure);
      }
  }, [loading]);

  React.useEffect( () => {
      refetch({ variables: {id: parseInt(match.params.id)} });
  }, [match.params.id]);

  // functions
  const updateSMTPFunc = () => {
    setSaving( true );
    updateSmtp({ variables: {
      id: parseInt(match.params.id),
      title,
      order: (order !== '' ? parseInt(order) : 0),
      def,
      host,
      port: (port !== '' ? parseInt(port) : 0),
      username,
      password,
      rejectUnauthorized,
      secure,
    } }).then( ( response ) => {
      const updatedSMTP = {...response.data.updateSmtp};
      if (def){
        client.writeQuery({ query: GET_SMTPS, data: {smtps: [...allSMTPs.map( SMTP => {
          if (SMTP.id === parseInt(match.params.id)) {
            return ({...updatedSMTP, def: true});
          } else {
            return({...SMTP, def: false});
          }
        } ) ] } });
      } else {
        client.writeQuery({ query: GET_SMTPS, data: {smtps: [...allSMTPs.filter( SMTP => SMTP.id !== parseInt(match.params.id) ), updatedSMTP ] } });
      }
    }).catch( (err) => {
      console.log(err.message);
    });

     setSaving( false );
  };

  const deleteSMTPFunc = () => {
    setChooseingNewSMTP(false);

    if(window.confirm("Are you sure?")){
      deleteSmtp({ variables: {
        id: parseInt(match.params.id),
        newDefId: ( newDefSMTP ? parseInt(newDefSMTP.id) : null ),
        newId: ( newSMTP ? parseInt(newSMTP.id) : null ),
      } }).then( ( response ) => {
        if (def) {
          client.writeQuery({ query: GET_SMTPS, data: {smtps: filteredSMTPs.map(smtp => {return {...smtp, def: (smtp.id === parseInt(newDefSMTP.id)) }} )} });
        } else {
          client.writeQuery({ query: GET_SMTPS, data: {smtps: filteredSMTPs} });
        }
        history.push('/helpdesk/settings/smtps/add');
      }).catch( (err) => {
        console.log(err.message);
        console.log(err);
      });
    }
  };

  const cannotSave = saving || title === '' ||  host === '' || port === '' || username === '';

  if (loading) {
    return <Loading />
  }

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
              <i className={"mt-auto mb-auto "+ ( !showPass ?' fa fa-eye':'fa fa-eye-slash') }/>
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

      <Modal isOpen={choosingNewSMTP}>
        <ModalHeader>
          Please choose an SMTP to replace this one
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            { def && <Label>A replacement SMTP</Label> }
            <Select
              styles={selectStyle}
              options={filteredSMTPs}
              value={newSMTP}
              onChange={s => setNewSMTP(s)}
              />
          </FormGroup>

          {def &&
            <FormGroup>
              <Label>New default SMTP</Label>
              <Select
                styles={selectStyle}
                options={filteredSMTPs}
                value={newDefSMTP}
                onChange={s => setNewDefSMTP(s)}
                />
            </FormGroup>
          }
        </ModalBody>
        <ModalFooter>
          <Button className="btn-link mr-auto"onClick={() => setChooseingNewSMTP(false)}>
            Cancel
          </Button>
          <Button className="btn ml-auto" disabled={!newSMTP || (def ? !newDefSMTP : false)} onClick={deleteSMTPFunc}>
            Complete deletion
          </Button>
        </ModalFooter>
      </Modal>

      <div className="row">
          <Button className="btn" disabled={cannotSave} onClick={updateSMTPFunc}>{ saving ? 'Saving SMTP...' : 'Save SMTP' }</Button>
          <Button className="btn-red m-l-5" disabled={saving || theOnlyOneLeft} onClick={ () => setChooseingNewSMTP(true) }>Delete</Button>
      </div>
    </div>
  );
}
