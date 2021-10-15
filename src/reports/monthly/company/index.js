import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import DateFilter from './filter';
import CompanyList from './companyList';
import CompanyInvoice from './companyInvoice';

export default function CompanyReportsLoader( props ) {

  const [ filterData, setFilterData ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );

  return (
    <div className="scrollable fit-with-header p-20">
      <h2>Firmy</h2>

    <DateFilter
      onTrigger={ (fromDate, toDate) => {
        setFilterData({
          fromDate: fromDate.valueOf()
            .toString(),
          toDate: toDate.valueOf()
            .toString(),
        });
        setCompany(null);
      }}
      />
    { filterData !== null && <CompanyList filterData={filterData} setCompany={setCompany} /> }
    { company !== null && <CompanyInvoice company={company} /> }
    </div>
  );
}