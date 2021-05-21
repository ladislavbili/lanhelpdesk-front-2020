import {
  useApolloClient,
} from "@apollo/client";
import {
  GET_MY_DATA,
} from 'apollo/globalQueries';

export const getMyData = () => {
  const client = useApolloClient();
  const myData = client.readQuery( {
    query: GET_MY_DATA
  } )
  if ( myData ) {
    return myData.getMyData;
  }
  return null;
}