import {
  ApolloClient
} from "apollo-client";
import {
  InMemoryCache
} from "apollo-cache-inmemory";
import {
  HttpLink
} from "apollo-link-http";
import jwtDecode from 'jwt-decode';
import {
  setContext
} from 'apollo-link-context';
import {
  from as ApolloFrom,
  Observable
} from 'apollo-link';
import {
  onError
} from 'apollo-link-error';

import {
  resolvers,
  typeDefs
} from "./localSchema";
import {
  afterNow
} from '../helperFunctions';
import axios from 'axios';


import {
  allMilestones
} from 'configs/constants/sidebar';

import {
  REST_URL
} from 'configs/restAPI';


const cache = new InMemoryCache();

export function writeCleanCashe() {
  cache.writeData( {
    data: {
      isLoggedIn: false,
      cartItems: [],
      projectName: "Any project",
      filterName: "All tasks",
      milestone: allMilestones,
      orderBy: 'id',
      ascending: false,
      search: "",
      showDataFilter: {
        name: undefined,
        checked: false,
        important: false,
        id: "",
        title: "",
        status: "",
        requester: "",
        company: "",
        assignedTo: "",
        createdAt: "",
        deadline: "",
      }
    }
  } );
}

const link = new HttpLink( {
  uri: `${REST_URL}/graphql`,
  credentials: "include"
} );

async function refreshToken() {
  return axios.request( {
    url: `${REST_URL}/refresh_token`,
    method: 'post',
    withCredentials: true
  }, )
}

const promiseToObservable = promise => (
  new Observable( ( subscriber ) => {
    promise.then(
      ( response ) => {
        const {
          ok,
          accessToken
        } = response.data;
        if ( ok ) {
          localStorage.setItem( "acctok", accessToken );
        } else {
          localStorage.removeItem( "acctok" )
          cache.writeData( {
            data: {
              isLoggedIn: false
            }
          } );
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
  let token = localStorage.getItem( 'acctok' );
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
      localStorage.setItem( "acctok", accessToken );
    } else {
      localStorage.removeItem( "acctok" )
      cache.writeData( {
        data: {
          isLoggedIn: false
        }
      } );
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
    localStorage.removeItem( "acctok" )
    cache.writeData( {
      data: {
        isLoggedIn: false
      }
    } );
  }
}

export default function createClient() {
  const client = new ApolloClient( {
    cache,
    link: ApolloFrom( [ onError( processErrors ), authLink, link ] ),
    typeDefs,
    resolvers
  } );

  writeCleanCashe();

  if ( localStorage.getItem( "acctok" ) ) {
    refreshToken().then( ( response ) => {
      const {
        ok,
        accessToken
      } = response.data;
      if ( ok ) {
        localStorage.setItem( "acctok", accessToken );
        client.writeData( {
          data: {
            isLoggedIn: true
          }
        } );
      } else {
        localStorage.removeItem( "acctok" )
        client.writeData( {
          data: {
            isLoggedIn: false
          }
        } );
      }
    } )
  }
  return client;
}