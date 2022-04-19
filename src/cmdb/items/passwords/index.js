import React from 'react';
import Table from './table';
import {
  updateArrayItem,
} from 'helperFunctions';
import {
  useMutation,
} from "@apollo/client";
import {
  ADD_ITEM_PASSWORD,
  UPDATE_ITEM_PASSWORD,
  DELETE_ITEM_PASSWORD,
} from 'cmdb/items/queries';

export default function PasswordLoader( props ) {
  const {
    itemId,
    edit,
    passwords,
    setPasswords,
    disabled,
  } = props;

  const [ addPassword ] = useMutation( ADD_ITEM_PASSWORD );
  const [ updatePassword ] = useMutation( UPDATE_ITEM_PASSWORD );
  const [ deletePassword ] = useMutation( DELETE_ITEM_PASSWORD );

  const onAdd = ( password ) => {
    const id = password.id;

    setPasswords( [ ...passwords, {
      ...password
    } ] );
    if ( edit ) {
      delete password.id;
      addPassword( {
          variables: {
            itemId,
            ...password,
          }
        } )
        .then( ( response ) => {
          setPasswords( [ ...passwords.filter( ( password ) => password.id !== id ), response.data.addCmdbItemPassword ] );
        } )
        .catch( ( e ) => {
          console.log( e );
        } );
    }

  };
  const onEdit = ( password ) => {
    setPasswords( updateArrayItem( passwords, password ) );
    if ( edit ) {
      updatePassword( {
          variables: password
        } )
        .catch( ( e ) => {
          console.log( e );
        } );
    }

  };
  const onDelete = ( passwordId ) => {

    setPasswords( passwords.filter( ( password ) => password.id !== passwordId ) );
    if ( edit ) {
      deletePassword( {
          variables: {
            id: passwordId
          }
        } )
        .catch( ( e ) => {
          console.log( e );
        } );
    }
  };

  return (
    <Table
      passwords={passwords}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      disabled={disabled}
      />
  );
}