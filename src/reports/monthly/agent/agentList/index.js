import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import Loading from 'components/loading';
import AgentList from './agentList';

import {
  GET_BASIC_USERS,
} from 'helpdesk/settings/users/queries';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function CompanyListLoader( props ) {
  const {
    filterData,
    invoiced,
    setAgent,
  } = props;

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );

  const {
    data: usersData,
    loading: usersLoading,
    refetch: usersRefetch,
  } = useQuery( GET_BASIC_USERS, {
    fetchPolicy: 'network-only'
  } );

  React.useEffect( () => {
    usersRefetch();
  }, [ filterData ] );

  if ( usersLoading ) {
    return (
      <Loading />
    );
  }

  const users = usersData.basicUsers;

  return (
    <AgentList
      users={users}
      setAgent={setAgent}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      />
  );
}