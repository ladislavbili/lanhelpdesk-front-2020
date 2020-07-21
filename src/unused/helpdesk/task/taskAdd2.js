import React, { Component } from 'react';
import Select from 'react-select';
import CKEditor from 'ckeditor4-react';
import {rebase} from '../../index';
import firebase from 'firebase';
import { Label, TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import Materials from '../components/materials';

import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';
import Attachments from '../components/attachments';
import PraceWorkTrips from '../components/praceWorkTrips';
import classnames from "classnames";
import ck4config from '../../scss/ck4config';
import datePickerConfig from 'configs/components/datepicker';
import {invisibleSelectStyleNoArrow, invisibleSelectStyleNoArrowColored,invisibleSelectStyleNoArrowColoredRequired, invisibleSelectStyleNoArrowRequired} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect';
import { noMilestone } from 'configs/constants/sidebar';
import { noDef } from 'configs/constants/projects';

export default class TaskAdd extends Component{
	constructor(props){
		super(props);
		let requester=this.props.users?this.props.users.find((user)=>user.id===this.props.currentUser.id):null;
		this.state={
			saving:false,
			users:[],
			companies:[],
			statuses:[],
			projects:[],
			taskWorks:[],
			subtasks:[],
			taskMaterials:[],
			workTrips:[],
			milestones:[noMilestone],
			allTags:[],
			taskTypes:[],
			tripTypes:[],
			hidden:true,
			defaults:noDef,

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
			this.setState({defaults:noDef});
			return;
		}
		let project = this.props.projects.find((proj)=>proj.id===projectID);
		let def = project.def;
			if(!def){
				this.setState({defaults:noDef});
				return;
			}

			if (this.props.task && !forced) {
				this.setState({
					defaults: def,
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
				defaults: def
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
				workTrips: this.props.task ? this.props.task.workTrips.map(m => {
						delete m['fake'];
						delete m['task'];
						return {...m, id:this.getNewID()};})
					: [],
				defaults:noDef,

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
			let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100));
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(2);
			finalUnitPrice=finalUnitPrice.toFixed(2);
			return {
				...material,
				unit:this.state.units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice
			}
		});
		return (
			<div className="scrollable row">
			<div className="task-edit-left p-l-20 p-r-20 p-b-15 p-t-15">
				<div className="p-t-0">
					<div className="row m-b-15">
						<h2 className="center-hor text-extra-slim">NEW TASK </h2>
						<span className="center-hor flex m-r-15">
							<input type="text"
								 value={this.state.title}
								 className="task-title-input text-extra-slim hidden-input"
								 onChange={(e)=>this.setState({title:e.target.value})}
								 placeholder="Enter task name" />
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
							onClick={() => this.props.switch()}>
							Switch layout
						</button>
					</div>

					<hr className="m-t-15 m-b-10"/>


				<Label className="m-b-10 col-form-label m-t-10">Popis úlohy</Label>
					{!this.state.descriptionVisible && <span className="task-edit-popis p-20 text-muted" onClick={()=>this.setState({descriptionVisible:true})}>Napíšte krátky popis úlohy</span>}
					{this.state.descriptionVisible && <CKEditor
						data={this.state.description}
						onChange={(e)=>{
							this.setState({description:e.editor.getData()})
						}}
						readOnly={this.state.viewOnly}
						config={{
							...ck4config
						}}
						/>
					}

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

				<div>
						{!this.state.viewOnly && !this.state.hidden && false && <Subtasks
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
						/>}

						{!this.state.viewOnly &&
							<Nav tabs className="b-0 m-t-20 m-l--10">
								<NavItem>
									<NavLink
										className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
										onClick={() => { this.setState({toggleTab:'1'}); }}
									>
										Výkaz |
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
										onClick={() => { this.setState({toggleTab:'2'}); }}
									>
										Rozpočet
									</NavLink>
								</NavItem>
							</Nav>}
							{!this.state.viewOnly &&
								<TabContent activeTab={this.state.toggleTab}>
								<TabPane tabId="1">
									<PraceWorkTrips
										showColumns={[0,1,4,8]}
										showTotals={false}
										disabled={this.state.viewOnly}
										taskAssigned={this.state.assignedTo}
										subtasks={taskWorks}
										defaultType={this.state.type}
										workTypes={this.state.taskTypes}
										company={this.state.company}
										taskID={null}
										submitService={(newService)=>{
											this.setState({taskWorks:[...this.state.taskWorks,{id:this.getNewID(),...newService}]});
										}}
										updateSubtask={(id,newData)=>{
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskWorks:newTaskWorks});
										}}
										removeSubtask={(id)=>{
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
											this.setState({taskWorks:newTaskWorks});
										}}
										workTrips={workTrips}
										tripTypes={this.props.tripTypes}
										submitTrip={(newTrip)=>{
											this.setState({workTrips:[...this.state.workTrips,{id:this.getNewID(),...newTrip}]});
										}}
										updateTrip={(id,newData)=>{
											let newTrips=[...this.state.workTrips];
											newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
											this.setState({workTrips:newTrips});
										}}
										removeTrip={(id)=>{
											let newTrips=[...this.state.workTrips];
											newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
											this.setState({workTrips:newTrips});
										}}
										/>
									<Materials
										showColumns={[0,1,2,3,4,6]}
										showTotals={true}
										disabled={this.state.viewOnly}
										materials={taskMaterials}
										submitMaterial={(newMaterial)=>{
											this.setState({taskMaterials:[...this.state.taskMaterials,{id:this.getNewID(),...newMaterial}]});
										}}
										updateMaterial={(id,newData)=>{
											let newTaskMaterials=[...this.state.taskMaterials];
											newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskMaterials:newTaskMaterials});
										}}
										removeMaterial={(id)=>{
											let newTaskMaterials=[...this.state.taskMaterials];
											newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
											this.setState({taskMaterials:newTaskMaterials});
										}}
										units={this.state.units}
										defaultUnit={this.state.defaultUnit}
										company={this.state.company}
										match={{params:{taskID:null}}}
									/>
								</TabPane>
								<TabPane tabId="2">
									<PraceWorkTrips
										showColumns={[0,1,2,3,4,5,6,7,8]}
										disabled={this.state.viewOnly}
										taskAssigned={this.state.assignedTo}
										subtasks={taskWorks}
										defaultType={this.state.type}
										workTypes={this.state.taskTypes}
										company={this.state.company}
										taskID={null}
										submitService={(newService)=>{
											this.setState({taskWorks:[...this.state.taskWorks,{id:this.getNewID(),...newService}]});
										}}
										updateSubtask={(id,newData)=>{
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskWorks:newTaskWorks});
										}}
										removeSubtask={(id)=>{
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
											this.setState({taskWorks:newTaskWorks});
										}}
										workTrips={workTrips}
										tripTypes={this.props.tripTypes}
										submitTrip={(newTrip)=>{
											this.setState({workTrips:[...this.state.workTrips,{id:this.getNewID(),...newTrip}]});
										}}
										updateTrip={(id,newData)=>{
											let newTrips=[...this.state.workTrips];
											newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
											this.setState({workTrips:newTrips});
										}}
										removeTrip={(id)=>{
											let newTrips=[...this.state.workTrips];
											newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
											this.setState({workTrips:newTrips});
										}}
										/>
									<Materials
										showColumns={[0,1,2,3,4,5,6]}
										disabled={this.state.viewOnly}
										materials={taskMaterials}
										submitMaterial={(newMaterial)=>{
											this.setState({taskMaterials:[...this.state.taskMaterials,{id:this.getNewID(),...newMaterial}]});
										}}
										updateMaterial={(id,newData)=>{
											let newTaskMaterials=[...this.state.taskMaterials];
											newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskMaterials:newTaskMaterials});
										}}
										removeMaterial={(id)=>{
											let newTaskMaterials=[...this.state.taskMaterials];
											newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
											this.setState({taskMaterials:newTaskMaterials});
										}}
										units={this.state.units}
										defaultUnit={this.state.defaultUnit}
										company={this.state.company}
										match={{params:{taskID:null}}}
									/>
								</TabPane>
							</TabContent>}
					</div>
			</div>
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
								this.state.defaults.assignedTo.show &&
								<div className="">
									<Label className="col-form-label-2">Assigned</Label>
									<div className="col-form-value-2">
										<Select
											placeholder="Select required"
											value={this.state.assignedTo}
											isDisabled={this.state.defaults.assignedTo.fixed||this.state.viewOnly}
											isMulti
											onChange={(users)=>this.setState({assignedTo:users})}
											options={this.state.users.filter((user)=>this.state.project && this.state.project.permissions.some((permission)=>permission.user===user.id))}
											styles={invisibleSelectStyleNoArrowRequired}
											/>
										</div>
								</div>}

							{!this.state.viewOnly &&
								this.state.defaults.status.show &&
								<div className="">
								<Label className="col-form-label-2">Status</Label>
								<div className="col-form-value-2">
									<Select
										placeholder="Select required"
										value={this.state.status}
										isDisabled={this.state.defaults.status.fixed||this.state.viewOnly}
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
									this.state.defaults.type.show &&
									<div className="">
									<Label className="col-form-label-2">Typ</Label>
									<div className="col-form-value-2">
										<Select
											placeholder="Select required"
											value={this.state.type}
											isDisabled={this.state.defaults.type.fixed||this.state.viewOnly}
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

								{this.state.defaults.tags.show &&
									<div className=""> {/*Tags*/}
										<Label className="col-form-label-2">Tagy: </Label>
										<div className="col-form-value-2">
											<Select
												value={this.state.tags}
												placeholder="None"
												isDisabled={this.state.defaults.tags.fixed||this.state.viewOnly}
												isMulti
												onChange={(tags)=>this.setState({tags})}
												options={this.state.allTags}
												styles={invisibleSelectStyleNoArrowColored}
												/>
										</div>
									</div>}

								{!this.state.viewOnly &&
									this.state.defaults.requester.show &&
									<div className="">
										<Label className="col-form-label-2">Zadal</Label>
										<div className="col-form-value-2">
											<Select
												value={this.state.requester}
												placeholder="Select required"
												isDisabled={this.state.defaults.requester.fixed||this.state.viewOnly}
												onChange={(requester)=>this.setState({requester})}
												options={this.state.users}
												styles={invisibleSelectStyleNoArrowRequired}
												/>
										</div>
									</div>}

								{!this.state.viewOnly &&
									this.state.defaults.company.show &&
									<div className="">
										<Label className="col-form-label-2">Firma</Label>
										<div className="col-form-value-2">
											<Select
												value={this.state.company}
												placeholder="Select required"
												isDisabled={this.state.defaults.company.fixed||this.state.viewOnly}
												onChange={(company)=>this.setState({company, pausal:parseInt(company.workPausal)>0?booleanSelects[1]:booleanSelects[0]})}
												options={this.state.companies}
												styles={invisibleSelectStyleNoArrowRequired}
												/>
										</div>
									</div>}

								{!this.state.viewOnly &&
									this.state.defaults.pausal.show &&
									<div className="">
										<Label className="col-form-label-2">Paušál</Label>
										<div className="col-form-value-2">
											<Select
												value={this.state.pausal}
												placeholder="Select required"
												isDisabled={this.state.viewOnly||!this.state.company || parseInt(this.state.company.workPausal)===0||this.state.defaults.pausal.fixed}
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
							this.state.defaults.overtime.show &&
							<div className="">
							<Label className="col-form-label-2">Mimo PH</Label>
							<div className="col-form-value-2">
								<Select
									placeholder="Select required"
									value={this.state.overtime}
									isDisabled={this.state.viewOnly||this.state.defaults.overtime.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(overtime)=>this.setState({overtime})}
									options={booleanSelects}
									/>
							</div>
						</div>}

				</div>
			</div>
			);
		}
	}
