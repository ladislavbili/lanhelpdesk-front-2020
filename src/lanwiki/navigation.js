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

import Sidebar from './Sidebar';
import ErrorMessages from 'components/errorMessages';
import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';
import ListNotes from './Notes';
import TagAdd from './Tags/TagAdd';
import TagEdit from './Tags/TagEdit';

import {
  layout
} from './constants';

export default function Navigation( props ) {

  return (
    <div>
			<div className="page-header">
				<div className="center-ver row center flex">
					<SelectPage />
					<PageHeader {...props}
						setLayout={() => {}}
						layout={layout}
						showLayoutSwitch={true}
						/>
				</div>
			</div>

			<div className="row center center-ver">
        <Switch>
          <Route path="/lanwiki/i/:listID" component={Sidebar} />
          <Route path="/lanwiki" component={Sidebar} />
        </Switch>
				<div className="main">
					<Route exact path='/lanwiki' component={ListNotes} />
          <Route exact path="/lanwiki/errorMessages" component={ErrorMessages} />
          <Route exact path='/lanwiki/i/:listID' component={ListNotes} />
          <Route exact path='/lanwiki/i/:listID/:noteID' component={ListNotes} />
          <Route exact path='/lanwiki/tag-add' component={TagAdd} />
          <Route exact path='/lanwiki/tag-edit/:listID' component={TagEdit} />
				</div>
			</div>
		</div>
  );
}