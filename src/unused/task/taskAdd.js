import React, { Component } from 'react';
import Select from 'react-select';
import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Materials from '../components/materials';
import Subtasks from '../components/subtasks';
import {selectStyle, invisibleSelectStyle} from 'configs/components/select';
import { noDef } from 'configs/constants/projects';

export default class TaskAdd extends Component{
  constructor(props){
    super(props);
    this.state={
			//vseobecne
      saving:false,
      loading:true,
			openAddTaskModal:false,
			statuses:[],	//Hore status v ramceku
			defaults:noDef,

			//moznosti vo formulari
			allTags:[], //Tagy
      users:[], //Assigned to, Zadal, Sluzby - riesi
			taskTypes:[], //Typ
      companies:[], //Firma
      projects:[], //Projekt

			//sluzby & rozpocet select - Typ
			workTypes:[],

			//vsetky sluzby
			taskWorks:[],

			//vsetky materialy
			taskMaterials:[],


			//task basic info
			id: 0,
      title: "",
			tags:[],
			assignedTo:[],
			type:null,
			project: null,
			requester:null,
      company:null,
			deadline: null,
			description: "",

			status:null,
			statusChange:null,

			//sluzby formular
      workType:null,

      pausal:{value:true,label:'Pausal'},
      overtime:{value:false,label:'Nie'},

			//smth
			workHours:'0',
			hidden:true,

    }
		this.counter = 0;
    this.fetchData(this.props);
  }

	componentWillMount(){
		rebase.listenToCollection('metadata', {
			context: this,
			then(data) {
				this.setState({
					id: parseInt(data[0].taskLastID)+1,
				});
			},
			onFailure(err) {
				//handle error
			}
		});
	}

	componentWillReceiveProps(props){
		if ((this.props.project !== props.project) || (this.props.task !== props.task)){
			this.fetchData(props);
		} else if(this.props.triggerDate!==props.triggerDate){
			this.setDefaults(props.project);
		}
	}

	fetchData(props){
		Promise.all(
			[
				database.collection('help-statuses').get(),
				database.collection('help-projects').get(),
				database.collection('users').get(),
				database.collection('companies').get(),
				database.collection('help-work_types').get(),
				database.collection('help-units').get(),
				database.collection('help-prices').get(),
				database.collection('help-pricelists').get(),
				database.collection('help-tags').get(),
				database.collection('help-task_types').get(),
				rebase.get('metadata/0', {
					context: this,
				})
			]).then(([statuses,projects,users, companies, workTypes,units, prices, pricelists,tags,taskTypes,meta])=>{
				this.setData(
					toSelArr(snapshotToArray(statuses)),
					toSelArr(snapshotToArray(projects)),
					toSelArr(snapshotToArray(users),'email'),
					toSelArr(snapshotToArray(companies)),
					toSelArr(snapshotToArray(workTypes)),
					toSelArr(snapshotToArray(units)),
					snapshotToArray(prices),
					snapshotToArray(pricelists),
					toSelArr(snapshotToArray(tags)),
					toSelArr(snapshotToArray(taskTypes)),
					meta.defaultUnit,
					props,
				);
			});
	}

	setData(statuses, projects,users,companies,workTypes,units, prices, pricelists,tags,taskTypes,defaultUnit, props = null){
		let status = statuses.find((item)=>item.title==='New');
		if(!status){
			status = null;
		}
		let newCompanies=companies.map((company)=>{
			let newCompany = {...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
			return newCompany;
		});
		let newWorkTypes = workTypes.map((workType)=>{
			let newWorkType = {...workType, prices:prices.filter((price)=>price.workType===workType.id)}
			return newWorkType;
		});

		let chosenProject = (props && props.isCopy ? (projects.map(p => {return {label: p.label, value: p.value }}).find(p => p.value === props.project)) : null);

		this.setState({
			//vseobecne
			loading:false,
			statuses,
			defaults:noDef,

			//moznosti vo formulari
			allTags:tags,
			users,
			taskTypes,
			companies: newCompanies,
			projects,

			//sluzby & rozpocet select - Typ
			taskWorks: props && props.isCopy ? props.task.taskWorks : [],
			workTypes: newWorkTypes,

			//Materials
			taskMaterials: props && props.isCopy ? props.task.taskMaterials : [],

			//task basic info
			title: props && props.isCopy ? props.task.title : "",
			tags: props && props.isCopy ? props.task.tags : [],
			assignedTo: props && props.isCopy ? props.task.assignedTo : [],
			type: props && props.isCopy ? props.task.type : [],
			project: chosenProject,
			requester:null,
			company:null,
			description: props && props.isCopy ? props.task.description : "",

			status,
			statusChange:null,

			//sluzby formular
			workHours:0,
			workType:null,

			defaultUnit,
			units,

		},()=>this.setDefaults((props ? props.project : null)));
	}

	getNewID(){
		return this.counter++;
	}



	setDefaults(projectID){
		if(projectID===null){
			this.setState({defaults:noDef});
			return;
		}

		database.collection('help-projects').doc(projectID).get().then((project)=>{
			let def = project.data().def;
			if(!def){
				this.setState({defaults:noDef});
				return;
			}
			let state  = this.state;

			this.setState({
				assignedTo: def.assignedTo && (def.assignedTo.fixed||def.assignedTo.def)
																		 ? state.users.filter((item)=> def.assignedTo.value.includes(item.id))
																		 : [],
				tags: def.tags && (def.tags.fixed||def.tags.def)
																		 ? state.allTags.filter((item)=> def.tags.value.includes(item.id))
																		 : [],
				type: def.type && (def.type.fixed||def.type.def)
																		 ? state.taskTypes.find((item)=> item.id === def.type.value)
																		 : null,
				company: def.company && (def.company.fixed||def.company.def)
																		 ? state.companies.find((item)=> item.id === def.company.value)
																		 : null,
				requester: def.requester && (def.requester.fixed||def.requester.def)
																		 ? state.users.find((item)=> item.id === def.requester.value)
																		 : null,
				status: def.status && (def.status.fixed||def.status.def)
																		 ? state.statuses.find((item) => item.id === def.status.value)
																		 : null,
				project: state.projects.find((item)=>item.id===project.id),
				defaults: def
			});

		});
	}

  submitTask(){
    this.setState({saving:true});
    let body = {
      title: this.state.title,
      company: this.state.company?this.state.company.id:null,
      workHours: this.state.workHours,
      workType: this.state.workType?this.state.workType.id:null,
      requester: this.state.requester?this.state.requester.id:null,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
      description: this.state.description,
      status: this.state.status?this.state.status.id:null,
      deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : (new Date(this.state.deadline).getTime()),
      createdAt:(new Date()).getTime(),
      statusChange:(new Date()).getTime(),
      project: this.state.project?this.state.project.id:null,
      pausal: this.state.pausal.value,
      overtime: this.state.overtime.value,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type?this.state.type.id:null,
    }

			this.state.taskWorks.forEach((item)=>{
				delete item['id'];
					rebase.addToCollection('help-task_works',{task: this.state.id,...item});
			})

			this.state.taskMaterials.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_materials',{task: this.state.id,...item});
			})


			rebase.addToCollection('/help-tasks', body, this.state.id)
			.then(()=>{
				rebase.updateDoc('/metadata/0',{taskLastID: this.state.id});
				this.setState({
					saving:false,
					openAddTaskModal: this.props.isCopy,
					hidden:true,
					title:'',
					company:null,
					workHours:'0',
					workType:null,
					requester:null,
					assignedTo:[],
					tags:[],
					type:null,
					description:'',
					status:null,
					statusChange:null,
					project:null,
					pausal:{value:true,label:'Pausal'},
					overtime:{value:false,label:'Nie'},
					taskWorks:[],
					taskMaterials:[],
				})
				this.fetchData(this.props.project);
				this.props.history.push('/helpdesk/taskList/i/all/' + this.state.id);
			});
  }



  render(){
		let taskWorks = this.state.taskWorks.map((work)=>{
			let finalUnitPrice=parseFloat(work.price);
			if(work.extraWork){
				finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
			}
			let totalPrice=(finalUnitPrice*parseFloat(work.quantity)*(1-parseFloat(work.discount)/100)).toFixed(2);
			finalUnitPrice=finalUnitPrice.toFixed(2);
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
			<div className="display-inline">

				{!this.props.isCopy
					&&
					<Button
						className="btn-link t-a-l sidebar-menu-item"
						onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}
					> <i className="fa fa-plus m-r-5 m-l-5 "/> Add task
					</Button>
				}

				{
					this.props.isCopy
					&&
					<button
						type="button"
						className="btn btn-link waves-effect"
						disabled={this.props.disabled}
						onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}>
						<i
							className="fas fa-copy icon-M"
							/> Copy
					</button>
				}

			<Modal size="lg"  isOpen={this.state.openAddTaskModal} toggle={()=>{this.setState({openAddTaskModal:!this.state.openAddTaskModal})}} >
					<ModalHeader toggle={()=>{this.setState({openAddTaskModal:!this.state.openAddTaskModal})}} >
						{
							this.state.statuses.sort((item1,item2)=>{
								if(item1.order &&item2.order){
									return item1.order > item2.order? 1 :-1;
								}
								return -1;
							}).map((status)=>
							<Button
								className="btn-link"
								disabled={this.state.defaults.status.fixed}
								onClick={()=>{this.setState({status})}}
								> <i className={(status.icon?status.icon:"")+" commandbar-command-icon icon-M"}/>{" "+status.title}
							</Button>
							)
						}

					</ModalHeader>
					<ModalBody>
					<div className="scrollable">
						<div className="p-t-0">
								<div className="row">
									<h1 className="center-hor"># {this.props.isCopy ? this.state.id : "NEW"}</h1>

									<span className="center-hor">
										<input type="text" value={this.state.title} className="task-title-input hidden-input" onChange={(e)=>this.setState({title:e.target.value})} placeholder="Enter task name" />
									</span>
									<div className="ml-auto center-hor">
										<span className="label label-info" style={{backgroundColor:this.state.status && this.state.status.color?this.state.status.color:'white'}}>{this.state.status?this.state.status.title:'Neznámy status'}</span>
									</div>

								</div>
							<div className="row">
								<div className="col-lg-12 row">
									<strong className="center-hor">Tagy: </strong>
									<div className="f-1">
										<Select
											value={this.state.tags}
											isDisabled={this.state.defaults.tags.fixed}
											isMulti
											onChange={(tags)=>this.setState({tags})}
											options={this.state.allTags}
											styles={invisibleSelectStyle}
											/>
									</div>
								</div>
								<div className="col-lg-12 row">
									<strong className="center-hor">Assigned to: </strong>
									<div className="f-1">
										<Select
											value={this.state.assignedTo}
											isDisabled={this.state.defaults.assignedTo.fixed}
											isMulti
											onChange={(users)=>this.setState({assignedTo:users})}
											options={this.state.users}
											styles={invisibleSelectStyle}
											/>
									</div>
								</div>

								<div className="col-lg-12 p-0">
									<div className="col-lg-6">
										<div className="p-r-20">
											<div className="row">
												<label className="col-5 col-form-label">Typ</label>
												<div className="col-7">
													<Select
														value={this.state.type}
														isDisabled={this.state.defaults.type.fixed}
														styles={selectStyle}
														onChange={(type)=>this.setState({type})}
														options={this.state.taskTypes}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label">Projekt</label>
												<div className="col-7">
													<Select
														value={this.state.project}
														onChange={(project)=>this.setState({project},()=>this.setDefaults(project.id))}
														options={this.state.projects}
														styles={selectStyle}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label">Zadal</label>
												<div className="col-7">
													<Select
														value={this.state.requester}
														isDisabled={this.state.defaults.requester.fixed}
														onChange={(requester)=>this.setState({requester})}
														options={this.state.users}
														styles={selectStyle}
														/>
												</div>
											</div>
										</div>
									</div>
									<div className="col-lg-6">
										<div>
											<div className="row">
												<label className="col-5 col-form-label">Firma</label>
												<div className="col-7">
													<Select
														value={this.state.company}
														isDisabled={this.state.defaults.company.fixed}
														onChange={(company)=>this.setState({company})}
														options={this.state.companies}
														styles={selectStyle}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label">Deadline</label>
												<div className="col-7">
													<input
														className='form-control'
														placeholder="Status change date"
														type="datetime-local"
														value={this.state.deadline}
														onChange={(e)=>{
															this.setState({deadline:e.target.value})}
														}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label">Opakovanie</label>
												<div className="col-7">
													<Select options={[]} styles={selectStyle} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<label className="m-t-5">Popis</label>
							<textarea className="form-control b-r-0" placeholder="Enter task description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />

						{!this.state.hidden && <Subtasks
							taskAssigned={this.state.assignedTo}
							submitService={(newService)=>{
								this.setState({taskWorks:[...this.state.taskWorks,{id:this.getNewID(),...newService}]});
							}}
							updatePrices={(ids)=>{
								let newTaskWorks=[...this.state.taskWorks];
								taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
									let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
									if(price === undefined){
										price = 0;
									}else{
										price = price.price;
									}
									newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
									return null;
								})
								this.setState({taskWorks:newTaskWorks});
							}}
							subtasks={taskWorks}
							workTypes={this.state.workTypes}
							updateSubtask={(id,newData)=>{
								let newTaskWorks=[...this.state.taskWorks];
								newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
								this.setState({taskWorks:newTaskWorks});
							}}
							company={this.state.company}
							removeSubtask={(id)=>{
								let newTaskWorks=[...this.state.taskWorks];
								newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
								this.setState({taskWorks:newTaskWorks});
							}}
							match={{params:{taskID:null}}}
							/>}

						{!this.state.hidden && <Materials
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
							/>}
					</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button
						className="btn m-r-10"
						disabled={this.state.title==="" || this.state.status===null || this.state.project === null|| this.state.company === null||this.state.saving}
						onClick={this.submitTask.bind(this)}
					> Add
					</button>
				</ModalFooter>
			</Modal>
		</div>
    );
  }
}
