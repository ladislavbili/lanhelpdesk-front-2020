import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import Loading from 'components/loading';
import AgentList from './agentList';

import {
  INVOICE_AGENTS,
} from 'invoices/queries';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function AgentListLoader( props ) {
  const {
    filterData,
    setAgent,
  } = props;

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );

  const {
    data: agentsData,
    loading: agentsLoading,
    refetch: agentsRefetch,
  } = useQuery( INVOICE_AGENTS, {
    variables: filterData,
    fetchPolicy: 'network-only',
  } );

  React.useEffect( () => {
    agentsRefetch( {
      variables: filterData,
    } );
  }, [ filterData ] );

  if ( agentsLoading ) {
    return (
      <Loading />
    );
  }

  const agents = agentsData.invoiceAgents;

  return (
    <AgentList
      agents={agents}
      setAgent={setAgent}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      />
  );
}