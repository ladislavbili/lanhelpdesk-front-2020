import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import Loading from 'components/loading';
import CompanyList from './companyList';

import {
  GET_BASIC_COMPANIES_WITH_RENTS,
} from 'helpdesk/settings/companies/queries';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function CompanyListLoader( props ) {
  const {
    filterData,
    setCompany,
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

  React.useEffect( () => {
    companiesRefetch();
  }, [ filterData ] );

  if ( companiesLoading ) {
    return (
      <Loading />
    );
  }

  const companies = companiesData.basicCompanies;

  return (
    <CompanyList
      companies={companies}
      setCompany={setCompany}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      />
  );
}