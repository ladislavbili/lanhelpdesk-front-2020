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
import Reroute from './reroute';

import AccessDenied from 'components/accessDenied';

import SelectPage from '../components/SelectPage';
import PageHeader from '../components/PageHeader';
import Sidebar from './components/sidebar';
import ErrorMessages from 'components/errorMessages';
import NotificationList from 'components/notifications';

import AgentMonthlyReport from './monthly/agent';
import CompanyMonthlyReport from './monthly/company';
import Invoices from './invoices';

export default function Navigation( props ) {


  const [ sidebarOpen, setSidebarOpen ] = React.useState( true );

  const currentUser = getMyData();
  const accessRights = currentUser ? currentUser.role.accessRights : {};
  return (
    <div>
      <div className="page-header">
        <div className="center-ver row center flex">
          <SelectPage  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} history={props.history} />
          <PageHeader {...props} />
        </div>
      </div>

      <div className="row center center-ver h-100vh">
        <Sidebar {...props} canSeeVykazy={accessRights.vykazy} />
        <div className="main">

          { accessRights.vykazy && <Route exact path="/reports" component={Reroute} /> }
          { accessRights.vykazy && accessRights.viewErrors && <Route exact path="/reports/errorMessages" component={ErrorMessages} /> }
          { accessRights.vykazy && <Route exact path="/reports/monthly/companies" component={CompanyMonthlyReport} /> }
          { accessRights.vykazy && <Route exact path="/reports/monthly/agents" component={AgentMonthlyReport} /> }
          { accessRights.vykazy && <Route exact path="/reports/invoices" component={Invoices} /> }
          <Route exact path="/helpdesk/notifications" component={NotificationList} />
          <Route exact path="/helpdesk/notifications/:notificationID" component={NotificationList} />
        </div>
      </div>
    </div>
  );
}