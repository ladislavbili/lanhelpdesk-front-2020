import {
  ApolloClient,
  InMemoryCache,
  from as ApolloFrom,
  Observable,
} from "@apollo/client";
import {
  onError
} from "@apollo/client/link/error";
import * as resolvers from './localSchema/resolvers';
import {
  setIsLoggedIn,
  addApolloErrors,
} from './localSchema/actions';
import {
  authLink,
  connectionLink,
} from './links';
import refreshToken from 'apollo/refreshToken';

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

function processErrors( {
  graphQLErrors,
  operation,
  forward
} ) {
  if ( !graphQLErrors ) {
    return;
  }
  let error = graphQLErrors[ 0 ];
  if ( error && error.extensions && error.extensions.code === 'INVALID_OR_OUTDATED_TOKEN' ) {
    return promiseToObservable( refreshToken() ).flatMap( () => forward( operation ) );
  }
  if ( error.extensions.code === "NO_ACC_TOKEN" ) {
    sessionStorage.removeItem( "acctok" )
    setIsLoggedIn( false );
  } else {
    addApolloErrors( graphQLErrors );
  }
}

export default function createClient() {
  const client = new ApolloClient( {
    cache,
    link: ApolloFrom( [ onError( processErrors ), authLink, connectionLink ] ),
  } );
  return client;
}