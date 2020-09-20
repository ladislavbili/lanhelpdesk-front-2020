import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Navigation from 'navigation';
import Login from 'components/login';

import createStore from 'redux/store';
import 'react-datepicker/dist/react-datepicker.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import "scss/index.scss";

import gql from "graphql-tag";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import createClient from 'apollo/createClient';

export const database = {};
export const rebase = {};

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Navigation /> : <Login />;
}

const client = createClient();

const store=createStore();

const Root = () => {
  return(
    <div>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <IsLoggedIn />
        </Provider>
      </ApolloProvider>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
