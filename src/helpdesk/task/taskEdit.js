import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Select from 'react-select';
import { connect } from "react-redux";
import { Label, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
//import CKEditor4 from 'ckeditor4-react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Attachments from '../components/attachments.js';
import Comments from '../components/comments.js';
//import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';

import VykazyTable from '../components/vykazyTable';

import UserAdd from '../settings/users/userAdd';
import CompanyAdd from '../settings/companies/companyAdd';

import TaskAdd from './taskAddContainer';
import TaskPrint from './taskPrint';
import classnames from "classnames";
import {rebase, database} from '../../index';
import firebase from 'firebase';
import ck5config from 'configs/components/ck5config';
//import ck4config from '../../scss/ck4config';
import datePickerConfig from 'configs/components/datepicker';
import PendingPicker from '../components/pendingPicker';
import {toSelArr, snapshotToArray, timestampToString, sameStringForms} from '../../helperFunctions';
import { storageCompaniesStart, storageHelpPricelistsStart, storageHelpPricesStart,storageHelpProjectsStart, storageHelpStatusesStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageHelpTasksStart, storageHelpUnitsStart,storageHelpWorkTypesStart, storageMetadataStart, storageUsersStart, storageHelpMilestonesStart, storageHelpTripTypesStart } from '../../redux/actions';
import {invisibleSelectStyleNoArrow, invisibleSelectStyleNoArrowColored,invisibleSelectStyleNoArrowColoredRequired, invisibleSelectStyleNoArrowRequired} from 'configs/components/select';
import { REST_URL } from 'configs/restAPI';
import booleanSelects from 'configs/constants/boolSelect';
import { noMilestone } from 'configs/constants/sidebar';
import { noDef } from 'configs/constants/projects';

import { GET_TASK_TYPES } from 'helpdesk/settings/taskTypes';
import { GET_TRIP_TYPES } from 'helpdesk/settings/tripTypes';
import { GET_PRICELISTS } from 'helpdesk/settings/prices';

export const UPDATE_TASK = gql`
mutation updateTask($title: String!, $closeDate: Int!, $assignedTo: [Int]!, $company: Int!, $deadline: Int, $description: String!, $milestone: Int, $overtime: Boolean!, $pausal: Boolean!, $pendingChangable: Boolean, $pendingDate: Int, $project: Int!, $requester: Int, $status: Int!, $tags: [Int]!, $taskType: Int!, $repeat: RepeatInput ) {
  updateTask(
    title: $title,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    deadline: $deadline,
    description: $description,
    milestone: $milestone,
    overtime: $overtime,
    pausal: $pausal,
    pendingChangable: $pendingChangable,
    pendingDate: $pendingDate,
    project: $project,
    requester: $requester,
    status: $status,
    tags: $tags,
    taskType: $taskType,
    repeat: $repeat,
  ){
    id
    title
  }
}
`;



const GET_TASK = gql`
query task($id: Int!){
	task(
		id: $id
	)  {
		id
		title
		updatedAt
		createdAt
		closeDate
		assignedTo {
			id
			name
			surname
		}
		company {
			id
			title
		}
		createdBy {
			id
			name
			surname
		}
		deadline
		description
		milestone{
			id
			title
		}
		pendingDate
		project{
			id
			title

	    lockedRequester
	    projectRights {
				read
				write
				delete
				internal
				admin
				user {
					id
				}
			}
	    def {
				assignedTo {
					def
					fixed
					show
					value {
						id
					}
				}
				company {
					def
					fixed
					show
					value {
						id
					}
				}
				overtime {
					def
					fixed
					show
					value
				}
				pausal {
					def
					fixed
					show
					value
				}
				requester {
					def
					fixed
					show
					value {
						id
					}
				}
				status {
					def
					fixed
					show
					value {
						id
					}
				}
				tag {
					def
					fixed
					show
					value {
						id
					}
				}
				taskType {
					def
					fixed
					show
					value {
						id
					}
				}
	    }
		}
		requester{
			id
			name
			surname
		}
		status {
			id
			title
			color
			action
		}
		tags {
			id
			title
		}
		taskType {
			id
			title
		}
		repeat {
			repeatEvery
			repeatInterval
			startsAt
		}
	}
}
`;

const GET_STATUSES = gql`
query {
  statuses {
    title
    id
    order
    color
    action
  }
}
`;

const GET_TAGS = gql`
query {
  tags {
    title
    id
    order
    color
  }
}
`;

const GET_PROJECTS = gql`
query {
  projects {
    title
    id
    lockedRequester
    projectRights {
			read
			write
			delete
			internal
			admin
			user {
				id
			}
		}
    def {
			assignedTo {
				def
				fixed
				show
				value {
					id
				}
			}
			company {
				def
				fixed
				show
				value {
					id
				}
			}
			overtime {
				def
				fixed
				show
				value
			}
			pausal {
				def
				fixed
				show
				value
			}
			requester {
				def
				fixed
				show
				value {
					id
				}
			}
			status {
				def
				fixed
				show
				value {
					id
				}
			}
			tag {
				def
				fixed
				show
				value {
					id
				}
			}
			taskType {
				def
				fixed
				show
				value {
					id
				}
			}
    }
  }
}
`;

const GET_COMPANIES = gql`
query {
  companies {
    title
    id
    dph
    taskWorkPausal
    pricelist {
      id
      title
      materialMargin
      prices {
        type
        price
        taskType {
          id
        }
        tripType {
          id
        }
      }
    }
  }
}
`;

const GET_USERS = gql`
query {
  users{
    id
    email
    role {
      level
    }
    company {
      id
    }
  }
}
`;

const GET_MY_DATA = gql`
query {
  getMyData{
    id
    role {
      accessRights {
        projects
      }
    }
  }
}
`;

export default function TaskEdit (props){
	//data & queries
	const { match, columns } = props;
  const [ updateTask, {client} ] = useMutation(UPDATE_TASK);
	const { data, loading } = useQuery(GET_MY_DATA);
  const { data: taskData, loading: taskLoading, refetch: taskRefetch } = useQuery(GET_TASK, { variables: {id: parseInt(props.match.params.taskID)} });
	const { data: statusesData, loading: statusesLoading } = useQuery(GET_STATUSES, { options: { fetchPolicy: 'network-only' }});
	const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES, { options: { fetchPolicy: 'network-only' }});
	const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, { options: { fetchPolicy: 'network-only' }});
	const { data: taskTypesData, loading: taskTypesLoading } = useQuery(GET_TASK_TYPES, { options: { fetchPolicy: 'network-only' }});
	const { data: tripTypesData, loading: tripTypesLoading } = useQuery(GET_TRIP_TYPES, { options: { fetchPolicy: 'network-only' }});
	const { data: pricesData, loading: pricesLoading } = useQuery(GET_PRICELISTS, { options: { fetchPolicy: 'network-only' }});
	const { data: tagsData, loading: tagsLoading } = useQuery(GET_TAGS, { options: { fetchPolicy: 'network-only' }});
	const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, { options: { fetchPolicy: 'network-only' }});

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  //state
  const [ layout, setLayout ] = React.useState(1);

	const [ defaultFields, setDefaultFields ] = React.useState(noDef);

  const [ attachments, setAttachments ] = React.useState([]);
  const [ assignedTo, setAssignedTo ] = React.useState([]);
  const [ createdBy, setCreatedBy ] = React.useState(null);
  const [ createdAt, setCreatedAt ] = React.useState(null);
  const [ closeDate, setCloseDate ] = React.useState(null);
  const [ company, setCompany ] = React.useState(null);
  const [ customItems, setCustomItems ] = React.useState([]);
  const [ deadline, setDeadline ] = React.useState(null);
  const [ description, setDescription ] = React.useState("");
  const [ descriptionVisible, setDescriptionVisible ] = React.useState(false);
  const [ history, setHistory ] = React.useState([]);
  const [ invoicedDate, setInvoicedDate ] = React.useState(null);
  const [ important, setImportant ] = React.useState(false);
  const [ isColumn, setIsColumn ] = React.useState(false);
  const [ milestone, setMilestone ] = React.useState([noMilestone]);
  const [ newHistoryEntery, setNewHistoryEntery ] = React.useState(null);
  const [ overtime, setOvertime ] = React.useState(booleanSelects[0]);
  const [ openUserAdd, setOopenUserAdd ] = React.useState(false);
  const [ openCompanyAdd, setOopenCompanyAdd ] = React.useState(false);
  const [ pausal, setPausal ] = React.useState(booleanSelects[0]);
	const [ pendingChangable, setPendingChangable ] = React.useState(false);
  const [ pendingDate, setPendingDate ] = React.useState(null);
  const [ pendingOpen, setPendingOpen ] = React.useState(false);
  const [ pendingStatus, setPendingStatus ] = React.useState(null);
  const [ project, setProject ] = React.useState(null);
  const [ projectChangeDate, setProjectChangeDate ] = React.useState(false);
  const [ print, setPrint ] = React.useState(false);
  const [ reminder, setReminder ] = React.useState(null);
  const [ repeat, setRepeat ] = React.useState(null);
  const [ requester, setRequester ] = React.useState(null);
  const [ saving, setSaving ] = React.useState(false);
  const [ status, setStatus ] = React.useState(null);
  const [ statusChange, setStatusChange ] = React.useState(false);
  const [ showDescription, setShowDescription ] = React.useState(false);
  const [ subtasks, setSubtasks ] = React.useState([]);
  const [ tags, setTags ] = React.useState([]);
  const [ taskMaterials, setTaskMaterials ] = React.useState([]);
  const [ taskType, setTaskType ] = React.useState(null);
  const [ taskWorks, setTaskWorks ] = React.useState([]);
	const [ title, setTitle ] = React.useState("");
  const [ toggleTab, setToggleTab ] = React.useState(1);
  const [ workTrips, setWorkTrips ] = React.useState([]);
	//workHours:'0',

  let counter = 0;

	const getNewID = () => {
			return counter++;
		}

const userRights = project ? project.projectRights.find(r => r.user.id === currentUser.id) : false;

const [ viewOnly, setViewOnly ] = React.useState(currentUser.role.level !== 0 && !userRights.write);


	const canSave = () => {
		return  title==="" || status===null || project === null || saving || viewOnly;
	}

// sync
React.useEffect( () => {
    if (!taskLoading){
			console.log(taskData);
			setAssignedTo(taskData.task.assignedTo);
			setCloseDate(taskData.task.closeDate);
			setCompany( ( taskData.task.company ? {...taskData.task.company, value: taskData.task.company.id, label: taskData.task.company.title} : null) );
			setCreatedBy(taskData.task.createdBy);
			setCreatedAt(taskData.task.createdAt);
			setDeadline(taskData.task.deadline);
			setDescription(taskData.task.description);
			setMilestone(taskData.task.milestone);
			setOvertime(taskData.task.overtime);
			setPausal(taskData.task.pausal);
			setPendingChangable(taskData.task.pendingChangable);
			setPendingDate(taskData.task.pendingDate);
			setProject( (taskData.task.project ? {...taskData.task.project, value: taskData.task.project.id, label: taskData.task.project.title} : null ) );
			setReminder(taskData.task.reminder);
			setRepeat(taskData.task.repeat);
			setRequester( (taskData.task.requester ? {...taskData.task.requester, value: taskData.task.requester.id, label: `${taskData.task.requester.name} ${taskData.task.requester.surname}`} : null)) ;
			setStatus( (taskData.task.staus ? {...taskData.task.staus, value: taskData.task.staus.id, label: taskData.task.staus.title} : null ) );
			setTags(taskData.task.tags);
			setTaskType( (taskData.task.taskType ? {...taskData.task.taskType, value: taskData.task.taskType.id, label: taskData.task.taskType.title} : null ) );
			setTitle(taskData.task.title);
    }
}, [taskLoading]);

React.useEffect( () => {
    taskRefetch({ variables: {id: parseInt(match.params.taskID)} });
}, [match.params.taskID]);

/*
	storageLoaded(props){
		return props.companiesLoaded &&
		props.pricelistsLoaded &&
		props.pricesLoaded &&
		props.projectsLoaded &&
		props.statusesLoaded &&
		props.tagsLoaded &&
		props.taskTypesLoaded &&
		props.tasksLoaded &&
		props.unitsLoaded &&
		props.metadataLoaded &&
		props.usersLoaded &&
		props.tripTypesLoaded &&
		props.milestonesLoaded
	}

	deleteTask(){
		if(window.confirm("Are you sure?")){
			let taskID = this.props.match.params.taskID;
			let storageRef = firebase.storage().ref();
			this.state.attachments.map((attachment)=>storageRef.child(attachment.path).delete());

			rebase.removeDoc('/help-tasks/'+taskID);
			this.state.taskMaterials.forEach((material)=>rebase.removeDoc('/help-task_materials/'+material.id))
			this.state.customItems.forEach((item)=>rebase.removeDoc('/help-task_custom_items/'+item.id))
			this.state.taskWorks.forEach((work)=>rebase.removeDoc('/help-task_works/'+work.id))
			this.state.workTrips.forEach((workTrip)=>rebase.removeDoc('/help-task_work_trips/'+workTrip.id))
			if(this.state.repeat!==null){
				rebase.removeDoc('/help-repeats/'+taskID);
			}
			database.collection('help-comments').where("task", "==", taskID).get()
			.then((data)=>{
				snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-comments/'+item.id));
			});
			database.collection('help-calendar_events').where("taskID", "==", taskID).get()
			.then((data)=>{
				snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-calendar_events/'+item.id));
			});
			if(this.props.inModal){
				this.props.closeModal();
			}else{
				this.props.history.goBack();
				this.props.history.push(this.props.match.url.substring(0,this.props.match.url.length-this.props.match.params.taskID.length));
			}
		}
	}

	submitTask(){
		if(this.canSave()){
			return;
		}
		let taskID = this.props.match.params.taskID;
		this.setState({saving:true});

		let statusAction = this.state.status.action;
		let invoicedDate = null;
		if(statusAction==='invoiced'){
			invoicedDate = isNaN(new Date(this.state.invoicedDate).getTime()) ? (new Date()).getTime() : new Date(this.state.invoicedDate).getTime()
		}


		let body = {
			title: this.state.title,
			company: this.state.company?this.state.company.id:null,
			workHours: this.state.workHours,
			requester: this.state.requester?this.state.requester.id:null,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
			description: this.state.description,
			status: this.state.status?this.state.status.id:null,
			statusChange: this.state.statusChange,
			project: this.state.project?this.state.project.id:null,
			pausal: this.state.pausal.value,
			overtime: this.state.overtime.value,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type?this.state.type.id:null,
			repeat: this.state.repeat!==null?taskID:null,
			milestone:this.state.milestone.id,
			attachments:this.state.attachments,
			deadline: this.state.deadline!==null?this.state.deadline.unix()*1000:null,
			closeDate: (this.state.closeDate!==null && (statusAction==='close'||statusAction==='invoiced'|| statusAction==='invalid'))?this.state.closeDate.unix()*1000:null,
			pendingDate: (this.state.pendingDate!==null && statusAction==='pending')?this.state.pendingDate.unix()*1000:null,
			pendingChangable: this.state.pendingChangable,
			invoicedDate,
			important:this.state.important,
		}

		rebase.updateDoc('/help-tasks/'+taskID, body).then(()=>{
			if(this.state.newHistoryEntery!==null){
				this.addToHistory(this.state.newHistoryEntery);
				this.addNotification(this.state.newHistoryEntery,false);
			}
			this.setState({saving:false, newHistoryEntery:null});
		});
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.taskID!==props.match.params.taskID){
			this.setState({loading:true, extraDataLoaded:false, showDescription:false});
			this.fetchData(props.match.params.taskID);
		}
		if(
			!sameStringForms(props.companies,this.props.companies)||
			!sameStringForms(props.pricelists,this.props.pricelists)||
			!sameStringForms(props.prices,this.props.prices)||
			!sameStringForms(props.projects,this.props.projects)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.tags,this.props.tags)||
			!sameStringForms(props.taskTypes,this.props.taskTypes)||
			!sameStringForms(props.tasks,this.props.tasks)||
			!sameStringForms(props.units,this.props.units)||
			!sameStringForms(props.metadata,this.props.metadata)||
			!sameStringForms(props.tripTypes,this.props.tripTypes)||
			!sameStringForms(props.users,this.props.users)||
			!sameStringForms(props.milestones,this.props.milestones)||
			(!this.storageLoaded(this.props) && this.storageLoaded(props))
		){
			this.setData(props);
		}
	}

	componentWillMount(){
		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}
		if(!this.props.pricelistsActive){
			this.props.storageHelpPricelistsStart();
		}
		if(!this.props.pricesActive){
			this.props.storageHelpPricesStart();
		}
		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}
		if(!this.props.tagsActive){
			this.props.storageHelpTagsStart();
		}
		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}
		if(!this.props.tasksActive){
			this.props.storageHelpTasksStart();
		}
		if(!this.props.unitsActive){
			this.props.storageHelpUnitsStart();
		}
		if(!this.props.metadataActive){
			this.props.storageMetadataStart();
		}
		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		if(!this.props.milestonesActive){
			this.props.storageHelpMilestonesStart();
		}
		if(!this.props.tripTypesActive){
			this.props.storageHelpTripTypesStart();
		}
		this.setData(this.props);
	}

	fetchData(taskID){*//*
		Promise.all([
			database.collection('help-task_work_trips').where("task", "==", taskID).get(),
			database.collection('help-task_materials').where("task", "==", taskID).get(),
			database.collection('help-task_custom_items').where("task", "==", taskID).get(),
			database.collection('help-task_works').get(),
			database.collection('help-repeats').doc(taskID).get(),
			database.collection('help-task_history').where("task", "==", taskID).get(),
		]).then(([workTrips,taskMaterials,customItems, taskWorks,repeat,history])=>{
			this.setState({
				extraData:{
					taskWorks:snapshotToArray(taskWorks),
					workTrips:snapshotToArray(workTrips),
					taskMaterials:snapshotToArray(taskMaterials),
					customItems:snapshotToArray(customItems),
					repeat:repeat.exists ? {id:repeat.id,...repeat.data()} : null,
				},
				history:snapshotToArray(history).sort((item1,item2)=>item1.createdAt > item2.createdAt ? -1 : 1 ),
				extraDataLoaded:true
			},()=>this.setData(this.props));
		});*/


	const addToHistory = (event) => {/*
		rebase.addToCollection('help-task_history',event).then((result)=>{
			this.setState({history: [ {...event, id: Math.random() } , ...this.state.history]});
		});*/
	}

	const addNotification = (originalEvent,internal) => {/*
		let event = {
			...originalEvent,
			read:false
		}
		let usersToNotify=[...this.state.assignedTo.filter((user)=>!internal || this.getPermissions(user.id).internal)];
		if( this.state.requester && (!internal || this.getPermissions(this.state.requester.id).internal) && !usersToNotify.some((user)=>user.id===this.state.requester.id)){
			usersToNotify.push(this.state.requester);
		}
		usersToNotify = usersToNotify.filter((user)=>user.id!==this.props.currentUser.id);
		usersToNotify.forEach((user)=>{
			rebase.addToCollection('user_notifications',{ ...event, user: user.id }).then((newNotification)=>{
				if(user.mailNotifications){
					firebase.auth().currentUser.getIdToken(/* forceRefresh *//* true).then((token)=>{
						fetch(`${REST_URL}/send-notification`,{
							headers: {
								'Content-Type': 'application/json'
							},
							method: 'POST',
							body:JSON.stringify({
								message:`
								<div>
									<h4>Nové upozornenie</h4>
									<p>Zmena: ${event.message}</p>
									<p>V úlohe: ${event.task}: ${this.state.title}</p>
									<p>Odkaz: https://lanhelpdesk2019.lansystems.sk/helpdesk/notifications/${newNotification.id}/${event.task}</p>
								</div>
								`,
								tos:[user.email],
								subject:`Upozornenie na zmenu: ${event.message}`,
								token,
							}),
						}).then((response)=>response.json().then((response)=>{
							if(response.error){
							}
						})).catch((error)=>{
							console.log(error);
						});
					});
					//end of sending mail
				}
			});
		})*/
	}

	const getHistoryMessage = (type, data) => {/*
		let user = "Používateľ " + this.props.currentUser.userData.name + ' ' + this.props.currentUser.userData.surname;
		switch (type) {
			case 'status':{
				return `${user} zmenil status z ${data.oldStatus?data.oldStatus.title:''} na ${data.newStatus?data.newStatus.title:''}.`;
			}
			case 'comment':{
				return user + ' komentoval úlohu.';
			}
			default:{
				return user + ' spravil nedefinovanú zmenu.';
			}
		}*/
	}

	const setDefaults = (projectID) => {
		if(projectID===null){
			setDefaultFields( noDef );
			return;
		}
		let pro = projectsData.projects.find((p)=>p.id===projectID);
		if(!pro){
			setDefaultFields( noDef );
			return;
		}
	 setDefaultFields( {...noDef,...pro.def} );
	}

	const setData = (props) =>{/*
		if(!this.state.extraDataLoaded || !this.storageLoaded(props)){
			return;
		}

		let taskWorks = this.state.extraData.taskWorks
															.filter(work => work.task === this.props.match.params.taskID)
															.map((work, index)=>{
																return {
																	title:work.title,
																	order: !isNaN(parseInt(work.order)) ? parseInt(work.order) : index,
																	id:work.id,
																	done:work.done===true,
																	type:work.type||work.workType,
																	quantity:work.quantity,
																	discount:work.discount,
																	assignedTo:work.assignedTo,
																}
															});
		let workTrips = this.state.extraData.workTrips.map((trip, index) => {
			return {
				...trip,
				order: !isNaN(parseInt(trip.order)) ? parseInt(trip.order) : index,
			}
		});
		let taskMaterials = this.state.extraData.taskMaterials.map((material, index) => {
			return {
				...material,
				order: !isNaN(parseInt(material.order)) ? parseInt(material.order) : index,
			}
		});
		let customItems = this.state.extraData.customItems.map((customItem, index) => {
			return {
				...customItem,
				order: !isNaN(parseInt(customItem.order)) ? parseInt(customItem.order) : index,
			}
		});
		let repeat = this.state.extraData.repeat;

		let taskID = props.match.params.taskID;
		let task = props.tasks.find((task)=>task.id===taskID);
		let statuses = toSelArr(props.statuses);
		let projects = toSelArr(props.projects);
		let users = toSelArr(props.users,'email');
		let tags = toSelArr(props.tags);
		let units = toSelArr(props.units);
		let subtasks = props.subtasks;
		let defaultUnit = props.metadata.defaultUnit;
		let prices = props.prices;
		let taskTypes = toSelArr(props.taskTypes).map((taskType)=>{
			let newTaskType = {...taskType, prices:prices.filter((price)=>price.type===taskType.id)}
			return newTaskType;
		});
		let tripTypes = toSelArr(props.tripTypes).map((tripType)=>{
			let newTripType = {...tripType, prices:prices.filter((price)=>price.type===tripType.id)}
			return newTripType;
		});
		let pricelists = props.pricelists;
		let companies = toSelArr(props.companies).map((company)=>{
			let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
			if(newCompany.pricelist===undefined){
				newCompany.pricelist=pricelists[0];
			}
			return newCompany;
		}).sort((comp1, comp2) => comp1.title.toLowerCase() >= comp2.title.toLowerCase() ? 1 : -1);

		this.setDefaults(task.project);

		let milestones = [noMilestone,...toSelArr(props.milestones)];
		let milestone = noMilestone;
		if(task.milestone!==undefined){
			milestone = milestones.find((item)=>item.id===task.milestone);
			if(milestone===undefined){
				milestone=noMilestone;
			}
		}
		let project = projects.find((item)=>item.id===task.project);
		let status = statuses.find((item)=>item.id===task.status);
		let company = companies.find((item)=>item.id===task.company);
		if(company===undefined){
			company=companies[0];
		}
		let requester = users.find((item)=>item.id===task.requester);
		let assignedTo = users.filter((user)=>task.assignedTo.includes(user.id));

		let type = taskTypes.find((item)=>item.id===task.type);
		let taskTags=[];
		if(task.tags){
			taskTags=tags.filter((tag)=>task.tags.includes(tag.id));
		}
		let permission = undefined;
		if(project.permissions){
			permission = project.permissions.find((permission)=>permission.user===props.currentUser.id);
		}
		let viewOnly = false;
		if(status && status.action==='invoiced' && props.inModal && (props.currentUser.userData.role.value===3 || permission.isAdmin)){
			viewOnly = false;
		}else{
			viewOnly = ((permission === undefined || !permission.write) && props.currentUser.userData.role.value===0)||(status && status.action==='invoiced');
		}

		let newState = {
			workTrips,
			taskMaterials,
			customItems,
			toggleTab: 1, //viewOnly?"1":"3",
			taskWorks,
			repeat,

			statuses,
			projects,
			users,
			companies,
			units,
			tripTypes,
			subtasks,
			taskTypes,
			allTags:tags,
			task,

			title:task.title,
			pausal:task.pausal?booleanSelects[1]:booleanSelects[0],
			overtime:task.overtime?booleanSelects[1]:booleanSelects[0],
			status:status?status:null,
			statusChange:task.statusChange?task.statusChange:null,
			createdAt:task.createdAt?task.createdAt:(new Date()).getTime(),
			deadline: task.deadline!==null?moment(task.deadline):null,
			closeDate: task.closeDate!==null?moment(task.closeDate):null,
			pendingDate: task.pendingDate!==null?moment(task.pendingDate):null,
			invoicedDate: task.invoicedDate!==null && task.invoicedDate!==undefined ?new Date(task.invoicedDate).toISOString().replace('Z',''):'',
			reminder: task.reminder?new Date(task.reminder).toISOString().replace('Z',''):'',
			project:project?project:null,
			company:company?company:null,
			workHours:isNaN(parseInt(task.workHours))?0:parseInt(task.workHours),
			requester:requester?requester:null,
			assignedTo,
			milestone,
			milestones,
			attachments:task.attachments?task.attachments:[],
			pendingChangable:task.pendingChangable===false? false : true,
			important:task.important===true,

			viewOnly,
			loading:false,
			defaultUnit,
			tags:taskTags,
			type:type?type:null,
			projectChangeDate:(new Date()).getTime()
		}
		if(this.state.loading){
			newState.description=task.description;
		}

		this.setState(newState);*/
	}

	const getPermissions = (id) => {
		let permission = null;
		if(project){
			permission = project.projectRights.find((p)=>p.user===id);
		}
		if(permission===undefined){
			permission = {user:{id},read:false,write:false,delete:false,internal:false,isAdmin:false};
		}
		return permission;
	}

const	getRenderAttributes = () => {
	/*	let permission = null;
		if(this.state.project && this.state.project.permissions){
			permission = this.state.project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
		}
		if(!permission){
			permission = {user:{id:this.props.currentUser.id},read:false,write:false,delete:false,internal:false,isAdmin:false};
		}

		let canAdd = this.props.currentUser.userData.role.value>0;
		let canDelete = (permission && permission.delete)||this.props.currentUser.userData.role.value===3;
		let canCopy = ((!permission || !permission.write) && this.props.currentUser.userData.role.value===0)||this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving;
		let taskID = this.props.match.params.taskID;

		let workTrips= this.state.workTrips.map((trip)=>{
			let type= this.state.tripTypes.find((item)=>item.id===trip.type);
			let assignedTo=trip.assignedTo?this.state.users.find((item)=>item.id===trip.assignedTo):null

			return {
				...trip,
				type,
				assignedTo:assignedTo?assignedTo:null
			}
		});

		let taskWorks= this.state.taskWorks.map((work)=>{
			let assignedTo=work.assignedTo?this.state.users.find((item)=>item.id===work.assignedTo):null
			return {
				...work,
				type:this.state.taskTypes.find((item)=>item.id===work.type),
				assignedTo:assignedTo?assignedTo:null
			}
		});
		let taskMaterials= this.state.taskMaterials.map((material)=>{
			return {
				...material,
				unit:this.state.units.find((unit)=>unit.id===material.unit)
			}
		});

		let customItems = this.state.customItems.map((item)=>(
			{
				...item,
				unit:this.state.units.find((unit)=>unit.id===item.unit),
			}
		));

		let createdBy=null;
		if(this.state.task&& this.state.task.createdBy){
			createdBy = this.state.users.find((user)=>user.id===this.state.task.createdBy);
		}

		let availableProjects = this.state.projects.filter((project)=>{
			let curr = this.props.currentUser;
			if((curr.userData && curr.userData.role.value===3)||(project.id===-1||project.id===null)){
				return true;
			}
			if(!project.permissions){
				return false;
			}
			let permission = project.permissions.find((permission)=>permission.user===curr.id);
			return permission && permission.read;
		})

		const USERS_WITH_PERMISSIONS = this.state.users.filter((user)=>this.state.project && this.state.project.permissions && this.state.project.permissions.some((permission)=>permission.user===user.id));
		const REQUESTERS =  (this.state.project && this.state.project.lockedRequester ? USERS_WITH_PERMISSIONS : this.state.users);

		return {
			permission,
			canAdd,
			canDelete,
			canCopy,
			taskID,
			workTrips,
			taskWorks,
			taskMaterials,
			customItems,
			createdBy,
			availableProjects,
			USERS_WITH_PERMISSIONS,
			REQUESTERS,
		}*/
	}

	const renderCommandbar = (taskID, canCopy, canDelete, taskWorks, workTrips, taskMaterials, customItems) => {
		return (
			<div className={classnames({"commandbar-small": columns}, {"commandbar": !columns}, { "p-l-25": true})}> {/*Commandbar*/}
				<div className={classnames("d-flex", "flex-row", "center-hor", {"m-b-10": columns})}>
					<div className="display-inline center-hor">
						{!columns &&
							<button type="button" className="btn btn-link-reversed waves-effect p-l-0" onClick={() => props.history.push(`/helpdesk/taskList/i/${this.props.match.params.listID}`)}>
								<i
									className="fas fa-arrow-left commandbar-command-icon"
									/>
							</button>
						}
						{ project &&
							<TaskAdd
								history={history}
								project={project.id}
								triggerDate={projectChangeDate}
								task={taskData.task}
								disabled={canCopy}
								/>
						}
					</div>
					<div className="ml-auto center-hor">
					{false &&	<TaskPrint
							match={match}
							taskID={taskID}
							createdBy={createdBy}
							createdAt={createdAt}
							taskWorks={taskWorks}
							workTrips={workTrips}
							taskMaterials={taskMaterials}
							customItems={customItems}
							isLoaded={/*this.state.extraDataLoaded && this.storageLoaded(this.props) && !this.state.loading*/ true} />
					}
						{ canDelete &&
							<button type="button" disabled={!canDelete} className="btn btn-link-reversed waves-effect" onClick={() => {/*deleteTask()*/}}>
								<i className="far fa-trash-alt" /> Delete
							</button>
						}
						<button type="button" style={{color:important ? '#ffc107' : '#0078D4'}} disabled={viewOnly} className="btn btn-link-reversed waves-effect" onClick={()=>{
								setImportant(!important);
								//submitTask();
							}}>
							<i className="far fa-star" /> Important
						</button>
					</div>
					<button
						type="button"
						className="btn btn-link-reversed waves-effect"
						onClick={() => setLayout(layout === 1 ? 2 : 1)}>
						Switch layout
					</button>
				</div>
			</div>
		)
	}


		const	renderTitle = () => {
			return (
				<div className="d-flex p-2">{/* Task name row */}
					<div className="row flex">
						<h2 className="center-hor text-extra-slim">{taskData.task.id}: </h2>
						<span className="center-hor flex m-r-15">
							<input type="text"
								disabled={viewOnly}
								value={title}
								className="task-title-input text-extra-slim hidden-input m-l-10"
								onChange={(e)=> {
									setTitle(e.target.value);
							//		this.submitTask.bind(this));
								}}
								placeholder="Enter task name" />
						</span>

						<div className="ml-auto center-hor">
							<p className="m-b-0 task-info">
								<span className="text-muted">
									{createdBy?"Created by ":""}
								</span>
								{createdBy? (createdBy.name + " " +createdBy.surname) :''}
								<span className="text-muted">
									{createdBy?' at ':'Created at '}
									{createdAt?(timestampToString(createdAt)):''}
								</span>
							</p>
							<p className="m-b-0">
								{ renderStatusDate() }
							</p>
						</div>
					</div>
				</div>
		);
	}

	const renderStatusDate = () => {
			if(status && status.action==='PendingDate'){
				return (
					<span className="text-muted task-info m-r--40">
						<span className="center-hor">
							Pending date:
						</span>
						<DatePicker
							className="form-control hidden-input"
							selected={pendingDate}
							disabled={!status || status.action!=='PendingDate'||viewOnly||!pendingChangable}
							onChange={ (date) => {
								setPendingDate(date);
								//this.submitTask.bind(this));
							}}
							placeholderText="No pending date"
							{...datePickerConfig}
							/>
					</span>
				)
			}

			if(status && (status.action==='CloseDate'||status.action==='Invoiced'||status.action==='CloseInvalid')){
				return (
					<span className="text-muted task-info m-r--40">
						<span className="center-hor">
							Closed at:
						</span>
						<DatePicker
							className="form-control hidden-input"
							selected={closeDate}
							disabled={!status || (status.action!=='CloseDate' && status.action!=='CloseInvalid')||viewOnly}
							onChange={date => {
								setCloseDate(date);
								//this.submitTask.bind(this));
							}}
							placeholderText="No pending date"
							{...datePickerConfig}
							/>
					</span>
				)
			}
			return (
				<span className="task-info ">
					<span className="center-hor text-muted">
						{statusChange ? ('Status changed at ' + timestampToString(statusChange) ) : ""}
					</span>
				</span>
			)
		}


		//Value Change

		const changeProject = (pro) => {
			let permissionIDs = [];
			if(pro.projectRights){
				pro.projectRights.map((p) => p.user.id);
			}
			let newAssignedTo = assignedTo.filter((user)=>permissionIDs.includes(user.id));

			setProject(pro);
			setAssignedTo(newAssignedTo);
			setProjectChangeDate(moment());
			setMilestone(noMilestone);
	//		this.submitTask();
			setDefaults(project.id);
		}

			const changeStatus = (s) => {
				let newHistoryEntery = {
					createdAt:moment(),
					message:getHistoryMessage('status', {newStatus:status,oldStatus:status}),
					task:match.params.taskID,
				};
				if(status.action==='PendingDate'){
					setPendingStatus(s);
					setPendingOpen(true);
					setNewHistoryEntery(newHistoryEntery);
				}else if(s.action==='CloseDate'||s.action==='Invalid'){
					setStatus(s);
					setStatusChange(moment());
					setImportant(false);
						/*important:false,
						closeDate: moment(),
						newHistoryEntery
					},this.submitTask.bind(this))*/
				}
				else{
					setStatus(s);
					setStatusChange(moment());
		/*				newHistoryEntery
					},this.submitTask.bind(this))*/
				}
			}

//Renders
/*		const {
		permission,
		canAdd,
		canDelete,
		canCopy,
		taskID,
		workTrips,
		taskWorks,
		taskMaterials,
		customItems,
		createdBy,
		availableProjects,
		USERS_WITH_PERMISSIONS,
		REQUESTERS,
	} = this.getRenderAttributes();*/
	const USERS_WITH_PERMISSIONS = toSelArr(usersData.users, 'email');
	const REQUESTERS = [];

	const renderSelectsLayout1 = () => {
		return (
			<div>
				<div className="col-lg-12">
					<div className="col-lg-4">
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Projekt</Label>
							<div className="col-9">
								<Select
									placeholder="Zadajte projekt"
									isDisabled={ viewOnly }
									value={ project }
									onChange={(e) => changeProject(e) }
									options={ toSelArr(projectsData.projects)/*availableProjects*/ }
									styles={ invisibleSelectStyleNoArrowRequired }
									/>
							</div>
						</div>
					</div>
					{ defaultFields.assignedTo.show &&
						<div className="col-lg-8">
							<div className="row p-r-10">
								<Label className="col-1-5 col-form-label">Assigned</Label>
								<div className="col-10-5">
									<Select
										value={assignedTo.filter((user)=>project && project.projectRights.some((permission)=>permission.user===user.id))}
										placeholder="Select"
										isMulti
										isDisabled={defaultFields.assignedTo.fixed||viewOnly}
										onChange={(users)=> {
											setAssignedTo(users);
											//this.submitTask.bind(this))
										}}
										options={
											(/*canAdd*/ true?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[])
											.concat(USERS_WITH_PERMISSIONS)
										}
										styles={invisibleSelectStyleNoArrowRequired}
										/>
								</div>
							</div>
						</div>
					}
				</div>

				<div className="hello">
					{ defaultFields.status.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Status</Label>
								<div className="display-inline-block w-25 p-r-10">
									<Select
										placeholder="Status required"
										value={status}
										isDisabled={defaultFields.status.fixed||viewOnly}
										styles={invisibleSelectStyleNoArrowColoredRequired}
										onChange={() => { /*this.changeStatus.bind(this)*/}}
										options={toSelArr(statusesData.statuses.filter((status)=>status.action!=='Invoiced'))}
										/>
								</div>
						</div>
					}
					{ defaultFields.taskType.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Typ</Label>
								<div className="display-inline-block w-25 p-r-10">
									<Select
										placeholder="Zadajte typ"
										value={taskType}
										isDisabled={defaultFields.taskType.fixed||viewOnly}
										styles={invisibleSelectStyleNoArrowRequired}
										onChange={(type)=> {/*this.setState({type},this.submitTask.bind(this))*/}}
										options={toSelArr(taskTypesData.taskTypes)}
										/>
								</div>
						</div>
					}
					<div className="display-inline">
						<Label className="col-form-label w-8">Milestone</Label>
						<div className="display-inline-block w-25 p-r-10">
							<Select
								isDisabled={viewOnly}
								value={milestone}
								onChange={() => {/*this.changeMilestone.bind(this)*/}}
								options={[] /*milestones.filter((milestone)=>milestone.id===null || (project!== null && milestone.project===project.id))*/}
								styles={invisibleSelectStyleNoArrow}
								/>
						</div>
					</div>
					{ defaultFields.requester.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Zadal</Label>
							<div className="display-inline-block w-25 p-r-10">
								<Select
									placeholder="Zadajte žiadateľa"
									value={requester}
									isDisabled={defaultFields.requester.fixed||viewOnly}
									onChange={() => {/*this.changeRequester.bind(this)*/}}
									options={(true/*canAdd*/?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(REQUESTERS)}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>
					}
					{ defaultFields.company.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Firma</Label>
							<div className="display-inline-block w-25 p-r-10">
								<Select
									placeholder="Zadajte firmu"
									value={company}
									isDisabled={defaultFields.company.fixed||viewOnly}
									onChange={() => {/*this.changeCompany.bind(this)*/} }
									options={(true/*canAdd*/?[{id:-1,title:'+ Add company',body:'add', label:'+ Add company',value:null}]:[]).concat(toSelArr(companiesData.companies))}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>
					}
					{	defaultFields.pausal.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Paušál</Label>
							<div className="display-inline-block w-25 p-r-10">
								<Select
									value={company && parseInt(company.taskWorkPausal) === 0 && pausal.value === false ? {...pausal, label: pausal.label + " (nezmluvný)"} : pausal }
									isDisabled={viewOnly||!company || parseInt(company.taskWorkPausal)===0||defaultFields.pausal.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(pausal)=> {
										setPausal(pausal);
										//this.submitTask.bind(this))
									}}
									options={booleanSelects}
									/>
							</div>
						</div>
					}
					<div className="display-inline">
						<Label className="col-form-label w-8">Deadline</Label>
						<div className="display-inline-block w-25 p-r-10">
							<DatePicker
								className="form-control hidden-input"
								selected={deadline}
								disabled={viewOnly}
								onChange={date => {
									setDeadline(date);
								//this.submitTask.bind(this));
								}}
								placeholderText="No deadline"
								{...datePickerConfig}
								/>
						</div>
					</div>
		       <div className="display-inline">
						<Repeat
							disabled={viewOnly}
							taskID={match.params.taskID}
							repeat={repeat}
							submitRepeat={() => {/*this.changeRepeat.bind(this)*/}}
							deleteRepeat={()=>{
					//			rebase.removeDoc('/help-repeats/'+taskID);
					//			this.setState({repeat:null})
							}}
							columns={columns}
							/>
		        </div>
					{	defaultFields.overtime.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Mimo PH</Label>
							<div className="display-inline-block w-25 p-r-10">
								<Select
									value={overtime}
									isDisabled={viewOnly||defaultFields.overtime.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(overtime)=> {
										setOvertime(overtime);
										//this.submitTask.bind(this))
									}}
									options={booleanSelects}
									/>
							</div>
						</div>
					}
				</div>
			</div>
		)
	}


		if (taskLoading) {
			return <div></div>
		}

		return (
			<div className="flex">
				{ showDescription &&
					<div
						style={{backgroundColor: "transparent", width: "100%", height: "100%", position: "absolute"}}
						onClick={()=>setShowDescription(false)}
						/>
				}

				{ renderCommandbar(taskData.task.id, true, true/*canCopy, canDelete*/, taskWorks, workTrips, taskMaterials, customItems) }

				<div className={classnames({"fit-with-header-and-commandbar": !columns}, {"fit-with-header-and-commandbar-3": columns}, "scroll-visible", "bkg-white", { "row": layout === '2'})}>
					<div className={classnames( "card-box-lanwiki", { "task-edit-left": layout === '2' && !columns, "task-edit-left-columns": layout === '2' && columns})}>

						<div className="p-t-20 p-l-30 p-r-30">
							{ renderTitle() }

							<hr className="m-t-5 m-b-5"/>
							{ layout === 1 && renderSelectsLayout1() }

              {/*
							{ this.renderPopis() }

							{ this.renderAttachments(taskID) }

							{ this.state.layout === "1" && this.state.defaultFields.tags.show && this.renderTags() }

							{ this.renderModalUserAdd() }

							{ this.renderModalCompanyAdd() }

							{ this.renderPendingPicker() }

							{ this.renderVykazyTable(taskWorks, workTrips, taskMaterials, customItems) }

							{ this.renderComments(taskID, permission) }
							*/}
						</div>


					</div>
{/*
					{ this.state.layout === "2" && this.renderSelectsLayout2(taskID, canAdd, USERS_WITH_PERMISSIONS, REQUESTERS, availableProjects) }
*/}
				</div>
			</div>
		);
}

/*


	renderSelectsLayout2(taskID, canAdd, usersWithPermissions, requesters, availableProjects){
		return (
			<div className={"task-edit-right" + (this.props.columns ? " w-250px" : "")} >
				{/* Projekt *//*}
				<div>
					<Label className="col-form-label-2">Projekt</Label>
					<div className="col-form-value-2">
						<Select
							placeholder="Zadajte projekt"
							isDisabled={this.state.viewOnly}
							value={this.state.project}
							onChange={this.changeProject.bind(this)}
							options={availableProjects}
							styles={invisibleSelectStyleNoArrowRequired}
							/>
					</div>
				</div>
				{/* Assigned *//*}
				{ this.state.defaultFields.assignedTo.show &&
					<div>
						<Label className="col-form-label-2">Assigned</Label>
						<div className="col-form-value-2" style={{marginLeft: "-5px"}}>
							<Select
								value={this.state.assignedTo.filter((user)=>this.state.project && this.state.project.permissions.some((permission)=>permission.user===user.id))}
								placeholder="Select"
								isMulti
								isDisabled={this.state.defaultFields.assignedTo.fixed||this.state.viewOnly}
								onChange={(users)=>this.setState({assignedTo:users},this.submitTask.bind(this))}
								options={
									(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[])
									.concat(usersWithPermissions)
								}
								styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				}

				{ /* Status *//* }
				{ this.state.defaultFields.status.show &&
					<div>
						<Label className="col-form-label-2">Status</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Status required"
								value={this.state.status}
								isDisabled={this.state.defaultFields.status.fixed||this.state.viewOnly}
								styles={invisibleSelectStyleNoArrowColoredRequired}
								onChange={this.changeStatus.bind(this)}
								options={this.state.statuses.filter((status)=>status.action!=='invoiced')}
								/>
						</div>
					</div>
				}

				{/* Type *//*}
				{ this.state.defaultFields.type.show &&
					<div>
						<Label className="col-form-label-2">Typ</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte typ"
								value={this.state.type}
								isDisabled={this.state.defaultFields.type.fixed||this.state.viewOnly}
								styles={invisibleSelectStyleNoArrowRequired}
								onChange={(type)=>this.setState({type},this.submitTask.bind(this))}
								options={this.state.taskTypes}
								/>
						</div>
					</div>
				}

				{/* Milestone *//*}
				<div>
					<Label className="col-form-label-2">Milestone</Label>
					<div className="col-form-value-2">
						<Select
							isDisabled={this.state.viewOnly}
							value={this.state.milestone}
							onChange={this.changeMilestone.bind(this)}
							options={this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null && milestone.project===this.state.project.id))}
							styles={invisibleSelectStyleNoArrow}
							/>
					</div>
				</div>

				{/* Tags *//*}
				{ this.state.defaultFields.tags.show &&
					<div style={{maxWidth:"250px"}}>
						<Label className="col-form-label-2">Tagy: </Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zvoľte tagy"
								value={this.state.tags}
								isMulti
								onChange={(tags)=>this.setState({tags},this.submitTask.bind(this))}
								options={this.state.allTags}
								isDisabled={this.state.defaultFields.tags.fixed||this.state.viewOnly}
								styles={invisibleSelectStyleNoArrowColored}
								/>
						</div>
					</div>
				}

				{/* Requester *//*}
				{ this.state.defaultFields.requester.show &&
					<div>
						<Label className="col-form-label-2">Zadal</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte žiadateľa"
								value={this.state.requester}
								isDisabled={ this.state.defaultFields.requester.fixed || this.state.viewOnly }
								onChange={ this.changeRequester.bind(this) }
								options={(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(requesters)}
								styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				}

				{/* Company *//*}
				{ this.state.defaultFields.company.show &&
					<div>
						<Label className="col-form-label-2">Firma</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte firmu"
								value={this.state.company}
								isDisabled={this.state.defaultFields.company.fixed||this.state.viewOnly}
								onChange={this.changeCompany.bind(this)}
								options={(canAdd?[{id:-1,title:'+ Add company',body:'add', label:'+ Add company',value:null}]:[]).concat(this.state.companies)}
								styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				}

				{/* Pausal *//*}
				{	this.state.defaultFields.pausal.show &&
					<div>
						<label className="col-form-label m-l-7">Paušál</label>
						<div className="col-form-value-2">
							<Select
								value={this.state.company && parseInt(this.state.company.workPausal) === 0 && this.state.pausal.value === false ? {...this.state.pausal, label: this.state.pausal.label + " (nezmluvný)"} : this.state.pausal }
								isDisabled={this.state.viewOnly||!this.state.company || parseInt(this.state.company.workPausal)===0||this.state.defaultFields.pausal.fixed}
								styles={invisibleSelectStyleNoArrowRequired}
								onChange={(pausal)=>this.setState({pausal},this.submitTask.bind(this))}
								options={booleanSelects}
								/>
						</div>
					</div>
				}

				{/* Deadline *//*}
				<div>
					<Label className="col-form-label m-l-7">Deadline</Label>
					<div className="col-form-value-2" style={{marginLeft: "-1px"}}>
						<DatePicker
							className="form-control hidden-input"
							selected={this.state.deadline}
							disabled={this.state.viewOnly}
							onChange={date => {
								this.setState({ deadline: date },this.submitTask.bind(this));
							}}
							placeholderText="No deadline"
							{...datePickerConfig}
							/>
					</div>
				</div>

				{/* Repeat *//*}
				<Repeat
					disabled={this.state.viewOnly}
					taskID={taskID}
					repeat={this.state.repeat}
					submitRepeat={this.changeRepeat.bind(this)}
					deleteRepeat={()=>{
						rebase.removeDoc('/help-repeats/'+taskID);
						this.setState({repeat:null})
					}}
					columns={this.props.columns}
					vertical={true}
					/>

				{/* Overtime *//*}
				{	this.state.defaultFields.overtime.show &&
					<div>
						<label className="col-form-label-2">Mimo PH</label>
						<div className="col-form-value-2">
							<Select
								value={this.state.overtime}
								isDisabled={this.state.viewOnly||this.state.defaultFields.overtime.fixed}
								styles={invisibleSelectStyleNoArrowRequired}
								onChange={(overtime)=>this.setState({overtime},this.submitTask.bind(this))}
								options={booleanSelects}
								/>
						</div>
					</div>
				}
			</div>
		)
	}

	renderTags(){
		return (
			<div className="row m-t-10"> {/*Tags*//*}
				<div className="center-hor">
					<Label className="center-hor">Tagy: </Label>
				</div>
				<div className="f-1 ">
					<Select
						placeholder="Zvoľte tagy"
						value={this.state.tags}
						isMulti
						onChange={(tags)=>this.setState({tags},this.submitTask.bind(this))}
						options={this.state.allTags}
						isDisabled={this.state.defaultFields.tags.fixed||this.state.viewOnly}
						styles={invisibleSelectStyleNoArrowColored}
						/>
				</div>
			</div>
		)
	}

	renderPopis(){
		const TOTAL_PAUSAL = this.state.company ? this.state.company.pausalPrice : 0;

		let usedPausal = 0;
		if (this.state.company && this.state.company.monthlyPausal){
			let currentTasks = this.props.tasks.filter( task => {
				let condition1 = this.state.company.id === task.company;

				let currentDate = new Date();
				let currentMonth = currentDate.getMonth();
				let currentYear = currentDate.getFullYear();

				if (task.closeDate === null || task.closeDate === undefined){
					return false;
				}

				let taskCloseDate = new Date(task.closeDate);
				let taskCloseMonth = taskCloseDate.getMonth();
				let taskCloseYear = taskCloseDate.getFullYear();

				let condition2 = (currentMonth === taskCloseMonth) && (currentYear === taskCloseYear);

				return condition1 && condition2;
			})

			let taskIDs = currentTasks.map(task => task.id);


			let currentTaskWorksQuantities = this.state.extraData.taskWorks.filter(work => taskIDs.includes(work.task)).map(task => task.quantity);

			if (currentTaskWorksQuantities.length > 0){
				usedPausal = currentTaskWorksQuantities.reduce((total, quantity) => total + quantity);
			}
		}

		let RenderDescription = null;
		if( this.state.viewOnly ){
			if( this.state.description.length !== 0 ){
				RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:this.state.description }} />
			}else{
				RenderDescription = <div className="task-edit-popis">Úloha nemá popis</div>
			}
		}else{
			if( this.state.showDescription ){
				RenderDescription = <div onClick={()=>this.setState({showDescription:true})}>
					<CKEditor
						editor={ ClassicEditor }
						data={this.state.description}
						onInit={(editor) => {
							editor.editing.view.document.on( 'keydown', ( evt, data ) => {
								if ( data.keyCode === 27 ) {
									this.setState({ showDescription: false })
									data.preventDefault();
									evt.stop();
								}
							});
						}}
						onChange={(e,editor)=>{
							this.setState({description: editor.getData()},this.submitTask.bind(this))
						}}
						config={ck5config}
						/>
				</div>
			}else{
				RenderDescription = <div className="clickable task-edit-popis" onClick={()=>this.setState({showDescription:true})}>
					<div dangerouslySetInnerHTML={{__html:this.state.description }} />
					<span className="text-highlight"> <i	className="fas fa-pen"/> edit </span>
				</div>
			}
		}
		return (
			<div style={{zIndex: "9999"}}>
				<div>
				<Label className="col-form-label m-t-10 m-r-20">Popis úlohy</Label>
				{ this.state.company && this.state.company.monthlyPausal &&
					<span> {`Used pausal: ${usedPausal} / Total pausal: ${TOTAL_PAUSAL}`} </span>
				}
				</div>

				{RenderDescription}
			</div>
		)
	}

	renderAttachments(taskID){
		return (
			<Attachments
				disabled={this.state.viewOnly}
				taskID={this.props.match.params.taskID}
				attachments={this.state.attachments}
				addAttachments={(newAttachments)=>{
					let time = (new Date()).getTime();
					let storageRef = firebase.storage().ref();
					Promise.all([
						...newAttachments.map((attachment)=>{
							return storageRef.child(`help-tasks/${taskID}/${time}-${attachment.size}-${attachment.name}`).put(attachment)
						})
					]).then((resp)=>{
						Promise.all([
							...newAttachments.map((attachment)=>{
								return storageRef.child(`help-tasks/${taskID}/${time}-${attachment.size}-${attachment.name}`).getDownloadURL()
							})
						]).then((urls)=>{
							newAttachments=newAttachments.map((attachment,index)=>{
								return {
									title:attachment.name,
									size:attachment.size,
									path:`help-tasks/${taskID}/${time}-${attachment.size}-${attachment.name}`,
									url:urls[index]
								}
							});
							this.setState({attachments:[...this.state.attachments,...newAttachments]},this.submitTask.bind(this));
						})
					})
				}}
				removeAttachment={(attachment)=>{
					let storageRef = firebase.storage().ref();
					let newAttachments = [...this.state.attachments];
					newAttachments.splice(newAttachments.findIndex((item)=>item.path===attachment.path),1);
					storageRef.child(attachment.path).delete();
					this.setState({attachments:newAttachments},this.submitTask.bind(this));
				}}
				/>
		)
	}

	renderModalUserAdd(){
		return (
			<Modal isOpen={this.state.openUserAdd} >
				<ModalHeader>
					Add user
				</ModalHeader>
				<ModalBody>
					<UserAdd
						close={() => this.setState({openUserAdd: false,})}
						addUser={(user) => {
							let newUsers = this.state.users.concat([user]);
							this.setState({
								users: newUsers,
							})
						}}
						/>
				</ModalBody>
			</Modal>
		)
	}

	renderModalCompanyAdd(){
		return (
			<Modal isOpen={this.state.openCompanyAdd}>
				<ModalHeader>
					Add company
				</ModalHeader>
				<ModalBody>
					<CompanyAdd
						close={() => this.setState({openCompanyAdd: false,})}
						addCompany={(company) => {
							let newCompanies = this.state.companies.concat([company]);
							this.setState({
								companies: newCompanies,
							})
						}}
						/>
				</ModalBody>
			</Modal>
		)
	}

	renderPendingPicker(){
		return (
			<PendingPicker
				open={this.state.pendingOpen}
				prefferedMilestone={this.state.milestone}
				milestones={this.state.milestones.filter((milestone)=>this.state.project!== null && milestone.project===this.state.project.id && milestone.startsAt!==null)}
				closeModal={()=>this.setState({pendingOpen:false})}
				savePending={(pending)=>{
					/*
					database.collection('help-calendar_events').where("taskID", "==", parseInt(this.props.match.params.taskID)).get()
					.then((data)=>{
					snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-calendar_events/'+item.id));
					});*//*
					this.setState({
						pendingOpen:false,
						pendingStatus:null,
						status:this.state.pendingStatus,
						pendingDate:pending.milestoneActive?moment(pending.milestone.startsAt):pending.pendingDate,
						milestone:pending.milestoneActive?pending.milestone:this.state.milestone,
						pendingChangable:!pending.milestoneActive,
						statusChange:(new Date().getTime()),
					},this.submitTask.bind(this))
				}}
				/>
		)
	}

	renderVykazyTable(taskWorks, workTrips, taskMaterials, customItems){
		return (
			<VykazyTable
				showColumns={ (this.state.viewOnly ? [0,1,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7,8]) }
				showTotals={false}
				disabled={this.state.viewOnly}
				company={this.state.company}
				match={this.props.match}
				taskID={this.props.match.params.taskID}
				taskAssigned={this.state.assignedTo}

				showSubtasks={this.state.project ? this.state.project.showSubtasks : false}

				submitService={this.submitService.bind(this)}
				subtasks={taskWorks}
				defaultType={this.state.type}
				workTypes={this.state.taskTypes}
				updateSubtask={(id,newData)=>{
					let extraData = {...this.state.extraData};
					extraData.taskWorks[extraData.taskWorks.findIndex((work)=>work.id === id)] = {...extraData.taskWorks.find((work)=>work.id === id),...newData};
					let newTaskWorks=[...this.state.taskWorks];
					newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
					rebase.updateDoc('help-task_works/'+id,newData);
					this.setState({taskWorks:newTaskWorks, extraData});
				}}
				updateSubtasks={(multipleSubtasks)=>{
					let extraData = {...this.state.extraData};
					let newTaskWorks=[...this.state.taskWorks];
					multipleSubtasks.forEach(({id, newData})=>{
						extraData.taskWorks[extraData.taskWorks.findIndex((work)=>work.id === id)] = {...extraData.taskWorks.find((work)=>work.id === id),...newData};
						newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
						rebase.updateDoc('help-task_works/'+id,newData);
					})
					this.setState({taskWorks:newTaskWorks, extraData});
				}}
				removeSubtask={(id)=>{
					rebase.removeDoc('help-task_works/'+id).then(()=>{
						let extraData = {...this.state.extraData};
						extraData.taskWorks.splice(extraData.taskWorks.findIndex((work)=>work.id === id),1);
						let newTaskWorks=[...this.state.taskWorks];
						newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
						this.setState({ taskWorks: newTaskWorks, extraData });
					});
				}}
				workTrips={workTrips}
				tripTypes={this.state.tripTypes}
				submitTrip={this.submitWorkTrip.bind(this)}
				updateTrip={(id,newData)=>{
					let extraData = {...this.state.extraData};
					extraData.workTrips[extraData.workTrips.findIndex((trip)=>trip.id === id)] = {...extraData.workTrips.find((trip)=>trip.id === id),...newData};
					let newTrips=[...this.state.workTrips];
					newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
					rebase.updateDoc('help-task_work_trips/'+id,newData);
					this.setState({ workTrips: newTrips, extraData });
				}}
				updateTrips={(multipleTrips)=>{
					let extraData = {...this.state.extraData};
					let newTrips=[...this.state.workTrips];
					multipleTrips.forEach(({id, newData})=>{
						extraData.workTrips[extraData.workTrips.findIndex((trip)=>trip.id === id)] = {...extraData.workTrips.find((trip)=>trip.id === id),...newData};
						newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
						rebase.updateDoc('help-task_work_trips/'+id,newData);
					})
					this.setState({ workTrips: newTrips, extraData });
				}}
				removeTrip={(id)=>{
					rebase.removeDoc('help-task_work_trips/'+id).then(()=>{
						let extraData = {...this.state.extraData};
						extraData.workTrips.splice(extraData.workTrips.findIndex((trip)=>trip.id === id),1);
						let newTrips=[...this.state.workTrips];
						newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
						this.setState({ workTrips:newTrips, extraData });
					});
				}}

				materials={taskMaterials}
				submitMaterial={this.submitMaterial.bind(this)}
				updateMaterial={(id,newData)=>{
					let extraData = {...this.state.extraData};
					extraData.taskMaterials[extraData.taskMaterials.findIndex((material)=>material.id === id)] = {...extraData.taskMaterials.find((material)=>material.id === id),...newData};
					let newTaskMaterials=[...this.state.taskMaterials];
					newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
					rebase.updateDoc('help-task_materials/'+id,newData);
					this.setState({taskMaterials:newTaskMaterials, extraData});
				}}
				updateMaterials={(multipleMaterials)=>{
					let extraData = {...this.state.extraData};
					let newTaskMaterials=[...this.state.taskMaterials];
					multipleMaterials.forEach(({id, newData})=>{
						extraData.taskMaterials[extraData.taskMaterials.findIndex((material)=>material.id === id)] = {...extraData.taskMaterials.find((material)=>material.id === id),...newData};
						newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
						rebase.updateDoc('help-task_materials/'+id,newData);
					})
					this.setState({taskMaterials:newTaskMaterials, extraData});
				}}
				removeMaterial={(id)=>{
					rebase.removeDoc('help-task_materials/'+id).then(()=>{
						let extraData = {...this.state.extraData};
						extraData.taskMaterials.splice(extraData.taskMaterials.findIndex((material)=>material.id === id),1);
						let newTaskMaterials=[...this.state.taskMaterials];
						newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
						this.setState({taskMaterials:newTaskMaterials, extraData});
					});
				}}
				customItems={customItems}
				submitCustomItem={this.submitCustomItem.bind(this)}
				updateCustomItem={(id,newData)=>{
					let extraData = {...this.state.extraData};
					extraData.customItems[extraData.customItems.findIndex((item)=>item.id === id)] = {...extraData.customItems.find((item)=>item.id === id),...newData};
					let newCustomItems=[...this.state.customItems];
					newCustomItems[newCustomItems.findIndex((taskWork)=>taskWork.id===id)]={...newCustomItems.find((taskWork)=>taskWork.id===id),...newData};
					rebase.updateDoc('help-task_custom_items/'+id,newData);
					this.setState({customItems:newCustomItems, extraData});
				}}
				updateCustomItems={(multipleCustomItems)=>{
					let extraData = {...this.state.extraData};
					let newCustomItems=[...this.state.customItems];
					multipleCustomItems.forEach(({id, newData})=>{
						extraData.customItems[extraData.customItems.findIndex((item)=>item.id === id)] = {...extraData.customItems.find((item)=>item.id === id),...newData};
						newCustomItems[newCustomItems.findIndex((taskWork)=>taskWork.id===id)]={...newCustomItems.find((taskWork)=>taskWork.id===id),...newData};
						rebase.updateDoc('help-task_custom_items/'+id,newData);
					})
					this.setState({customItems:newCustomItems, extraData});
				}}
				removeCustomItem={(id)=>{
					rebase.removeDoc('help-task_custom_items/'+id).then(()=>{
						let extraData = {...this.state.extraData};
						extraData.customItems.splice(extraData.customItems.findIndex((item)=>item.id === id),1);
						let newCustomItems=[...this.state.customItems];
						newCustomItems.splice(newCustomItems.findIndex((item)=>item.id===id),1);
						this.setState({customItems:newCustomItems, extraData});
					});
				}}
				units={this.state.units}
				defaultUnit={this.state.defaultUnit}
				/>
		)
	}

	renderComments(taskID, permission){
		return (
			<div className="comments">
				<Nav tabs className="b-0 m-b-22 m-l--10 m-t-15">
					<NavItem>
						<NavLink
							className={classnames({ active: this.state.toggleTab === 1}, "clickable", "")}
							onClick={() => { this.setState({toggleTab:1}); }}
							>
							Komentáre
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink>
							|
						</NavLink>
					</NavItem>
					{ this.props.currentUser.userData.role.value > 0 &&
						<NavItem>
							<NavLink
								className={classnames({ active: this.state.toggleTab === 2 }, "clickable", "")}
								onClick={() => { this.setState({toggleTab:2}); }}
								>
								História
							</NavLink>
						</NavItem>
					}
				</Nav>

				<TabContent activeTab={this.state.toggleTab}>
					<TabPane tabId="1">
						<Comments
							id={taskID?taskID:null}
							showInternal={permission.internal || this.props.currentUser.userData.role.value > 1 }
							users={this.state.users}
							addToHistory={(internal)=>{
								let event = {
									message:this.getHistoryMessage('comment'),
									createdAt:(new Date()).getTime(),
									task:this.props.match.params.taskID
								}
								this.addToHistory(event);
								this.addNotification(event,internal);
							}}
							/>
					</TabPane>
					{	this.props.currentUser.userData.role.value > 0 &&
						<TabPane tabId="2">
							<h3>História</h3>
							<ListGroup>
								{ this.state.history.map((event)=>
									<ListGroupItem key={event.id}>
										({timestampToString(event.createdAt)})
										{' ' + event.message}
									</ListGroupItem>
								)}
							</ListGroup>
							{	this.state.history.length===0 && <div>História je prázdna.</div>	}
						</TabPane>
					}
				</TabContent>
			</div>
		)
	}

	//Vykazy submits
	submitWorkTrip(body){
		rebase.addToCollection('help-task_work_trips',{task:this.props.match.params.taskID,...body}).then((result)=>{
			let extraData = {...this.state.extraData};
			extraData.workTrips = [{task:this.props.match.params.taskID,...body,id:result.id}, ...extraData.workTrips];
			this.setState({workTrips:[...this.state.workTrips, {task:this.props.match.params.taskID,...body,id:result.id}],extraData})
		});
	}

	submitMaterial(body){
		rebase.addToCollection('help-task_materials',{task:this.props.match.params.taskID,...body}).then((result)=>{
			let extraData = {...this.state.extraData};
			extraData.taskMaterials = [{task:this.props.match.params.taskID,...body,id:result.id}, ...extraData.taskMaterials];
			this.setState({taskMaterials:[...this.state.taskMaterials, {task:this.props.match.params.taskID,...body,id:result.id}],extraData})
		});
	}

	submitCustomItem(body){
		rebase.addToCollection('help-task_custom_items',{task:this.props.match.params.taskID,...body}).then((result)=>{
			let extraData = {...this.state.extraData};
			extraData.customItems = [{task:this.props.match.params.taskID,...body,id:result.id}, ...extraData.customItems];
			this.setState({customItems:[...this.state.customItems, {task:this.props.match.params.taskID,...body,id:result.id}],extraData})
		});
	}

	submitService(body){
		rebase.addToCollection('help-task_works',{task:this.props.match.params.taskID,...body}).then((result)=>{
			let extraData = {...this.state.extraData};
			extraData.taskWorks = [{task:this.props.match.params.taskID,...body,id:result.id}, ...extraData.taskWorks];
			this.setState({taskWorks:[...this.state.taskWorks, {task:this.props.match.params.taskID,...body,id:result.id}],extraData})
		});
	}



	changeMilestone(milestone){
		if(this.state.status.action==='pending'){
			if(milestone.startsAt!==null){
				this.setState({milestone,pendingDate:moment(milestone.startsAt),pendingChangable:false},this.submitTask.bind(this));
			}else{
				this.setState({milestone, pendingChangable:true }, this.submitTask.bind(this));
			}
		}else{
			this.setState({milestone},this.submitTask.bind(this));
		}
	}

	changeRequester(requester){
		if (requester.id === -1) {
			this.setState({
				openUserAdd: true,
			})
		} else {
			this.setState({requester},this.submitTask.bind(this))
		}
	}

	changeCompany(company){
		if (company.id === -1) {
			this.setState({
				openCompanyAdd: true,
			})
		} else {
			this.setState({company, pausal:parseInt(company.workPausal)>0?booleanSelects[1]:booleanSelects[0]},this.submitTask.bind(this));
		}
	}

	changeRepeat(repeat){
		database.collection('help-repeats').doc(this.props.match.params.taskID).set({
			...repeat,
			task:this.props.match.params.taskID,
			startAt:(new Date(repeat.startAt).getTime()),
		});
		this.setState({repeat})
	}

	changeItemValue(item, value){
		let change = {}
		change[item] = value;
		this.setState(change, this.submitTask.bind(this) )
	}
}

const mapStateToProps = ({ userReducer, storageCompanies, storageHelpPricelists, storageHelpPrices, storageHelpProjects, storageHelpStatuses, storageHelpTags, storageHelpTaskTypes, storageHelpTasks, storageHelpUnits, storageHelpWorkTypes, storageMetadata, storageUsers, storageHelpMilestones, storageHelpTripTypes }) => {
	const { companiesLoaded, companiesActive, companies } = storageCompanies;
	const { pricelistsLoaded, pricelistsActive, pricelists } = storageHelpPricelists;
	const { pricesLoaded, pricesActive, prices } = storageHelpPrices;
	const { projectsLoaded, projectsActive, projects } = storageHelpProjects;
	const { statusesLoaded, statusesActive, statuses } = storageHelpStatuses;
	const { tagsLoaded, tagsActive, tags } = storageHelpTags;
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { tasksLoaded, tasksActive, tasks } = storageHelpTasks;
	const { unitsLoaded, unitsActive, units } = storageHelpUnits;
	const { workTypesLoaded, workTypesActive, workTypes } = storageHelpWorkTypes;
	const { metadataLoaded, metadataActive, metadata } = storageMetadata;
	const { usersLoaded, usersActive, users } = storageUsers;
	const { milestonesLoaded, milestonesActive, milestones } = storageHelpMilestones;
	const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;

	return {
		currentUser: userReducer,
		companiesLoaded, companiesActive, companies,
		pricelistsLoaded, pricelistsActive, pricelists,
		pricesLoaded, pricesActive, prices,
		projectsLoaded, projectsActive, projects,
		statusesLoaded, statusesActive, statuses,
		tagsLoaded, tagsActive, tags,
		taskTypesLoaded, taskTypesActive, taskTypes,
		tasksLoaded, tasksActive, tasks,
		unitsLoaded, unitsActive, units,
		workTypesLoaded, workTypesActive, workTypes,
		metadataLoaded, metadataActive, metadata,
		usersLoaded, usersActive, users,
		milestonesLoaded, milestonesActive, milestones,
		tripTypesActive, tripTypes, tripTypesLoaded,
	};
};

export default connect(mapStateToProps, { storageCompaniesStart, storageHelpPricelistsStart, storageHelpPricesStart,storageHelpProjectsStart, storageHelpStatusesStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageHelpTasksStart, storageHelpUnitsStart,storageHelpWorkTypesStart, storageMetadataStart, storageUsersStart, storageHelpMilestonesStart, storageHelpTripTypesStart })(TaskEdit);
*/
