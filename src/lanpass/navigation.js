import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import PageHeader from 'components/PageHeader';
import SelectPage from 'components/SelectPage';
import Sidebar from 'lanpass/components/sidebar';
import AccessDenied from 'components/accessDenied';
import ErrorMessages from 'components/errorMessages';
import NotificationList from 'components/notifications';

import PasswordsList from './passwords/list';
import PasswordView from './passwords/edit';

import {
  getMyData,
} from 'helperFunctions';

export default function LanpassNavigation( props ) {

  const currentUser = getMyData();
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  return (
    <div>
      <div className="page-header">
        <div className="center-ver row center flex">
          <SelectPage {...props} />
          <PageHeader {...props} />
        </div>
      </div>

      <div className="row center center-ver">
          <Switch>
            <Route path="/lanpass/i/:folderID" component={Sidebar} />
            <Route path="/lanpass" component={Sidebar} />
          </Switch>
          <div className="main">
            <Route exact path="/lanpass/errorMessages" component={accessRights.viewErrors ? ErrorMessages : AccessDenied} />
            <Route exact path="/lanpass/notifications" component={NotificationList} />
            <Route exact path="/lanpass/notifications/:notificationID" component={NotificationList} />
            <Route exact path='/lanpass/i/:folderID' component={PasswordsList} />
            <Route exact path='/lanpass/i/:folderID/p/:page' component={PasswordsList} />
            <Route exact path='/lanpass/i/:folderID/p/:page/:passwordID' component={PasswordView} />
          </div>
      </div>
    </div>
  );
}
