import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";

import {testing} from '../helperFunctions';

import Sidebar from './Sidebar';
import ErrorMessages from 'components/errorMessages';
import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';
import GeneralReports from './general';
import CompanyMonthlyReport from './monthly/company';
import AssignedMonthlyReport from './monthly/assigned';
import CompanyInvoices from './invoices/company';

import StatusList from './../helpdesk/settings/statuses';
import ProjectList from './../helpdesk/settings/projects';
import CompanyList from './../helpdesk/settings/companies';
import UserList from './../helpdesk/settings/users';
import PriceList from './../helpdesk/settings/prices';
import TagList from './../helpdesk/settings/tags';
import TaskTypeList from './../helpdesk/settings/taskTypes';
import ImapList from './../helpdesk/settings/imaps';
import SMTPList from './../helpdesk/settings/smtps';

class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="page-header">
					<div className="center-ver row center flex">
						<SelectPage />
						<PageHeader {...this.props}
							settings={
							[{title:'Projects',link:'projects'},
							{title:'Statuses',link:'statuses'},
							{title:'Companies',link:'companies'},
							{title:'Users',link:'users'},
							{title:'Prices',link:'pricelists'},
							{title:'Tags',link:'tags'},
							{title:'Task types',link:'taskTypes'},
							{title:'Imaps',link:'imaps'},
							{title:'SMTPs',link:'smtps'},
						]} />
					</div>
				</div>

				<div className="row center center-ver h-100vh">
						<Sidebar {...this.props} />
					<div className="main">
					<Route exact path="/reports" component={GeneralReports} />
					<Route exact path="/reports/errorMessages" component={ErrorMessages} />
					<Route exact path="/reports/i/:id" component={GeneralReports} />
					<Route exact path="/reports/monthly/companies" component={CompanyMonthlyReport} />
					<Route exact path="/reports/monthly/requester" component={AssignedMonthlyReport} />
					<Route exact path="/reports/company_invoices" component={CompanyInvoices} />

					<Route exact path='/reports/settings/statuses' component={StatusList} />
	        <Route exact path='/reports/settings/statuses/:id' component={StatusList} />
	        <Route exact path='/reports/settings/projects' component={ProjectList} />
	        <Route exact path='/reports/settings/projects/:id' component={ProjectList} />
	        <Route exact path='/reports/settings/companies' component={CompanyList} />
	        <Route exact path='/reports/settings/companies/:id' component={CompanyList} />
	        <Route exact path='/reports/settings/users' component={UserList} />
	        <Route exact path='/reports/settings/users/:id' component={UserList} />
	        <Route exact path='/reports/settings/pricelists' component={PriceList} />
	        <Route exact path='/reports/settings/pricelists/:id' component={PriceList} />
					<Route exact path='/reports/settings/tags' component={TagList} />
					<Route exact path='/reports/settings/tags/:id' component={TagList} />
					<Route exact path='/reports/settings/taskTypes' component={TaskTypeList} />
	        <Route exact path='/reports/settings/taskTypes/:id' component={TaskTypeList} />
					<Route exact path='/reports/settings/imaps' component={ImapList} />
					<Route exact path='/reports/settings/imaps/:id' component={ImapList} />
					<Route exact path='/reports/settings/smtps' component={SMTPList} />
					<Route exact path='/reports/settings/smtps/:id' component={SMTPList} />
				</div>
			</div>
		</div>
	);
}
}

const mapStateToProps = ({ userReducer }) => {
	return { currentUser:userReducer };
};

export default connect(mapStateToProps, { })(Navigation);
