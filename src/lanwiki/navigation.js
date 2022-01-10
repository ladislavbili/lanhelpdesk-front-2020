import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import Sidebar from 'lanwiki/components/sidebar';
import ErrorMessages from 'components/errorMessages';
import PageHeader from 'components/PageHeader';
import SelectPage from 'components/SelectPage';
import PagesList from './pages/list';
import PageView from './pages/edit';

export default function LanwikiNavigation( props ) {
  //new Blob([str]).size;
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
          <Route exact path="/lanwiki/errorMessages" component={ErrorMessages} />
          <Route exact path='/lanwiki/i/:folderID' component={PagesList} />
          <Route exact path='/lanwiki/i/:folderID/p/:page' component={PagesList} />
          <Route exact path='/lanwiki/i/:folderID/p/:page/:pageID' component={PageView} />
				</div>
			</div>
		</div>
  );
}