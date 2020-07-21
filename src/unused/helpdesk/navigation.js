import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import Reports from './reports';

import TaskList from './task/';

import StatusList from './settings/statuses';
import ProjectList from './settings/projects';
import UnitList from './settings/units';
import CompanyList from './settings/companies';
import WorkTypeList from './settings/workTypes';
import UserList from './settings/users';
import PriceList from './settings/prices';
import SupplierList from './settings/suppliers';
import SupplierInvoiceList from './settings/supplierInvoices';
import TagList from './settings/tags';
import TaskTypeList from './settings/taskTypes';
import ImapList from './settings/imaps';
import SMTPList from './settings/smtps';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="main">

					<PageHeader {...this.props}
						showLayoutSwitch={true}
						settings={
						[{title:'Projects',link:'projects'},
						{title:'Statuses',link:'statuses'},
						{title:'Units',link:'units'},
						{title:'Companies',link:'companies'},
						{title:'Work Type',link:'workTypes'},
						{title:'Users',link:'users'},
						{title:'Prices',link:'pricelists'},
						{title:'Supplier',link:'suppliers'},
						{title:'Tags',link:'tags'},
						{title:'Invoices',link:'supplierInvoices'},
						{title:'Task types',link:'taskTypes'},
						{title:'Imaps',link:'imaps'},
						{title:'SMTPs',link:'smtps'},
					]} />

					<Route exact path="/helpdesk/reports" component={Reports} />
					<Route exact path="/helpdesk/reports/:id" component={Reports} />
					<Route exact path="/helpdesk" component={TaskList} />
					<Route exact path="/helpdesk/taskList" component={TaskList} />
					<Route exact path="/helpdesk/taskList/i/:listID" component={TaskList} />
					<Route exact path="/helpdesk/taskList/i/:listID/:taskID" component={TaskList} />

					<Route exact path='/helpdesk/settings/statuses' component={StatusList} />
          <Route exact path='/helpdesk/settings/statuses/:id' component={StatusList} />
          <Route exact path='/helpdesk/settings/projects' component={ProjectList} />
          <Route exact path='/helpdesk/settings/projects/:id' component={ProjectList} />
          <Route exact path='/helpdesk/settings/units' component={UnitList} />
          <Route exact path='/helpdesk/settings/units/:id' component={UnitList} />
          <Route exact path='/helpdesk/settings/companies' component={CompanyList} />
          <Route exact path='/helpdesk/settings/companies/:id' component={CompanyList} />
          <Route exact path='/helpdesk/settings/workTypes' component={WorkTypeList} />
          <Route exact path='/helpdesk/settings/workTypes/:id' component={WorkTypeList} />
          <Route exact path='/helpdesk/settings/users' component={UserList} />
          <Route exact path='/helpdesk/settings/users/:id' component={UserList} />
          <Route exact path='/helpdesk/settings/pricelists' component={PriceList} />
          <Route exact path='/helpdesk/settings/pricelists/:id' component={PriceList} />
          <Route exact path='/helpdesk/settings/suppliers' component={SupplierList} />
          <Route exact path='/helpdesk/settings/suppliers/:id' component={SupplierList} />
          <Route exact path='/helpdesk/settings/supplierInvoices' component={SupplierInvoiceList} />
          <Route exact path='/helpdesk/settings/supplierInvoices/:id' component={SupplierInvoiceList} />
					<Route exact path='/helpdesk/settings/tags' component={TagList} />
					<Route exact path='/helpdesk/settings/tags/:id' component={TagList} />
					<Route exact path='/helpdesk/settings/taskTypes' component={TaskTypeList} />
          <Route exact path='/helpdesk/settings/taskTypes/:id' component={TaskTypeList} />
					<Route exact path='/helpdesk/settings/imaps' component={ImapList} />
					<Route exact path='/helpdesk/settings/imaps/:id' component={ImapList} />
					<Route exact path='/helpdesk/settings/smtps' component={SMTPList} />
					<Route exact path='/helpdesk/settings/smtps/:id' component={SMTPList} />
				</div>
			</div>
		</div>
	);
}
}
