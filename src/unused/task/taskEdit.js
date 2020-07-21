import React, { Component } from 'react';
import Select from 'react-select';
import {Button} from 'reactstrap';
import Comments from '../components/comments.js';
import Materials from '../components/materials';
import Subtasks from '../components/subtasks';

import TaskAdd from './taskAddContainer';

import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray, timestampToString} from '../../helperFunctions';
import {selectStyle, invisibleSelectStyleNoArrow} from 'configs/components/select';
import { noDef } from 'configs/constants/projects';

export default class TasksTwoEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saving:false,
			loading:true,
			addItemModal:false,
			users:[],
			companies:[],
			workTypes:[],
			statuses:[],
			projects:[],
			taskMaterials:[],
			taskWorks:[],
			units:[],
			allTags:[],
			taskTypes:[],
			defaultUnit:null,
			task:null,
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
			createdAt:null,
			deadline:null,
			reminder:null,
			project:null,
			tags:[],
			pausal:{value:true,label:'Pausal'},
			overtime:{value:true,label:'Áno'},
			type:null,

			/////
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			openCopyModal: false,
		};
    this.submitTask.bind(this);
    this.submitMaterial.bind(this);
    this.submitService.bind(this);
    this.saveService.bind(this);
    this.saveMaterial.bind(this);
		this.canSave.bind(this);
		this.deleteTask.bind(this);
    this.fetchData(this.props.match.params.taskID);
	}

	canSave(){
		return this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving;
	}

	deleteTask(){
		if(window.confirm("Are you sure?")){
			rebase.removeDoc('/help-tasks/'+this.state.task.id);
			this.state.taskMaterials.forEach((material)=>rebase.removeDoc('/help-task_materials/'+material.id))
			this.state.taskWorks.forEach((work)=>rebase.removeDoc('/help-task_works/'+work.id))
			database.collection('help-comments').where("task", "==", this.state.task.id).get()
			.then((data)=>{
				snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-comments/'+item.id));
			});
		}
	}

	copyTask(){
		if(window.confirm("Do you really want to copy this task?")){
		/*	let body = {
				title: this.state.title,
				company: this.state.company?this.state.company.id:null,
				workHours: this.state.workHours,
				requester: this.state.requester?this.state.requester.id:null,
				assignedTo: this.state.assignedTo.map((item)=>item.id),
				description: this.state.description,
				status: this.state.status?this.state.status.id:null,
				deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : (new Date(this.state.deadline).getTime()),
				reminder: isNaN(new Date(this.state.reminder).getTime()) ? null : (new Date(this.state.reminder).getTime()),
				createdAt:(new Date()).getTime(),
				statusChange:(new Date()).getTime(),
				project: this.state.project?this.state.project.id:null,
				pausal: this.state.pausal.value,
				overtime: this.state.overtime.value,
				tags: this.state.tags.map((item)=>item.id),
				type: this.state.type?this.state.type.id:null,
			};*/

	/*		database.collection('metadata').doc('0').get().then((taskMeta)=>{
				let newID = (parseInt(taskMeta.data().taskLastID)+1)+"";
				this.state.taskWorks.forEach((item)=>{
					delete item['id'];
						rebase.addToCollection('help-task_works',{...item,task:newID});
				})

				this.state.taskMaterials.forEach((item)=>{
					delete item['id'];
					rebase.addToCollection('help-task_materials',{...item, task:newID});
				})


				rebase.addToCollection('/help-tasks', body,newID)
				.then(()=>{
					rebase.updateDoc('/metadata/0',{taskLastID:newID});
					this.props.history.push('/helpdesk/taskList/i/'+this.props.match.params.listID+'/'+newID);
				});
			})*/
		}
	}

	submitTask(){
		if(this.canSave()){
			return;
		}
    this.setState({saving:true});
    let body = {
      title: this.state.title,
      company: this.state.company?this.state.company.id:null,
      workHours: this.state.workHours,
      requester: this.state.requester?this.state.requester.id:null,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
      description: this.state.description,
      status: this.state.status?this.state.status.id:null,
			deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : (new Date(this.state.deadline).getTime()),
			reminder: isNaN(new Date(this.state.reminder).getTime()) ? null : (new Date(this.state.reminder).getTime()),
      statusChange: this.state.statusChange,
      project: this.state.project?this.state.project.id:null,
      pausal: this.state.pausal.value,
      overtime: this.state.overtime.value,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type?this.state.type.id:null,
    }

    rebase.updateDoc('/help-tasks/'+this.state.task.id, body)
    .then(()=>{
      this.setState({saving:false});
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

  saveService(body,id){
    rebase.updateDoc('/help-task_works/'+id,body).then((result)=>{
      let newTaskWorks=[...this.state.taskWorks];
      newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...body};
      this.setState({taskWorks:newTaskWorks,openService:null});
    });
  }

  saveMaterial(body,id){
    rebase.updateDoc('/help-task_materials/'+id,body).then((result)=>{
      let newTaskMaterials=[...this.state.taskMaterials];
      newTaskMaterials[newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id)]={...newTaskMaterials.find((taskMaterial)=>taskMaterial.id===id),...body};
      this.setState({taskMaterials:newTaskMaterials,openMaterial:null});
    });
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.taskID!==props.match.params.taskID){
      this.setState({loading:true})
      this.fetchData(props.match.params.taskID);
    }
  }

  fetchData(taskID){
    Promise.all(
      [
        database.collection('help-tasks').doc(taskID).get(),
        database.collection('help-statuses').get(),
        database.collection('help-projects').get(),
        database.collection('companies').get(),
        database.collection('help-work_types').get(),
        database.collection('help-units').get(),
        database.collection('help-prices').get(),
        database.collection('help-pricelists').get(),
        database.collection('users').get(),
				database.collection('help-tags').get(),
				database.collection('help-task_types').get(),
        database.collection('help-task_materials').where("task", "==", taskID).get(),
        database.collection('help-task_works').where("task", "==", taskID).get(),
				rebase.get('metadata/0', {
					context: this,
				})
    ]).then(([task,statuses,projects, companies, workTypes, units, prices, pricelists, users, tags,taskTypes, taskMaterials, taskWorks,meta])=>{
      this.setData(
				{id:task.id,...task.data()},
				toSelArr(snapshotToArray(statuses)),
				toSelArr(snapshotToArray(projects)),
				toSelArr(snapshotToArray(users),'email'),
				toSelArr(snapshotToArray(tags)),
      	toSelArr(snapshotToArray(companies)),
				toSelArr(snapshotToArray(workTypes)),
      	toSelArr(snapshotToArray(units)),
				toSelArr(snapshotToArray(taskTypes)),
				snapshotToArray(prices),
				snapshotToArray(taskMaterials),
				snapshotToArray(taskWorks),
				snapshotToArray(pricelists),
				meta.defaultUnit);
    });
  }

	setDefaults(projectID){
		if(projectID===null){
			this.setState({defaultFields:noDef});
			return;
		}

		database.collection('help-projects').doc(projectID).get().then((project)=>{
			let def = project.data().def;
			if(!def){
				this.setState({defaultFields:noDef});
				return;
			}
			this.setState({
				defaultFields:def
			});
		});
	}

  setData(task, statuses, projects,users,tags,companies,workTypes,units,taskTypes, prices,taskMaterials,taskWorks,pricelists,defaultUnit){
		this.setDefaults(task.project);
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

    this.setState({
      task,
      statuses,
      projects,
      users,
      companies:newCompanies,
      workTypes:newWorkTypes,
      units,
      taskMaterials,
      taskWorks,
			taskTypes,
			allTags:tags,

			description:task.description,
      title:task.title,
      pausal:task.pausal?{value:true,label:'Pausal'}:{value:false,label:'Project'},
			overtime:task.overtime?{value:true,label:'Áno'}:{value:false,label:'Nie'},
      status:status?status:null,
			statusChange:task.statusChange?task.statusChange:null,
			createdAt:task.createdAt?task.createdAt:null,
			deadline: task.deadline!==null?new Date(task.deadline).toISOString().replace('Z',''):'',
			reminder: task.reminder?new Date(task.reminder).toISOString().replace('Z',''):'',
      project:project?project:null,
      company:company?company:null,
      workHours:isNaN(parseInt(task.workHours))?0:parseInt(task.workHours),
      requester:requester?requester:null,
      assignedTo,
      loading:false,
			defaultUnit,
			tags:taskTags,
			type:type?type:null,

			projectChangeDate:(new Date()).getTime(),
    });
  }

	render() {

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


		return (
			<div className="flex">
				<div className="commandbar p-2">
					<div className="d-flex flex-row align-items-center p-l-18">
						<div className="center-hor">
							{
								this.state.statuses.sort((item1,item2)=>{
					        if(item1.order &&item2.order){
					          return item1.order > item2.order? 1 :-1;
					        }
					        return -1;
					      }).map((status)=>
								<Button
									className="btn-link"
									disabled={this.state.defaultFields.status.fixed}
									onClick={()=>{this.setState({status,statusChange:(new Date().getTime())},this.submitTask.bind(this))}}
									><i className={(status.icon?status.icon:"")+" commandbar-command-icon icon-M"}/>{" "+status.title}
								</Button>
								)
							}
							{!this.props.columns &&
								<button type="button" className="btn btn-link waves-effect" onClick={()=>this.props.history.goBack()}>
									<i
										className="fas fa-arrow-left commandbar-command-icon icon-M"
										/>
								</button>
							}
							{' '}
							<button type="button" disabled={this.canSave()} className="btn btn-link waves-effect" onClick={this.deleteTask.bind(this)}>
								<i
									className="fas fa-trash icon-M"
									/> Delete
							</button>
							{' '}
							{this.state.project
								&&
								<TaskAdd history={this.props.history} isCopy={true} project={this.state.project.id} triggerDate={this.state.projectChangeDate} task={this.state} disabled={this.canSave()}/>
							}

						{/*	<button type="button" disabled={this.canSave()} className="btn btn-link waves-effect" onClick={this.copyTask.bind(this)}>
								<i
									className="fas fa-copy icon-M"
									/> Copy
							</button>*/}
							{' '}
							<button type="button" disabled={this.canSave()} className="btn btn-link waves-effect" onClick={this.submitTask.bind(this)}>
								<i
									className="fas fa-save icon-M mr-3"
									/>
								{this.state.saving?'Saving... ':''}
							</button>
						</div>
					</div>
				</div>

						<div className={"card-box scrollable fit-with-header-and-commandbar " + (!this.props.columns ? " center-ver w-50" : "")}>
							<div className="d-flex p-2">
								<div className="row flex">
									<h1 className="center-hor text-extra-slim"># {this.props.match.params.taskID}</h1>
									<span className="center-hor">
							    	<input type="text" value={this.state.title} className="task-title-input text-extra-slim hidden-input" onChange={(e)=>this.setState({title:e.target.value},this.submitTask.bind(this))} placeholder="Enter task name" />
									</span>
									<div className="ml-auto center-hor">
									<span className="label label-info" style={{backgroundColor:this.state.status && this.state.status.color?this.state.status.color:'white'}}>{this.state.status?this.state.status.title:'Neznámy status'}</span>
									</div>
								</div>
							</div>

							<hr/>

							<div className="row">
								<div className="col-lg-12 d-flex">
									<p className="text-muted">Created by Branislav Šusta at {this.state.createdAt?(timestampToString(this.state.createdAt)):''}</p>
									<p className="text-muted ml-auto">{this.state.statusChange?('Status changed at ' + timestampToString(this.state.statusChange)):''}</p>
								</div>

							</div>
							<div className="row">
								<div className="col-lg-12 row">
									<div className="center-hor text-slim">Tagy: </div>
									<div className="f-1">
										<Select
											value={this.state.tags}
											isMulti
											onChange={(tags)=>this.setState({tags},this.submitTask.bind(this))}
											options={this.state.allTags}
											isDisabled={this.state.defaultFields.tags.fixed}
											styles={invisibleSelectStyleNoArrow}
											/>
									</div>
								</div>
								<div className="col-lg-12 row">
									<div className="center-hor text-slim">Assigned to: </div>
									<div className="f-1">
										<Select
											value={this.state.assignedTo}
											isMulti
											isDisabled={this.state.defaultFields.assignedTo.fixed}
											onChange={(users)=>this.setState({assignedTo:users},this.submitTask.bind(this))}
											options={this.state.users}
											styles={invisibleSelectStyleNoArrow}
											/>
									</div>
								</div>
								<div className="col-lg-12">
									<div className="col-lg-6">
										<div className="p-r-20">
											<div className="row">
												<label className="col-5 col-form-label text-slim">Typ</label>
												<div className="col-7">
													<Select
					                  value={this.state.type}
														isDisabled={this.state.defaultFields.type.fixed}
														styles={selectStyle}
					                  onChange={(type)=>this.setState({type},this.submitTask.bind(this))}
					                  options={this.state.taskTypes}
					                  />
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label text-slim">Projekt</label>
												<div className="col-7">
													<Select
														value={this.state.project}
														onChange={(project)=>this.setState({project, projectChangeDate:(new Date()).getTime()},()=>{this.submitTask();this.setDefaults(project.id)})}
														options={this.state.projects}
														styles={selectStyle}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label text-slim">Zadal</label>
												<div className="col-7">
													<Select
														value={this.state.requester}
														isDisabled={this.state.defaultFields.requester.fixed}
														onChange={(requester)=>this.setState({requester},this.submitTask.bind(this))}
														options={this.state.users}
														styles={selectStyle}
														/>
												</div>
											</div>
										</div>
									</div>

									<div className="col-lg-6">
										<div className="">
											<div className="row">
												<label className="col-5 col-form-label text-slim">Firma</label>
												<div className="col-7">
													<Select
														value={this.state.company}
														isDisabled={this.state.defaultFields.company.fixed}
														onChange={(company)=>this.setState({company},this.submitTask.bind(this))}
														options={this.state.companies}
														styles={selectStyle}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label text-slim">Deadline</label>
												<div className="col-7">
													{/*className='form-control hidden-input'*/}
													<input
														className='form-control'
														placeholder="Status change date"
														type="datetime-local"
														value={this.state.deadline}
														onChange={(e)=>{
															this.setState({deadline:e.target.value},this.submitTask.bind(this))}
														}
														/>
												</div>
											</div>

											<div className="row">
												<label className="col-5 col-form-label text-slim">Opakovanie</label>
												<div className="col-7">
													<Select options={[]} styles={selectStyle} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{false && <div className="form-group m-b-0 row">
								<label className="col-5 col-form-label text-slim">Mimo pracovných hodín</label>
								<div className="col-7">
									<Select
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


							<label className="m-t-5  text-slim">Popis</label>
							<textarea className="form-control b-r-0" placeholder="Enter task description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value},this.submitTask.bind(this))} />

							<Subtasks
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
								/>

							<Materials
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

							<Comments id={this.state.task?this.state.task.id:null} users={this.state.users} />
						</div>
			</div>
		);
	}
}
