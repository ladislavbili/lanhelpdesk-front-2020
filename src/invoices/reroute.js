import React from 'react';

export default function ReportsReroute( props ) {
  React.useEffect( () => {
    props.history.push( './invoices/monthly/companies' );
  } );
  return null;
}