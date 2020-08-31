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

import Loading from 'components/loading';

import TaskAdd from './taskAddContainer';
import TaskPrint from './taskPrint';
import classnames from "classnames";
import ck5config from 'configs/components/ck5config';

import datePickerConfig from 'configs/components/datepicker';
import PendingPicker from '../components/pendingPicker';
import {toSelArr, snapshotToArray, timestampToString, sameStringForms, toMomentInput} from '../../helperFunctions';
import {invisibleSelectStyleNoArrow, invisibleSelectStyleNoArrowColored,invisibleSelectStyleNoArrowColoredRequired, invisibleSelectStyleNoArrowRequired} from 'configs/components/select';
import { REST_URL } from 'configs/restAPI';
import booleanSelects from 'configs/constants/boolSelect';
import { noMilestone } from 'configs/constants/sidebar';
import { noDef } from 'configs/constants/projects';

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
      dph
      taskWorkPausal
      monthly
      monthlyPausal
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
      milestones{
        id
        title
      }
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

const UPDATE_TASK = gql`
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

export const DELETE_TASK = gql`
mutation deleteTask($id: Int!) {
  deleteTask(
    id: $id,
  ){
    id
  }
}
`;

export default function TaskEdit (props){
	//data & queries
	const { match, history, columns, currentUser, accessRights, statuses, companies, users, allTags, projects, tasks, taskTypes, tripTypes, units, defaultUnit, subtasks, inModal, closeModal } = props;
  const { data: taskData, loading: taskLoading, refetch: taskRefetch } = useQuery(GET_TASK, { variables: {id: parseInt(match.params.taskID)} });
  const [ updateTask, {client} ] = useMutation(UPDATE_TASK);
  const [deleteTask, {deleteData}] = useMutation(DELETE_TASK);

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
  const [ taskHistory, setTaskHistory ] = React.useState([]);
  const [ invoicedDate, setInvoicedDate ] = React.useState(null);
  const [ important, setImportant ] = React.useState(false);
  const [ isColumn, setIsColumn ] = React.useState(false);
  const [ milestone, setMilestone ] = React.useState([noMilestone]);
  const [ milestones, setMilestones ] = React.useState([noMilestone]);
  const [ overtime, setOvertime ] = React.useState(booleanSelects[0]);
  const [ openUserAdd, setOpenUserAdd ] = React.useState(false);
  const [ openCompanyAdd, setOpenCompanyAdd ] = React.useState(false);
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
  const [ tags, setTags ] = React.useState([]);
  const [ taskMaterials, setTaskMaterials ] = React.useState([]);
  const [ taskType, setTaskType ] = React.useState(null);
  const [ taskWorks, setTaskWorks ] = React.useState([]);
	const [ title, setTitle ] = React.useState("");
  const [ toggleTab, setToggleTab ] = React.useState(1);
  const [ workTrips, setWorkTrips ] = React.useState([]);

  const [ viewOnly, setViewOnly ] = React.useState(true);

  let counter = 0;

	const getNewID = () => {
			return counter++;
	}

// sync
React.useEffect( () => {
    if (!taskLoading){
			setAssignedTo(taskData.task.assignedTo);
			setCloseDate( moment(taskData.task.closeDate) );
			setCompany( ( taskData.task.company ? {...taskData.task.company, value: taskData.task.company.id, label: taskData.task.company.title} : null) );
			setCreatedBy(taskData.task.createdBy);
			setCreatedAt( taskData.task.createdAt );
			setDeadline(taskData.task.deadline ? moment(taskData.task.deadline) : null) ;
			setDescription(taskData.task.description);
      setImportant(taskData.task.important);
      setInvoicedDate( moment(taskData.task.invoicedDate) );
      //invoicedDate: task.invoicedDate!==null && task.invoicedDate!==undefined ?new Date(task.invoicedDate).toISOString().replace('Z',''):'',
      const pro =  (taskData.task.project ? {...taskData.task.project, value: taskData.task.project.id, label: taskData.task.project.title} : null );
      setMilestone(pro && pro.milestone ? {...pro.milestone, value: pro.milestone.id, label: pro.milestone.title} : null );
			setOvertime( (taskData.task.overtime ? booleanSelects[1] : booleanSelects[0]) );
			setPausal( (taskData.task.pausal ? booleanSelects[1] : booleanSelects[0]) );
			setPendingChangable(taskData.task.pendingChangable);
			setPendingDate( moment(taskData.task.pendingDate) );
			setProject(pro);
			setReminder(taskData.task.reminder);
			setRepeat(taskData.task.repeat);
			setRequester( (taskData.task.requester ? {...taskData.task.requester, value: taskData.task.requester.id, label: `${taskData.task.requester.name} ${taskData.task.requester.surname}`} : null)) ;
      const sta = (taskData.task.status ? {...taskData.task.status, value: taskData.task.status.id, label: taskData.task.status.title} : null )
			setStatus(sta );
			setTags(taskData.task.tags);
			setTaskType( (taskData.task.taskType ? {...taskData.task.taskType, value: taskData.task.taskType.id, label: taskData.task.taskType.title} : null ) );
			setTitle(taskData.task.title);
      setCustomItems(taskData.task.customItems);
      setTaskMaterials(taskData.task.taskMaterials);
      setTaskWorks(taskData.task.taskWorks);
      setWorkTrips(taskData.task.workTrips);

      /*
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
  		));*/

      if (pro){
        setDefaults(pro);
        const userRights = pro ? pro.projectRights.find(r => r.user.id === currentUser.id) : false;
        if (sta && sta.action==='Invoiced' && inModal && userRights.isAdmin) {
          setViewOnly(false);
        } else {
          setViewOnly((sta && sta.action==='Invoiced') || (!userRights.isAdmin && !userRights.write));
        }
      }
    }
}, [taskLoading]);

React.useEffect( () => {
    taskRefetch({ variables: {id: parseInt(match.params.taskID)} });
}, [match.params.taskID]);

  const deleteTaskFunc = () => {
    if(window.confirm("Are you sure?")){
      deleteTask({ variables: {
        id: parseInt(match.params.taskID),
      } }).then( ( response ) => {
        if(inModal){
          closeModal();
        }else{
          history.goBack();
          history.push(match.url.substring(0,match.url.length-match.params.taskID.length));
        }
      }).catch( (err) => {
        console.log(err.message);
        console.log(err);
      });
    }
  }

  const cannotSave = () => {
  	return  title==="" || status===null || project === null || saving || viewOnly;
  }

  const	updateTaskFunc = () => {
  		if(cannotSave()){
  			return;
  		}
      setSaving(true);

  		let newInvoicedDate = null;
  		if(status.action==='Invoiced'){
  			newInvoicedDate = isNaN(invoicedDate.unix()) ? moment().unix() : invoicedDate.unix();
  		}

      updateTask({ variables: {
        id: parseInt(match.params.taskID),
        title,
        company: company ? company.id : null,
        requester: requester ? requester.id : null,
        assignedTo: assignedTo.map((item)=>item.id),
        description,
        status: status ? status.id : null,
        statusChange: statusChange !== null ? statusChange.unix() : null,
        project: project ? project.id : null,
        pausal: pausal.value,
        overtime: overtime.value,
        tags: tags.map((item)=>item.id),
        taskType: taskType ? taskType.id : null,
        repeat: repeat,
        milestone: (milestone.id === null || milestone.id === -1 ? null : milestone.id),
        attachments,
        deadline: deadline !== null ? deadline.unix() : null,
        closeDate: (closeDate !== null && (status.action==='CloseDate' || status.action === 'Invoiced'|| status.action === 'CloseInvalid')) ? closeDate.unix() : null,
        pendingDate: (pendingDate !== null && status.action==='PendingDate') ? pendingDate.unix() : null,
        pendingChangable,
    //    invoicedDate: newInvoicedDate,
    //    important,
      } }).then( ( response ) => {
      }).catch( (err) => {
        console.log(err.message);
      });

     setSaving( false );
  	}

	const getHistoryMessage = (type, data) => {
		let user = "Používateľ " + currentUser.userData.name + ' ' + currentUser.userData.surname;
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
		}
	}

	const setDefaults = (projectID) => {
		if(projectID===null){
			setDefaultFields( noDef );
			return;
		}
		let pro = projects.find((p)=>p.id===projectID);
		if(!pro){
			setDefaultFields( noDef );
			return;
		}
	 setDefaultFields( {...noDef,...pro.def} );
	}

  const rights = project ? project.projectRights.find(r => r.user.id === currentUser.id) : undefined;
  const userRights = rights === undefined ? {user: currentUser, read: false, write: false, delete: false, internal: false, isAdmin: false} : rights;

	const canAdd = userRights.write || userRights.isAdmin;
	const canDelete = userRights.delete || userRights.isAdmin;
	const canCopy = userRights.write || userRights.isAdmin || title === "" || status === null || project === null || saving;

	const availableProjects = projects.filter((p)=>{
		let userRights = p.projectRights.find(r => r.user.id === currentUser.id);
		if((userRights && userRights.isAdmin) || (userRights && userRights.read) || (p.id ===-1 || p.id === null)){
			return true;
		} else {
			return false;
		}
	});

	const USERS_WITH_PERMISSIONS = users.filter((user)=> project && project.projectRights && project.projectRights.some((right)=>right.user.id === user.id));

	const REQUESTERS =  (project && project.lockedRequester ? USERS_WITH_PERMISSIONS : users);

  const MILESTONES = [noMilestone].concat( (project ? toSelArr( project.milestones.filter((m)=> m.id !== milestone.id) ) : []) );

	const renderCommandbar = () => {
		return (
			<div className={classnames({"commandbar-small": columns}, {"commandbar": !columns}, { "p-l-25": true})}> {/*Commandbar*/}
				<div className={classnames("d-flex", "flex-row", "center-hor", {"m-b-10": columns})}>
					<div className="display-inline center-hor">
						{!columns &&
							<button type="button" className="btn btn-link-reversed waves-effect p-l-0" onClick={() => history.push(`/helpdesk/taskList/i/${this.props.match.params.listID}`)}>
								<i
									className="fas fa-arrow-left commandbar-command-icon"
									/>
							</button>
						}
						{ project &&
							<TaskAdd
								history={taskHistory}
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
							taskID={match.params.taskID}
							createdBy={createdBy}
							createdAt={createdAt}
							taskWorks={taskWorks}
							workTrips={workTrips}
							taskMaterials={taskMaterials}
							customItems={customItems}
							isLoaded={!taskLoading} />
					}
						{ canDelete &&
							<button
                type="button"
                disabled={!canDelete}
                className="btn btn-link-reversed waves-effect"
                onClick={deleteTask}>
								<i className="far fa-trash-alt" /> Delete
							</button>
						}
						<button
              type="button"
              style={{color: important ? '#ffc107' : '#0078D4'}}
              disabled={viewOnly}
              className="btn btn-link-reversed waves-effect" onClick={()=>{
								setImportant(!important);
						//		updateTaskFunc();
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
				<div className="d-flex p-2">
					<div className="row flex">
						<h2 className="center-hor text-extra-slim">{match.params.taskID}: </h2>
						<span className="center-hor flex m-r-15">
							<input type="text"
								disabled={viewOnly}
								value={title}
								className="task-title-input text-extra-slim hidden-input m-l-10"
								onChange={(e)=> {
									setTitle(e.target.value);
  						//		updateTaskFunc();
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
						//		updateTaskFunc();
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
						//		updateTaskFunc();
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
			permissionIDs = pro.projectRights.map((p) => p.user.id);
		}
		let newAssignedTo = assignedTo.filter((user)=>permissionIDs.includes(user.id));
		setProject(pro);
		setAssignedTo(newAssignedTo);
		setProjectChangeDate(moment());
		setMilestone(noMilestone);
//		updateTaskFunc();
		setDefaults(project.id);
	}

	const changeStatus = (s) => {
		if(status.action==='PendingDate'){
			setPendingStatus(s);
			setPendingOpen(true);
		}else if(s.action==='CloseDate'||s.action==='Invalid'){
			setStatus(s);
			setStatusChange(moment());
			setImportant(false);
			setCloseDate(moment());
    //		updateTaskFunc();
		}
		else{
			setStatus(s);
			setStatusChange(moment());
  //		updateTaskFunc();
		}
	}

	const changeMilestone = (mile) => {
		if(status.action==='PendingDate'){
			if(mile.startsAt!==null){
        setMilestone(mile);
        setPendingDate(moment(mile.startsAt));
        setPendingChangable(false);
  //		updateTaskFunc();
			}else{
        setMilestone(mile);
        setPendingChangable(false);
  //		updateTaskFunc();
			}
		}else{
      setMilestone(mile);
//		updateTaskFunc();
		}
	}

	const changeRequester = (req) => {
		if (req.id === -1) {
			setOpenUserAdd(true);
		} else {
      setRequester(req);
      // updateTaskFunc();
		}
	}

	const changeCompany = (comp) => {
		if (comp.id === -1) {
			setOpenCompanyAdd(true);
		} else {
      setCompany(comp);
      setPausal( parseInt(comp.taskWorkPausal) > 0 ? booleanSelects[1] : booleanSelects[0] );
			// updateTaskFunc();
		}
	}

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
									options={ availableProjects }
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
										value={assignedTo}
										placeholder="Select"
										isMulti
										isDisabled={defaultFields.assignedTo.fixed||viewOnly}
										onChange={(users)=> {
                      if (users.find(u => u.id === -1)){
                        setOpenUserAdd(true);
                      } else {
  											setAssignedTo(users);
                    //		updateTaskFunc();
                      }
										}}
										options={
											( canAdd ? [{id:-1, title:'+ Add user',body:'add', label:'+ Add user',value:null}] : [])
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
										isDisabled={defaultFields.status.fixed || viewOnly}
										styles={invisibleSelectStyleNoArrowColoredRequired}
										onChange={(s) => changeStatus(s)}
										options={statuses.filter((status)=>status.action!=='Invoiced')}
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
										onChange={(type)=> {
                      setTaskType(type);
                //		updateTaskFunc();
                  }}
										options={taskTypes}
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
								onChange={(m) => changeMilestone(m)}
								options={MILESTONES}
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
									isDisabled={defaultFields.requester.fixed || viewOnly}
									onChange={changeRequester}
									options={(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(REQUESTERS)}
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
									isDisabled={defaultFields.company.fixed || viewOnly}
									onChange={changeCompany}
									options={(canAdd ? [{id:-1,title:'+ Add company',body:'add', label:'+ Add company', value:null}] : [] ).concat(companies)}
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
									isDisabled={viewOnly || !company || parseInt(company.taskWorkPausal) === 0 || defaultFields.pausal.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(pausal)=> {
										setPausal(pausal);
              			// updateTaskFunc();
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
            			// updateTaskFunc();
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
							submitRepeat={(r) => {
                setRepeat(r);
          			// updateTaskFunc();
              }}
							deleteRepeat={()=> {
                setRepeat(null);
          			// updateTaskFunc();
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
									isDisabled={viewOnly || defaultFields.overtime.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(overtime)=> {
										setOvertime(overtime);
              			// updateTaskFunc();
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

	const renderSelectsLayout2 = () => {
		return (
			<div className={"task-edit-right" + (columns ? " w-250px" : "")} >
				<div>
					<Label className="col-form-label-2">Projekt</Label>
					<div className="col-form-value-2">
						<Select
							placeholder="Zadajte projekt"
              isDisabled={ viewOnly }
              value={ project }
              onChange={(e) => changeProject(e) }
              options={ availableProjects }
              styles={ invisibleSelectStyleNoArrowRequired }
							/>
					</div>
				</div>
				{ defaultFields.assignedTo.show &&
					<div>
						<Label className="col-form-label-2">Assigned</Label>
						<div className="col-form-value-2" style={{marginLeft: "-5px"}}>
							<Select
                value={assignedTo}
                placeholder="Select"
                isMulti
                isDisabled={defaultFields.assignedTo.fixed||viewOnly}
                onChange={(users)=> {
                  if (users.find(u => u.id === -1)){
                    setOpenUserAdd(true);
                  } else {
                    setAssignedTo(users);
                //		updateTaskFunc();
                  }
                }}
                options={
                  ( canAdd ? [{id:-1, title:'+ Add user',body:'add', label:'+ Add user',value:null}] : [])
                  .concat(USERS_WITH_PERMISSIONS)
                }
								styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				}
				{ defaultFields.status.show &&
					<div>
						<Label className="col-form-label-2">Status</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Status required"
                value={status}
                isDisabled={defaultFields.status.fixed || viewOnly}
                styles={invisibleSelectStyleNoArrowColoredRequired}
                onChange={(s) => changeStatus(s)}
                options={statuses.filter((status)=>status.action!=='Invoiced')}
								/>
						</div>
					</div>
				}
				{ defaultFields.taskType.show &&
					<div>
						<Label className="col-form-label-2">Typ</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte typ"
                value={taskType}
                isDisabled={defaultFields.taskType.fixed||viewOnly}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(type)=> {
                  setTaskType(type);
            //		updateTaskFunc();
              }}
                options={taskTypes}
								/>
						</div>
					</div>
				}
				<div>
					<Label className="col-form-label-2">Milestone</Label>
					<div className="col-form-value-2">
						<Select
              isDisabled={viewOnly}
              value={milestone}
              onChange={(m) => changeMilestone(m)}
              options={MILESTONES}
              styles={invisibleSelectStyleNoArrow}
              />
					</div>
				</div>
				{ defaultFields.tag.show &&
					<div style={{maxWidth:"250px"}}>
						<Label className="col-form-label-2">Tagy: </Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zvoľte tagy"
    						value={tags}
    						isMulti
    						onChange={(tags)=> {
                  setTags(tags);
                  // updateTaskFunc();
                }}
    						options={allTags}
    						isDisabled={defaultFields.tag.fixed||viewOnly}
    						styles={invisibleSelectStyleNoArrowColored}
								/>
						</div>
					</div>
				}
				{ defaultFields.requester.show &&
					<div>
						<Label className="col-form-label-2">Zadal</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte žiadateľa"
                value={requester}
                isDisabled={defaultFields.requester.fixed || viewOnly}
                onChange={changeRequester}
                options={(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(REQUESTERS)}
                styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				}
				{ defaultFields.company.show &&
					<div>
						<Label className="col-form-label-2">Firma</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte firmu"
                value={company}
                isDisabled={defaultFields.company.fixed || viewOnly}
                onChange={changeCompany}
                options={(canAdd ? [{id:-1,title:'+ Add company',body:'add', label:'+ Add company', value:null}] : [] ).concat(companies)}
                styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				}
				{	defaultFields.pausal.show &&
					<div>
						<label className="col-form-label m-l-7">Paušál</label>
						<div className="col-form-value-2">
							<Select
                value={company && parseInt(company.taskWorkPausal) === 0 && pausal.value === false ? {...pausal, label: pausal.label + " (nezmluvný)"} : pausal }
                isDisabled={viewOnly || !company || parseInt(company.taskWorkPausal) === 0 || defaultFields.pausal.fixed}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(pausal)=> {
                  setPausal(pausal);
                  // updateTaskFunc();
                }}
                options={booleanSelects}
								/>
						</div>
					</div>
				}
				<div>
					<Label className="col-form-label m-l-7">Deadline</Label>
					<div className="col-form-value-2" style={{marginLeft: "-1px"}}>
						<DatePicker
							className="form-control hidden-input"
              selected={deadline}
              disabled={viewOnly}
              onChange={date => {
                setDeadline(date);
                // updateTaskFunc();
              }}
							placeholderText="No deadline"
							{...datePickerConfig}
							/>
					</div>
				</div>
				<Repeat
          disabled={viewOnly}
          taskID={match.params.taskID}
          repeat={repeat}
          submitRepeat={(r) => {
            setRepeat(r);
            // updateTaskFunc();
          }}
          deleteRepeat={()=> {
            setRepeat(null);
            // updateTaskFunc();
          }}
          columns={columns}
					vertical={true}
					/>
				{	defaultFields.overtime.show &&
					<div>
						<label className="col-form-label-2">Mimo PH</label>
						<div className="col-form-value-2">
							<Select
                value={overtime}
                isDisabled={viewOnly || defaultFields.overtime.fixed}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(overtime)=> {
                  setOvertime(overtime);
                  // updateTaskFunc();
                }}
                options={booleanSelects}
								/>
						</div>
					</div>
				}
			</div>
		);
  }


	const renderTags = () => {
		return (
			<div className="row m-t-10">
				<div className="center-hor">
					<Label className="center-hor">Tagy: </Label>
				</div>
				<div className="f-1 ">
					<Select
						placeholder="Zvoľte tagy"
						value={tags}
						isMulti
						onChange={(tags)=> {
              setTags(tags);
              // updateTaskFunc();
            }}
						options={allTags}
						isDisabled={defaultFields.tag.fixed||viewOnly}
						styles={invisibleSelectStyleNoArrowColored}
						/>
				</div>
			</div>
		)
	}

	const renderPopis = () => {
		const TOTAL_PAUSAL = company ? company.taskWorkPausal : 0;

		let usedPausal = 0;
		if (company && company.monthly){
			let currentTasks = tasks.filter( task => {
				let condition1 = company.id === task.company.id;

				let currentDate = moment();
				let currentMonth = currentDate.month() + 1;
				let currentYear = currentDate.year();

				if (task.closeDate === null || task.closeDate === undefined){
					return false;
				}

				let taskCloseDate = moment(task.closeDate);
				let taskCloseMonth = taskCloseDate.month() + 1;
				let taskCloseYear = taskCloseDate.year();

				let condition2 = (currentMonth === taskCloseMonth) && (currentYear === taskCloseYear);

				return condition1 && condition2;
			})

			let taskIDs = currentTasks.map(task => task.id);

      let currentTaskWorksQuantities =[];
			//let currentTaskWorksQuantities = this.state.extraData.taskWorks.filter(work => taskIDs.includes(work.task)).map(task => task.quantity);

			if (currentTaskWorksQuantities.length > 0){
				usedPausal = currentTaskWorksQuantities.reduce((total, quantity) => total + quantity);
			}
		}

		let RenderDescription = null;
		if( viewOnly ){
			if( description.length !== 0 ){
				RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
			}else{
				RenderDescription = <div className="task-edit-popis">Úloha nemá popis</div>
			}
		}else{
			if( showDescription ){
				RenderDescription = <div onClick={()=> setShowDescription(true)}>
					<CKEditor
						editor={ ClassicEditor }
						data={description}
						onInit={(editor) => {
							editor.editing.view.document.on( 'keydown', ( evt, data ) => {
								if ( data.keyCode === 27 ) {
									setShowDescription(false);
									data.preventDefault();
									evt.stop();
								}
							});
						}}
						onChange={(e,editor)=>{
              setDescription(editor.getData());
              // updateTaskFunc();
						}}
						config={ck5config}
						/>
				</div>
			}else{
				RenderDescription = <div className="clickable task-edit-popis" onClick={()=>setShowDescription(true)}>
					<div dangerouslySetInnerHTML={{__html:description }} />
					<span className="text-highlight"> <i	className="fas fa-pen"/> edit </span>
				</div>
			}
		}
		return (
			<div style={{zIndex: "9999"}}>
				<div>
				<Label className="col-form-label m-t-10 m-r-20">Popis úlohy</Label>
				{ company && company.monthlyPausal &&
					<span> {`Used pausal: ${usedPausal} / Total pausal: ${TOTAL_PAUSAL}`} </span>
				}
				</div>
				{RenderDescription}
			</div>
		)
	}


	const renderAttachments = () => {
		return (
			<Attachments
				disabled={viewOnly}
				taskID={match.params.taskID}
				attachments={attachments}
				addAttachments={(newAttachments)=>{
					let time = moment().unix();
					newAttachments = newAttachments.map((attachment)=>{
						return {
							title:attachment.name,
							size:attachment.size,
							time,
							data:attachment
						}
					});
					setAttachments([...attachments, ...newAttachments]);
					// updateTaskFunc();
				}}
				removeAttachment={(attachment)=>{
					let newAttachments = [...attachments];
					newAttachments.splice(newAttachments.findIndex((item)=>item.title===attachment.title && item.size===attachment.size && item.time===attachment.time),1);
					setAttachments([...newAttachments]);
					// updateTaskFunc();
				}}
				/>
		)
	}

	const renderModalUserAdd = () => {
		return (
			<Modal isOpen={openUserAdd} >
				<ModalHeader>
					Add user
				</ModalHeader>
				<ModalBody>
					<UserAdd
						close={() => setOpenUserAdd(false)}
						addUser={(user) => {
			/*				let newUsers = users.concat([user]);
							this.setState({
								users: newUsers,
							})*/
						}}
						/>
				</ModalBody>
			</Modal>
		)
	}

	const renderModalCompanyAdd = () => {
		return (
			<Modal isOpen={openCompanyAdd}>
				<ModalBody>
					<CompanyAdd
						close={() => setOpenCompanyAdd(false)}
						addCompany={(company) => {
			/*				let newCompanies = this.state.companies.concat([company]);
							this.setState({
								companies: newCompanies,
							})*/
						}}
						/>
				</ModalBody>
			</Modal>
		)
	}


	const renderPendingPicker = () => {
		return (
			<PendingPicker
				open={pendingOpen}
				prefferedMilestone={milestone}
				milestones={ (project ? toSelArr( project.milestones.filter((m)=> m.id !== milestone.id && milestone.startsAt!==null) ) : []) }
				closeModal={()=>setPendingOpen(false)}
				savePending={(pending)=>{
					/*
					database.collection('help-calendar_events').where("taskID", "==", parseInt(this.props.match.params.taskID)).get()
					.then((data)=>{
					snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-calendar_events/'+item.id));
					});
					this.setState({
						pendingOpen:false,
						pendingStatus:null,
						status:this.state.pendingStatus,
						pendingDate:pending.milestoneActive?moment(pending.milestone.startsAt):pending.pendingDate,
						milestone:pending.milestoneActive?pending.milestone:this.state.milestone,
						pendingChangable:!pending.milestoneActive,
						statusChange:(new Date().getTime()),
					},this.submitTask.bind(this))*/
				}}
				/>
		)
	}
/*

  let newTaskWorks = [...taskWorks];
  newTaskWorks.push({...newService, id: getNewID()});
  setTaskWorks(newTaskWorks);
*/

	const renderVykazyTable = () => {
		return (
			<VykazyTable
				showColumns={ (viewOnly ? [0,1,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7,8]) }
				showTotals={false}
				disabled={viewOnly}
				company={company}
				match={match}
				taskID={match.params.taskID}
				taskAssigned={assignedTo}

				showSubtasks={project ? project.showSubtasks : false}

				submitService={(newService) => {
          setTaskWorks([ ...taskWorks, {...newService, id: getNewID()}]);
      //		updateTaskFunc();
        }}
				subtasks={taskWorks ? taskWorks : []}
				defaultType={taskType}
        taskTypes={taskTypes}
				updateSubtask={(id,newData)=>{
          let newTaskWorks=[...taskWorks];
          newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
          setTaskWorks(newTaskWorks);
      //		updateTaskFunc();
				}}
				updateSubtasks={(multipleSubtasks)=>{
          let newTaskWorks=[...taskWorks];
          multipleSubtasks.forEach(({id, newData})=>{
            newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
          });
          setTaskWorks(newTaskWorks);
      //		updateTaskFunc();
				}}
				removeSubtask={(id)=>{
          let newTaskWorks=[...taskWorks];
          newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
          setTaskWorks(newTaskWorks);
      //		updateTaskFunc();
				}}
				workTrips={workTrips ? workTrips : []}
				tripTypes={tripTypes ? tripTypes : []}
        submitTrip={(newTrip)=>{
          setWorkTrips([...workTrips,{id: getNewID(),...newTrip}]);
      //		updateTaskFunc();
        }}
				updateTrip={(id,newData)=>{
          let newTrips=[...workTrips];
          newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
          setWorkTrips(newTrips);
      //		updateTaskFunc();
				}}
				updateTrips={(multipleTrips)=>{
          let newTrips=[...workTrips];
          multipleTrips.forEach(({id, newData})=>{
            newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
          });
          setWorkTrips(newTrips);
      //		updateTaskFunc();
				}}
				removeTrip={(id)=>{
          let newTrips=[...workTrips];
          newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
          setWorkTrips(newTrips);
      //		updateTaskFunc();
				}}

				materials={taskMaterials ? taskMaterials : []}
        submitMaterial={(newMaterial)=>{
          setTaskMaterials([...taskMaterials,{id:getNewID(),...newMaterial}]);
      //		updateTaskFunc();
        }}
				updateMaterial={(id,newData)=>{
          let newTaskMaterials=[...taskMaterials];
          newTaskMaterials[newTaskMaterials.findIndex((material)=>material.id===id)]={...newTaskMaterials.find((material)=>material.id===id),...newData};
          setTaskMaterials(newTaskMaterials);
      //		updateTaskFunc();
				}}
				updateMaterials={(multipleMaterials)=>{
          let newTaskMaterials=[...taskMaterials];
          multipleMaterials.forEach(({id, newData})=>{
            newTaskMaterials[newTaskMaterials.findIndex((material)=>material.id===id)]={...newTaskMaterials.find((material)=>material.id===id),...newData};
          });
          setTaskMaterials(newTaskMaterials);
      //		updateTaskFunc();
				}}
				removeMaterial={(id)=>{
          let newTaskMaterials=[...taskMaterials];
          newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
          setTaskMaterials(newTaskMaterials);
      //		updateTaskFunc();
				}}
				customItems={customItems ? customItems : [] }
        submitCustomItem={(customItem)=>{
          setCustomItems([...customItems,{id:getNewID(),...customItem}]);
      //		updateTaskFunc();
        }}
				updateCustomItem={(id,newData)=>{
          let newCustomItems=[...customItems];
          newCustomItems[newCustomItems.findIndex((customItem)=>customItem.id===id)]={...newCustomItems.find((customItem)=>customItem.id===id),...newData};
          setCustomItems(newCustomItems);
      //		updateTaskFunc();
				}}
				updateCustomItems={(multipleCustomItems)=>{
          let newCustomItems=[...customItems];
          multipleCustomItems.forEach(({id, newData})=>{
            newCustomItems[newCustomItems.findIndex((customItem)=>customItem.id===id)]={...newCustomItems.find((customItem)=>customItem.id===id),...newData};
          });
          setCustomItems(newCustomItems);
      //		updateTaskFunc();
				}}
				removeCustomItem={(id)=>{
          let newCustomItems=[...customItems];
          newCustomItems.splice(newCustomItems.findIndex((customItem)=>customItem.id===id),1);
          setCustomItems(newCustomItems);
      //		updateTaskFunc();
				}}
				units={units ? units : []}
				defaultUnit={defaultUnit}
				/>
		)
	}


	if (taskLoading) {
		return <Loading />
	}

	return (
		<div className="flex">
			{ showDescription &&
				<div
					style={{backgroundColor: "transparent", width: "100%", height: "100%", position: "absolute"}}
					onClick={()=>setShowDescription(false)}
					/>
			}

			{ renderCommandbar() }

			<div className={classnames({"fit-with-header-and-commandbar": !columns}, {"fit-with-header-and-commandbar-3": columns}, "scroll-visible", "bkg-white", { "row": layout === '2'})}>
				<div className={classnames( "card-box-lanwiki", { "task-edit-left": layout === '2' && !columns, "task-edit-left-columns": layout === '2' && columns})}>

					<div className="p-t-20 p-l-30 p-r-30">
						{ renderTitle() }

						<hr className="m-t-5 m-b-5"/>
						{ layout === 1 && renderSelectsLayout1() }

						{ renderPopis() }

						{ renderAttachments() }

						{ layout === 1 && defaultFields.tag.show && renderTags() }

						{ renderModalUserAdd() }

						{ renderModalCompanyAdd() }

						{ renderPendingPicker() }

						{ renderVykazyTable() }

            {/*
						{ this.renderComments(taskID, permission) }
						*/}
					</div>


				</div>

				{ layout === 2 && renderSelectsLayout2() }

			</div>
		</div>
	);
}

/*

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
								{ this.state.taskHistory.map((event)=>
									<ListGroupItem key={event.id}>
										({timestampToString(event.createdAt)})
										{' ' + event.message}
									</ListGroupItem>
								)}
							</ListGroup>
							{	this.state.taskHistory.length===0 && <div>História je prázdna.</div>	}
						</TabPane>
					}
				</TabContent>
			</div>
		)
	}
}
*/
