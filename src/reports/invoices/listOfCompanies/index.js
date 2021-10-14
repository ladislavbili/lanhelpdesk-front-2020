import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import Loading from 'components/loading';
import ListOfCompanies from './listOfCompanies';

import {
  GET_BASIC_COMPANIES_WITH_RENTS,
} from 'helpdesk/settings/companies/queries';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function InvoicesListOfCompaniesLoader( props ) {
  const {
    setInvoiceFilter,
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
  }, [ fromDateData.reportsFromDate, toDateData.reportsToDate ] );

  if ( companiesLoading ) {
    return (
      <Loading />
    );
  }

  const companies = companiesData.basicCompanies;

  return (
    <ListOfCompanies
      companies={companies}
      setInvoiceFilter={setInvoiceFilter}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      />
  );
}