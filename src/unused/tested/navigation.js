import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import Reports from './reports';

import TaskList from './task/TaskList';
import TaskTop3 from './task/TaskTop3';

/*
import TaskListSearch from './tested/TaskListSearch';
import TaskTop from './tested/TaskTop';
import TaskTop2 from './tested/TaskTop2';
import TaskTop4 from './tested/TaskTop4';
import TaskTopChiptask from './tested/TaskTopChiptask';
import TaskSideLeft2 from './tested/TaskSideLeft2';
import TaskSide from './tested/TaskSide';
import TaskSide2 from './tested/TaskSide2';
import TaskSide3 from './tested/TaskSide3';
import TasksTwoEditRow from './tested/TasksTwoEditRow';
import TaskSideLeft from './tested/TaskSideLeft';
*/
import StatusList from './settings/statusList';
import ProjectList from './settings/projectList';
import UnitList from './settings/unitList';
import CompanyList from './settings/companyList';
import WorkTypeList from './settings/workTypeList';
import UserList from './settings/userList';
import PriceList from './settings/priceList';
import SupplierList from './settings/supplierList';
import SupplierInvoiceList from './settings/supplierInvoiceList';


export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">

					<PageHeader {...this.props} settings={
						[{title:'Projects',link:'projects'},
						{title:'Statuses',link:'statuses'},
						{title:'Units',link:'units'},
						{title:'Companies',link:'companies'},
						{title:'Work Type',link:'workTypes'},
						{title:'Users',link:'users'},
						{title:'Prices',link:'pricelists'},
						{title:'Supplier',link:'suppliers'},
						{title:'Invoices',link:'supplierInvoices'}]
					} />
					<Route exact path="/helpdesk/Reports" component={Reports} />
					<Route exact path="/helpdesk" component={TaskList} />
					<Route exact path="/helpdesk/taskList" component={TaskList} />
					<Route exact path="/helpdesk/taskList/:taskID" component={TaskList} />

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

					<Route exact path="/helpdesk/taskListSearch" component={TaskListSearch} />
					<Route exact path="/helpdesk/taskTop" component={TaskTop} />
					<Route exact path="/helpdesk/taskTop2" component={TaskTop2} />
					<Route exact path="/helpdesk/taskTop3" component={TaskTop3} />
					<Route exact path="/helpdesk/taskTop4" component={TaskTop4} />
					<Route exact path="/helpdesk/TaskTopChiptask" component={TaskTopChiptask} />
					<Route exact path="/helpdesk/taskSide" component={TaskSide} />
					<Route exact path="/helpdesk/taskSide2" component={TaskSide2} />
					<Route exact path="/helpdesk/taskSide3" component={TaskSide3} />
					<Route exact path="/helpdesk/tasksTwoEditRow" component={TasksTwoEditRow} />
					<Route exact path="/helpdesk/taskSideLeft" component={TaskSideLeft} />
					<Route exact path="/helpdesk/taskSideLeft2" component={TaskSideLeft2} />

				</div>
			</div>
		</div>
	);
}
}
