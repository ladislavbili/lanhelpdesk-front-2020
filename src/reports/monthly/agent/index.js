import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  actions
} from 'configs/constants/statuses';

import StatusAndDateFilter from './filter';
import AgentList from './agentList';
import AgentInvoice from './agentInvoice';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
  GET_REPORTS_STATUS_ACTIONS,
} from 'apollo/localSchema/queries';

export default function AgentReportsLoader( props ) {

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );
  const {
    data: statusActionsData,
  } = useQuery( GET_REPORTS_STATUS_ACTIONS );

  const [ filterData, setFilterData ] = React.useState( null );
  const [ agent, setAgent ] = React.useState( null );
  const [ invoiced, setInvoiced ] = React.useState( null );

  return (
    <div className="scrollable fit-with-header p-20">
      <h2>Agenti</h2>

      <StatusAndDateFilter
        onTrigger={ () => {
          setFilterData({
            fromDate: fromDateData.reportsFromDate.valueOf()
            .toString(),
            toDate: toDateData.reportsToDate.valueOf()
            .toString(),
            statusActions: statusActionsData.reportsStatusActions.map((statusAction) => statusAction.value ),
          })
          setAgent(null);
        }}
        invoiced={invoiced}
        setInvoiced={setInvoiced}
        />
      { filterData !== null && <AgentList filterData={filterData} invoiced={invoiced} setAgent={setAgent} /> }
      { agent !== null && <AgentInvoice agent={agent} filterData={filterData} invoiced={invoiced} /> }
    </div>
  );
}