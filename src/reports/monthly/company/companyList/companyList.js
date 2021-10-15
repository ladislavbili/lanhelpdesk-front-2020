import React from 'react';

import Loading from 'components/loading';

import {
  timestampToString,
} from 'helperFunctions';

export default function CompanyList( props ) {
  const {
    companies,
    fromDate,
    toDate,
    setCompany,
  } = props;

  return (
    <div className="m-t-10 m-b-20">
      <table className="table bkg-white row-highlight">
        <thead>
          <tr>
            <th>Company name</th>
            <th>Works</th>
            <th>Trips</th>
            <th>Materials</th>
            <th>Rented items</th>
          </tr>
        </thead>
        <tbody>
          { companies.map( (companyData) => (
            <tr
              key={companyData.company.id}
              className="clickable"
              onClick={() => setCompany(companyData) }
              >
              <td>{companyData.company.title}</td>
              <td>{companyData.works}</td>
              <td>{companyData.trips}</td>
              <td>{companyData.materials}</td>
              <td>{companyData.company.companyRents.reduce((acc, companyRent) => acc + companyRent.quantity , 0)}</td>
            </tr>
          )) }
          { companies.length === 0 &&
            <tr
              key="no-items"
              >
              <td colSpan="6">{`No invoiceable companies in date range ${timestampToString(fromDate.valueOf())} - ${timestampToString(toDate.valueOf())}`}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}