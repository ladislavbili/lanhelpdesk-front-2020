import React, { Component } from 'react';
import Select from 'react-select';
import {rebase} from '../../index';
import firebase from 'firebase';
import { Label, Button } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';
import Attachments from '../components/attachments';

import VykazyTable from '../components/vykazyTable';

import classnames from "classnames";


import CKEditor5 from '@ckeditor/ckeditor5-react';
import ck5config from 'configs/components/ck5config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import datePickerConfig from 'configs/components/datepicker';
import {invisibleSelectStyleNoArrow, invisibleSelectStyleNoArrowColored,invisibleSelectStyleNoArrowColoredRequired, invisibleSelectStyleNoArrowRequired} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect'
import { noMilestone } from 'configs/constants/sidebar';
import { noDef } from 'configs/constants/projects';

export default class TaskAdd extends Component{
	constructor(props){
		super(props);
		let requester=this.props.users?this.props.users.find((user)=>user.id===this.props.currentUser.id):null;
		this.state={
			layout: "1",

			saving:false,
			users:[],
			companies:[],
			statuses:[],
			projects:[],
			taskWorks:[],
			subtasks:[],
			taskMaterials:[],
			customItems:[],
			workTrips:[],
			milestones:[noMilestone],
			allTags:[],
			taskTypes:[],
			tripTypes:[],
			hidden:true,
			defaultFields:noDef,

			title:'',
			company:this.props.companies && requester ? this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company) : null,
			workHours:'0',
			requester,
			assignedTo:[],
			description:'',
			status:this.props.statuses?this.props.statuses:null,
			statusChange:null,
			deadline:null,
			closeDate:null,
			pendingDate:null,
			reminder:null,
			project:null,
			milestone:noMilestone,
			tags:[],
			pausal:booleanSelects[0],
			overtime:booleanSelects[0],
			type:null,
			repeat:null,
			toggleTab: "1",
			viewOnly:true,
			descriptionVisible:true,
			attachments:[],
			pendingChangable:false,
		}
		this.counter = 0;

		this.renderTitle.bind(this);
		this.renderSelectsLayout1.bind(this);
		this.renderSelectsLayout2.bind(this);
		this.renderTags.bind(this);
		this.renderPopis.bind(this);
		this.renderAttachments.bind(this);
		this.renderSubtasks.bind(this);
		this.renderVykazyTable.bind(this);
		this.renderButtons.bind(this);
	}

	getNewID(){
		return this.counter++;
	}

	componentWillMount(){
		this.setData();
	}

	componentWillReceiveProps(props){
		if (this.props.project !== props.project || this.props.triggerDate!==props.triggerDate){
			this.setDefaults(props.project, false);
		}
	}

	submitTask(){
		this.setState({saving:true});
		let statusAction = this.state.status.action;
		let newID = (parseInt(this.props.newID)+1)+"";
		let body = {
			title: this.state.title,
			company: this.state.company?this.state.company.id:null,
			workHours: this.state.workHours,
			requester: this.state.requester?this.state.requester.id:this.props.currentUser.id,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
			description: this.state.description,
			status: this.state.status?this.state.status.id:null,

			deadline: this.state.deadline!==null?this.state.deadline.unix()*1000:null,
			closeDate: (this.state.closeDate!==null && (statusAction==='close'||statusAction==='invoiced'||statusAction==='invalid'))?this.state.closeDate.unix()*1000:null,
			pendingDate: (this.state.pendingDate!==null && statusAction==='pending')?this.state.pendingDate.unix()*1000:null,

			createdAt:moment().unix()*1000,
			createdBy:this.props.currentUser.id,
			statusChange:moment().unix()*1000,
			project: this.state.project?this.state.project.id:null,
			pausal: this.state.pausal.value,
			overtime: this.state.overtime.value,
			milestone: this.state.milestone.value,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type?this.state.type.id:null,
			repeat: this.state.repeat!==null?newID:null,
			pendingChangable: this.state.pendingChangable,
		}

			this.state.taskWorks.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_works',{task:newID,...item});
			})

			this.state.taskMaterials.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_materials',{task:newID,...item});
			})

			this.state.customItems.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_custom_items',{task:newID,...item});
			})

			this.state.workTrips.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_work_trips',{task:newID,...item});
			})
			/*
			this.state.subtasks.forEach((item)=>{
			delete item['id'];
			rebase.addToCollection('help-task_subtasks',{task:newID,...item});
			})
			*/


			let storageRef = firebase.storage().ref();
			Promise.all([
				...this.state.attachments.map((attachment)=>{
					return storageRef.child(`help-tasks/${newID}/${attachment.time}-${attachment.size}-${attachment.name}`).put(attachment.data)
				})
			])
			.then((resp)=>{
				Promise.all([
					...this.state.attachments.map((attachment)=>{
						return storageRef.child(`help-tasks/${newID}/${attachment.time}-${attachment.size}-${attachment.name}`).getDownloadURL()
					})
				]).then((urls)=>{
						body.attachments=this.state.attachments.map((attachment,index)=>{
							return {
								title:attachment.title,
								size:attachment.size,
								path:`help-tasks/${newID}/${attachment.time}-${attachment.size}-${attachment.name}`,
								url:urls[index]
							}
						});
						if(this.state.repeat !==null){
							rebase.addToCollection('/help-repeats', {
								...this.state.repeat,
								task:newID,
								startAt:(new Date(this.state.repeat.startAt).getTime()),
							},newID);
						}

						rebase.addToCollection('/help-tasks', body,newID)
						.then(()=>{
							rebase.updateDoc('/metadata/0',{taskLastID:newID});
							let requester = this.props.users.find((user)=>user.id===this.props.currentUser.id);
							this.setState({
								saving:false,
								hidden:true,
								title:'',
								company:this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company),
								workHours:'0',
								requester,
								assignedTo:[],
								tags:[],
								type:null,
								description:'',
								status:this.props.statuses[0],
								statusChange:null,
								deadline:null,
								closeDate:null,
								pendingDate:null,
								project:null,
								viewOnly:true,
								milestone:noMilestone,
								pausal:booleanSelects[0],
								overtime:booleanSelects[0],
								taskWorks:[],
								taskMaterials:[],
								customItems:[],
								workTrips:[],
								subtasks:[],
								repeat:null,
								pendingChangable:false,
							})
							this.props.closeModal();
							this.props.history.push('/helpdesk/taskList/i/all/'+newID);
						});

					})
			});
	}

	setDefaults(projectID, forced){
		if(projectID===null){
			this.setState({defaultFields:noDef});
			return;
		}
		let project = this.props.projects.find((proj)=>proj.id===projectID);
		let def = project.def;
			if(!def){
				this.setState({defaultFields:noDef});
				return;
			}

			if (this.props.task && !forced) {
				this.setState({
					defaultFields: def,
				});
				return;
			}

			let state  = this.state;
			let permission = project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
			let requester=this.props.users?this.props.users.find((user)=>user.id===this.props.currentUser.id):null;

			let permissionIDs = state.project?state.project.permissions.map((permission) => permission.user):[];
			let assignedTo= state.assignedTo.filter((user)=>permissionIDs.includes(user.id));

			this.setState({
				assignedTo: def.assignedTo&& (def.assignedTo.fixed||def.assignedTo.def)? state.users.filter((item)=> def.assignedTo.value.includes(item.id)):assignedTo,
				company: def.company && (def.company.fixed||def.company.def)?state.companies.find((item)=> item.id===def.company.value):(this.props.companies && requester ? this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company) : null),
				requester: def.requester&& (def.requester.fixed||def.requester.def)?state.users.find((item)=> item.id===def.requester.value):requester,
				status: def.status&& (def.status.fixed||def.status.def)?state.statuses.find((item)=> item.id===def.status.value):state.statuses[0],
				tags: def.tags&& (def.tags.fixed||def.tags.def)? state.allTags.filter((item)=> def.tags.value.includes(item.id)):this.state.tags,
				type: def.type && (def.type.fixed||def.type.def)?state.taskTypes.find((item)=> item.id===def.type.value):this.state.type,
				overtime: def.overtime&& (def.overtime.fixed||def.overtime.def)? booleanSelects.find((item)=> def.overtime.value === item.value):this.state.overtime,
				pausal: def.pausal&& (def.pausal.fixed||def.pausal.def)? booleanSelects.find((item)=> def.pausal.value === item.value):this.state.pausal,
				project,
				viewOnly: this.props.currentUser.userData.role.value===0 && !permission.write,
				defaultFields: def
			});
	}

	setData(){
			let status = this.props.statuses.find((item)=>item.title==='New');
			if(!status){
				status=this.props.statuses[0];
			}

			let permission = null;
			if(this.props.task){
				if(this.props.task.project){
					permission = this.props.task.project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
				}
			}

			let requester = this.props.task ? this.props.task.requester : this.props.users.find((user)=>user.id===this.props.currentUser.id);
			this.setState({
				statuses: this.props.statuses,
				projects: this.props.projects,
				users: this.props.users,
				companies: this.props.companies,
				taskTypes: this.props.taskTypes,
				tripTypes: this.props.tripTypes,
				milestones:this.props.milestones,
				allTags: this.props.allTags,
				units: this.props.units,
				defaultUnit: this.props.defaultUnit,

				status: this.props.task ? this.props.task.status : status,

				title: this.props.task ? this.props.task.title : '',
				description: this.props.task ? this.props.task.description : '',
				deadline: this.props.task ? this.props.task.deadline : null,
				pendingDate: this.props.task ? this.props.task.pendingDate : null,
				closeDate: this.props.task ? this.props.task.closeDate : null,
				milestone: this.props.task? this.props.task.milestone : noMilestone,
				pendingChangable: this.props.task ? this.props.task.pendingChangable : false,
				pausal: this.props.task ? this.props.task.pausal : booleanSelects[0],
				overtime: this.props.task ? this.props.task.overtime : booleanSelects[0],
				statusChange: this.props.task ? this.props.task.statusChange : null,
				project: this.props.task ? this.props.task.project : null,
				viewOnly: this.props.currentUser.userData.role.value===0 && (permission===null || !permission.write),
				company: this.props.task ? this.props.task.company : this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company),
				workHours: this.props.task ? this.props.task.workHours : 0,
				requester,
				assignedTo: this.props.task ? this.props.task.assignedTo : [],
				repeat: this.props.task ? this.props.task.repeat : null,
				type: this.props.task ? this.props.task.type : null,
				tags: this.props.task ? this.props.task.tags : [],
				taskWorks: this.props.task ? this.props.task.taskWorks.map(w => {
						delete w['fake'];
						delete w['task'];
						return {...w, id:this.getNewID()};})
					 : [],
				taskMaterials: this.props.task ? this.props.task.taskMaterials.map(m => {
						delete m['fake'];
						delete m['task'];
						return {...m, id:this.getNewID()};})
					: [],
				customItems: this.props.task ? this.props.task.customItems.map(m => {
						delete m['fake'];
						delete m['task'];
						return {...m, id:this.getNewID()};}) :
					 	[],
				workTrips: this.props.task ? this.props.task.workTrips.map(m => {
						delete m['fake'];
						delete m['task'];
						return {...m, id:this.getNewID()};})
					: [],
				defaultFields:noDef,

				hidden: false,
			},() => this.setDefaults(this.props.project, false));
		}

	render(){

		let workTrips= this.state.workTrips.map((trip)=>{
			let assignedTo=trip.assignedTo?this.state.users.find((item)=>item.id===trip.assignedTo):null;
			return {
				...trip,
				type:this.state.tripTypes.find((item)=>item.id===trip.type),
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

		let customItems= this.state.customItems.map((customItem)=>{
			return {
				...customItem,
				unit:this.state.units.find((unit)=>unit.id===customItem.unit)
			}
		});
		return (
			<div className={classnames("scrollable", { "p-20": this.state.layout === '1'}, { "row": this.state.layout === '2'})}>

				<div className={classnames({ "task-edit-left p-l-20 p-r-20 p-b-15 p-t-15": this.state.layout === '2'})}>

					{ this.renderTitle() }

					<hr className="m-t-15 m-b-10"/>

					{ this.state.layout === "1" && this.renderSelectsLayout1() }

					{ this.renderPopis() }

					{ this.state.layout === "1" && this.state.defaultFields.tags.show && this.renderTags() }

					{ this.renderAttachments() }

					{ !this.state.viewOnly && !this.state.hidden && false && this.renderSubtasks() }

					{ !this.state.viewOnly && this.renderVykazyTable(taskWorks, workTrips, taskMaterials, customItems) }

					{ this.renderButtons() }

				</div>

				{ this.state.layout === "2" && this.renderSelectsLayout2() }

				</div>
			);
		}



		renderTitle(){
			return (
				<div className="row m-b-15">
					<span className="center-hor flex m-r-15">
						<input type="text"
							 value={this.state.title}
							 className="task-title-input text-extra-slim hidden-input"
							 onChange={(e)=>this.setState({title:e.target.value})}
							 placeholder="ENTER NEW TASK NAME" />
					</span>
					{ this.state.status && (['close','pending','invalid']).includes(this.state.status.action) && <div className="ml-auto center-hor">
						<span>
							{ (this.state.status.action==='close' || this.state.status.action==='invalid') &&
								<span className="text-muted">
									Close date:
									<DatePicker
										className="form-control hidden-input"
										selected={this.state.closeDate}
										disabled={this.state.viewOnly}
										onChange={date => {
											this.setState({ closeDate: date });
										}}
										placeholderText="No close date"
										{...datePickerConfig}
										/>
								</span>
							}
							{ this.state.status.action==='pending' &&
								<span className="text-muted">
									Pending date:
									<DatePicker
										className="form-control hidden-input"
										selected={this.state.pendingDate}
										disabled={this.state.viewOnly}
										onChange={date => {
											this.setState({ pendingDate: date });
										}}
										placeholderText="No pending date"
										{...datePickerConfig}
									/>
								</span>
							}
						</span>
					</div>}
					<button
						type="button"
						className="btn btn-link waves-effect ml-auto asc"
						onClick={() => this.setState({layout: (this.state.layout === "1" ? "2" : "1")})}>
						Switch layout
					</button>
				</div>

			)
		}

		renderSelectsLayout1(){
			const USERS_WITH_PERMISSIONS = this.state.users.filter((user)=>this.state.project && this.state.project.permissions.some((permission)=>permission.user===user.id));
			const REQUESTERS =  (this.state.project && this.state.project.lockedRequester ? USERS_WITH_PERMISSIONS : this.state.users);

			return(
				<div className="row">
						{this.state.viewOnly &&
							<div className="row p-r-10">
							<Label className="col-3 col-form-label">Projekt</Label>
							<div className="col-9">
								<Select
									value={this.state.project}
									placeholder="None"
									onChange={(project)=>{
										let newState={project,
											milestone:noMilestone,
											pausal:booleanSelects[0],
											viewOnly:this.props.currentUser.userData.role.value===0 && !project.permissions.find((permission)=>permission.user===this.props.currentUser.id).write
										}
										if(newState.viewOnly){
											newState={
												...newState,
												repeat:null,
												taskWorks:[],
												subtasks:[],
												taskMaterials:[],
												customItems:[],
												workTrips:[],
												allTags:[],
												deadline:null,
												closeDate:null,
												pendingDate:null,
												reminder:null,
											}
										}
										this.setState(newState,()=>this.setDefaults(project.id, true))
									}}
									options={this.state.projects.filter((project)=>{
										let curr = this.props.currentUser;
										if(curr.userData.role.value===3){
											return true;
										}
										let permission = project.permissions.find((permission)=>permission.user===curr.id);
										return permission && permission.read;
									})}
									styles={invisibleSelectStyleNoArrow}
									/>
							</div>
						</div>
						}

				{!this.state.viewOnly && <div className="col-lg-12">
					<div className="col-lg-12">{/*NUTNE !! INAK AK NIE JE ZOBRAZENY ASSIGNED SELECT TAK SA VZHLAD POSUVA*/}
						<div className="col-lg-4">
							<div className="row p-r-10">
								<Label className="col-3 col-form-label">Projekt</Label>
								<div className="col-9">
									<Select
										placeholder="Select required"
										value={this.state.project}
										onChange={(project)=>{
											let permissionIDs = project.permissions.map((permission) => permission.user);
											let assignedTo=this.state.assignedTo.filter((user)=>permissionIDs.includes(user.id));
											let newState={
												project,
												milestone:noMilestone,
												assignedTo,
												viewOnly:this.props.currentUser.userData.role.value===0 && !project.permissions.find((permission)=>permission.user===this.props.currentUser.id).write
											}
											if(newState.viewOnly){
												newState={
													...newState,
													repeat:null,
													taskWorks:[],
													subtasks:[],
													workTrips:[],
													taskMaterials:[],
													customItems:[],
													allTags:[],
													deadline:null,
													closeDate:null,
													pendingDate:null,
													reminder:null,
												}
											}
											this.setState(newState,()=>this.setDefaults(project.id, true))
										}}
										options={this.state.projects.filter((project)=>{
											let curr = this.props.currentUser;
											if(curr.userData.role.value===3){
												return true;
											}
											let permission = project.permissions.find((permission)=>permission.user===curr.id);
											return permission && permission.read;
										})}
										styles={invisibleSelectStyleNoArrowRequired}
										/>
								</div>
							</div>
						</div>
						{this.state.defaultFields.assignedTo.show && <div className="col-lg-8">
							<div className="row p-r-10">
								<Label className="col-1-5 col-form-label">Assigned</Label>
								<div className="col-10-5">
									<Select
										placeholder="Select required"
										value={this.state.assignedTo}
										isDisabled={this.state.defaultFields.assignedTo.fixed||this.state.viewOnly}
										isMulti
										onChange={(users)=>this.setState({assignedTo:users})}
										options={USERS_WITH_PERMISSIONS}
										styles={invisibleSelectStyleNoArrowRequired}
										/>
									</div>
							</div>
						</div>}
					</div>

					<div className="col-lg-4">
						{this.state.defaultFields.status.show && <div className="row p-r-10">
							<Label className="col-3 col-form-label">Status</Label>
							<div className="col-9">
								<Select
									placeholder="Select required"
									value={this.state.status}
									isDisabled={this.state.defaultFields.status.fixed||this.state.viewOnly}
									styles={invisibleSelectStyleNoArrowColoredRequired}
									onChange={(status)=>{
										if(status.action==='pending'){
											this.setState({
												status,
												pendingDate:  moment().add(1,'d'),
											})
										}else if(status.action==='close'||status.action==='invalid'){
											this.setState({
												status,
												closeDate: moment(),
											})
										}
										else{
											this.setState({status})
										}
									}}
									options={this.state.statuses.filter((status)=>status.action!=='invoiced').sort((item1,item2)=>{
										if(item1.order &&item2.order){
											return item1.order > item2.order? 1 :-1;
										}
										return -1;
									})}
									/>
							</div>
						</div>}
							{this.state.defaultFields.type.show && <div className="row p-r-10">
								<Label className="col-3 col-form-label">Typ</Label>
								<div className="col-9">
									<Select
										placeholder="Select required"
										value={this.state.type}
										isDisabled={this.state.defaultFields.type.fixed||this.state.viewOnly}
										styles={invisibleSelectStyleNoArrowRequired}
										onChange={(type)=>this.setState({type})}
										options={this.state.taskTypes}
										/>
								</div>
							</div>}
							<div className="row p-r-10">
								<Label className="col-3 col-form-label">Milestone</Label>
								<div className="col-9">
									<Select
										isDisabled={this.state.viewOnly}
										placeholder="None"
										value={this.state.milestone}
										onChange={(milestone)=> {
											if(this.state.status.action==='pending'){
												if(milestone.startsAt!==null){
													this.setState({milestone,pendingDate:moment(milestone.startsAt),pendingChangable:false});
												}else{
													this.setState({milestone, pendingChangable:true });
												}
											}else{
												this.setState({milestone});
											}
										}}
										options={this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null && milestone.project===this.state.project.id))}
										styles={invisibleSelectStyleNoArrow}
								/>
								</div>
							</div>
					</div>

					<div className="col-lg-4">
							{this.state.defaultFields.requester.show && <div className="row p-r-10">
								<Label className="col-3 col-form-label">Zadal</Label>
								<div className="col-9">
									<Select
										value={this.state.requester}
										placeholder="Select required"
										isDisabled={this.state.defaultFields.requester.fixed||this.state.viewOnly}
										onChange={(requester)=>this.setState({requester})}
										options={REQUESTERS}
										styles={invisibleSelectStyleNoArrowRequired}
										/>
								</div>
							</div>}
							{this.state.defaultFields.company.show && <div className="row p-r-10">
								<Label className="col-3 col-form-label">Firma</Label>
								<div className="col-9">
									<Select
										value={this.state.company}
										placeholder="Select required"
										isDisabled={this.state.defaultFields.company.fixed||this.state.viewOnly}
										onChange={(company)=>this.setState({company, pausal:parseInt(company.workPausal)>0?booleanSelects[1]:booleanSelects[0]})}
										options={this.state.companies}
										styles={invisibleSelectStyleNoArrowRequired}
										/>
								</div>
							</div>}
							{this.state.defaultFields.pausal.show && <div className="row p-r-10">
									<Label className="col-3 col-form-label">Paušál</Label>
									<div className="col-9">
										<Select
											value={this.state.pausal}
											placeholder="Select required"
											isDisabled={this.state.viewOnly||!this.state.company || parseInt(this.state.company.workPausal)===0||this.state.defaultFields.pausal.fixed}
											styles={invisibleSelectStyleNoArrowRequired}
											onChange={(pausal)=>this.setState({pausal})}
											options={booleanSelects}
											/>
									</div>
								</div>}

							{false && <div className="row p-r-10">
								<Label className="col-3 col-form-label">Pending</Label>
								<div className="col-9">
									{/*className='form-control hidden-input'*/}
									<DatePicker
										className="form-control hidden-input"
										selected={this.state.pendingDate}
										disabled={!this.state.status || this.state.status.action!=='pending'||this.state.viewOnly||!this.state.pendingChangable}
										onChange={date => {
											this.setState({ pendingDate: date });
										}}
										placeholderText="No pending date"
										{...datePickerConfig}
										/>
								</div>
							</div>}
					</div>

					<div className="col-lg-4">
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Deadline</Label>
								<div className="col-9">
									<DatePicker
										className="form-control hidden-input"
										selected={this.state.deadline}
										disabled={this.state.viewOnly}
										onChange={date => {
											this.setState({ deadline: date });
										}}
										placeholderText="No deadline"
										{...datePickerConfig}
										/>
								</div>
						</div>
					<Repeat
							taskID={null}
							repeat={this.state.repeat}
							disabled={this.state.viewOnly}
							submitRepeat={(repeat)=>{
								if(this.state.viewOnly){
									return;
								}
								this.setState({repeat:repeat})
							}}
							deleteRepeat={()=>{
								this.setState({repeat:null})
							}}
							columns={true}
							/>
							{this.state.defaultFields.overtime.show && <div className="row p-r-10">
								<Label className="col-3 col-form-label">Mimo PH</Label>
								<div className="col-9">
									<Select
										placeholder="Select required"
										value={this.state.overtime}
										isDisabled={this.state.viewOnly||this.state.defaultFields.overtime.fixed}
										styles={invisibleSelectStyleNoArrowRequired}
										onChange={(overtime)=>this.setState({overtime})}
										options={booleanSelects}
										/>
								</div>
							</div>}
					</div>
				</div>}
			</div>
		)}

		renderSelectsLayout2(){
			const USERS_WITH_PERMISSIONS = this.state.users.filter((user)=>this.state.project && this.state.project.permissions.some((permission)=>permission.user===user.id));
			const REQUESTERS =  (this.state.project && this.state.project.lockedRequester ? USERS_WITH_PERMISSIONS : this.state.users);

			return(
				<div className="task-edit-right">
						{this.state.viewOnly &&
							<div className="">
								<Label className="col-form-label-2">Projekt</Label>
								<div className="col-form-value-2">
									<Select
										value={this.state.project}
										placeholder="None"
										onChange={(project)=>{
											let newState={project,
												milestone:noMilestone,
												pausal:booleanSelects[0],
												viewOnly:this.props.currentUser.userData.role.value===0 && !project.permissions.find((permission)=>permission.user===this.props.currentUser.id).write
											}
											if(newState.viewOnly){
												newState={
													...newState,
													repeat:null,
													taskWorks:[],
													subtasks:[],
													taskMaterials:[],
													customItems:[],
													workTrips:[],
													allTags:[],
													deadline:null,
													closeDate:null,
													pendingDate:null,
													reminder:null,
												}
											}
											this.setState(newState,()=>this.setDefaults(project.id, true))
										}}
										options={this.state.projects.filter((project)=>{
											let curr = this.props.currentUser;
											if(curr.userData.role.value===3){
												return true;
											}
											let permission = project.permissions.find((permission)=>permission.user===curr.id);
											return permission && permission.read;
										})}
										styles={invisibleSelectStyleNoArrow}
										/>
								</div>
							</div>
						}

						{/*NUTNE !! INAK AK NIE JE ZOBRAZENY ASSIGNED SELECT TAK SA VZHLAD POSUVA*/}
				{!this.state.viewOnly &&
							<div className="">
								<Label className="col-form-label-2">Projekt</Label>
								<div className="col-form-value-2">
									<Select
										placeholder="Select required"
										value={this.state.project}
										onChange={(project)=>{
											let permissionIDs = project.permissions.map((permission) => permission.user);
											let assignedTo=this.state.assignedTo.filter((user)=>permissionIDs.includes(user.id));
											let newState={
												project,
												milestone:noMilestone,
												assignedTo,
												viewOnly:this.props.currentUser.userData.role.value===0 && !project.permissions.find((permission)=>permission.user===this.props.currentUser.id).write
											}
											if(newState.viewOnly){
												newState={
													...newState,
													repeat:null,
													taskWorks:[],
													subtasks:[],
													workTrips:[],
													taskMaterials:[],
													customItems:[],
													allTags:[],
													deadline:null,
													closeDate:null,
													pendingDate:null,
													reminder:null,
												}
											}
											this.setState(newState,()=>this.setDefaults(project.id, true))
										}}
										options={this.state.projects.filter((project)=>{
											let curr = this.props.currentUser;
											if(curr.userData.role.value===3){
												return true;
											}
											let permission = project.permissions.find((permission)=>permission.user===curr.id);
											return permission && permission.read;
										})}
										styles={invisibleSelectStyleNoArrowRequired}
										/>
								</div>
							</div>
						}
						{!this.state.viewOnly &&
							this.state.defaultFields.assignedTo.show &&
							<div className="">
								<Label className="col-form-label-2">Assigned</Label>
								<div className="col-form-value-2">
									<Select
										placeholder="Select required"
										value={this.state.assignedTo}
										isDisabled={this.state.defaultFields.assignedTo.fixed||this.state.viewOnly}
										isMulti
										onChange={(users)=>this.setState({assignedTo:users})}
										options={USERS_WITH_PERMISSIONS}
										styles={invisibleSelectStyleNoArrowRequired}
										/>
									</div>
							</div>}

						{!this.state.viewOnly &&
							this.state.defaultFields.status.show &&
							<div className="">
							<Label className="col-form-label-2">Status</Label>
							<div className="col-form-value-2">
								<Select
									placeholder="Select required"
									value={this.state.status}
									isDisabled={this.state.defaultFields.status.fixed||this.state.viewOnly}
									styles={invisibleSelectStyleNoArrowColoredRequired}
									onChange={(status)=>{
										if(status.action==='pending'){
											this.setState({
												status,
												pendingDate:  moment().add(1,'d'),
											})
										}else if(status.action==='close'||status.action==='invalid'){
											this.setState({
												status,
												closeDate: moment(),
											})
										}
										else{
											this.setState({status})
										}
									}}
									options={this.state.statuses.filter((status)=>status.action!=='invoiced').sort((item1,item2)=>{
										if(item1.order &&item2.order){
											return item1.order > item2.order? 1 :-1;
										}
										return -1;
									})}
									/>
							</div>
						</div>}

							{!this.state.viewOnly &&
								this.state.defaultFields.type.show &&
								<div className="">
								<Label className="col-form-label-2">Typ</Label>
								<div className="col-form-value-2">
									<Select
										placeholder="Select required"
										value={this.state.type}
										isDisabled={this.state.defaultFields.type.fixed||this.state.viewOnly}
										styles={invisibleSelectStyleNoArrowRequired}
										onChange={(type)=>this.setState({type})}
										options={this.state.taskTypes}
										/>
								</div>
							</div>}
						{!this.state.viewOnly &&
							<div className="">
								<Label className="col-form-label-2">Milestone</Label>
								<div className="col-form-value-2">
									<Select
										isDisabled={this.state.viewOnly}
										placeholder="None"
										value={this.state.milestone}
										onChange={(milestone)=> {
											if(this.state.status.action==='pending'){
												if(milestone.startsAt!==null){
													this.setState({milestone,pendingDate:moment(milestone.startsAt),pendingChangable:false});
												}else{
													this.setState({milestone, pendingChangable:true });
												}
											}else{
												this.setState({milestone});
											}
										}}
										options={this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null && milestone.project===this.state.project.id))}
										styles={invisibleSelectStyleNoArrow}
								/>
								</div>
							</div>}

							{this.state.defaultFields.tags.show &&
								<div className=""> {/*Tags*/}
									<Label className="col-form-label-2">Tagy: </Label>
									<div className="col-form-value-2">
										<Select
											value={this.state.tags}
											placeholder="None"
											isDisabled={this.state.defaultFields.tags.fixed||this.state.viewOnly}
											isMulti
											onChange={(tags)=>this.setState({tags})}
											options={this.state.allTags}
											styles={invisibleSelectStyleNoArrowColored}
											/>
									</div>
								</div>}

							{!this.state.viewOnly &&
								this.state.defaultFields.requester.show &&
								<div className="">
									<Label className="col-form-label-2">Zadal</Label>
									<div className="col-form-value-2">
										<Select
											value={this.state.requester}
											placeholder="Select required"
											isDisabled={this.state.defaultFields.requester.fixed||this.state.viewOnly}
											onChange={(requester)=>this.setState({requester})}
											options={REQUESTERS}
											styles={invisibleSelectStyleNoArrowRequired}
											/>
									</div>
								</div>}

							{!this.state.viewOnly &&
								this.state.defaultFields.company.show &&
								<div className="">
									<Label className="col-form-label-2">Firma</Label>
									<div className="col-form-value-2">
										<Select
											value={this.state.company}
											placeholder="Select required"
											isDisabled={this.state.defaultFields.company.fixed||this.state.viewOnly}
											onChange={(company)=>this.setState({company, pausal:parseInt(company.workPausal)>0?booleanSelects[1]:booleanSelects[0]})}
											options={this.state.companies}
											styles={invisibleSelectStyleNoArrowRequired}
											/>
									</div>
								</div>}

							{!this.state.viewOnly &&
								this.state.defaultFields.pausal.show &&
								<div className="">
									<Label className="col-form-label-2">Paušál</Label>
									<div className="col-form-value-2">
										<Select
											value={this.state.pausal}
											placeholder="Select required"
											isDisabled={this.state.viewOnly||!this.state.company || parseInt(this.state.company.workPausal)===0||this.state.defaultFields.pausal.fixed}
											styles={invisibleSelectStyleNoArrowRequired}
											onChange={(pausal)=>this.setState({pausal})}
											options={booleanSelects}
											/>
									</div>
								</div>}

							{false && <div className="">
								<Label className="col-form-label-2">Pending</Label>
								<div className="col-form-value-2">
									{/*className='form-control hidden-input'*/}
									<DatePicker
										className="form-control hidden-input"
										selected={this.state.pendingDate}
										disabled={!this.state.status || this.state.status.action!=='pending'||this.state.viewOnly||!this.state.pendingChangable}
										onChange={date => {
											this.setState({ pendingDate: date });
										}}
										placeholderText="No pending date"
										{...datePickerConfig}
										/>
								</div>
							</div>}

					{!this.state.viewOnly &&
						<div className="">
							<Label className="col-form-label-2">Deadline</Label>
								<div className="col-form-value-2">
									<DatePicker
										className="form-control hidden-input"
										selected={this.state.deadline}
										disabled={this.state.viewOnly}
										onChange={date => {
											this.setState({ deadline: date });
										}}
										placeholderText="No deadline"
										{...datePickerConfig}
										/>
								</div>
						</div>}

				{!this.state.viewOnly &&
					<Repeat
							taskID={null}
							repeat={this.state.repeat}
							disabled={this.state.viewOnly}
							submitRepeat={(repeat)=>{
								if(this.state.viewOnly){
									return;
								}
								this.setState({repeat:repeat})
							}}
							deleteRepeat={()=>{
								this.setState({repeat:null})
							}}
							columns={true}
							vertical={true}
							/>}

					{!this.state.viewOnly &&
						this.state.defaultFields.overtime.show &&
						<div className="">
						<Label className="col-form-label-2">Mimo PH</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Select required"
								value={this.state.overtime}
								isDisabled={this.state.viewOnly||this.state.defaultFields.overtime.fixed}
								styles={invisibleSelectStyleNoArrowRequired}
								onChange={(overtime)=>this.setState({overtime})}
								options={booleanSelects}
								/>
						</div>
					</div>}

			</div>
			)
		}

		renderTags(){
			return (
				<div className="row m-t-10"> {/*Tags*/}
					<div className="center-hor">
						<Label className="center-hor">Tagy: </Label>
					</div>
					<div className="f-1 ">
						<Select
							value={this.state.tags}
							placeholder="None"
							isDisabled={this.state.defaultFields.tags.fixed||this.state.viewOnly}
							isMulti
							onChange={(tags)=>this.setState({tags})}
							options={this.state.allTags}
							styles={invisibleSelectStyleNoArrowColored}
							/>
					</div>
				</div>
			)
		}

		renderPopis(){
			return(
				<div>
					<Label className="m-b-10 col-form-label m-t-10">Popis úlohy</Label>
						{!this.state.descriptionVisible &&
							<span className="task-edit-popis p-20 text-muted" onClick={()=>this.setState({descriptionVisible:true})}>
								Napíšte krátky popis úlohy
							</span>}
						{this.state.descriptionVisible &&
							<CKEditor5
								editor={ ClassicEditor }
								data={this.state.description}
								onInit={(editor)=>{
								}}
								onChange={(e, editor)=>{
										this.setState({description: editor.getData()})
								}}
								readOnly={this.state.viewOnly}
								config={ck5config}
								/>
						}
			</div>
			)
		}

		renderAttachments(){
			return (
				<Attachments
					disabled={this.state.viewOnly}
					taskID={null}
					attachments={this.state.attachments}
					addAttachments={(newAttachments)=>{
						let time = (new Date()).getTime();
						newAttachments=newAttachments.map((attachment)=>{
							return {
								title:attachment.name,
								size:attachment.size,
								time,
								data:attachment
							}
						});
						this.setState({attachments:[...this.state.attachments,...newAttachments]});
					}}
					removeAttachment={(attachment)=>{
						let newAttachments = [...this.state.attachments];
						newAttachments.splice(newAttachments.findIndex((item)=>item.title===attachment.title && item.size===attachment.size && item.time===attachment.time),1);
						this.setState({attachments:newAttachments});
					}}
					/>
				)
		}

		renderSubtasks(){
			return (
				<Subtasks
				disabled={this.state.viewOnly}
				taskAssigned={this.state.assignedTo}
				submitService={(newSubtask)=>{
					this.setState({subtasks:[...this.state.subtasks,{id:this.getNewID(),...newSubtask}]});
				}}
				subtasks={this.state.subtasks.map((subtask)=>{
					let assignedTo=subtask.assignedTo?this.state.users.find((item)=>item.id===subtask.assignedTo):null
					return {
						...subtask,
						assignedTo:assignedTo?assignedTo:null
					}
				})}
				updateSubtask={(id,newData)=>{
					let newSubtasks=[...this.state.subtasks];
					newSubtasks[newSubtasks.findIndex((subtask)=>subtask.id===id)]={...newSubtasks.find((subtask)=>subtask.id===id),...newData};
					this.setState({subtasks:newSubtasks});
				}}
				removeSubtask={(id)=>{
					let newSubtasks=[...this.state.subtasks];
					newSubtasks.splice(newSubtasks.findIndex((subtask)=>subtask.id===id),1);
					this.setState({subtasks:newSubtasks});
				}}
				match={{params:{taskID:null}}}
			/>
			)
		}

		renderVykazyTable(taskWorks, workTrips, taskMaterials, customItems){
			return(
						<VykazyTable
							showColumns={ [0,1,2,3,4,5,6,7,8] }

							showTotals={false}
							disabled={this.state.viewOnly}
							company={this.state.company}
							match={this.props.match}
							taskID={null}
							taskAssigned={this.state.assignedTo}

							showSubtasks={this.state.project ? this.state.project.showSubtasks : false}

							submitService={(newService)=>{
								this.setState({taskWorks:[...this.state.taskWorks,{id:this.getNewID(),...newService}]});
							}}
							subtasks={taskWorks}
							defaultType={this.state.type}
							workTypes={this.state.taskTypes}
							updateSubtask={(id,newData)=>{
								let newTaskWorks=[...this.state.taskWorks];
								newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
								this.setState({taskWorks:newTaskWorks});
							}}
							updateSubtasks={(multipleSubtasks)=>{
								let newTaskWorks=[...this.state.taskWorks];
								multipleSubtasks.forEach(({id, newData})=>{
									newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
								})
								this.setState({taskWorks:newTaskWorks});
							}}
							removeSubtask={(id)=>{
								let newTaskWorks=[...this.state.taskWorks];
								newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
								this.setState({taskWorks:newTaskWorks});
							}}
							workTrips={workTrips}
							tripTypes={this.state.tripTypes}
							submitTrip={(newTrip)=>{
								this.setState({workTrips:[...this.state.workTrips,{id:this.getNewID(),...newTrip}]});
							}}
							updateTrip={(id,newData)=>{
								let newTrips=[...this.state.workTrips];
								newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
								this.setState({workTrips:newTrips});
							}}
							updateTrips={(multipleTrips)=>{
								let newTrips=[...this.state.workTrips];
								multipleTrips.forEach(({id, newData})=>{
									newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
								})
								this.setState({workTrips:newTrips});
							}}
							removeTrip={(id)=>{
								let newTrips=[...this.state.workTrips];
								newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
								this.setState({workTrips:newTrips});
							}}

							materials={taskMaterials}
							submitMaterial={(newMaterial)=>{
								this.setState({taskMaterials:[...this.state.taskMaterials,{id:this.getNewID(),...newMaterial}]});
							}}
							updateMaterial={(id,newData)=>{
								let newTaskMaterials=[...this.state.taskMaterials];
								newTaskMaterials[newTaskMaterials.findIndex((material)=>material.id===id)]={...newTaskMaterials.find((material)=>material.id===id),...newData};
								this.setState({taskMaterials:newTaskMaterials});
							}}
							updateMaterials={(multipleMaterials)=>{
								let newTaskMaterials=[...this.state.taskMaterials];
								multipleMaterials.forEach(({id, newData})=>{
									newTaskMaterials[newTaskMaterials.findIndex((material)=>material.id===id)]={...newTaskMaterials.find((material)=>material.id===id),...newData};
								})
								this.setState({taskMaterials:newTaskMaterials});
							}}
							removeMaterial={(id)=>{
								let newTaskMaterials=[...this.state.taskMaterials];
								newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
								this.setState({taskMaterials:newTaskMaterials});
							}}

							customItems={customItems}
							submitCustomItem={(customItem)=>{
								this.setState({customItems:[...this.state.customItems,{id:this.getNewID(),...customItem}]});
							}}
							updateCustomItem={(id,newData)=>{
								let newCustomItems=[...this.state.customItems];
								newCustomItems[newCustomItems.findIndex((customItem)=>customItem.id===id)]={...newCustomItems.find((customItem)=>customItem.id===id),...newData};
								this.setState({customItems:newCustomItems});
							}}
							updateCustomItems={(multipleCustomItems)=>{
								let newCustomItems=[...this.state.customItems];
								multipleCustomItems.forEach(({id, newData})=>{
									newCustomItems[newCustomItems.findIndex((customItem)=>customItem.id===id)]={...newCustomItems.find((customItem)=>customItem.id===id),...newData};
								})
								this.setState({customItems:newCustomItems});
							}}
							removeCustomItem={(id)=>{
								let newCustomItems=[...this.state.customItems];
								newCustomItems.splice(newCustomItems.findIndex((customItem)=>customItem.id===id),1);
								this.setState({customItems:newCustomItems});
							}}

							units={this.state.units}
							defaultUnit={this.state.defaultUnit}
							/>
			)
		}

		renderButtons(){
			return (
				<div>
					{this.props.closeModal &&
						<Button className="btn-link-remove" onClick={this.props.closeModal}>Cancel</Button>
					}
					<button
						className="btn pull-right"
						disabled={this.state.title==="" || this.state.status===null || this.state.project === null || this.state.company === null || this.state.saving || this.props.loading||this.props.newID===null}
						onClick={this.submitTask.bind(this)}
						> Create task
					</button>
				</div>
			)
		}
	}
