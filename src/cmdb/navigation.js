import React, {
  Component
} from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';
import ItemList from './items';
import ItemContainer from './items/itemContainer';
import ItemAdd from './items/itemAdd';
import ItemCategoryAdd from './settings/itemCategoryAdd';
import ItemCategoryEdit from './settings/itemCategoryEdit';
/*
import StatusList from './settings/statuses';
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
          <Route exact path='/cmdb/i/:itemCategoryID/i/add' component={ItemAdd} />
          <Route exact path='/cmdb/i/:itemCategoryID/:itemID' component={ItemContainer} />
          <Route exact path='/cmdb/add-category' component={ItemCategoryAdd} />
          <Route exact path='/cmdb/edit-category/:itemCategoryID' component={ItemCategoryEdit} />
        </div>
      </div>
    </div>
  );
}
/*

<Route exact path='/cmdb/settings/statuses' component={StatusList} />
<Route exact path='/cmdb/settings/status/add' component={StatusList} />
*/