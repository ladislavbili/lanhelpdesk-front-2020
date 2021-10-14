import React from 'react';
import {
  useQuery,
} from "@apollo/client";
import moment from 'moment';

import InvoiceListOfDates from './listOfDates';

import {
  months
} from 'configs/constants/reports';

let years = [];
for ( let i = moment()
    .year(); i >= 2012; i-- ) {
  years.push( {
    value: i,
    label: i
  } );
}

const allValidDates = years.reduce( ( acc, year ) => {
    return [
    ...acc,
    ...months.map( ( month ) => ( {
        month,
        year
      } ) )
  ]
  }, [] )
  .filter( ( date ) => Math.random() < 0.3 );

export default function InvoicesListOfDatesLoader( props ) {

  const {
    company,
  } = props;


  return (
    <InvoiceListOfDates dates={allValidDates} {...props} />
  );
}