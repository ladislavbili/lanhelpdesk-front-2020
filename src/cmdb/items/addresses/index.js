import React from 'react';
import Table from './table';
import {
  updateArrayItem,
} from 'helperFunctions';
import {
  useMutation,
} from "@apollo/client";
import {
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
} from 'cmdb/items/queries';

export default function AddressesLoader( props ) {
  const {
    itemId,
    edit,
    addresses,
    setAddresses,
    disabled,
  } = props;

  const [ addAddress ] = useMutation( ADD_ADDRESS );
  const [ updateAddress ] = useMutation( UPDATE_ADDRESS );
  const [ deleteAddress ] = useMutation( DELETE_ADDRESS );

  const onAdd = ( address ) => {
    const id = address.id;
    setAddresses( [ ...addresses, {
      ...address
    } ] );
    if ( edit ) {
      delete address.id;
      addAddress( {
          variables: {
            itemId,
            ...address,
          }
        } )
        .then( ( response ) => {
          setAddresses( [ ...addresses.filter( ( address ) => address.id !== id ), response.data.addCmdbAddress ] );
        } )
        .catch( ( e ) => {
          console.log( e );
        } );
    }

  };
  const onEdit = ( address ) => {
    setAddresses( updateArrayItem( addresses, address ) );
    if ( edit ) {
      updateAddress( {
          variables: address
        } )
        .catch( ( e ) => {
          console.log( e );
        } );
    }

  };
  const onDelete = ( addressId ) => {

    setAddresses( addresses.filter( ( address ) => address.id !== addressId ) );
    if ( edit ) {
      deleteAddress( {
          variables: {
            id: addressId
          }
        } )
        .catch( ( e ) => {
          console.log( e );
        } );
    }
  };

  return (
    <Table
      addresses={addresses}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      disabled={disabled}
      />
  );
}