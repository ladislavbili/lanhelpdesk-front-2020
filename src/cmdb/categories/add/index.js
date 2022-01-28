import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";
import CategoryAdd from './add';
import {
  ADD_CATEGORY,
} from 'cmdb/categories/queries';

export default function AddCategoryLoader( props ) {
  const [ addCategory ] = useMutation( ADD_CATEGORY );

  return (
    <CategoryAdd
      {...props}
      addCategory={addCategory}
      />
  );
}