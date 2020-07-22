import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import UserAdd from './userAdd';

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
  const rolesData = useQuery(GET_ROLES);
  const companiesData = useQuery(GET_COMPANIES);
  const [registerUser, {client}] = useMutation(ADD_USER);
  return (
    <UserAdd registerUser={registerUser}  rolesData={rolesData} companiesData={companiesData} client={client} {...props}/>
  )
}
