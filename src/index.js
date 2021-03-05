import React from 'react';
import ReactDOM from 'react-dom';

import Navigation from 'navigation';
import Login from 'components/login';
import 'react-datepicker/dist/react-datepicker.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import "scss/index.scss";

import {
  ApolloProvider,
  useQuery
} from '@apollo/client'
import createClient from 'apollo/createClient';
import {
  GET_IS_LOGGED_IN,
} from 'apollo/localSchema/queries';

const client = createClient();

const IsLoggedIn = () => {
  const {
    data
  } = useQuery( GET_IS_LOGGED_IN );
  return data.isLoggedIn ? <Navigation /> : <Login />;
}

const Root = () => {
  return (
    <div>
      <ApolloProvider client={client}>
          <IsLoggedIn />
      </ApolloProvider>
    </div>
  )
}

ReactDOM.render( <Root />, document.getElementById( 'root' ) );