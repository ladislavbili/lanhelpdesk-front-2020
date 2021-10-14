import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  pickSelectStyle,
} from 'configs/components/select';

import {
  Label,
  Button,
  FormGroup,
} from 'reactstrap';
import Select from 'react-select';

import Loading from 'components/loading';
import MonthSelector from 'reports/components/monthSelector';

import {
  setReportsFromDate,
  setReportsToDate,
} from 'apollo/localSchema/actions';

import {
  toSelArr,
} from 'helperFunctions';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE
} from 'apollo/localSchema/queries';

import {
  GET_BASIC_COMPANIES_WITH_RENTS,
} from 'helpdesk/settings/companies/queries';

export default function InvoicesFilter( props ) {
  const {
    onTrigger,
    company,
    setCompany,
    showByDate,
    showByCompany,
  } = props;

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );

  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );

  const {
    data: companiesData,
    loading: companiesLoading,
    refetch: companiesRefetch,
  } = useQuery( GET_BASIC_COMPANIES_WITH_RENTS, {
    fetchPolicy: 'network-only'
  } );

  if ( companiesLoading ) {
    return (
      <div className="max-width-850 m-t-10 m-b-20">
        <Loading />
      </div>
    );
  }

  const companies = toSelArr( companiesData.basicCompanies );

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
        onTrigger={showByDate}
        />
        <FormGroup>
          <Label>Select company</Label>
          <div className="flex-row">
            <div className="width-50-p p-r-20">
              <Select
                placeholder="Pick company"
                value={company}
                options={companies}
                onChange={(statusActions) => {
                  setCompany( statusActions );
                }}
                styles={pickSelectStyle()}
                />
            </div>
            <Button
              type="button"
              disabled={ company === null }
              className="btn-primary max-width-50"
              onClick={showByCompany}
              >
              Show
            </Button>
          </div>
        </FormGroup>
    </div>
  );
}