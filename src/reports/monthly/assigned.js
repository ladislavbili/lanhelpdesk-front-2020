import React, { Component } from 'react';
import { connect } from "react-redux";
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Select from 'react-select';
import TaskEdit from '../../helpdesk/task/taskEdit';
import MonthSelector from '../components/monthSelector';

import {selectStyleColored} from 'configs/components/select';
import { timestampToString, sameStringForms, toSelArr } from '../../helperFunctions';
import {storageCompaniesStart, storageHelpTasksStart, storageHelpStatusesStart, storageHelpTaskTypesStart, storageUsersStart,
	storageHelpTaskWorksStart, storageHelpTaskWorkTripsStart, storageHelpTripTypesStart} from '../../redux/actions';


class MothlyReportsAssigned extends Component {
	constructor(props){
		super(props);
		this.state={
			users:[],
			status:[],
			tasks:[],
			showAgent:null,
			taskOpened:null,
		}
		this.filterByAgent.bind(this);
		this.getWorkTypeTotals.bind(this);
	}

	storageLoaded(props){
		return props.companiesLoaded &&
		props.tasksLoaded &&
		props.statusesLoaded &&
		props.taskTypesLoaded &&
		props.usersLoaded &&
		props.taskWorksLoaded &&
		props.tripTypesLoaded &&
		props.workTripsLoaded
	}

	componentWillReceiveProps(props){
		if(
			!sameStringForms(props.companies,this.props.companies)||
			!sameStringForms(props.tasks,this.props.tasks)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.taskTypes,this.props.taskTypes)||
			!sameStringForms(props.users,this.props.users)||
			!sameStringForms(props.taskWorks,this.props.taskWorks)||
			!sameStringForms(props.tripTypes,this.props.tripTypes)||
			!sameStringForms(props.workTrips,this.props.workTrips)||
			(props.year!==null && this.props.year===null)||
			(this.storageLoaded(props) && this.storageLoaded(this.props))
		){
			this.setData(props);
		}
		if(!sameStringForms(props.statuses,this.props.statuses)){
			this.setState({status:toSelArr(props.statuses.filter((status)=>status.action==='invoiced'))})
		}
		if(
			props.from!==this.props.from||
			props.to!==this.props.to
		){
			this.setState({showAgent:null},()=>{this.setData(props)})
		}
	}

	componentWillMount(){
		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}
		if(!this.props.tasksActive){
			this.props.storageHelpTasksStart();
		}
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}

		if(this.props.statusesLoaded){
			this.setState({status:toSelArr(this.props.statuses.filter((status)=>status.action==='invoiced'))});
		}

		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}
		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		if(!this.props.taskWorksActive){
			this.props.storageHelpTaskWorksStart();
		}
		if(!this.props.workTripsActive){
			this.props.storageHelpTaskWorkTripsStart();
		}
		if(!this.props.tripTypesActive){
			this.props.storageHelpTripTypesStart();
		}
		this.setData(this.props);
	}

	setData(props){
		if(!this.storageLoaded(props)){
			return;
		}
		let works = this.processWorks(props);
		let trips = this.processTrips(props);

		let allTasks = this.processAllTasks(props, works, trips).sort((task1,task2)=> task1.closeDate > task2.closeDate ? 1 : -1 );
		let selectedTasks = this.processSelectedTasks(props, works, trips).sort((task1,task2)=> task1.closeDate > task2.closeDate ? 1 : -1 );
		let tasks = this.separateTasks(allTasks, selectedTasks);
		let users = this.processAgents(allTasks,props);
		this.setState({
			users,
			tasks
		});
	}

	processWorks(props){
		return props.taskWorks.map((work,index)=>{
			let type = props.taskTypes.find((item)=>item.id===work.type||item.id===work.workType);
			if(type===undefined){
				type={title:'Unknown',id:Math.random()}
			}

			return {
				finished:work.finished===true,
				id:work.id,
				title:work.title,
				quantity:isNaN(parseInt(work.quantity))? 0 : parseInt(work.quantity),
				assignedTo:work.assignedTo,
				task:work.task,
				type,
				order: !isNaN(parseInt(work.order)) ? parseInt(work.order) : index,
			}
		})
	}

	processTrips(props){
		return props.workTrips.map((trip, index)=>{
			let type = props.tripTypes.find((item)=>item.id===trip.type);
			if(type===undefined){
				type={title:'Unknown',id:Math.random(),prices:[]}
			}

			return {
				finished:trip.finished===true,
				id:trip.id,
				quantity:isNaN(parseInt(trip.quantity))? 0 : parseInt(trip.quantity),
				task:trip.task,
				assignedTo:trip.assignedTo,
				type,
				order: !isNaN(parseInt(trip.order)) ? parseInt(trip.order) : index,
			}
		})
	}

	giveTasksInfo(props, works, trips){
		return props.tasks.map((task)=>{
			let company = task.company === null ? null : props.companies.find((company)=>company.id===task.company);
			if(company === undefined){
				company = null;
			}
			return {
				...task,
				company,
				requester: task.requester===null ? null:props.users.find((user)=>user.id===task.requester),
				assignedTo: task.assignedTo===null ? null:props.users.filter((user)=>task.assignedTo.includes(user.id)),
				status: task.status===null ? null: props.statuses.find((status)=>status.id===task.status),
				works: works.filter((work)=>work.task===task.id).sort((work1,work2) => work1.order - work2.order ),
				trips: trips.filter((trip)=>trip.task===task.id).sort((trip1,trip2) => trip1.order - trip2.order ),
			}
		})
	}

	/*All tasks in selected range*/
	processAllTasks(props, works, trips){
		return this.giveTasksInfo(props, works, trips).filter((task)=>
		(task.works.length > 0 || task.trips.length > 0) &&
		task.status &&
		task.closeDate &&
		task.closeDate >= props.from
		&& task.closeDate <= props.to);
	}

	/*All tasks in selected range ignoring day */
	processSelectedTasks(props, works, trips){
		return this.giveTasksInfo(props, works, trips).filter((task)=>
		(task.works.length > 0 || task.trips.length > 0) &&
		task.status &&
		task.closeDate &&
		(new Date(task.closeDate)).getFullYear() >= (new Date(props.from)).getFullYear()  &&
		(new Date(task.closeDate)).getFullYear() <= (new Date(props.to)).getFullYear()  &&
		((new Date(task.closeDate)).getMonth() >= (new Date(props.from)).getMonth() || (new Date(props.from)).getFullYear() < (new Date(task.closeDate)).getFullYear())  &&
		((new Date(task.closeDate)).getMonth() <= (new Date(props.to)).getMonth() || (new Date(props.to)).getFullYear() > (new Date(task.closeDate)).getFullYear())
		);
	}

	processAgents(tasks,props){
		let agents = [];
		tasks.forEach((task)=>{
			task.trips.forEach((trip)=>{
				let agent = agents.find((agent)=>agent.id===trip.assignedTo);
				let newAgent = props.users.find((user)=>user.id===trip.assignedTo);
				if(agent===undefined && newAgent!==undefined){
						agents.push({...newAgent,works:[],trips:[]});
						agent = agents.find((agent)=>agent.id===trip.assignedTo);
				}
				if(agent!==undefined){
					agent.trips.push({...trip,status:task.status});
				}
			});
			task.works.forEach((work)=>{
				let agent = agents.find((agent)=>agent.id===work.assignedTo);
				let newAgent = props.users.find((user)=>user.id===work.assignedTo);
				if(agent===undefined && newAgent!==undefined){
						agents.push({...newAgent,works:[],trips:[]});
						agent = agents.find((agent)=>agent.id===work.assignedTo);
				}
				if(agent!==undefined){
					agent.works.push({...work,status:task.status});
				}
			});
		});
		return agents;
	}

	filterWorkTask(task,statusIDs){
		return task.works.filter((work)=>this.filterByAgent(work) && statusIDs.includes(task.status.id)).length>0;
	}

	filterTripTask(task,statusIDs){
		return task.trips.filter((trip)=>this.filterByAgent(trip) && statusIDs.includes(task.status.id)).length>0;
	}

	//Filtruje prace a trips podla agenta
	filterByAgent(assignment){
		return assignment.assignedTo===this.state.showAgent.id
	}

	getWorkTypeTotals(statusIDs){
		let workTypes=[];
		this.state.tasks.filter((task)=>this.filterWorkTask(task, statusIDs)).forEach((task)=>{
			task.works.forEach((work)=>{
				let workType=workTypes.find((workType)=>workType.id===work.type.id);
				let newWorkType=this.props.taskTypes.find((taskType)=>taskType.id===work.type.id);
				if(workType===undefined && newWorkType!==undefined){
					workTypes.push({...newWorkType, quantity:0});
					workType=workTypes.find((workType)=>workType.id===work.type.id);
				}
				if(workType!==undefined){
					workType.quantity += isNaN(parseInt(work.quantity)) ? 0 : parseInt(work.quantity);
				}else{
					console.log('Chybny typ prace');
					console.log(work);
				}

			})
		})
		return workTypes;
	}

	getTripTypeTotals(statusIDs){
		let tripTypes=[];
		this.state.tasks.filter((task)=>this.filterTripTask(task, statusIDs)).forEach((task)=>{
			task.trips.forEach((trip)=>{
				let tripType = tripTypes.find((tripType)=>tripType.id===trip.type.id);
				let newTripType = this.props.tripTypes.find((tripType)=>tripType.id===trip.type.id);
				if(tripType===undefined && newTripType!==undefined){
					tripTypes.push({...newTripType, quantity:0});
					tripType=tripTypes.find((tripType)=>tripType.id===trip.type.id);
				}
				if(tripType!==undefined){
					tripType.quantity += isNaN(parseInt(trip.quantity)) ? 0 : parseInt(trip.quantity);
				}else{
					console.log('Chybny typ vyjazdu');
					console.log(trip);
				}

			})
		})
		return tripTypes;
	}

	render() {
		let statusIDs= this.state.status.map((status)=>status.id);
		//pre test so vsetkymi statusmi odkomentujte nizsie
		//statusIDs = this.props.statuses.map((status)=>status.id);
		return (
				<div className="scrollable fit-with-header">
					<h2 className="m-l-20 m-t-20">Agenti</h2>
					<div style={{maxWidth:500}}>
						<MonthSelector />
						<div className="p-20">
							<Select
								value={this.state.status}
								placeholder="Vyberte statusy"
								isMulti
								onChange={(status)=>this.setState({status})}
								options={toSelArr(this.props.statuses)}
								styles={selectStyleColored}
								/>
						</div>
					</div>

					{ this.props.month!==null && this.props.year!==null && <div className="p-20">
						<table className="table m-b-10">
							<thead>
								<tr>
									<th>Assigned to</th>
									<th>Work hours</th>
									<th>Trip hours</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.users.map((agent)=>{
										return {
											...agent,
											works:agent.works.filter((work)=>statusIDs.includes(work.status.id)),
											trips:agent.trips.filter((trip)=>statusIDs.includes(trip.status.id)),
										}
									}).filter((agent)=> agent.works.length > 0 || agent.trips.length > 0).map((agent)=>
									<tr key={agent.id} className="clickable" onClick={()=>this.setState({showAgent:agent})}>
										<td>{agent.email}</td>
										<td>{agent.works.reduce((acc,work)=>acc+((isNaN(parseInt(work.quantity)))?0:parseInt(work.quantity)),0)}</td>
										<td>{agent.trips.reduce((acc,trips)=>acc+((isNaN(parseInt(trips.quantity)))?0:parseInt(trips.quantity)),0)}</td>
									</tr>
								)}
							</tbody>
							</table>
					</div>
				}
					{this.props.month!==null && this.props.year!==null && this.state.showAgent!==null &&
						<div className="p-20">
							<h2>Mesačný výkaz faktúrovaných prác agenta</h2>
							<div className="flex-row m-b-30">
								<div>
									Agent {this.state.showAgent.name} {this.state.showAgent.surname} ({this.state.showAgent.email}) <br/>
									Obdobie od: {timestampToString(this.props.from)} do: {timestampToString(this.props.to)}
								</div>
							</div>
							<h3>Práce</h3>
							<hr />
							<table className="table m-b-30">
								<thead>
									<tr>
										<th>ID</th>
										<th>Názov úlohy</th>
										<th>Zadal</th>
										<th>Firma</th>
										<th>Status</th>
										<th>Close date</th>
										<th>Popis práce</th>
										<th style={{width:'150px'}}>Typ práce</th>
										<th style={{width:'50px'}}>Hodiny</th>
									</tr>
								</thead>
								<tbody>
									{
										this.state.tasks.filter((task)=>this.filterWorkTask(task,statusIDs)).map((task)=>
										<tr key={task.id}>
											<td>{task.id}</td>
											<td className="clickable" style={{ color: "#1976d2" }} onClick={()=>this.setState({taskOpened:task})}>{task.title}</td>
											<td>{task.requester?task.requester.email:'Nikto'}</td>
											<td>{task.company?task.company.title:'Unknown company'}</td>
											<td>
												<span className="label label-info"
													style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
													{task.status?task.status.title:'Neznámy status'}
												</span>
											</td>
											<td>{timestampToString(task.closeDate)}</td>
											<td colSpan="3" style={{padding:0}}>
												<table className="table-borderless full-width">
													<tbody>
														{task.works.filter((work)=>this.filterByAgent(work)).map((work)=>
															<tr key={work.id}>
																<td key={work.id+ '-title'} style={{}}>{work.title}</td>
																<td key={work.id+ '-type'} style={{width:'150px', }}>{work.type.title}</td>
																<td key={work.id+ '-time'} style={{width:'50px', }}>{work.quantity}</td>
															</tr>
														)}
													</tbody>
												</table>
											</td>
										</tr>
									)
								}
							 </tbody>
							</table>
							<table className="table m-b-10">
								<thead>
									<tr>
										<th>Typ práce</th>
										<th>Počet hodín</th>
									</tr>
								</thead>
								<tbody>
									{
										this.getWorkTypeTotals(statusIDs).map((workType)=>
										<tr key={workType.id}>
											<td>{workType.title}</td>
											<td>{workType.quantity}</td>
										</tr>
									)
								}
							 </tbody>
							</table>
							<p className="m-0">Spolu počet hodín: {
								this.state.tasks.filter((task)=>this.filterWorkTask(task,statusIDs)).reduce((acc,item)=>{
									return acc+item.works.reduce((acc,item)=>{
										if(!isNaN(parseInt(item.quantity))){
											return acc+parseInt(item.quantity);
										}
										return acc;
									},0);
								},0)}
							</p>
							<p className="m-0">
								Spolu počet hodín mimo pracovný čas: {
									this.state.tasks.filter((task)=>this.filterWorkTask(task,statusIDs) && task.overtime).reduce((acc,item)=>{
										return acc+item.works.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)+' '}
								(Čísla úloh:{
									this.state.tasks.filter((task)=>this.filterWorkTask(task,statusIDs) && task.overtime)
									.reduce((acc,task)=>{
										return acc+=task.id + ','
									}," ").slice(0,-1)
								})
							</p>

							<h3>Výjazdy</h3>
							<hr />
							<table className="table m-b-30">
								<thead>
									<tr>
										<th>ID</th>
										<th>Názov úlohy</th>
										<th>Zadal</th>
										<th>Firma</th>
										<th>Status</th>
										<th>Close date</th>
										<th style={{width:'150px'}}>Výjazd</th>
										<th style={{width:'50px'}}>Mn.</th>
									</tr>
								</thead>
								<tbody>
									{
										this.state.tasks.filter((task)=>this.filterTripTask(task,statusIDs)).map((task)=>
										<tr key={task.id}>
											<td>{task.id}</td>
											<td className="clickable" style={{ color: "#1976d2" }} onClick={()=>this.setState({taskOpened:task})}>{task.title}</td>
											<td>{task.requester?task.requester.email:'Nikto'}</td>
											<td>{task.company?task.company.title:'Unknown company'}</td>
											<td>
												<span className="label label-info"
													style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
													{task.status?task.status.title:'Neznámy status'}
												</span>
											</td>
											<td>{timestampToString(task.closeDate)}</td>
											<td colSpan="2" style={{padding:0}}>
												<table className="table-borderless full-width">
													<tbody>
														{task.trips.filter((trip)=>this.filterByAgent(trip)).map((trip)=>
															<tr key={trip.id}>
																<td style={{width:'150px', }}>{trip.type?trip.type.title:"Undefined"}</td>
																<td style={{width:'50px', }}>{trip.quantity}</td>
															</tr>
														)}
													</tbody>
												</table>
											</td>
										</tr>
									)
								}
							 </tbody>
							</table>
							<table className="table m-b-10">
								<thead>
									<tr>
										<th>Výjazd</th>
										<th>ks</th>
									</tr>
								</thead>
								<tbody>
									{
										this.getTripTypeTotals(statusIDs).map((tripType)=>
										<tr key={tripType.id}>
											<td>{tripType.title}</td>
											<td>{tripType.quantity}</td>
										</tr>
									)
								}
							 </tbody>
							</table>
							<p className="m-0">Spolu počet výjazdov: {
								this.state.tasks.filter((task)=>this.filterTripTask(task,statusIDs)).reduce((acc,item)=>{
									return acc+item.trips.reduce((acc,item)=>{
										if(!isNaN(parseInt(item.quantity))){
											return acc+parseInt(item.quantity);
										}
										return acc;
									},0);
								},0)}
							</p>
							<p className="m-0 m-b-10">
								Spolu počet výjazdov mimo pracovný čas: {
									this.state.tasks.filter((task)=>this.filterTripTask(task,statusIDs) && task.overtime).reduce((acc,item)=>{
										return acc+item.trips.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)+' '}
								(Čísla úloh:{
									this.state.tasks.filter((task)=>this.filterTripTask(task,statusIDs) && task.overtime)
									.reduce((acc,task)=>{
										return acc+=task.id + ','
									}," ").slice(0,-1)
								})
							</p>
							<h3>Sumár podľa typu práce a výjazdov - v rámci paušálu, nad rámec paušálu, projektových</h3>
							<table className="table m-b-10">
								<tbody>
									<tr>
										<td>Počet prác vrámci paušálu</td>
										<td>
											{
												this.state.tasks.filter((task)=>this.filterWorkTask(task,statusIDs)).reduce((acc,task)=>{
													return acc + task.works.reduce((acc2,work)=>{
														return acc2 + work.pausalQuantity
													},0)
												},0)
											}
										</td>
									</tr>
									<tr>
										<td>Počet prác nad rámec paušálu</td>
										<td>
											{
												this.state.tasks.filter((task)=>this.filterWorkTask(task,statusIDs)).reduce((acc,task)=>{
													return acc + task.works.reduce((acc2,work)=>{
														return acc2 + work.extraQuantity
													},0)
												},0)
											}
										</td>
									</tr>
									<tr>
										<td>Projektové práce</td>
										<td>
											{
												this.state.tasks.filter((task)=>this.filterWorkTask(task,statusIDs)).reduce((acc,task)=>{
													return acc + task.works.reduce((acc2,work)=>{
														return acc2 + work.projectQuantity
													},0)
												},0)
											}
										</td>
									</tr>
									<tr>
									<td>Výjazdy vrámci paušálu</td>
										<td>
											{
												this.state.tasks.filter((task)=>this.filterTripTask(task,statusIDs)).reduce((acc,task)=>{
													return acc + task.trips.reduce((acc2,trip)=>{
														return acc2 + trip.pausalQuantity
													},0)
												},0)
											}
										</td>
									</tr>
									<tr>
										<td>Výjazdy nad rámec paušálu</td>
										<td>
											{
												this.state.tasks.filter((task)=>this.filterTripTask(task,statusIDs)).reduce((acc,task)=>{
													return acc + task.trips.reduce((acc2,trip)=>{
														return acc2 + trip.extraQuantity
													},0)
												},0)
											}
										</td>
									</tr>
									<tr>
										<td>Výjazdy pri projektových prácach</td>
										<td>
											{
												this.state.tasks.filter((task)=>this.filterTripTask(task,statusIDs)).reduce((acc,task)=>{
													return acc + task.trips.reduce((acc2,trip)=>{
														return acc2 + trip.projectQuantity
													},0)
												},0)
											}
										</td>
									</tr>
							 </tbody>
							</table>

					</div>}
					<Modal isOpen={this.state.taskOpened!==null}>
						<ModalHeader>{this.state.taskOpened!==null?('Editing: '+this.state.taskOpened.title):''}</ModalHeader>
						<ModalBody>
							{ this.state.taskOpened!==null &&
								<TaskEdit inModal={true} columns={true} match={{params:{taskID:this.state.taskOpened.id}}} closeModal={()=>this.setState({taskOpened:null})}/>
							}
						</ModalBody>
					</Modal>

				 </div>
		);
	}
	//Processing tasks
	/*
		spracovat trips a works, priradit ich uloham, rozdelit ulohy podla mesiacov, vyber osoby, odfiltrovat ulohy podla toho ci su priradene vybranej osoby
	*/

	separateTasks(tasks,allTasks){
		let projectTasks = tasks.filter((task)=>!task.pausal).map((task)=>{
			return {
				...task,
				works:task.works.map((work)=>{
					return {
						...work,
						projectQuantity:work.quantity,
						pausalQuantity:0,
						extraQuantity:0,
					};
				}),
				trips:task.trips.map((trip)=>{
					return {
						...trip,
						projectQuantity:trip.quantity,
						pausalQuantity:0,
						extraQuantity:0,
					};
				}),
			}
		});
		let pausalTasks = allTasks.filter((task)=>task.pausal);

		let groupedPausalTasks = this.groupTasksByCompany(this.groupTasksByMonth(pausalTasks));
		let calculatedPausalTasks = this.calculatePausalOfTasks(groupedPausalTasks);
		let newTasks = this.getTasksFromPeriods(calculatedPausalTasks,tasks.filter((task)=>task.pausal).map((task)=>task.id));
		return [...newTasks,...projectTasks];
	}

	groupTasksByMonth(tasks){
		let groupedTasks=[];
		tasks.forEach((task)=>{
			let closeDate = new Date(task.closeDate);
			let key = closeDate.getFullYear() + '-' + closeDate.getMonth();
			let group = groupedTasks.find((group)=>group.id===key);
			if(group!==undefined){
				group.tasks = [...group.tasks,task]
			}else{
				groupedTasks.push({id:key,tasks:[task]})
			}
		})
		return groupedTasks;
	}

	groupTasksByCompany(tasks){
		return tasks.map((group)=>{
			let companies = [];
			group.tasks.forEach((task)=>{
				let group = null;
				if(task.company === null ){
					 group = companies.find( (group) => group.company === null );
				}else{
					 group = companies.find( (group) => group.company !== null && group.company.id === task.company.id );
				}
				if(group === undefined){
					companies.push({company:task.company,tasks:[task]})
				}else{
					group.tasks=[...group.tasks,task];
				}
			})

			return {id:group.id, companies}
		})
	}

	calculatePausalOfTasks(companies){
		return companies.map((period)=>{
			let newCompanies = period.companies.map((group)=>{
				//iba ponechat tasky a pridat im pausalWorks a extraWorks
				let newCompany = {company:group.company,tasks:[]};
				let pausal = parseInt(group.company !== null ? group.company.workPausal : 0);
				let tripPausal = parseInt(group.company !== null ? group.company.drivePausal : 0);
				group.tasks.forEach((task)=>{
					let works = [];
					let trips = [];
					task.works.forEach((work)=>{
						if(work.quantity < pausal){
							pausal -= work.quantity;
							works.push({...work,pausalQuantity:work.quantity, extraQuantity:0, projectQuantity:0 });
						}else if(pausal===0){
							works.push({...work,pausalQuantity:0, extraQuantity:work.quantity, projectQuantity:0 });
						}else{
							works.push({...work,pausalQuantity:pausal, extraQuantity:work.quantity - pausal, projectQuantity:0 });
							pausal = 0;
						}
					})
					task.trips.forEach((trip)=>{
						if(trip.quantity < tripPausal){
							tripPausal -= trip.quantity;
							trips.push({...trip,pausalQuantity:trip.quantity, extraQuantity:0, projectQuantity:0 });
						}else if(tripPausal===0){
							trips.push({...trip,pausalQuantity:0, extraQuantity:trip.quantity, projectQuantity:0 });
						}else{
							trips.push({...trip,pausalQuantity:tripPausal, extraQuantity:trip.quantity - tripPausal, projectQuantity:0 });
							tripPausal = 0;
						}
					})
					newCompany.tasks.push({...task,works,trips});
				})
				return newCompany;
			})
			return {id:period.id,companies:newCompanies};
		})
	}

	getTasksFromPeriods(periods,validIDs){
			let tasks = [];
			periods.forEach((period)=>{
				period.companies.forEach((company)=>{
					company.tasks.forEach((task)=>{
						if(validIDs.includes(task.id)){
							if(task.works.length>0||task.trips.length>0){
								tasks.push(task);
							}

						}
					})
				})
			})
			return tasks;
		}

}

const mapStateToProps = ({ reportReducer, storageCompanies, storageHelpTasks, storageHelpStatuses, storageHelpTaskTypes, storageUsers,
	storageHelpTaskWorks, storageHelpTaskWorkTrips, storageHelpTripTypes }) => {
	const { from, to } = reportReducer;

	const { companiesActive, companies, companiesLoaded } = storageCompanies;
	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
	const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { taskTypesActive, taskTypes, taskTypesLoaded } = storageHelpTaskTypes;
	const { usersActive, users, usersLoaded } = storageUsers;
	const { taskWorksActive, taskWorks, taskWorksLoaded } = storageHelpTaskWorks;
	const { workTripsActive, workTrips, workTripsLoaded } = storageHelpTaskWorkTrips;
	const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;

	return {
		from, to,
		companiesActive, companies, companiesLoaded,
		tasksActive, tasks,tasksLoaded,
		statusesActive, statuses,statusesLoaded,
		taskTypesActive, taskTypes,taskTypesLoaded,
		usersActive, users,usersLoaded,
		taskWorksActive, taskWorks,taskWorksLoaded,
		workTripsActive, workTrips, workTripsLoaded,
		tripTypesActive, tripTypes, tripTypesLoaded,
	};
};

export default connect(mapStateToProps, { storageCompaniesStart, storageHelpTasksStart, storageHelpStatusesStart, storageHelpTaskTypesStart, storageUsersStart,
	storageHelpTaskWorksStart, storageHelpTaskWorkTripsStart, storageHelpTripTypesStart })(MothlyReportsAssigned);
