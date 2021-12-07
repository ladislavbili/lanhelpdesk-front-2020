import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  localFilterToValues,
} from 'helperFunctions';
import {
  getEmptyGeneralFilter
} from 'configs/constants/filter';

import Loading from 'components/loading';
import Invoice from './invoice';

import {
  INVOICE,
} from 'invoices/queries';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function InvoiceLoader( props ) {
  const {
    invoiceFilter,
  } = props;

  const {
    data: invoiceData,
    loading: invoiceLoading,
    refetch: invoiceRefetch,
  } = useQuery( INVOICE, {
    variables: {
      companyId: invoiceFilter.company.id,
      fromDate: invoiceFilter.fromDate.valueOf()
        .toString(),
      toDate: invoiceFilter.toDate.valueOf()
        .toString()
    },
  } );

  React.useEffect( () => {
    invoiceRefetch( {
      variables: {
        companyId: invoiceFilter.company.id,
        fromDate: invoiceFilter.fromDate.valueOf()
          .toString(),
        toDate: invoiceFilter.toDate.valueOf()
          .toString()
      },
    } );

  }, [ invoiceFilter ] );

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );

  if ( invoiceLoading ) {
    return (
      <Loading />
    );
  }

  return (
    <Invoice
      invoice={invoiceData.invoice}
      company={invoiceFilter.company}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      invoiceRefetch={() => invoiceRefetch( {
        variables: {
          companyId: invoiceFilter.company.id,
          fromDate: invoiceFilter.fromDate.valueOf()
            .toString(),
          toDate: invoiceFilter.toDate.valueOf()
            .toString()
        },
      } )}
      />
  );
}