import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  setLSidebarTag,
} from 'apollo/localSchema/actions';
import Loading from 'components/loading';
import TagEdit from './edit';
import {
  GET_TAG,
  UPDATE_TAG,
  DELETE_TAG,
} from 'lanwiki/tags/queries';

export default function TagEditLoader( props ) {
  const {
    id,
  } = props;

  const {
    data: tagData,
    loading: tagLoading,
    refetch: tagRefetch,
  } = useQuery( GET_TAG, {
    variables: {
      id
    },
    fetchPolicy: 'network-only',
  } );
  const [ updateTag ] = useMutation( UPDATE_TAG );
  const [ deleteTag ] = useMutation( DELETE_TAG );

  if ( tagLoading ) {
    return ( <Loading/> )
  }

  return (
    <TagEdit
      {...props}
      updateTag={updateTag}
      deleteTag={deleteTag}
      tag={tagData.lanwikiTag}
      clearFilterTag={() => setLSidebarTag(null) }
      />
  );
}