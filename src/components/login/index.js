import React from 'react';
import {
  useMutation
} from "@apollo/client";
import Login from './login';
import gql from "graphql-tag";

const LOGIN_USER = gql `
mutation loginUser($email: String!, $password: String!) {
  loginUser(
    email: $email,
    password: $password
  ){
    user{
      fullName
      email
      name
      surname
      id
      role {
        accessRights {
          users
          companies
          pausals
          projects
          statuses
          units
          prices
          suppliers
          tags
          invoices
          roles
          taskTypes
          tripTypes
          imaps
          smtps
        }
      }
    },
    accessToken
  }
}
`;

export default function LoginContainer() {
  const [ login ] = useMutation( LOGIN_USER );
  return (
    <Login login={login} />
  )
}