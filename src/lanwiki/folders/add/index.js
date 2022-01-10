import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";
import Loading from 'components/loading';
import FolderAdd from './add';
import {
  getMyData,
} from 'helperFunctions';
import {
  GET_LANWIKI_USERS,
  ADD_FOLDER,
} from 'lanwiki/folders/queries';

export default function AddFolderLoader( props ) {
  const {
    id,
  } = props;
  const currentUser = getMyData();
  const {
    data: usersData,
    loading: usersLoading,
    refetch: usersRefetch,
  } = useQuery( GET_LANWIKI_USERS, {
    variables: {
      id
    },
    fetchPolicy: 'network-only',
  } );
  const [ addFolder ] = useMutation( ADD_FOLDER );

  if ( usersLoading ) {
    return ( <Loading/> )
  }

  return (
    <FolderAdd
      {...props}
      addFolder={addFolder}
      users={usersData.lanwikiUsers}
      currentUser={currentUser}
      />
  );
}