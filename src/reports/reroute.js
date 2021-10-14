import React from 'react';

export default function ReportsReroute( props ) {
  React.useEffect( () => {
    props.history.push( './reports/monthly/companies' );
  } );
  return null;
}