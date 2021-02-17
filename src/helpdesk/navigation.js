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

import ProjectEdit from 'helpdesk/components/projects/projectEdit';

import AccessDenied from 'components/accessDenied';

import TaskList from './task';

import NotificationList from './notifications';

import Loading from 'components/loading';
import RepeatsList from 'helpdesk/components/repeat/repeatsList';

import {
  GET_MY_DATA,
} from 'helpdesk/settings/users/queries';

export default function Navigation( props ) {
  //data & queries
  const {
    data: myData,
    refetch: myDataRefetch
  } = useQuery( GET_MY_DATA );

  const client = useApolloClient();

  const currentUser = myData ? myData.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  return (
    <div>
      <div className="page-header">
        <div className="center-ver row center flex">
          <SelectPage />
          <PageHeader {...props}
            settings={settings} />
        </div>
      </div>

      <div className="row center center-ver">
        <Switch>
        <Route path="/helpdesk/taskList/i/:filterID" component={Sidebar} />
        <Route path="/helpdesk" component={Sidebar} />
        </Switch>
        <div className="main">
          <Route exact path="/helpdesk/errorMessages" component={accessRights.viewErrors ? ErrorMessages : AccessDenied} />

          <Route exact path="/helpdesk" component={TaskList} />
          <Route exact path="/helpdesk/taskList" component={TaskList} />
          <Route exact path="/helpdesk/taskList/i/:listID" component={TaskList} />
          <Route exact path="/helpdesk/taskList/i/:listID/:taskID" component={TaskList} />
          <Route exact path="/helpdesk/notifications" component={NotificationList} />
          <Route exact path="/helpdesk/notifications/:notificationID/:taskID" component={NotificationList} />
          <Route exact path="/helpdesk/project/:projectID" component={ProjectEdit} />
          <Route exact path="/helpdesk/repeats" component={RepeatsList} />


          { /* SETTINGS */ }
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