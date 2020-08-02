import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Loading from 'components/loading';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import { isEmail, toSelArr } from 'helperFunctions';
import Checkbox from 'components/checkbox';

import { REST_URL } from 'configs/restAPI';

import { GET_USERS } from '../index';

const GET_USER = gql`
query user($id: Int!) {
  user (
    id: $id
  ) {
    id
    createdAt
    updatedAt
    active
    username
    email
    name
    surname
    fullName
    receiveNotifications
    signature
    role {
      id
      title
      level
    }
    company {
      id
      title
    }
  }
}
`;

const UPDATE_USER = gql`
mutation updateUser($id: Int!, $username: String, $email: String, $name: String, $surname: String, $password: String, $receiveNotifications: Boolean, $signature: String, $roleId: Int, $companyId: Int) {
  updateUser(
    id: $id,
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
  }
}
`;

export const DELETE_USER = gql`
mutation deleteUser($id: Int!) {
  deleteUser(
    id: $id,
  ){
    id
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

export default function UserEdit(props){
  // data & queries
  const { history, match } = props;
  const { data: userData, loading: userLoading, refetch: userRefetch} = useQuery(GET_USER, { variables: {id: parseInt(props.match.params.id)} });
  const { data: rolesData, loading: rolesLoading } = useQuery(GET_ROLES);
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES);
  const [updateUser, {updateData}] = useMutation(UPDATE_USER);
  const [deleteUser, {deleteData, client}] = useMutation(DELETE_USER);

  //state
  const [ createdAt, setCreatedAt ] = React.useState(0);
  const [ updatedAt, setUpdatedAt ] = React.useState(0);
  const [ active, setActive ] = React.useState(true);
  const [ username, setUsername ] = React.useState("");
  const [ email, setEmail ] = React.useState("");
  const [ name, setName ] = React.useState("");
  const [ surname, setSurname ] = React.useState("");
  const [ fullName, setFullName ] = React.useState("");
  const [ receiveNotifications, setReceiveNotifications ] = React.useState(false);
  const [ signature, setSignature ] = React.useState("");
  const [ role, setRole ] = React.useState({});
  const [ company, setCompany ] = React.useState({});
  const [ saving, setSaving ] = React.useState(false);
  const [ deletingUser, setDeletingUser ] = React.useState(false);
  const [ deactivatingUser, setDeactivatingUser ] = React.useState(false);
  const [ passReseted, setPassReseted ] = React.useState(false);
  const [ passResetEnded, setPassResetEnded ] = React.useState(true);

  // sync
  React.useEffect( () => {
    if (!userLoading){
      setCreatedAt(userData.user.createdAt);
      setUpdatedAt(userData.user.updatedAt);
      setActive(userData.user.active);
      setUsername(userData.user.username);
      setEmail(userData.user.email);
      setName(userData.user.name);
      setSurname(userData.user.surname);
      setFullName(userData.user.fullName);
      setReceiveNotifications(userData.user.receiveNotifications);
      setSignature((userData.user.signature ? userData.user.signature : `${userData.user.name} ${userData.user.surname}, ${userData.user.company.title}`));
      setRole(userData.user.role);
      setCompany(userData.user.company);
      }
  }, [userLoading]);

  React.useEffect( () => {
      userRefetch({ variables: {id: parseInt(match.params.id)} });
  }, [match.params.id]);

  // functions
  const updateUserFunc = () => {
    setSaving( true );
    updateUser({ variables: {
      id: parseInt(match.params.id),
      active,
      username,
      email,
      name,
      surname,
      receiveNotifications,
      signature,
      roleId: role.id,
      companyId: company.id,
    } }).then( ( response ) => {
      const allUsers = client.readQuery({query: GET_USERS}).users;
      let newUser = {
        id: parseInt(match.params.id),
        username,
        email,
        role,
        company,
        __typename: "User"
      }
      client.writeQuery({ query: GET_USERS, data: {users: allUsers.map( user => (user.id !== parseInt(match.params.id) ? user : {...newUser}) )} });
    }).catch( (err) => {
      console.log(err.message);
    });
    setSaving( false );
  };

  const deleteUserFunc = () => {
    if(!window.confirm("Are you sure you want to delete the user?")){
      deleteUser({ variables: {
        id: parseInt(match.params.id)
      } }).then( ( response ) => {
        const allUsers = client.readQuery({query: GET_USERS}).users;
        client.writeQuery({ query: GET_USERS, data: {users: allUsers.filter( user => user.id !== parseInt(match.params.id),)} });
        history.goBack();
      }).catch( (err) => {
        console.log(err.message);
      });
    }
  };

  /*deactivateUser(){
    this.setState({ deletingUser: true })
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ /*true).then((token)=>{
      fetch(`${REST_URL}/deactivate-user`,{
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          token,
          userID: this.props.match.params.id,
        }),
      }).then((response)=>response.json().then((response)=>{
        this.setState({ deletingUser: false, deactivated: response.deactivated })
        console.log(response);
      })).catch((error)=>{
        this.setState({ deletingUser: false })
        console.log(error);
      })
    })
  }*/

  if (userLoading || rolesLoading || companiesLoading) {
    return <Loading />
  }

  return (
    <div className="scroll-visible p-20 fit-with-header-and-commandbar">
        <FormGroup>
          <Label for="role">Role</Label>
          <Select
            styles={ selectStyle }
            isDisabled={ true }
            options={ rolesData.roles }
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
          <Input type="text" name="name" id="name" placeholder="Enter name" value={ name } onChange={ (e) => setName(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="surname">Surname</Label>
          <Input type="text" name="surname" id="surname" placeholder="Enter surname" value={ surname } onChange={ (e) => setSurname(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="email">E-mail</Label>
          <Input type="email" name="email" id="email" disabled={ false } placeholder="Enter email" value={ email } onChange={ (e) => setEmail(e.target.value) } />
        </FormGroup>

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { receiveNotifications }
          label = "Receive e-mail notifications"
          onChange={()=> setReceiveNotifications(!receiveNotifications)}
          />

        <FormGroup>
          <Label for="company">Company</Label>
          <Select
            styles={ selectStyle }
            isDisabled={ true }
            options={ companiesData.companies }
            value={ company }
            onChange={ e => this.setCompany( e ) }
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
            onChange={ (e) => setSignature(e.target.value) }
            />
        </FormGroup>

        <div className="row">
          <Button
            className="btn m-r-5"
            disabled={ saving || ( companiesData.companies ? companiesData.companies.length === 0 : false) || !isEmail(email) }
            onClick={ updateUser }
            >
            { saving ? 'Saving user...' : 'Save user' }
          </Button>
            { false && role.level === 0 &&
                <Button
                  className={ active ? "btn-grey" : "btn-green"}
                  disabled={deactivatingUser}
                  onClick={this.deactivateUser.bind(this)}
                  >
                  {active ? 'Deactivate user' : 'Activate user'}
                </Button>
              }
              { false && role.level === 0 &&
                <Button
                  className="btn-red m-l-5"
                  disabled={deletingUser}
                  onClick={this.deleteUser.bind(this)}
                  >
                  Delete
                </Button>
              }

            <Button
              className="btn-link"
              disabled={ saving || passReseted }
              onClick={ ()=>{
                setPassReseted({passReseted:true,passResetEnded:false});
                /*firebase.auth().sendPasswordResetEmail(this.state.email).then(()=>{
                  this.setState({passResetEnded:true})
                })*/
              }}
              >{ passResetEnded ? (passReseted ? 'Password reseted!' : "Reset user's password") : "Resetting..." }</Button>
        </div>
    </div>
  )
}
