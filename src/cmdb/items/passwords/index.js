import React from 'react';
import Table from './table';
import {
  updateArrayItem,
} from 'helperFunctions';

export default function PasswordsLoader( props ) {
  const {
    itemId,
    edit,
    disabled,
  } = props;

  const [ passwords, setPasswords ] = React.useState( [] );

  const onAdd = ( password ) => {
    setPasswords( [ ...passwords, {
      ...password,
    } ] );

  };
  const onEdit = ( password ) => {
    setPasswords( updateArrayItem( passwords, password ) );
  };
  const onDelete = ( passwordId ) => {
    setPasswords( passwords.filter( ( password ) => password.id !== passwordId ) );
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