import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Loading from 'components/loading';
import Checkbox from '../../../components/checkbox';
import { toSelArr } from 'helperFunctions';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import {  GET_IMAPS } from './index';

const GET_IMAP = gql`
query imap($id: Int!) {
  imap (
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
    tsl
  }
}
`;

const UPDATE_IMAP = gql`
mutation updateImap($id: Int!, $title: String!, $order: Int!, $def: Boolean!, $host: String!, $port: Int!, $username: String!, $password: String!, $rejectUnauthorized: Boolean!, $tsl: Boolean!) {
  updateImap(
    id: $id,
    title: $title,
    order: $order,
    def: $def,
    host: $host,
    port: $port,
    username: $username,
    password: $password,
    rejectUnauthorized: $rejectUnauthorized,
    tsl: $tsl,
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

export const DELETE_IMAP = gql`
mutation deleteImap($id: Int!, $newDefId: Int!, $newId: Int!) {
  deleteImap(
    id: $id,
    newDefId: $newDefId,
    newId: $newId,
  ){
    id
  }
}
`;

export default function IMAPEdit(props){
  //data
  const { history, match } = props;
  const { data, loading, refetch } = useQuery(GET_IMAP, { variables: {id: parseInt(match.params.id)} });
  const [updateImap] = useMutation(UPDATE_IMAP);
  const [deleteImap, {client}] = useMutation(DELETE_IMAP);
  const allIMAPs = toSelArr(client.readQuery({query: GET_IMAPS}).imaps);
  const filteredIMAPs = allIMAPs.filter( IMAP => IMAP.id !== parseInt(match.params.id) );
  const theOnlyOneLeft = allIMAPs.length === 0;

  //state
  const [ title, setTitle ] = React.useState("");
  const [ order, setOrder ] = React.useState(0);
  const [ def, setDef ] = React.useState(false);
  const [ host, setHost ] = React.useState("");
  const [ port, setPort ] = React.useState(465);
  const [ username, setUsername ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ rejectUnauthorized, setRejectUnauthorized ] = React.useState(false);
  const [ tsl, setTsl ] = React.useState(true);

  const [ showPass, setShowPass ] = React.useState(false);

  const [ saving, setSaving ] = React.useState(false);
  const [ newIMAP, setNewIMAP ] = React.useState(null);
  const [ choosingNewIMAP, setChooseingNewIMAP ] = React.useState(false);
  const [ newDefIMAP, setNewDefIMAP ] = React.useState(null);

  // sync
  React.useEffect( () => {
      if (!loading){
        setTitle(data.imap.title);
        setOrder(data.imap.order);
        setDef(data.imap.def);
        setHost(data.imap.host);
        setPort(data.imap.port);
        setUsername(data.imap.username);
        setPassword(data.imap.password);
        setRejectUnauthorized(data.imap.rejectUnauthorized);
        setTsl(data.imap.tsl);
      }
  }, [loading]);

  React.useEffect( () => {
      refetch({ variables: {id: parseInt(match.params.id)} });
  }, [match.params.id]);

  // functions
  const updateIMAPFunc = () => {
    setSaving( true );
    updateImap({ variables: {
      id: parseInt(match.params.id),
      title,
      order: (order !== '' ? parseInt(order) : 0),
      def,
      host,
      port: (port !== '' ? parseInt(port) : 0),
      username,
      password,
      rejectUnauthorized,
      tsl,
    } }).then( ( response ) => {
      const updatedIMAP = {...response.data.updateImap};
      if (def){
        client.writeQuery({ query: GET_IMAPS, data: {imaps: [...allIMAPs.map( IMAP => {
          if (IMAP.id === parseInt(match.params.id)) {
            return ({...updatedIMAP, def: true});
          } else {
            return({...IMAP, def: false});
          }
        } ) ] } });
      } else {
        client.writeQuery({ query: GET_IMAPS, data: {imaps: [...allIMAPs.filter( IMAP => IMAP.id !== parseInt(match.params.id) ), updatedIMAP ] } });
      }
    }).catch( (err) => {
      console.log(err.message);
    });

     setSaving( false );
  };

  const deleteIMAPFunc = () => {
    setChooseingNewIMAP(false);

    if(window.confirm("Are you sure?")){
      deleteImap({ variables: {
        id: parseInt(match.params.id),
        newDefId: ( newDefIMAP ? parseInt(newDefIMAP.id) : null ),
        newId: ( newIMAP ? parseInt(newIMAP.id) : null ),
      } }).then( ( response ) => {
        if (def) {
          client.writeQuery({ query: GET_IMAPS, data: {imaps: filteredIMAPs.map(imap => {return {...imap, def: (imap.id === parseInt(newDefIMAP.id)) }} )} });
        } else {
          client.writeQuery({ query: GET_IMAPS, data: {imaps: filteredIMAPs} });
        }
        history.push('/helpdesk/settings/imaps/add');
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
          <Input type="text" name="name" id="host" placeholder="Enter host" value={host} onChange={ (e) => setHost(e.target.value) }/>
        </FormGroup>
        <FormGroup>
          <Label for="name">Port</Label>
          <Input type="number" name="name" id="port" placeholder="Enter port"  value={port} onChange={ (e) => setPort(e.target.value) } />
        </FormGroup>
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
          value = { tsl }
          onChange={ () => setTsl(!tsl) }
          label = "TLS"
          />

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { rejectUnauthorized }
          onChange={ () => setRejectUnauthorized(!rejectUnauthorized) }
          label = "Reject unauthorized"
          />

        <Modal isOpen={choosingNewIMAP}>
          <ModalHeader>
            Please choose an IMAP to replace this one
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              { def && <Label>A replacement IMAP</Label> }
              <Select
                styles={selectStyle}
                options={filteredIMAPs}
                value={newIMAP}
                onChange={s => setNewIMAP(s)}
                />
            </FormGroup>

            {def &&
              <FormGroup>
                <Label>New default IMAP</Label>
                <Select
                  styles={selectStyle}
                  options={filteredIMAPs}
                  value={newDefIMAP}
                  onChange={s => setNewDefIMAP(s)}
                  />
              </FormGroup>
            }
          </ModalBody>
          <ModalFooter>
            <Button className="btn-link mr-auto"onClick={() => setChooseingNewIMAP(false)}>
              Cancel
            </Button>
            <Button className="btn ml-auto" disabled={!newIMAP || (def ? !newDefIMAP : false)} onClick={deleteIMAPFunc}>
              Complete deletion
            </Button>
          </ModalFooter>
        </Modal>

        <div className="row">
            <Button className="btn" disabled={cannotSave} onClick={updateIMAPFunc}>{ saving ? 'Saving IMAP...' : 'Save IMAP' }</Button>
            <Button className="btn-red m-l-5" disabled={saving || theOnlyOneLeft} onClick={ () => setChooseingNewIMAP(true) }>Delete</Button>
        </div>
      </div>
    );
}
