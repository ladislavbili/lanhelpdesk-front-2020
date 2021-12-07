import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import Loading from 'components/loading';
import AgentInvoice from './agentInvoice';

import {
  AGENT_INVOICE,
} from 'invoices/queries';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function AgentInvoiceLoader( props ) {
  const {
    agent,
    filterData,
  } = props;

  const {
    data: invoiceData,
    loading: invoiceLoading,
    refetch: invoiceRefetch,
  } = useQuery( AGENT_INVOICE, {
    variables: {
      ...filterData,
      userId: agent.id,
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
        userId: agent.id,
      },
    } );
  }, [ agent ] );

  if ( invoiceLoading ) {
    return (
      <Loading />
    );
  }

  return (
    <AgentInvoice
      invoice={invoiceData.agentInvoice}
      invoiced={filterData.invoiced}
      agent={agent}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      invoiceRefetch={() => invoiceRefetch( {
        variables: {
          ...filterData,
          userId: agent.id,
        },
      } )}
      />
  );
}