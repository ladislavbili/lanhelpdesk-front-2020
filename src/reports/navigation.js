import React from 'react';

import {
  useQuery
} from "@apollo/client";

import {
  Route
} from 'react-router-dom';
import {
  getMyData,
} from 'helperFunctions';
import RerouteToMonthlyCompany from './rerouteToMonthlyCompany';

import Sidebar from './Sidebar';
import ErrorMessages from 'components/errorMessages';
import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';
import CompanyMonthlyReport from './monthly/company';
import AssignedMonthlyReport from './monthly/assigned';
import CompanyInvoices from './invoices/company';
import AccessDenied from 'components/accessDenied';

import settings from 'configs/constants/settings';

export default function Navigation( props ) {

  const currentUser = getMyData();
  const accessRights = currentUser ? currentUser.role.accessRights : {};
  return (
    <div>
      <div className="page-header">
        <div className="center-ver row center flex">
          <SelectPage />
          <PageHeader
            {...props}
            settings={settings}
            />
        </div>
      </div>

      <div className="row center center-ver h-100vh">
        <Sidebar {...props} canSeeVykazy={accessRights.vykazy} />
        <div className="main">

          { accessRights.vykazy && <Route exact path="/reports" component={RerouteToMonthlyCompany} /> }
          { accessRights.vykazy && accessRights.viewErrors && <Route exact path="/reports/errorMessages" component={ErrorMessages} /> }
          { accessRights.vykazy && <Route exact path="/reports/monthly/companies" component={CompanyMonthlyReport} /> }
          { accessRights.vykazy && <Route exact path="/reports/monthly/requester" component={AssignedMonthlyReport} /> }
          { accessRights.vykazy && <Route exact path="/reports/company_invoices" component={CompanyInvoices} /> }


          { /* SETTINGS */ }
          { settings.map( (item) => {
            if (accessRights[item.value]){
              return (<Route exact key={item.link} path={`/reports/settings/${item.link}`} component={item.component} />);
            }
            return (<Route exact key={item.link} path={`/reports/settings/${item.link}`} component={AccessDenied} />);
          })}
          { settings.map( (item) =>{
            if (accessRights[item.value]){
              return (<Route exact key={item.link} path={`/reports/settings/${item.link}/:id`} component={item.component} />);
            }
            return (<Route exact key={item.link} path={`/reports/settings/${item.link}/:id`} component={AccessDenied} />);
          })}
        </div>
      </div>
    </div>
  );
}