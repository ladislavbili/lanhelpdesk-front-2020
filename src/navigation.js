import React, {
  Component
} from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import Reroute from 'reroute';
import HelpdeskNavigation from 'helpdesk/navigation';
import ReportsNavigation from 'reports/navigation';
import LanwikiNavigation from 'lanwiki/navigation';

export default class Navigation extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Reroute} />
          <Route path='/helpdesk' component={HelpdeskNavigation} />
          <Route path='/reports' component={ReportsNavigation} />
          <Route path='/lanwiki' component={LanwikiNavigation} />
        </Switch>
      </BrowserRouter>
    )
  }
}