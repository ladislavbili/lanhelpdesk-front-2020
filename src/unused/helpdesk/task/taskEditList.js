import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from "react-redux";
import {Button, Label, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalBody} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import CKEditor from 'ckeditor4-react';

import Attachments from '../components/attachments.js';
import Comments from '../components/comments.js';
import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';

import ServicesExpenditure from '../components/services/prace';
import MaterialsExpenditure from '../components/materials/materials';
import ServicesBudget from '../components/services/rozpocet';
import MaterialsBudget from '../components/materials/rozpocet';

import UserAdd from '../settings/users/userAdd';
import CompanyAdd from '../settings/companies/companyAdd';

import TaskAdd from './taskAddContainer';
import TaskPrint from './taskPrint';
import classnames from "classnames";
import {rebase, database} from '../../index';
import { storageCompaniesStart, storageHelpPricelistsStart, storageHelpPricesStart,storageHelpProjectsStart, storageHelpStatusesStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageHelpTasksStart, storageHelpUnitsStart,storageHelpWorkTypesStart, storageMetadataStart, storageUsersStart, storageHelpMilestonesStart } from '../../redux/actions';
import firebase from 'firebase';
import ck4config from '../../scss/ck4config';
import {toSelArr, snapshotToArray, timestampToString, sameStringForms} from '../../helperFunctions';
import {invisibleSelectStyleNoArrow} from 'configs/components/select';
import { noMilestone } from 'configs/constants/sidebar';
import { noDef } from 'configs/constants/projects';

const oneDay = 24*60*60*1000;


class TaskEditList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saving:false,
			loading:true,
			addItemModal:false,
			task:null,

			taskMaterials:[],
			taskWorks:[],
			pricelists:[],
			extraDataLoaded:false,

			users:[],
			companies:[],
			workTypes:[],
			statuses:[],
			projects:[],
			milestones:[noMilestone],
			units:[],
			allTags:[],
			taskTypes:[],
			defaultUnit:null,
			openEditServiceModal:false,
			openService:null,
			openEditMaterialModal:false,
			openMaterial:null,
			defaultFields:noDef,

			title:'',
			company:null,
			workHours:'0',
			requester:null,
			assignedTo:[],
			description:'',
			status:null,
			statusChange:null,
			deadline:null,
			closeDate:"",
			pendingDate:"",
			reminder:null,
			project:null,
			tags:[],
			pausal:{value:true,label:'Pausal'},
			overtime:{value:true,label:'Áno'},
			type:null,
			createdAt:null,
			repeat:null,
			milestone:noMilestone,
			attachments:[],

			/////
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			openCopyModal: false,
			toggleTab:"1",

			openUserAdd: false,
			openCompanyAdd: false,
			viewOnly:true,
			print: false,
		};
    this.submitTask.bind(this);
    this.submitMaterial.bind(this);
    this.submitService.bind(this);
		this.canSave.bind(this);
		this.deleteTask.bind(this);
		this.saveData.bind(this);
    this.fetchData(this.props.match.params.taskID);
	}

	canSave(){
		return this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving||this.state.viewOnly;
	}

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
			props.workTypesLoaded &&
			props.metadataLoaded &&
			props.usersLoaded &&
			props.milestonesLoaded
	}

	deleteTask(){
		if(window.confirm("Are you sure?")){
			let taskID = this.props.match.params.taskID;
			let storageRef = firebase.storage().ref();
			this.state.attachments.map((attachment)=>storageRef.child(attachment.path).delete());

			rebase.removeDoc('/help-tasks/'+taskID);
			this.state.taskMaterials.forEach((material)=>rebase.removeDoc('/help-task_materials/'+material.id))
			this.state.taskWorks.forEach((work)=>rebase.removeDoc('/help-task_works/'+work.id))
			//this.state.subtasks.forEach((subtask)=>rebase.removeDoc('/help-task_subtasks/'+subtask.id))
			if(this.state.repeat!==null){
				rebase.removeDoc('/help-repeats/'+taskID);
			}
			database.collection('help-comments').where("task", "==", taskID).get()
			.then((data)=>{
				snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-comments/'+item.id));
			});
		}
	}

	submitTask(){
		if(this.canSave()){
			return;
		}
		let taskID = this.props.match.params.taskID;
    this.setState({saving:true});

		let pendingDate = null;
		if(this.state.status.action==='pending'){
			pendingDate = isNaN(new Date(this.state.pendingDate).getTime()) ? ((new Date()).getTime()+oneDay) : new Date(this.state.pendingDate).getTime()
		}

		let closeDate = null;
		if(this.state.status.action==='close'){
			closeDate = isNaN(new Date(this.state.closeDate).getTime()) ? (new Date()).getTime() : new Date(this.state.closeDate).getTime()
		}

    let body = {
      title: this.state.title,
      company: this.state.company?this.state.company.id:null,
      workHours: this.state.workHours,
      requester: this.state.requester?this.state.requester.id:null,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
      description: this.state.description,
      status: this.state.status?this.state.status.id:null,
			deadline: this.state.deadline!==null?this.state.deadline.unix()*1000:null,
			//reminder: isNaN(new Date(this.state.reminder).getTime()) ? null : (new Date(this.state.reminder).getTime()),
      statusChange: this.state.statusChange,
      project: this.state.project?this.state.project.id:null,
      pausal: this.state.pausal.value,
      overtime: this.state.overtime.value,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type?this.state.type.id:null,
			repeat: this.state.repeat!==null?taskID:null,
			milestone:this.state.milestone.id,
			attachments:this.state.attachments,
			closeDate,
			pendingDate,
    }

    rebase.updateDoc('/help-tasks/'+taskID, body)
    .then(()=>{
      this.setState({saving:false});
    });
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.taskID!==props.match.params.taskID){
      this.setState({loading:true, extraDataLoaded:false});
      this.fetchData(props.match.params.taskID);
    }
		if(!sameStringForms(props.companies,this.props.companies)||
			!sameStringForms(props.pricelists,this.props.pricelists)||
			!sameStringForms(props.prices,this.props.prices)||
			!sameStringForms(props.projects,this.props.projects)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.tags,this.props.tags)||
			!sameStringForms(props.taskTypes,this.props.taskTypes)||
			!sameStringForms(props.tasks,this.props.tasks)||
			!sameStringForms(props.units,this.props.units)||
			!sameStringForms(props.workTypes,this.props.workTypes)||
			!sameStringForms(props.metadata,this.props.metadata)||
			!sameStringForms(props.users,this.props.users)||
			!sameStringForms(props.milestones,this.props.milestones)
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
		if(!this.props.workTypesActive){
			this.props.storageHelpWorkTypesStart();
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
		this.setData(this.props);
  }

  fetchData(taskID){
    Promise.all(
      [
        database.collection('help-task_materials').where("task", "==", taskID).get(),
        database.collection('help-task_works').where("task", "==", taskID).get(),
        database.collection('help-repeats').doc(taskID).get()
    ]).then(([taskMaterials, taskWorks,repeat])=>{
      this.saveData(
				snapshotToArray(taskMaterials),
				snapshotToArray(taskWorks),
				repeat.exists ? {id:repeat.id,...repeat.data()} : null,
				);
    });
  }

	saveData(taskMaterials,taskWorks,repeat){
		this.setState({
			extraDataLoaded:true,
			taskMaterials,
			toggleTab:'1',
			taskWorks,
			repeat
		},()=>{this.setData(this.props)});
	}

	setDefaults(projectID){
		if(projectID===null){
			this.setState({defaultFields:noDef});
			return;
		}
		let project = this.props.projects.find((project)=>project.id===projectID);
		if(!project){
			this.setState({defaultFields:noDef});
			return;
		}
		this.setState({
			defaultFields:project.def
		});
	}

	setData(props){
		if(!this.state.extraDataLoaded || !this.storageLoaded(props)){
			return;
		}

		let taskID = props.match.params.taskID;
		let task = props.tasks.find((task)=>task.id===taskID);
		let statuses = toSelArr(props.statuses);
		let projects = toSelArr(props.projects);
		let users = toSelArr(props.users,'email');
		let tags = toSelArr(props.tags);
		let companies = toSelArr(props.companies);
		let workTypes = toSelArr(props.workTypes);
		let units = toSelArr(props.units);
		let taskTypes = toSelArr(props.taskTypes);
		let prices = props.prices;
		let subtasks = props.subtasks;
		let pricelists = props.pricelists;
		let defaultUnit = props.metadata.defaultUnit;
		let taskMaterials = this.state.taskMaterials;
		let taskWorks = this.state.taskWorks;
		let milestones = [noMilestone,...toSelArr(props.milestones)];

		this.setDefaults(task.project);

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
    company = {...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
    let requester = users.find((item)=>item.id===task.requester);
    let assignedTo = users.filter((user)=>task.assignedTo.includes(user.id));
    let type = taskTypes.find((item)=>item.id===task.type);

    let newCompanies=companies.map((company)=>{
      let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
      return newCompany;
    });
    let newWorkTypes=workTypes.map((workType)=>{
      let newWorkType = {...workType, prices:prices.filter((price)=>price.workType===workType.id)}
      return newWorkType;
    });
		let taskTags=[];
		if(task.tags){
			taskTags=tags.filter((tag)=>task.tags.includes(tag.id));
		}

		let permission = project.permissions.find((permission)=>permission.user===props.currentUser.id);
		let viewOnly = (permission===undefined || !permission.write) && props.currentUser.userData.role.value===0;
		let newState = {
			statuses,
			projects,
			users,
			companies:newCompanies,
			workTypes:newWorkTypes,
			units,
			taskMaterials,
			taskWorks,
			subtasks,
			taskTypes,
			allTags:tags,
			task,

			title:task.title,
			pausal:task.pausal?{value:true,label:'Pausal'}:{value:false,label:'Project'},
			overtime:task.overtime?{value:true,label:'Áno'}:{value:false,label:'Nie'},
			status:status?status:null,
			statusChange:task.statusChange?task.statusChange:null,
			createdAt:task.createdAt?task.createdAt:(new Date()).getTime(),
			deadline: task.deadline!==null?moment(task.deadline):null,
			closeDate: task.closeDate!==null && task.closeDate!==undefined ?new Date(task.closeDate).toISOString().replace('Z',''):'',
			pendingDate: task.pendingDate!==null && task.pendingDate!==undefined ?new Date(task.pendingDate).toISOString().replace('Z',''):'',
			reminder: task.reminder?new Date(task.reminder).toISOString().replace('Z',''):'',
			project:project?project:null,
			company:company?company:null,
			workHours:isNaN(parseInt(task.workHours))?0:parseInt(task.workHours),
			requester:requester?requester:null,
			assignedTo,
			milestone,
			milestones,
			attachments:task.attachments?task.attachments:[],

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

    this.setState(newState);
  }


	render() {
		let permission = null;
		if(this.state.project){
			permission = this.state.project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
		}
		let canAdd = this.props.currentUser.userData.role.value>0;
		let canDelete = (permission && permission.delete)||this.props.currentUser.userData.role.value===3;

		let taskID = this.props.match.params.taskID;
		let taskWorks= this.state.taskWorks.map((work)=>{
			let finalUnitPrice=parseFloat(work.price);
			if(work.extraWork){
				finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
			}
			let totalPrice=(finalUnitPrice*parseFloat(work.quantity)*(1-parseFloat(work.discount)/100)).toFixed(3);
			finalUnitPrice=finalUnitPrice.toFixed(3);
			let workType= this.state.workTypes.find((item)=>item.id===work.workType);
			let assignedTo=work.assignedTo?this.state.users.find((item)=>item.id===work.assignedTo):null

			return {
				...work,
				workType,
				unit:this.state.units.find((unit)=>unit.id===work.unit),
				finalUnitPrice,
				totalPrice,
				assignedTo:assignedTo?assignedTo:null
			}
		});

		let taskMaterials= this.state.taskMaterials.map((material)=>{
			let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100));
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(3);
			finalUnitPrice=finalUnitPrice.toFixed(3);
			return {
				...material,
				unit:this.state.units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice
			}
		});

		let createdBy=null;
		if(this.state.task&& this.state.task.createdBy){
			createdBy = this.state.users.find((user)=>user.id===this.state.task.createdBy);
		}

		return (
			<div className="">
				<div className="commandbar">
					<div className="d-flex flex-row center-hor p-2  mr-auto ">
							<div className="display-inline center-hor">
							{!this.props.columns &&
								<button type="button" className="btn btn-link waves-effect" onClick={() => this.props.history.push(`/helpdesk/taskList/i/${this.props.match.params.listID}`)}>
									<i
										className="fas fa-arrow-left commandbar-command-icon"
										/>
								</button>
							}
							{
								this.state.statuses.sort((item1,item2)=>{
					        if(item1.order &&item2.order){
					          return item1.order > item2.order? 1 :-1;
					        }
					        return -1;
					      }).map((status)=>
								<Button
									key={status.id}
									className="btn-link"
									disabled={this.state.defaultFields.status.fixed||this.state.viewOnly}
									onClick={()=>{
										if(status.action==='pending'){
											this.setState({
												status,
												statusChange:(new Date().getTime()),
												pendingDate:new Date((new Date()).getTime()+oneDay).toISOString().replace('Z',''),
											},this.submitTask.bind(this))
										}else if(status.action==='closed'){
											this.setState({
												status,
												statusChange:(new Date().getTime()),
												closeDate: new Date().toISOString().replace('Z',''),
											},this.submitTask.bind(this))
										}
										else{
											this.setState({status,statusChange:(new Date().getTime())},this.submitTask.bind(this))
										}
									}}
									><i className={(status.icon?status.icon:"")+" commandbar-command-icon"}/>{" "+status.title}
								</Button>
								)
							}
							{this.state.project
								&&
								<TaskAdd history={this.props.history} project={this.state.project.id} triggerDate={this.state.projectChangeDate} task={this.state} disabled={this.canSave()}/>
							}
						</div>
						<div className="ml-auto center-hor">
							<TaskPrint match={this.props.match} {...this.state} isLoaded={this.state.extraDataLoaded && this.storageLoaded(this.props) && !this.state.loading}/>
								{canDelete && <button type="button" disabled={!canDelete} className="btn btn-link waves-effect" onClick={this.deleteTask.bind(this)}>
									<i
										className="far fa-trash-alt"
										/> Delete
									</button>}
							</div>
					</div>
				</div>

						<div className="card-box fit-with-header-and-commandbar scroll-visible max-width-1660">
							<div className="d-flex p-2">
								<div className="row flex">
									<h1 className="center-hor text-extra-slim">{taskID}: </h1>
									<span className="center-hor flex m-r-15">
							    	<input type="text" disabled={this.state.viewOnly} value={this.state.title} className="task-title-input text-extra-slim hidden-input" onChange={(e)=>this.setState({title:e.target.value},this.submitTask.bind(this))} placeholder="Enter task name" />
									</span>
									<div className="ml-auto center-hor">
									<span className="label label-info" style={{backgroundColor:this.state.status && this.state.status.color?this.state.status.color:'white'}}>{this.state.status?this.state.status.title:'Neznámy status'}</span>
									</div>
								</div>
							</div>


							<div className="row">
								<div className="col-lg-12 d-flex">

									<p className="">
										<span className="text-muted">
											{createdBy?"Created by ":""}
										</span>
											{createdBy? (createdBy.name + " " +createdBy.surname) :''}
										<span className="text-muted">
											{createdBy?' at ':'Created at '}
											{this.state.createdAt?(timestampToString(this.state.createdAt)):''}
										</span>
									</p>
									<p className="text-muted ml-auto">{this.state.statusChange?('Status changed at ' + timestampToString(this.state.statusChange)):''}</p>
								</div>

							</div>

							<hr className="m-t-5"/>

						<div className="row">


						<div className="task-edit-left-half">

							<div className="col-lg-12 row m-t-5">
								<div className="center-hor m-r-5"><Label className="center-hor">Assigned to: </Label></div>
								<div className="f-1">
									<Select
										value={this.state.assignedTo}
										placeholder="Zadajte poverených pracovníkov"
										isMulti
										isDisabled={this.state.defaultFields.assignedTo.fixed||this.state.viewOnly}
										onChange={(users)=>this.setState({assignedTo:users},this.submitTask.bind(this))}
										options={(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(this.state.users)}
										styles={invisibleSelectStyleNoArrow}
										/>
								</div>
							</div>

							<div className="col-lg-12">

								<div className="col-lg-4">
										<div className="row p-r-10 ">
											<Label className="col-3 col-form-label">Typ</Label>
											<div className="col-9">
												<Select
													placeholder="Zadajte typ"
													value={this.state.type}
													isDisabled={this.state.defaultFields.type.fixed||this.state.viewOnly}
													styles={invisibleSelectStyleNoArrow}
													onChange={(type)=>this.setState({type},this.submitTask.bind(this))}
													options={this.state.taskTypes}
													/>
											</div>
										</div>
										<div className="row p-r-10 ">
											<Label className="col-3 col-form-label">Projekt</Label>
											<div className="col-9">
												<Select
													placeholder="Zadajte projekt"
													isDisabled={this.state.viewOnly}
													value={this.state.project}
													onChange={(project)=>this.setState({project, projectChangeDate:(new Date()).getTime(),milestone:noMilestone},()=>{this.submitTask();this.setDefaults(project.id)})}
													options={this.state.projects.filter((project)=>{
														let curr = this.props.currentUser;
														if((curr.userData && curr.userData.role.value===3)||(project.id===-1||project.id===null)){
															return true;
														}
														let permission = project.permissions.find((permission)=>permission.user===curr.id);
														return permission && permission.read;
													})}
													styles={invisibleSelectStyleNoArrow}
													/>
											</div>
										</div>
										<div className="row p-r-10">
											<Label className="col-3 col-form-label">Close date</Label>
											<div className="col-9">
												{/*className='form-control hidden-input'*/}
												<input
													className='form-control hidden-input'
													placeholder="Close date"
													type="datetime-local"
													disabled={!this.state.status || this.state.status.action!=='close'||this.state.viewOnly}
													value={this.state.closeDate}
													onChange={(e)=>{
														this.setState({closeDate:e.target.value},this.submitTask.bind(this))}
													}
													/>
											</div>
										</div>
								</div>

								<div className="col-lg-4">
										<div className="row p-r-10 ">
											<Label className="col-3 col-form-label">Zadal</Label>
											<div className="col-9">
												<Select
													placeholder="Zadajte žiadateľa"
													value={this.state.requester}
													isDisabled={this.state.defaultFields.requester.fixed||this.state.viewOnly}
													onChange={(requester)=>
														{
															if (requester.id === -1) {
																this.setState({
																	openUserAdd: true,
																})
															} else {
																this.setState({requester},this.submitTask.bind(this))
															}
														}
													}
													options={(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(this.state.users)}
													styles={invisibleSelectStyleNoArrow}
													/>
											</div>
										</div>
										<div className="row p-r-10 ">
											<Label className="col-3 col-form-label">Firma</Label>
											<div className="col-9">
												<Select
													placeholder="Zadajte firmu"
													value={this.state.company}
													isDisabled={this.state.defaultFields.company.fixed||this.state.viewOnly}
													onChange={(company)=> {
															if (company.id === -1) {
																this.setState({
																	openCompanyAdd: true,
																})
															} else {
																this.setState({company},this.submitTask.bind(this));
															}
														}
													}
													options={(canAdd?[{id:-1,title:'+ Add company',body:'add', label:'+ Add company',value:null}]:[]).concat(this.state.companies)}
													styles={invisibleSelectStyleNoArrow}
													/>
											</div>
										</div>
										<div className="row p-r-10">
											<Label className="col-3 col-form-label">Pending</Label>
											<div className="col-9">
												{/*className='form-control hidden-input'*/}
												<input
													className='form-control hidden-input'
													placeholder="Pending date"
													type="datetime-local"
													disabled={!this.state.status || this.state.status.action!=='pending'||this.state.viewOnly}
													value={this.state.pendingDate}
													onChange={(e)=>{
														this.setState({pendingDate:e.target.value},this.submitTask.bind(this))}
													}
													/>
											</div>
										</div>
								</div>

								<div className="col-lg-4">
									<div className="row p-r-10">
										<Label className="col-3 col-form-label">Deadline</Label>
										<div className="col-9">
											<DatePicker
												selected={this.state.deadline}
												disabled={this.state.viewOnly}
												onChange={date => {
													this.setState({ deadline: date },this.submitTask.bind(this));
												}}
												locale="en-gb"
												placeholderText="No deadline"
												showTimeSelect
												className="form-control hidden-input"
												todayButton="Today"
												timeFormat="HH:mm"
												timeIntervals={15}
												dateFormat="HH:mm DD.MM.YYYY"
												/>
										</div>
									</div>
										<Repeat
											disabled={this.state.viewOnly}
											taskID={taskID}
											repeat={this.state.repeat}
											submitRepeat={(repeat)=>{
												database.collection('help-repeats').doc(taskID).set({
													...repeat,
													task:taskID,
													startAt:(new Date(repeat.startAt).getTime()),
													});
												this.setState({repeat})
											}}
											deleteRepeat={()=>{
												rebase.removeDoc('/help-repeats/'+taskID);
												this.setState({repeat:null})
											}}
											columns={!this.props.columns}
											/>
											<div className="row p-r-10">
												<Label className="col-3 col-form-label">Milestone</Label>
												<div className="col-9">
													<Select
														isDisabled={this.state.viewOnly}
														value={this.state.milestone}
														onChange={(milestone)=> {
															this.setState({milestone},this.submitTask.bind(this));
															}
														}
														options={this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null &&  milestone.project===this.state.project.id))}
														styles={invisibleSelectStyleNoArrow}
														/>
												</div>
											</div>
								</div>

							</div>


						{false && <div className="form-group m-b-0 row">
							<label className="col-5 col-form-label text-slim">Mimo pracovných hodín</label>
							<div className="col-7">
								<Select
									isDisabled={this.state.viewOnly}
									value={this.state.overtime}
									styles={invisibleSelectStyleNoArrow}
									onChange={(overtime)=>this.setState({overtime},this.submitTask.bind(this))}
									options={[{value:true,label:'Áno'},{value:false,label:'Nie'}]}
									/>
							</div>
						</div>}
						{false && <div className="row">
							<label className="col-5 col-form-label text-slim">Pripomienka</label>
							<div className="col-7">
								{/*className='form-control hidden-input'*/}
								<input
									disabled={this.state.viewOnly}
									className='form-control'
									placeholder="Status change date"
									type="datetime-local"
									value={this.state.reminder}
									onChange={(e)=>{
										this.setState({reminder:e.target.value},this.submitTask.bind(this))}
									}
									/>
							</div>
						</div>}

							<Label className="m-t-5  m-b-10">Popis</Label>
								<CKEditor
									data={this.state.description}
									onChange={(e)=>{
										this.setState({description:e.editor.getData()},this.submitTask.bind(this))
								}}
								readOnly={this.state.viewOnly}
									config={{
										...ck4config
									}}
									/>

								<Modal isOpen={this.state.openUserAdd}  toggle={() => this.setState({openUserAdd: !this.state.openUserAdd})} >
									<ModalBody>
										<UserAdd close={() => this.setState({openUserAdd: false,})} addUser={(user) => {
												let newUsers = this.state.users.concat([user]);
												this.setState({
													users: newUsers,
												})
											}}/>
									</ModalBody>
								</Modal>

								<Modal isOpen={this.state.openCompanyAdd}  toggle={() => this.setState({openCompanyAdd: !this.state.openCompanyAdd})} >
									<ModalBody>
										<CompanyAdd close={() => this.setState({openCompanyAdd: false,})} addCompany={(company) => {
												let newCompanies = this.state.companies.concat([company]);
												this.setState({
													companies: newCompanies,
												})
											}}/>
									</ModalBody>
								</Modal>

									{false && <Subtasks
										disabled={this.state.viewOnly}
										taskAssigned={this.state.assignedTo}
										submitService={this.submitSubtask.bind(this)}
										subtasks={this.state.subtasks.map((subtask)=>{
											let assignedTo=subtask.assignedTo?this.state.users.find((item)=>item.id===subtask.assignedTo):null
											return {
												...subtask,
												assignedTo:assignedTo?assignedTo:null
											}
										})}
										updateSubtask={(id,newData)=>{
											rebase.updateDoc('help-task_subtasks/'+id,newData);
											let newSubtasks=[...this.state.subtasks];
											newSubtasks[newSubtasks.findIndex((subtask)=>subtask.id===id)]={...newSubtasks.find((subtask)=>subtask.id===id),...newData};
											this.setState({subtasks:newSubtasks});
										}}
										removeSubtask={(id)=>{
											rebase.removeDoc('help-task_subtasks/'+id).then(()=>{
												let newSubtasks=[...this.state.subtasks];
												newSubtasks.splice(newSubtasks.findIndex((subtask)=>subtask.id===id),1);
												this.setState({subtasks:newSubtasks});
											});
											}
										}
										match={this.props.match}
									/>}

									{this.state.toggleTab !=="3" && <ServicesExpenditure
										disabled={this.state.viewOnly}
										taskAssigned={this.state.assignedTo}
										submitService={this.submitService.bind(this)}
										updatePrices={(ids)=>{
											taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
												let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
												if(price === undefined){
													price = 0;
												}else{
													price = price.price;
												}
												rebase.updateDoc('help-task_works/'+item.id, {price})
												.then(()=>{
													let newTaskWorks=[...this.state.taskWorks];
													newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
													this.setState({taskWorks:newTaskWorks});
												});
												return null;
											})
										}}
										subtasks={taskWorks}
										workTypes={this.state.workTypes}
										updateSubtask={(id,newData)=>{
											rebase.updateDoc('help-task_works/'+id,newData);
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskWorks:newTaskWorks});
										}}
										company={this.state.company}
										removeSubtask={(id)=>{
											rebase.removeDoc('help-task_works/'+id).then(()=>{
												let newTaskWorks=[...this.state.taskWorks];
												newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
												this.setState({taskWorks:newTaskWorks});
											});
											}
										}
										match={this.props.match}
									/>}
								{this.state.toggleTab==='3' &&
									<ServicesBudget
										disabled={this.state.viewOnly}
										taskAssigned={this.state.assignedTo}
										submitService={this.submitService.bind(this)}
										updatePrices={(ids)=>{
											taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
												let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
												if(price === undefined){
													price = 0;
												}else{
													price = price.price;
												}
												rebase.updateDoc('help-task_works/'+item.id, {price})
												.then(()=>{
													let newTaskWorks=[...this.state.taskWorks];
													newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
													this.setState({taskWorks:newTaskWorks});
												});
												return null;
											})
										}}
										subtasks={taskWorks}
										workTypes={this.state.workTypes}
										updateSubtask={(id,newData)=>{
											rebase.updateDoc('help-task_works/'+id,newData);
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskWorks:newTaskWorks});
										}}
										company={this.state.company}
										removeSubtask={(id)=>{
											rebase.removeDoc('help-task_works/'+id).then(()=>{
												let newTaskWorks=[...this.state.taskWorks];
												newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
												this.setState({taskWorks:newTaskWorks});
											});
											}
										}
										match={this.props.match}
										/>}

								<hr className="m-b-15"/>

								<Nav tabs className="b-0 m-b-22 m-l--10">
										<NavItem>
											<NavLink
												className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
												onClick={() => { this.setState({toggleTab:'1'}); }}
											>
												Komentáre
			            		</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
												onClick={() => { this.setState({toggleTab:'2'}); }}
											>
												Výkaz
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												className={classnames({ active: this.state.toggleTab === '3' }, "clickable", "")}
												onClick={() => { this.setState({toggleTab:'3'}); }}
											>
												Rozpočet
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												className={classnames({ active: this.state.toggleTab === '4' }, "clickable", "")}
												onClick={() => { this.setState({toggleTab:'4'}); }}
											>
												Prílohy
											</NavLink>
										</NavItem>
									</Nav>

									<TabContent activeTab={this.state.toggleTab}>
										<TabPane tabId="1">
											<Comments id={taskID?taskID:null} users={this.state.users} />
										</TabPane>
										<TabPane tabId="2">


											<MaterialsExpenditure
												disabled={this.state.viewOnly}
												materials={taskMaterials}
								        submitMaterial={this.submitMaterial.bind(this)}
												updateMaterial={(id,newData)=>{
													rebase.updateDoc('help-task_materials/'+id,newData);
													let newTaskMaterials=[...this.state.taskMaterials];
													newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
													this.setState({taskMaterials:newTaskMaterials});
												}}
												removeMaterial={(id)=>{
													rebase.removeDoc('help-task_materials/'+id).then(()=>{
														let newTaskMaterials=[...this.state.taskMaterials];
														newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
														this.setState({taskMaterials:newTaskMaterials});
													});
												}}
								        units={this.state.units}
												defaultUnit={this.state.defaultUnit}
												company={this.state.company}
												match={this.props.match}
											/>
										</TabPane>
										<TabPane tabId="3">


											<MaterialsBudget
												disabled={this.state.viewOnly}
												materials={taskMaterials}
								        submitMaterial={this.submitMaterial.bind(this)}
												updateMaterial={(id,newData)=>{
													rebase.updateDoc('help-task_materials/'+id,newData);
													let newTaskMaterials=[...this.state.taskMaterials];
													newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
													this.setState({taskMaterials:newTaskMaterials});
												}}
												removeMaterial={(id)=>{
													rebase.removeDoc('help-task_materials/'+id).then(()=>{
														let newTaskMaterials=[...this.state.taskMaterials];
														newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
														this.setState({taskMaterials:newTaskMaterials});
													});
												}}
								        units={this.state.units}
												defaultUnit={this.state.defaultUnit}
												company={this.state.company}
												match={this.props.match}
											/>
										</TabPane>
										<TabPane tabId="4">
											<Attachments
												disabled={this.state.viewOnly}
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
										</TabPane>
									</TabContent>
								</div>

								<div className="task-edit-right-half pull-right p-t-10">

									<div className="center-hor"><Label className="center-hor">Tagy: </Label></div>
									<div className="f-1 ">
										<Select
											placeholder="Zvoľte tagy"
											value={this.state.tags}
											isMulti
											onChange={(tags)=>this.setState({tags},this.submitTask.bind(this))}
											options={this.state.allTags}
											isDisabled={this.state.defaultFields.tags.fixed||this.state.viewOnly}
											styles={invisibleSelectStyleNoArrow}
											/>
									</div>
								</div>
							</div>
						</div>
			</div>
		);
	}

submitSubtask(body){
	rebase.addToCollection('help-task_subtasks',{task:this.props.match.params.taskID,...body}).then((result)=>{
		this.setState({subtasks:[...this.state.subtasks, {task:this.props.match.params.taskID,...body,id:result.id}]})
	});
}

submitMaterial(body){
	rebase.addToCollection('help-task_materials',{task:this.props.match.params.taskID,...body}).then((result)=>{
		this.setState({taskMaterials:[...this.state.taskMaterials, {task:this.props.match.params.taskID,...body,id:result.id}]})
	});
}

submitService(body){
	rebase.addToCollection('help-task_works',{task:this.props.match.params.taskID,...body}).then((result)=>{
		this.setState({taskWorks:[...this.state.taskWorks, {task:this.props.match.params.taskID,...body,id:result.id}]})
	});
}
}

const mapStateToProps = ({ userReducer, storageCompanies, storageHelpPricelists, storageHelpPrices, storageHelpProjects, storageHelpStatuses, storageHelpTags, storageHelpTaskTypes, storageHelpTasks, storageHelpUnits, storageHelpWorkTypes, storageMetadata, storageUsers, storageHelpMilestones }) => {
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

	return {
		currentUser:userReducer,
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
		milestonesLoaded, milestonesActive, milestones
	 };
};

export default connect(mapStateToProps, { storageCompaniesStart, storageHelpPricelistsStart, storageHelpPricesStart,storageHelpProjectsStart, storageHelpStatusesStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageHelpTasksStart, storageHelpUnitsStart,storageHelpWorkTypesStart, storageMetadataStart, storageUsersStart, storageHelpMilestonesStart })(TaskEditList);
