import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  actions
} from 'configs/constants/statuses';

import StatusAndDateFilter from './filter';
import CompanyList from './companyList';
import CompanyInvoice from './companyInvoice';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
  GET_REPORTS_STATUS_ACTIONS,
} from 'apollo/localSchema/queries';

export default function CompanyReportsLoader( props ) {

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
  const [ company, setCompany ] = React.useState( null );

  return (
    <div className="scrollable fit-with-header p-20">
      <h2>Firmy</h2>

    <StatusAndDateFilter
      onTrigger={ () => {
        setFilterData({
          fromDate: fromDateData.reportsFromDate.valueOf()
            .toString(),
          toDate: toDateData.reportsToDate.valueOf()
            .toString(),
          statusActions: statusActionsData.reportsStatusActions.map((statusAction) => statusAction.value ),
        });
        setCompany(null);
      }}
      />
    { filterData !== null && <CompanyList filterData={filterData} setCompany={setCompany} /> }
    { company !== null && <CompanyInvoice company={company} /> }
    </div>
  );
}