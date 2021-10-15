import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  pickSelectStyle
} from 'configs/components/select';

import {
  Label
} from 'reactstrap';
import Select from 'react-select';

import MonthSelector from 'reports/components/monthSelector';

import {
  setReportsFromDate,
  setReportsToDate,
} from 'apollo/localSchema/actions';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function CompanyFilter( props ) {
  const {
    onTrigger,
  } = props;

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );

  return (
    <div className="max-width-850 m-t-10 m-b-20">
      <MonthSelector
        fromDate={fromDateData.reportsFromDate}
        onChangeFromDate={(date) => {
          setReportsFromDate( date );
        }}
        toDate={toDateData.reportsToDate}
        onChangeToDate={(date) => {
          setReportsToDate( date );
        }}
        onTrigger={onTrigger}
        />
    </div>
  );
}