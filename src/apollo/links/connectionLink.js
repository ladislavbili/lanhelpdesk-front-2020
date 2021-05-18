import {
  split,
  HttpLink
} from '@apollo/client';
import {
  getMainDefinition
} from '@apollo/client/utilities';
import {
  WebSocketLink
} from '@apollo/client/link/ws';

import {
  REST_URL,
  SOCKET_URL
} from 'configs/restAPI';

const httpLink = new HttpLink( {
  uri: `${REST_URL}/graphql`,
  credentials: "include"
} );

export const socketLink = new WebSocketLink( {
  uri: `${SOCKET_URL}/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: () => ( {
      authorization: `Bearer ${sessionStorage.getItem( 'acctok' )}`,
    } ),
  }
} );

export const connectionLink = split(
  ( {
    query
  } ) => {
    const definition = getMainDefinition( query );
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  socketLink,
  httpLink,
);