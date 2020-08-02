import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import {isEmail, sameStringForms, toSelArr} from 'helperFunctions';
import Checkbox from 'components/checkbox';

import {  GET_USERS } from '../index';

const ADD_USER = gql`
mutation registerUser($username: String!, $email: String!, $name: String!, $surname: String!, $password: String!, $receiveNotifications: Boolean, $signature: String, $roleId: Int!, $companyId: Int!) {
  registerUser(
    username: $username,
    email: $email,
    name: $name,
    surname: $surname,
    password: $password,
    receiveNotifications: $receiveNotifications,
    signature: $signature,
    roleId: $roleId,
    companyId: $companyId,
  ){
    id
    email
    username
    role {
      id
      title
    }
    company {
      title
    }
  }
}
`;

export const GET_ROLES = gql`
query {
  roles{
    id
    title
    level
  }
}
`;

export const GET_COMPANIES = gql`
query {
  companies{
    id
    title
  }
}
`;

export default function UserAddContainer(props){
  // data & queries
  const { history, match } = props;
  const all = useQuery(GET_ROLES);
  const { data: rolesData, loading: rolesLoading, error: er1 } = all;
  const { data: companiesData, loading: companiesLoading, error: er2 } = useQuery(GET_COMPANIES);
  const [registerUser, {client}] = useMutation(ADD_USER);

  console.log(all);

  //state
  const [ createdAt, setCreatedAt ] = React.useState(0);
  const [ updatedAt, setUpdatedAt ] = React.useState(0);
  const [ active, setActive ] = React.useState(true);
  const [ username, setUsername ] = React.useState("");
  const [ email, setEmail ] = React.useState("");
  const [ name, setName ] = React.useState("");
  const [ surname, setSurname ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ receiveNotifications, setReceiveNotifications ] = React.useState(false);
  const [ signature, setSignature ] = React.useState("");
  const [ signatureChanged, setSignatureChanged ] = React.useState(false);
  const [ role, setRole ] = React.useState({});
  const [ company, setCompany ] = React.useState({});
  const [ saving, setSaving ] = React.useState(false);

  const addUser = () => {
    setSaving( true );
    registerUser({ variables: {
      active,
      username,
      email,
      name,
      surname,
      password,
      receiveNotifications,
      signature: (signature ? signature : `${name} ${surname}, ${company.title}`),
      roleId: role.id,
      companyId: company.id,
    } }).then( ( response ) => {
      const allUsers = client.readQuery({query: GET_USERS}).users;
      let newUser = {...response.data.registerUser,  __typename: "User"}
      client.writeQuery({ query: GET_USERS, data: {users: [...allUsers, newUser]} });
      history.push('/helpdesk/settings/users/' + newUser.id)
    }).catch( (err) => {
      console.log(err.message);
    });
    setSaving( false );
  }

  const cannotAddUser = () => {
    let cond1 = saving || (companiesData.companies ? companiesData.companies.length === 0 : false)  ;
    let cond2 = !username || !name || !surname || !isEmail(email) || password.length < 6 || !role || !company;
    return cond1 || cond2;
  }

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <FormGroup>
          <Label for="role">Role</Label>
          <Select
            styles={ selectStyle }
            options={ rolesData ? rolesData.roles : [] }
            value={ role }
            onChange={ role => setRole(role) }
            />
        </FormGroup>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input type="text" name="username" id="username" placeholder="Enter username" value={ username } onChange={ (e) => setUsername(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter name" value={ name } onChange={ (e)=>{
              if (signatureChanged){
                setName(e.target.value);
              } else {
                setName(e.target.value);
                setSignature(`${e.target.value} ${surname}, ${(company? company.title :'')}`);
                setSignatureChanged(false);
              }
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="surname">Surname</Label>
          <Input type="text" name="surname" id="surname" placeholder="Enter surname" value={ surname } onChange={ (e) => {
              if (signatureChanged) {
                setSurname(e.target.value);
              } else {
                setSurname(e.target.value);
                setSignature(`${name} ${e.target.value}, ${(company? company.title :'')}`);
                setSignatureChanged(false);
              }
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">E-mail</Label>
          <Input type="email" name="email" id="email" placeholder="Enter email" value={ email } onChange={ (e) => setEmail(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input type="password" name="password" id="password" placeholder="Enter password" value={ password } onChange={ (e) => setPassword(e.target.value) } />
        </FormGroup>

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { receiveNotifications }
          label = "Receive e-mail notifications"
          onChange={ () =>  setReceiveNotifications(!receiveNotifications) }
          />

        <FormGroup>
          <Label for="company">Company*</Label>
          <Select
            styles={ selectStyle }
            options={ companiesData ? companiesData.companies : [] }
            value={ company }
            onChange={ company => {
              if (signatureChanged){
                setCompany(company);
              } else {
                setCompany(company);
                setSignature(`${name} ${surname}, ${company.title}`);
                setSignatureChanged(false);
              }
              }}
           />
        </FormGroup>
        <FormGroup>
          <Label for="signature">Signature</Label>
          <Input
            type="textarea"
            name="signature"
            id="signature"
            placeholder="Enter signature"
            value={ signature }
            onChange={ (e) => {
              setSignature(e.target.value);
              setSignatureChanged(true);
            }}
            />
        </FormGroup>

        <Button
          className="btn"
          disabled={ cannotAddUser }
          onClick={ addUser }
          >
          { saving ? 'Adding...' : 'Add user' }
        </Button>
    </div>
  )
}
