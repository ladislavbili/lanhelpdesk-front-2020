import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import DateFilter from './filter';
import CompanyList from './companyList';
import CompanyInvoice from './companyInvoice';
import {
  useTranslation
} from "react-i18next";

export default function CompanyReportsLoader( props ) {

  const {
    t
  } = useTranslation();

  const [ filterData, setFilterData ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );

  return (
    <div className="scrollable fit-with-header p-20">
      <h2>{t('companies')}</h2>

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
    { company !== null && <CompanyInvoice filterData={filterData} company={company} /> }
    </div>
  );
}