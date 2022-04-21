import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";
import Loading from 'components/loading';
import FolderEdit from './edit';
import {
  getMyData,
} from 'helperFunctions';
import {
  GET_PASS_USERS,
  GET_FOLDER,
  UPDATE_FOLDER,
  DELETE_FOLDER,
} from 'lanpass/folders/queries';

export default function EditFolderLoader( props ) {
  const {
    id,
    folders,
  } = props;
  const currentUser = getMyData();

  const {
    data: usersData,
    loading: usersLoading,
    refetch: usersRefetch,
  } = useQuery( GET_PASS_USERS, {
    variables: {
      id
    },
    fetchPolicy: 'network-only',
  } );

  const {
    data: folderData,
    loading: folderLoading,
    refetch: folderRefetch,
  } = useQuery( GET_FOLDER, {
    variables: {
      id
    },
    fetchPolicy: 'network-only',
  } );
  
  const [ updateFolder ] = useMutation( UPDATE_FOLDER );
  const [ deleteFolder ] = useMutation( DELETE_FOLDER );

  if ( usersLoading || folderLoading ) {
    return ( <Loading/> )
  }

  return (
    <FolderEdit
      {...props}
      updateFolder={updateFolder}
      deleteFolder={deleteFolder}
      users={usersData.passUsers}
      folder={folderData.passFolder}
      folders={folders}
      currentUser={currentUser}
      />
  );
}
