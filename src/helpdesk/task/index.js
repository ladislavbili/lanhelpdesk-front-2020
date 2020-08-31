import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import ShowData from '../../components/showData';
import { timestampToString, sameStringForms, applyTaskFilter, snapshotToArray } from 'helperFunctions';
import { getEmptyFilter, getFixedFilters } from 'configs/fixedFilters';
import { allMilestones } from 'configs/constants/sidebar';
import TaskEdit from './taskEditContainer';
import TaskEmpty from './taskEmpty';
import TaskCalendar from '../calendar';
import {rebase, database} from '../../index';
import { GET_TASK_TYPES } from 'helpdesk/settings/taskTypes';

/*
import {setTasksOrderBy, setTasksAscending,storageCompaniesStart,storageHelpTagsStart,storageUsersStart, setUserFilterStatuses,
	storageHelpProjectsStart,storageHelpStatusesStart,storageHelpTasksStart, storageHelpFiltersStart,
	setTasklistLayout, storageHelpMilestonesStart, storageHelpCalendarEventsStart,
	setHelpSidebarProject, setHelpSidebarMilestone, setHelpSidebarFilter, setFilter, setMilestone,setProject} from 'redux/actions';*/
const fixedFilters = getFixedFilters();


const GET_ALL_TASKS = gql`
query {
  allTasks{
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

/*
    overtime
    pausal
    pendingChangable
    statusChange
*/

const GET_MY_DATA = gql`
query {
  getMyData{
    id
		tasklistLayout
		statuses {
			id
			title
			color
			action
		}
    role {
      accessRights {
        projects
      }
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


export default function TasksIndex (props) {
  //data & queries
  const { history, match, calendarEvents, /*tasklistLayout, setTasklistLayout, */orderBy, setTasksOrderBy, ascending, setTasksAscending, statuses, setUserFilterStatuses } = props;
  const { data, loading } = useQuery(GET_MY_DATA);
  const { data: tasksData, loading: tasksLoading, refetch: tasksRefetch } = useQuery(GET_ALL_TASKS, { options: { fetchPolicy: 'network-only' }});
  const { data: statusesData, loading: statusesLoading } = useQuery(GET_STATUSES, { options: { fetchPolicy: 'network-only' }});

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

	const [ filterName, setFilterName ] = React.useState("");
	const [ tasklistLayout, setTasklistLayout ] = React.useState(0);

	// sync
	React.useEffect( () => {
			getFilterName(props);
	}, [match.params.listID]);

	React.useEffect( () => {
			getFilterName(props);
	}, [props.filters]);

	const getFilterName = (props) => {
		let id = props.match.params.listID;
		let filter = fixedFilters.find( (filter) => filter.id === id )
		if(!id){
			setFilterName("");
			return;
		}else if( filter !== undefined ){
			setFilterName(filter.title);
			return;
		}
		filter = props.filters.find((filter)=>filter.id===id);
		if(filter){
			setFilterName(filter.title);
		}
	}

const getBreadcrumsData = () => {
/*	let project = this.props.projectState;
	let milestone = this.props.milestoneState;
	let filter = this.props.filterState;
	return [
		{
			type:'project',
			show:project!==null,
			data:project,
			label:project?project.title:'Invalid project',
			onClick:()=>{
				this.props.setHelpSidebarMilestone(allMilestones);
				this.props.setMilestone(null);
				this.props.setHelpSidebarFilter(null);
				this.props.setFilter(getEmptyFilter());
				this.props.history.push('/helpdesk/taskList/i/all');
			}
		},
		{
			type:'milestone',
			show:project!==null,
			data:milestone,
			label:milestone?milestone.title:'Invalid milestone',
			onClick:()=>{
				this.props.setHelpSidebarFilter(null);
				this.props.setFilter(getEmptyFilter());
				this.props.history.push('/helpdesk/taskList/i/all');
			}
		},
		{
			type:'filter',
			show: true,
			data: filter,
			label: this.state.filterName,
			onClick:()=>{
			}
		}
	]*/
}

const displayCol = (task) => {
		return (<li>
			<div className="taskCol-title">
				<span className="attribute-label">#{task.id} | </span> {task.title}
			</div>
			<div className="taskCol-body">
				<p className="pull-right m-0">
					<span className="label label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
						{task.status?task.status.title:'Neznámy status'}
					</span>
				</p>
				<p>
					<span>
						<span className="attribute-label">Requested by: </span>
								{task.requester?(" " + task.requester.name+' '+task.requester.surname):' Neznámy používateľ '}
					</span>
				</p>
				<p className="pull-right">
					<span>
						<span className="attribute-label">	<i className="fa fa-star-of-life" /> </span>
						{task.createdAt?timestampToString(task.createdAt):'None'}
					</span>
				</p>
				<p>
					<span>
						<span className="attribute-label">From </span>
						{task.company ? task.company.title : " Unknown"}
					</span>
				</p>

				<p className="pull-right">
					<span>
						<img
							className="dnd-item-icon"
							src={require('../../scss/icons/excl-triangle.svg')}
							alt="Generic placeholder XX"
							/>
						{task.deadline?timestampToString(task.deadline):'None'}
					</span>
				</p>
				<p >
					<span style={{textOverflow: 'ellipsis'}}>
						<span className="attribute-label">Assigned: </span>
						{task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.name+' '+user.surname+', ','').slice(0,-2):'Neznámy používateľ'}</span>
				</p>
			</div>

				<div className="taskCol-tags">
					{task.tags.map((tag)=>
						<span key={tag.id} className="label label-info m-r-5" style={{backgroundColor: tag.color, color: "white"}}>{tag.title}</span>
					)}
				</div>

		</li>)
}

const displayCal = (task,showEvent) => {
		return (<div style={ showEvent ? { backgroundColor:'#eaf6ff', borderRadius:5 } : {} }>
				<p className="m-0">
					{showEvent && <span className="label label-event">
					Event
				</span>}
					<span className="label label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
						{task.status?task.status.title:'Neznámy status'}
					</span>
					<span className="attribute-label m-l-3">#{task.id} | {task.title}</span>
				</p>
				{false &&  <p className="m-0">
					<span className="m-l-3">
						<span className="attribute-label">Requested by: </span>
								{task.requester?(" " + task.requester.name+' '+task.requester.surname):' Neznámy používateľ '}
					</span>
					<span className="m-l-3">
						<span className="attribute-label">	<i className="fa fa-star-of-life" /> </span>
						{task.createdAt?timestampToString(task.createdAt):'None'}
					</span>
					<span className="m-l-3">
						<span className="attribute-label">From: </span>
						{task.company ? task.company.title : " Unknown"}
					</span>
					<span className="m-l-3">
						<span className="attribute-label">Deadline: </span>
						{task.deadline?timestampToString(task.deadline):'None'}
					</span>
					<span className="m-l-3">
						<span className="attribute-label">Assigned: </span>
						{task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.name+' '+user.surname+', ','').slice(0,-2):'Neznámy používateľ'}
					</span>
				</p>}
		</div>)
}

const filterTasks = () => {
	return tasksData ? tasksData.allTasks : [];
	/*
	if(!this.props.statusesLoaded){
		return [];
	}
	let newTasks=this.state.tasks.map((task)=>{
		const status = this.state.statuses.find( (status) => status.id === task.status );
		const project = this.state.projects.find( (project) => project.id === task.project );
		return {
			...task,
			company: this.state.companies.find( (company) => company.id === task.company ),
			status,
			project,
			requester: this.state.users.find( (user) => user.id === task.requester ),
			tags: this.state.tags.filter( (tag) => task.tags && task.tags.includes(tag.id) ),
			assignedTo: this.state.users.filter( (user) => task.assignedTo && task.assignedTo.includes(user.id) ),
			id: parseInt(task.id),
			viewOnly: this.getViewOnly(task, status, project),
		}
	});

	const filter = this.props.filter;
	return newTasks.filter( ( task ) => applyTaskFilter( task, filter, this.props.currentUser, this.props.project, this.props.milestone ) )
	*/
}

const getViewOnly = ( task, status, project ) => {
	if( project === undefined ){
		return true;
	}
	let permission = []
	if(project.projectRights){
		permission = project.projectRights.find((p) => p.user.id === currentUser.id );
	}
	return ( (permission === undefined || !permission.write ) && currentUser.userData.role.value === 0 ) || ( status && status.action === 'Invoiced' );
}

const checkTask = (id, check) => {
	/*
	if(!this.props.statusesLoaded){
		return ;
	}
	let newTasks = this.state.tasks.map((task)=>{
		if (task.id.toString() === id.toString()){
			return { ...task, checked: check}
		} else  if (id === 'all'){
			return { ...task, checked: check}
		}
		return {...task}
	});

	this.setState({
		tasks: newTasks,
	})*/
}

const deleteTask = () => {
	/*
	if(!this.props.statusesLoaded){
		return;
	}
	let filteredTasks = this.filterTasks();
	let tasksToDelete = filteredTasks.filter( task => task.checked );
	let failedTasks = tasksToDelete.filter( (task) => task.viewOnly );
	tasksToDelete = tasksToDelete.filter( task => !task.viewOnly );
	let newTasks = this.state.tasks.filter(task1 => !tasksToDelete.some( (task2) => task1.id === task2.id ));
	tasksToDelete.forEach(task => {
		let taskID = task.id;
		let storageRef = firebase.storage().ref();
		if (task.attachments){
			task.attachments.map((attachment)=>storageRef.child(attachment.path).delete());
		}
		rebase.removeDoc('/help-tasks/'+taskID);

		database.collection('help-task_materials').where("task", "==", taskID).get()
		.then((data)=>{
			snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-task_materials/'+item.id));
		});

		database.collection('help-task_custom_items').where("task", "==", taskID).get()
		.then((data)=>{
			snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-task_custom_items/'+item.id));
		});

		database.collection('help-task_works').where("task", "==", taskID).get()
		.then((data)=>{
			snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-task_works/'+item.id));
		});

		database.collection('help-task_work_trips').where("task", "==", taskID).get()
		.then((data)=>{
			snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-task_work_trips/'+item.id));
		});

		if(task.repeat!==null){
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
	});
	this.setState({
		tasks: newTasks,
	})
	if( failedTasks.length > 0 ) {
		window.alert(`${tasksToDelete.length} were deleted. Some tasks couln't be deleted. This includes: \n` + failedTasks.reduce( (acc, task) => acc + `${task.id} ${task.title} \n` , '' ) )
	}*/
}

const getCalendarEventsData = (tasks) => {/*
	let taskIDs = tasks.map((task)=>task.id);
	return calendarEvents.filter((event)=>taskIDs.includes(event.taskID)).map((event)=>{
		let task = tasks.find((task)=>event.taskID===task.id);
		return {
			...task,
			isTask:false,
			eventID:event.id,
			titleFunction: displayCal,
			start:new Date(event.start),
			end:new Date(event.end),
		}
	})*/
}

const getCalendarAllDayData = (tasks) => {/*
	return tasks.map((task) => {
		let newTask = {
			...task,
			isTask:true,
			titleFunction:this.displayCal,
			allDay: !task.status || task.status.action !== 'pendingOLD',
		}
		if(!task.status){
			return {
				...newTask,
				status: this.props.statuses.find((status)=>status.action==='new'),
				start:new Date(),
			}
		}
		switch (task.status.action) {
			case 'invoiced':{
				return {
					...newTask,
					start:new Date(task.invoicedDate),
				}
			}
			case 'close':{
				return {
					...newTask,
					start:new Date(task.closeDate),
				}
			}
			case 'invalid':{
				return {
					...newTask,
					start:new Date(task.closeDate),
				}
			}
			case 'pending':{
				return {
					...newTask,
					start:new Date(task.pendingDate),
					//end:new Date(task.pendingDateTo ? task.pendingDateTo: fromMomentToUnix(moment(task.pendingDate).add(30,'minutes')) ),
				}
			}
			default:{
				return {
					...newTask,
					start:new Date(),
				}
			}
		}
	}).map((task)=>({...task,end: task.status.action !== 'pendingOLD' ? task.start : task.end }))*/
}

	let link='';
	if(match.params.hasOwnProperty('listID')){
		link = '/helpdesk/taskList/i/'+match.params.listID;
	}else{
		link = '/helpdesk/taskList'
	}
	return (
		<ShowData
			layout={0}
			setLayout={() => {}}
			data={filterTasks()}
			filterBy={[
				{value:'assignedTo',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
				//		{value:'tags',type:'list',func:((cur,item)=>cur+item.title+' ')},
				{value:'statusChange',type:'date'},
				{value:'createdAt',type:'date'},
				{value:'requester',type:'user'},
				{value:'deadline',type:'date'},
				{value:'status',type:'object'},
				{value:'title',type:'text'},
				{value:'id',type:'int'},
				{value:'company',type:'object'},
			]}
			displayCol={displayCol}
			filterName="help-tasks"
			displayValues={[
				{value:'checked', label: '', type:'checkbox'},
				{value:'important',label:'',type:'important'},
				{value:'title',label:'Title',type:'text'},
				{value:'id',label:'ID',type:'int'},
				{value:'status',label:'Status',type:'object'},
				{value:'requester',label:'Requester',type:'user'},
				{value:'company',label:'Company',type:'object'},
				{value:'assignedTo',label:'Assigned',type:'list',func:(items)=>
					(<div>
						{
							items.map((item)=><div key={item.id}>{item.name+' '+item.surname}</div>)
						}
					</div>)
				},
				{value:'createdAt',label:'Created at',type:'date'},
				/*		{value:'tags',label:'Tags',type:'list',func:(items)=>
							(<div>
							{items.map((item)=>
								<span key={item.id} className="label label-info m-r-5">{item.title}</span>)
							}
							</div>)
						},*/
				{value:'deadline',label:'Deadline',type:'date'}
			]}
			orderByValues={[
				{value:'id',label:'ID',type:'int'},
				{value:'status',label:'Status',type:'object'},
				{value:'title',label:'Title',type:'text'},
				{value:'requester',label:'Requester',type:'user'},
				{value:'assignedTo',label:'Assigned',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
				{value:'createdAt',label:'Created at',type:'date'},
				//		{value:'tags',label:'Tags',type:'list',func:((cur,item)=>cur+item.title+' ')},
				{value:'deadline',label:'Deadline',type:'date'}
			]}
			dndGroupAttribute="status"
			dndGroupData={props.statuses}
			calendar={TaskCalendar}
			calendarAllDayData={getCalendarAllDayData}
			calendarEventsData={getCalendarEventsData}
			link={link}
			history={history}
			orderBy={'id' /*orderBy*/}
			setOrderBy={setTasksOrderBy}
			ascending={ascending}
			setAscending={setTasksAscending}
			itemID={match.params.taskID}
			listID={match.params.listID}
			match={match}
			isTask={true}
			listName={filterName}
			edit={TaskEdit}
			empty={TaskEmpty}
			useBreadcrums={true}
			breadcrumsData={getBreadcrumsData()}
			setStatuses={setUserFilterStatuses}
			statuses={currentUser.statuses}
			allStatuses={statuses}
			checkTask={checkTask}
			deleteTask={deleteTask}
		 />
	);
}
