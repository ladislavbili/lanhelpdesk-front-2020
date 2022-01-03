import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import Sidebar from 'lanwiki/components/sidebar';
import ErrorMessages from 'components/errorMessages';
import PageHeader from 'components/PageHeader';
import SelectPage from 'components/SelectPage';
import ListNotes from './notes';
import TagAdd from './tags/add';
import TagEdit from './tags/edit';

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
					<Route exact path='/lanwiki' component={ListNotes} />
          <Route exact path='/lanwiki/archive' component={ListNotes} />
          <Route exact path="/lanwiki/errorMessages" component={ErrorMessages} />

          <Route exact path='/lanwiki/i/:folderID' component={ListNotes} />
          <Route exact path='/lanwiki/i/:folderID/note/:noteID' component={ListNotes} />
          <Route exact path='/lanwiki/tag/add' component={TagAdd} />
          <Route exact path='/lanwiki/tag/:tagID' component={TagEdit} />
				</div>
			</div>
		</div>
  );
}