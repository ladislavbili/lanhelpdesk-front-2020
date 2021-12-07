import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import Loading from 'components/loading';
import ListOfCompanies from './listOfCompanies';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

import {
  COMPANIES_WITH_INVOICE,
} from 'invoices/queries';

export default function InvoicesListOfCompaniesLoader( props ) {
  const {
    setInvoiceFilter,
  } = props;

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );

  const {
    data: companiesWithInvoiceData,
    loading: companiesWithInvoiceLoading,
    refetch: companiesWithInvoiceRefetch,
  } = useQuery( COMPANIES_WITH_INVOICE, {
    variables: {
      fromDate: fromDateData.reportsFromDate.valueOf()
        .toString(),
      toDate: toDateData.reportsToDate.valueOf()
        .toString(),
    },
  } );

  React.useEffect( () => {
    companiesWithInvoiceRefetch();
  }, [ fromDateData.reportsFromDate, toDateData.reportsToDate ] );

  if ( companiesWithInvoiceLoading ) {
    return (
      <Loading />
    );
  }

  return (
    <ListOfCompanies
      companies={companiesWithInvoiceData.companiesWithInvoice}
      setInvoiceFilter={setInvoiceFilter}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      />
  );
}