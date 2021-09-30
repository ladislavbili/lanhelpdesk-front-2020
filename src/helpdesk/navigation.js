import React from 'react';
import {
  useQuery,
  useMutation,
  gql,
  useApolloClient,
} from "@apollo/client";

import {
  Route,
  Switch
} from 'react-router-dom';
import settings from 'configs/constants/settings';

import Sidebar from './components/sidebar';
import ErrorMessages from 'components/errorMessages';

import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';

import ProjectAdd from 'helpdesk/settings/projects/projectAdd';
import ProjectEdit from 'helpdesk/components/projects/projectEdit';

import AccessDenied from 'components/accessDenied';

import TaskList from './task/tasklist';

import NotificationList from 'components/notifications';

import Loading from 'components/loading';
import RepeatsList from 'helpdesk/components/repeat/repeatsList';
import CompanyList from 'helpdesk/settings/companies';
import CompanyEdit from 'helpdesk/settings/companies/companyEdit';
import UserList from 'helpdesk/settings/users';

import {
  getMyData,
} from 'helperFunctions';

export default function Navigation( props ) {
  //data & queries

  const [ sidebarOpen, setSidebarOpen ] = React.useState( true );

  const client = useApolloClient();

  const currentUser = getMyData();
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  return (
    <div>
      <div className="page-header">
        <div className="center-ver row center flex">
          <SelectPage sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} history={props.history} />
          <PageHeader {...props} />
        </div>
      </div>

      <div className="row center center-ver">
        <Switch>
        <Route path="/helpdesk/taskList/i/:filterID" render={(props) => <Sidebar {...props} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
        <Route path="/helpdesk" render={(props) => <Sidebar {...props} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
        </Switch>
        <div className="main">
          <Route exact path="/helpdesk/errorMessages" component={accessRights.viewErrors ? ErrorMessages : AccessDenied} />

          <Route exact path="/helpdesk" component={TaskList} />
          <Route exact path="/helpdesk/taskList/i/:listID" component={TaskList} />
          <Route exact path="/helpdesk/taskList/i/:listID/p/:page" component={TaskList} />
          <Route exact path="/helpdesk/taskList/i/:listID/:taskID" component={TaskList} />
          <Route exact path="/helpdesk/taskList/i/:listID/p/:page/:taskID" component={TaskList} />
          <Route exact path="/helpdesk/notifications" component={NotificationList} />
          <Route exact path="/helpdesk/notifications/:notificationID" component={NotificationList} />
          { accessRights.addProjects ? <Route exact path="/helpdesk/project/add" component={ProjectAdd} /> : <Route exact path="/helpdesk/project/add" component={AccessDenied} /> }
          <Route exact path="/helpdesk/project/:projectID/:tabId" component={ProjectEdit} />
          <Route exact path="/helpdesk/repeats" component={RepeatsList} />
          <Route exact path="/helpdesk/companies" component={CompanyList} />
          { accessRights.companies ? <Route exact path="/helpdesk/companies" component={CompanyList} /> : <Route exact path="/helpdesk/companies" component={AccessDenied} /> }
          { accessRights.companies ? <Route exact path="/helpdesk/companies/:id" component={CompanyList} /> : <Route exact path="/helpdesk/companies/:id" component={AccessDenied} /> }
          { accessRights.users ? <Route exact path="/helpdesk/users" component={UserList} /> : <Route exact path="/helpdesk/users" component={AccessDenied} /> }
          { accessRights.users ? <Route exact path="/helpdesk/users/:id" component={UserList} /> : <Route exact path="/helpdesk/users/:id" component={AccessDenied} /> }

          { /* SETTINGS */ }
          { accessRights.companies && <Route exact key='defCompany' path="/helpdesk/settings/company/:id" component={ CompanyEdit } /> }
          { settings.map( (item) => {
            if (accessRights[item.value]){
              return (<Route exact key={item.link} path={`/helpdesk/settings/${item.link}`} component={item.component} />);
            }
            return (<Route exact key={item.link} path={`/helpdesk/settings/${item.link}`} component={AccessDenied} />);
          })}
          { settings.map( (item) =>{
            if (accessRights[item.value]){
              return (<Route exact key={item.link} path={`/helpdesk/settings/${item.link}/:id`} component={item.component} />);
            }
            return (<Route exact key={item.link} path={`/helpdesk/settings/${item.link}/:id`} component={AccessDenied} />);
          })}

        </div>
      </div>
    </div>
  );
}