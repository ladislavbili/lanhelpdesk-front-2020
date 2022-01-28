import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";
import Loading from 'components/loading';
import CategoryEdit from './edit';
import {
  GET_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from 'cmdb/categories/queries';

export default function EditCategoryLoader( props ) {
  const {
    id,
    categories,
  } = props;

  const {
    data: categoryData,
    loading: categoryLoading,
    refetch: categoryRefetch,
  } = useQuery( GET_CATEGORY, {
    variables: {
      id
    },
    fetchPolicy: 'network-only',
  } );

  const [ updateCategory ] = useMutation( UPDATE_CATEGORY );
  const [ deleteCategory ] = useMutation( DELETE_CATEGORY );

  if ( categoryLoading ) {
    return ( <Loading/> )
  }

  return (
    <CategoryEdit
      {...props}
      updateCategory={updateCategory}
      deleteCategory={deleteCategory}
      category={categoryData.cmdbCategory}
      categories={categories}
      />
  );
}