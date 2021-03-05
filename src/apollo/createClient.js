import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from as ApolloFrom,
  Observable,
} from "@apollo/client";
import {
  onError
} from "@apollo/client/link/error";
import {
  setContext
} from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';
import {
  afterNow
} from '../helperFunctions';
import axios from 'axios';
import * as resolvers from './localSchema/resolvers';
import {
  setIsLoggedIn
} from './localSchema/actions';

import {
  REST_URL
} from 'configs/restAPI';

//Apollo cashe
export const cache = new InMemoryCache( {
  typePolicies: {
    Query: {
      fields: {
        ...resolvers
      }
    }
  }
} );

const link = new HttpLink( {
  uri: `${REST_URL}/graphql`,
  credentials: "include"
} );

//refreshne access a refresh token
export async function refreshToken() {
  return axios.request( {
    url: `${REST_URL}/refresh_token`,
    method: 'post',
    withCredentials: true
  }, )
}

//pomaha spracovat opakovaný request v pripade zlyhania
const promiseToObservable = promise => (
  new Observable( ( subscriber ) => {
    promise.then(
      ( response ) => {
        const {
          ok,
          accessToken
        } = response.data;
        if ( ok ) {
          sessionStorage.setItem( "acctok", accessToken );
        } else {
          sessionStorage.removeItem( "acctok" )
          setIsLoggedIn( false );
        }
        if ( subscriber.closed ) return;
        subscriber.next();
        subscriber.complete();
      },
      err => subscriber.error( err )
    );
    return subscriber;
  } )
)

const authLink = setContext( async ( _, {
  headers
} ) => {
  let token = sessionStorage.getItem( 'acctok' );
  if ( !token ) {
    return headers;
  }
  if ( !afterNow( jwtDecode( token ).exp ) ) {
    const {
      ok,
      accessToken
    } = ( await refreshToken() ).data;
    if ( ok ) {
      token = accessToken;
      sessionStorage.setItem( "acctok", accessToken );
    } else {
      sessionStorage.removeItem( "acctok" )
      setIsLoggedIn( false );
    }
  }
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    }
  }
} );

function processErrors( {
  graphQLErrors,
  operation,
  forward,
  ...rest
} ) {
  if ( !graphQLErrors ) {
    return;
  }
  let error = graphQLErrors[ 0 ];
  if ( 'INVALID_OR_OUTDATED_TOKEN' ) {
    return promiseToObservable( refreshToken() ).flatMap( () => forward( operation ) );
  }
  if ( error.extensions.code === "NO_ACC_TOKEN" ) {
    sessionStorage.removeItem( "acctok" )
    setIsLoggedIn( false );
  }
}

export default function createClient() {
  const client = new ApolloClient( {
    cache,
    link: ApolloFrom( [ onError( processErrors ), authLink, link ] ),
  } );
  return client;
}