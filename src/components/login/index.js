import React from 'react';
import {
  useMutation,
} from "@apollo/client";
import Login from './login';
import {
  LOGIN_USER
} from '../queries';

export default function LoginContainer() {
  const [ login ] = useMutation( LOGIN_USER );
  return (
    <Login login={login} />
  )
}