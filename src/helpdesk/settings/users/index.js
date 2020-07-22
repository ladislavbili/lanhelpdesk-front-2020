import React, { Component } from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import UserList from './userList';

export const GET_USERS = gql`
query {
  users{
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
  }
}
`;

export default function UserListContainer(props){
  const userData = useQuery(GET_USERS);
  const roleData = useQuery(GET_ROLES);
  return (
    <UserList userData={userData} roleData={roleData} {...props}/>
  )
}
