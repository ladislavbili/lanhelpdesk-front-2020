import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import UserEdit from './userEdit';

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

export default function UserEditContainer(props){
  const userData = useQuery(GET_USER, { variables: {id: parseInt(props.match.params.id)} });
  const rolesData = useQuery(GET_ROLES);
  const companiesData = useQuery(GET_COMPANIES);
  const [updateUser, {updateData}] = useMutation(UPDATE_USER);
  const [deleteUser, {deleteData, client}] = useMutation(DELETE_USER);
  return (
    <UserEdit userData={userData} rolesData={rolesData} companiesData={companiesData} updateUser={updateUser} deleteUser={deleteUser} client={client} history={props.history} match={props.match} />
  )
}
