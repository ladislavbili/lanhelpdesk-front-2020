import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import {testing} from '../helperFunctions';
import {setTasklistLayout} from '../redux/actions';
import {rebase} from '../index';
import settings from 'configs/constants/settings';

import Sidebar from './components/sidebar';
import ErrorMessages from 'components/errorMessages';

import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';

import TaskList from './task';

import NotificationList from './notifications';

class Navigation extends Component {
	constructor(props){
		super(props);
		this.setLayout.bind(this);
	}

	setLayout(layout){
		rebase.updateDoc('/users/'+this.props.currentUser.id, {tasklistLayout:layout})
		this.props.setTasklistLayout(layout);
	}

	render() {
		return (
			<div>
				<div className="page-header">
					<div className="center-ver row center flex">
						<SelectPage />
						<PageHeader {...this.props}
							showLayoutSwitch={true}
							setLayout={this.setLayout.bind(this)}
							layout={this.props.layout}
							dndLayout={true}
							calendarLayout={true}
							settings={settings} />
					</div>
				</div>

				<div className="row center center-ver h-100vh">
						<Sidebar {...this.props} />
						<div className="main">
							<Route exact path="/helpdesk/errorMessages" component={ErrorMessages} />

							<Route exact path="/helpdesk" component={TaskList} />
							<Route exact path="/helpdesk/taskList" component={TaskList} />
							<Route exact path="/helpdesk/taskList/i/:listID" component={TaskList} />
							<Route exact path="/helpdesk/taskList/i/:listID/:taskID" component={TaskList} />
							<Route exact path="/helpdesk/notifications" component={NotificationList} />
							<Route exact path="/helpdesk/notifications/:notificationID/:taskID" component={NotificationList} />

							{ /* SETTINGS */ }
							{ settings.map( (item) =>
									<Route exact key={item.link} path={`/helpdesk/settings/${item.link}`} component={item.component} />
							)}
							{ settings.map( (item) =>
									<Route exact key={item.link} path={`/helpdesk/settings/${item.link}/:id`} component={item.component} />
							)}

					</div>
			</div>
		</div>
	);
}
}

const mapStateToProps = ({taskReducer, userReducer}) => {
	return {layout:taskReducer.tasklistLayout, currentUser:userReducer };
};

export default connect(mapStateToProps, { setTasklistLayout })(Navigation);
