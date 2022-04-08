import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";
import axios from 'axios';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import Scheme from './scheme';
import Loading from 'components/loading';

import {
  REST_URL,
} from 'configs/restAPI';
import {
  GET_SCHEME,
  ADD_OR_UPDATE_CMDB_SCHEME,
} from 'cmdb/scheme/queries';

export default function SchemeLoader( props ) {
  const {
    match,
  } = props;

  const {
    data: schemeData,
    loading: schemeLoading,
    refetch: schemeRefetch,
  } = useQuery( GET_SCHEME, {
    variables: {
      companyId: parseInt( match.params.companyID ),
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  } );

  const [ addOrUpdateCmdbScheme ] = useMutation( ADD_OR_UPDATE_CMDB_SCHEME );

  const [ schemeImage, setSchemeImage ] = React.useState( undefined );


  React.useEffect( () => {
    if ( !schemeLoading && schemeData ) {
      getSchemeImage( schemeData.cmdbScheme );
    }
  }, [ schemeLoading ] );

  const getSchemeImage = ( scheme ) => {
    if ( scheme && scheme.file ) {
      axios.get( `${REST_URL}/get-cmdb-file`, {
          params: {
            path: scheme.file.path
          },
          headers: {
            'authorization': `Bearer ${sessionStorage.getItem('acctok')}`
          },
          responseType: 'arraybuffer',
        } )
        .then( ( response ) => {
          setSchemeImage( URL.createObjectURL(
            new Blob( [ response.data ], {
              type: scheme.file.mimetype
            } )
          ) );
          //download
        } )
        .catch( ( err ) => {
          setSchemeImage( null );
          addLocalError( err );
        } )
    } else {
      setSchemeImage( null );
    }
  }

  if ( schemeLoading || schemeImage === undefined ) {
    return ( <Loading/> )
  }

  return (
    <Scheme
      {...props}
      scheme={schemeData.cmdbScheme}
      schemeImage={schemeImage}
      addOrUpdateCmdbScheme={addOrUpdateCmdbScheme}
      schemeRefetch={() => schemeRefetch({ variables: { companyId: parseInt( match.params.companyID )  } })}
      companyId={parseInt( match.params.companyID )}
      />
  );
}