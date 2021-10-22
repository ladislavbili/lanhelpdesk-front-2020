import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import Loading from 'components/loading';
import CompanyInvoice from './companyInvoice';

import {
  COMPANY_INVOICE,
} from 'reports/queries/companyQueries';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function CompanyInvoiceLoader( props ) {
  const {
    company,
    filterData,
  } = props;

  const {
    data: invoiceData,
    loading: invoiceLoading,
    refetch: invoiceRefetch,
  } = useQuery( COMPANY_INVOICE, {
    variables: {
      ...filterData,
      companyId: company.company.id,
    },
  } );

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );

  React.useEffect( () => {
    invoiceRefetch( {
      variables: {
        ...filterData,
        companyId: company.id,
      },
    } );
  }, [ company ] );

  if ( invoiceLoading ) {
    return (
      <Loading />
    );
  }

  return (
    <CompanyInvoice
      invoice={invoiceData.companyInvoice}
      companyData={company}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      />
  );
}