import React from 'react';
import {
  useQuery,
} from "@apollo/client";
import moment from 'moment';

import Loading from 'components/loading';
import InvoiceListOfDates from './listOfDates';

import {
  months
} from 'configs/constants/reports';

import {
  INVOICE_DATES_OF_COMPANY,
} from 'invoices/queries';

export default function InvoicesListOfDatesLoader( props ) {
  const {
    company,
  } = props;

  const {
    data: invoiceDatesOfCompanyData,
    loading: invoiceDatesOfCompanyLoading,
    refetch: invoiceDatesOfCompanyRefetch,
  } = useQuery( INVOICE_DATES_OF_COMPANY, {
    variables: {
      companyId: company.id,
    },
  } );

  React.useEffect( () => {
    invoiceDatesOfCompanyRefetch( {
      variables: {
        companyId: company.id,
      },
    } );
  }, [ company.id ] );

  if ( invoiceDatesOfCompanyLoading ) {
    return (
      <Loading />
    );
  }

  return (
    <InvoiceListOfDates dates={invoiceDatesOfCompanyData.invoiceDatesOfCompany.map((date) => ({ ...date, month: months.find((month) => month.value === date.month )  }) )} {...props} />
  );
}