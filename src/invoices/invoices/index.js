import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import Invoice from './invoice';
import InvoicesFilter from './filter';
import InvoicesListOfDates from './listOfDates';
import InvoicesListOfCompanies from './listOfCompanies';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function InvoicesLoader( props ) {

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );


  const [ company, setCompany ] = React.useState( null );
  const [ filteredByDate, setFilteredByDate ] = React.useState( false );
  const [ filteredByCompany, setFilteredByCompany ] = React.useState( false );

  const [ invoiceFilter, setInvoiceFilter ] = React.useState( null );

  return (
    <div className="scrollable fit-with-header p-20">
      <h2>Výkazy</h2>

      <InvoicesFilter
        showByDate={ () => {
          setFilteredByDate(true);
          setFilteredByCompany(false);
          setInvoiceFilter( null );
        }}
        showByCompany={ () => {
          setFilteredByCompany(true);
          setFilteredByDate(false);
          setInvoiceFilter( null );
        }}
        company={company}
        setCompany={setCompany}
        />
      { filteredByDate &&
        <InvoicesListOfCompanies
          fromDate={ fromDateData.reportsFromDate.valueOf().toString() }
          toDate={ toDateData.reportsToDate.valueOf().toString() }
          setInvoiceFilter={setInvoiceFilter}
          />
      }
      { filteredByCompany &&
        <InvoicesListOfDates
          company={ company }
          setInvoiceFilter={setInvoiceFilter}
          />
      }
      { invoiceFilter &&
        <Invoice
          invoiceFilter={invoiceFilter}
          />
      }
    </div>
  );
}