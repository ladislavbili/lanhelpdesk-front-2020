import React, {
  Component
} from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import Sidebar from './Sidebar';
import ErrorMessages from 'components/errorMessages';
import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';
import ItemList from './items';
import ItemContainer from './items/itemContainer';
/*
import SidebarItemAdd from './settings/sidebarItemAdd';
import SidebarItemEdit from './settings/sidebarItemEdit';
import StatusList from './settings/statuses';
import ItemAdd from './items/itemAdd';
*/

export default function Navigation( props ) {

  return (
    <div>
      <div className="page-header">
        <div className="center-ver row center flex">
          <SelectPage />
          <PageHeader {...props} settings={[{link:'statuses', title:'Statuses'}]} />
        </div>
      </div>

      <div className="row center center-ver cmdb">
        <Switch>
          <Route path="/cmdb/i/:itemCategoryID" component={Sidebar} />
          <Route path="/cmdb" component={Sidebar} />
        </Switch>
        <div className="main">
          <Route exact path='/cmdb/i/:itemCategoryID' component={ItemList} />
          <Route exact path='/cmdb/i/:itemCategoryID/:itemID' component={ItemContainer} />
        </div>
      </div>
    </div>
  );
}
/*
<Route exact path="/cmdb/errorMessages" component={ErrorMessages} />
<Route exact path='/cmdb/add' component={SidebarItemAdd} />
<Route exact path='/cmdb/edit/:sidebarID' component={SidebarItemEdit} />
<Route exact path='/cmdb/i/:sidebarID/i/add' component={ItemAdd} />
<Route exact path='/cmdb/i/:sidebarID/:itemID' component={ItemContainer} />


<Route exact path='/cmdb/settings/statuses' component={StatusList} />
<Route exact path='/cmdb/settings/status/add' component={StatusList} />
*/