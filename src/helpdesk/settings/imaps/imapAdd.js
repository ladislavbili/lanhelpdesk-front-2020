import React from 'react';
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {secondaryClient} from 'apollo/createClient';
import {ApolloProvider} from "@apollo/react-hooks";
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

import {GET_IMAPS} from './index';

const ADD_IMAP = gql `
mutation addImap($title: String!, $order: Int!, $def: Boolean!, $host: String!, $port: Int!, $username: String!, $password: String!, $rejectUnauthorized: Boolean!, $tsl: Boolean!) {
  addImap(
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

const ADD_FILE = gql `
mutation uploadTaskAttachment($taskId: Int!, $files: [Upload!]!) {
  uploadTaskAttachment(
    taskId: $taskId,
    files: $files,
  ){
    id
  }
}
`;

export default function IMAPAdd(props) {
  //data
  const {match} = props;
  const [addImap, {
      client
    }
  ] = useMutation(ADD_IMAP);

  const [uploadTaskAttachment] = useMutation(ADD_FILE);

  //state
  const [title, setTitle] = React.useState("");
  const [order] = React.useState(0);
  const [def, setDef] = React.useState(false);
  const [host, setHost] = React.useState("");
  const [port, setPort] = React.useState(465);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rejectUnauthorized, setRejectUnauthorized] = React.useState(false);
  const [tsl, setTsl] = React.useState(true);

  const [showPass, setShowPass] = React.useState(false);

  const [saving, setSaving] = React.useState(false);

  //functions
  const addIMAPFunc = () => {
    setSaving(true);
    addImap({
      variables: {
        title,
        order: (
          order !== ''
          ? parseInt(order)
          : 0),
        def,
        host,
        port: (
          port !== ''
          ? parseInt(port)
          : 465),
        username,
        password,
        rejectUnauthorized,
        tsl
      }
    }).then((response) => {
      const allIMAPs = client.readQuery({query: GET_IMAPS}).imaps;
      const newIMAP = {
        ...response.data.addImap,
        __typename: "Imap"
      };
      client.writeQuery({
        query: GET_IMAPS,
        data: {
          imaps: [
            ...allIMAPs.filter(IMAP => IMAP.id !== parseInt(match.params.id)),
            newIMAP
          ]
        }
      });
      //    history.push('/helpdesk/settings/imaps/' + newIMAP.id)
    }).catch((err) => {
      console.log(err.message);
    });
    setSaving(false);
  }

  const cannotSave = saving || title === '' || host === '' || port === '' || username === '';

  return (<ApolloProvider client={secondaryClient}>
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">
      <Checkbox className="m-b-5 p-l-0" value={def} onChange={() => setDef(!def)} label="Default"/>
      <Input type="file" name="name" id="user" multiple="multiple" placeholder="Enter user" onChange={(e) => {
          let files = [...e.target.files];
          console.log(files);
          uploadTaskAttachment({
            variables: {
              taskId: 1,
              files: files
            }
          })
        }}/>
      <FormGroup>
        <Label for="name">Title</Label>
        <Input type="text" name="name" id="name" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label for="name">Host</Label>
        <Input type="text" name="name" id="host" placeholder="Enter host" value={host} onChange={(e) => setHost(e.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label for="name">Port</Label>
        <Input type="number" name="name" id="port" placeholder="Enter port" value={port} onChange={(e) => setPort(e.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label for="name">Username</Label>
        <Input type="text" name="name" id="user" placeholder="Enter user" value={username} onChange={(e) => setUsername(e.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <InputGroup>
          <Input type={showPass
              ? 'text'
              : "password"} className="from-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <InputGroupAddon addonType="append" className="clickable" onClick={() => setShowPass(!showPass)}>
            <InputGroupText>
              <i className={"mt-auto mb-auto " + (
                  !showPass
                  ? 'fa fa-eye'
                  : 'fa fa-eye-slash')}/>
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>

      <Checkbox className="m-b-5 p-l-0" value={tsl} onChange={() => setTsl(!tsl)} label="TLS"/>

      <Checkbox className="m-b-5 p-l-0" value={rejectUnauthorized} onChange={() => setRejectUnauthorized(!rejectUnauthorized)} label="Reject unauthorized"/>

      <Button className="btn" disabled={cannotSave} onClick={addIMAPFunc}>{
          saving
            ? 'Adding...'
            : 'Add Imap'
        }</Button>
    </div>
  </ApolloProvider>);
}
