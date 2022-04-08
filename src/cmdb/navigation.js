import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import AccessDenied from 'components/accessDenied';
import Sidebar from 'cmdb/components/sidebar';
import ErrorMessages from 'components/errorMessages';
import NotificationList from 'components/notifications';
import PageHeader from 'components/PageHeader';
import SelectPage from 'components/SelectPage';
import ManualsList from './manuals/list';
import ManualAdd from './manuals/add';
import ManualEdit from './manuals/edit';
import SchemeLoader from './scheme';
import ItemsList from './items/list';
import ItemView from './items/edit';
import RepeatsList from 'helpdesk/components/repeat/repeatsList';

import {
  getMyData,
} from 'helperFunctions';

export default function CMDBNavigation( props ) {
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
          <Route path="/cmdb/i/:categoryID" component={Sidebar} />
          <Route path="/cmdb/scheme/:companyID" component={Sidebar} />
          <Route path="/cmdb/manuals/:companyID" component={Sidebar} />
          <Route path="/cmdb" component={Sidebar} />
        </Switch>
        <div className="main">
          <Route exact path="/cmdb/errorMessages" component={accessRights.viewErrors ? ErrorMessages : AccessDenied} />
          <Route exact path="/cmdb/notifications" component={NotificationList} />
          <Route exact path="/cmdb/notifications/:notificationID" component={NotificationList} />
          <Route exact path='/cmdb/scheme/:companyID' component={SchemeLoader} />
          <Route exact path='/cmdb/manuals/:companyID' component={ManualsList} />
          <Route exact path='/cmdb/manuals/:companyID/p/:page' component={ManualsList} />
          <Route exact path='/cmdb/manuals/:companyID/add' component={ManualAdd} />
          <Route exact path='/cmdb/manuals/:companyID/p/:page/:manualID' component={ManualEdit} />
          <Route exact path='/cmdb/i/:categoryID' component={ItemsList} />
          <Route exact path='/cmdb/i/:categoryID/p/:page' component={ItemsList} />
          <Route exact path='/cmdb/i/:categoryID/p/:page/:itemID' component={ItemView} />
          <Route exact path="/cmdb/repeats/i/:categoryID" component={RepeatsList} />
        </div>
      </div>
    </div>
  );
}