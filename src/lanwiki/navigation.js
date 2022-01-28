import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import AccessDenied from 'components/accessDenied';
import Sidebar from 'lanwiki/components/sidebar';
import ErrorMessages from 'components/errorMessages';
import NotificationList from 'components/notifications';
import PageHeader from 'components/PageHeader';
import SelectPage from 'components/SelectPage';
import PagesList from './pages/list';
import PageView from './pages/edit';

import {
  getMyData,
} from 'helperFunctions';

export default function LanwikiNavigation( props ) {
  //new Blob([str]).size;
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
          <Route path="/lanwiki/i/:folderID" component={Sidebar} />
          <Route path="/lanwiki" component={Sidebar} />
        </Switch>
        <div className="main">
          <Route exact path="/lanwiki/errorMessages" component={accessRights.viewErrors ? ErrorMessages : AccessDenied} />
          <Route exact path="/lanwiki/notifications" component={NotificationList} />
          <Route exact path="/lanwiki/notifications/:notificationID" component={NotificationList} />
          <Route exact path='/lanwiki/i/:folderID' component={PagesList} />
          <Route exact path='/lanwiki/i/:folderID/p/:page' component={PagesList} />
          <Route exact path='/lanwiki/i/:folderID/p/:page/:pageID' component={PageView} />
        </div>
      </div>
    </div>
  );
}