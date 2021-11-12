import React from 'react';
import {
  useQuery,
  useMutation,
} from "@apollo/client";

import Loading from 'components/loading';
import CompanyInvoice from './companyInvoice';

import {
  COMPANY_INVOICE,
  INVOICE_TASKS,
} from 'reports/queries';

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
  const [ invoiceTasksFunc ] = useMutation( INVOICE_TASKS );

  React.useEffect( () => {
    invoiceRefetch( {
      variables: {
        ...filterData,
        companyId: company.id,
      },
    } );
  }, [ company ] );

  const invoiceTasks = ( companyId, taskIds, setInvoiceTriggered ) => {
    if ( window.confirm( 'Please confirm your choice to invoice these tasks.' ) ) {
      setInvoiceTriggered( true );
      invoiceTasksFunc( {
        variables: {
          ...filterData,
          companyId,
          taskIds
        }
      } );
      invoiceRefetch( {
        variables: {
          ...filterData,
          companyId: company.id,
        },
      } );
      setInvoiceTriggered( false );
    }
  }

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
      invoiceTasks={invoiceTasks}
      invoiceRefetch={() => invoiceRefetch( {
        variables: {
          ...filterData,
          companyId: company.id,
        },
      } )}
      />
  );
}