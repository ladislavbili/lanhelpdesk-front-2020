import React from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Route } from 'react-router-dom';
import {testing} from '../helperFunctions';
import settings from 'configs/constants/settings';

import Sidebar from './components/sidebar';
import ErrorMessages from 'components/errorMessages';

import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';

import AccessDenied from 'components/accessDenied';

import TaskList from './task';

import NotificationList from './notifications';

const GET_MY_DATA = gql`
query {
  getMyData{
    id
		tasklistLayout
    role {
      accessRights {
        users
        companies
        pausals
        projects
        statuses
        units
        prices
        suppliers
        tags
        invoices
        roles
        taskTypes
        tripTypes
        imaps
        smtps
      }
    }
  }
}
`;


const UPDATE_USER = gql`
mutation updateUser($id: Int!, $tasklistLayout: TasklistLayoutEnum) {
  updateUser(
    id: $id,
    tasklistLayout: $tasklistLayout,
  ){
    id
  }
}
`;


export default function Navigation (props) {
  //data & queries
  const { history, match, layout } = props;
  const { data, loading } = useQuery(GET_MY_DATA);
  const [updateUser, {updateData}] = useMutation(UPDATE_USER);

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};
  const tasklistLayout = currentUser.tasklistLayout ? currentUser.tasklistLayout  : 0;

	const setLayout = (value) => {
		updateUserFunc(value);
		props.setTasklistLayout(value);
	}

	// functions
	const updateUserFunc = (value) => {
		updateUser({ variables: {
			id: parseInt(match.params.id),
			tasklistLayout: value,
		} }).then( ( response ) => {
		}).catch( (err) => {
			console.log(err.message);
		});
	};

//	accessRights["users"] = false;

		return (
			<div>
				<div className="page-header">
					<div className="center-ver row center flex">
						<SelectPage />
						<PageHeader {...props}
							showLayoutSwitch={true}
							setLayout={(value) => setLayout(value)}
							layout={layout}
							dndLayout={true}
							calendarLayout={true}
							settings={settings} />
					</div>
				</div>

				<div className="row center center-ver h-100vh">
						<Sidebar {...props} />
						<div className="main">
							<Route exact path="/helpdesk/errorMessages" component={ErrorMessages} />

							<Route exact path="/helpdesk" component={TaskList} />
							<Route exact path="/helpdesk/taskList" component={TaskList} />
							<Route exact path="/helpdesk/taskList/i/:listID" component={TaskList} />
							<Route exact path="/helpdesk/taskList/i/:listID/:taskID" component={TaskList} />
							<Route exact path="/helpdesk/notifications" component={NotificationList} />
							<Route exact path="/helpdesk/notifications/:notificationID/:taskID" component={NotificationList} />

							{ /* SETTINGS */ }
							{ settings.map( (item) => {
									if (accessRights[item.value]){
										return (<Route exact key={item.link} path={`/helpdesk/settings/${item.link}`} component={item.component} />);
									}
									return (<Route exact key={item.link} path={`/helpdesk/settings/${item.link}`} component={AccessDenied} />);
								})}
							{ settings.map( (item) =>{
									if (accessRights[item.value]){
										return (<Route exact key={item.link} path={`/helpdesk/settings/${item.link}/:id`} component={item.component} />);
									}
									return (<Route exact key={item.link} path={`/helpdesk/settings/${item.link}/:id`} component={AccessDenied} />);
								})}

					</div>
			</div>
		</div>
	);
}
