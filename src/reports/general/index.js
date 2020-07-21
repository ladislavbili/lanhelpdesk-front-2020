import React, { Component } from 'react';
import { connect } from "react-redux";
import {
	storageHelpTasksStart,
	storageHelpStatusesStart,
	storageHelpUnitsStart,
	storageUsersStart,
	storageHelpTaskMaterialsStart,
	storageHelpTaskWorksStart,
	storageHelpTaskTypesStart,
	storageHelpProjectsStart,
	storageHelpPricelistsStart,
	storageHelpPricesStart,
	storageCompaniesStart,
	storageHelpTaskCustomItemsStart,
	storageHelpTaskWorkTripsStart,
	storageHelpTripTypesStart,
} from 'redux/actions';
import TaskEdit from 'helpdesk/task/taskEdit';
import { timestampToString, sameStringForms } from '../../helperFunctions';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class Reports extends Component {
	constructor(props){
		super(props);
		this.state={
			tasks:[],
			statuses:[],
			users:[],
			units:[],
			taskMaterials:[],
			taskWorks:[],
			taskOpened:null,
			loading:false
		}
	}

	storageLoaded(props){
		return props.tasksLoaded &&
		props.statusesLoaded &&
		props.taskTypesLoaded &&
		props.unitsLoaded &&
		props.usersLoaded &&
		props.materialsLoaded &&
		props.projectsLoaded &&
		props.taskWorksLoaded &&
		props.pricelistsLoaded &&
		props.pricesLoaded &&
		props.companiesLoaded &&
		props.customItemsLoaded &&
		props.workTripsLoaded &&
		props.tripTypesLoaded
	}

	componentWillReceiveProps(props){
		if(
			!sameStringForms(props.tasks,this.props.tasks) ||
			!sameStringForms(props.statuses,this.props.statuses) ||
			!sameStringForms(props.taskTypes,this.props.taskTypes) ||
			!sameStringForms(props.units,this.props.units) ||
			!sameStringForms(props.users,this.props.users) ||
			!sameStringForms(props.materials,this.props.materials) ||
			!sameStringForms(props.projects,this.props.projects) ||
			!sameStringForms(props.taskWorks,this.props.taskWorks) ||
			!sameStringForms(props.pricelists,this.props.pricelists) ||
			!sameStringForms(props.prices,this.props.prices) ||
			!sameStringForms(props.companies,this.props.companies) ||
			!sameStringForms(props.customItems,this.props.customItems) ||
			!sameStringForms(props.workTrips,this.props.workTrips) ||
			!sameStringForms(props.tripTypes,this.props.tripTypes)
		){
			this.setData(props);
		}else	if(!this.storageLoaded(this.props) && this.storageLoaded(props)){
			this.setData(props);
		}
	}

	componentWillMount(){
		if(!this.props.tasksActive){
			this.props.storageHelpTasksStart();
		}
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}
		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}
		if(!this.props.unitsActive){
			this.props.storageHelpUnitsStart();
		}
		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		if(!this.props.materialsActive){
			this.props.storageHelpTaskMaterialsStart();
		}
		if(!this.props.taskWorksActive){
			this.props.storageHelpTaskWorksStart();
		}
		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		if(!this.props.pricelistsActive){
			this.props.storageHelpPricelistsStart();
		}
		if(!this.props.pricesActive){
			this.props.storageHelpPricesStart();
		}
		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}
		if(!this.props.customItemsActive){
			this.props.storageHelpTaskCustomItemsStart();
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
		const works = this.processWorks(props);
		const trips = this.processTrips(props);
		const materials = this.processMaterials(props);
		const customItems = this.processCustomItems(props);
		const projectsIDs = props.projects.map( (project) => project.id );
		let newTasks = props.tasks.map( (task) => {
			return {
				...task,
				works: works.filter( (work) => work.task === task.id ).sort(( item1, item2 ) => item1.order - item2.order ),
				trips: trips.filter( (trip) => trip.task === task.id ).sort(( item1, item2 ) => item1.order - item2.order ),
				materials: materials.filter( (material) => material.task === task.id ).sort(( item1, item2 ) => item1.order - item2.order ),
				customItems: customItems.filter( (customItem) => customItem.task === task.id ).sort(( item1, item2 ) => item1.order - item2.order ),
				project: projectsIDs.includes(task.project) ? props.projects.find( (project) => project.id === task.project ) : null,
				requester: task.requester === null ? null: props.users.find( (user) => user.id === task.requester ),
				assigned: task.assigned === null ? null: props.users.find( (user) => user.id === task.assigned ),
				status: task.status === null ? null: props.statuses.find( (status) => status.id === task.status ),
			}
		})
		.sort( ( task1, task2 ) => parseInt(task2.id) - parseInt(task1.id) );
		this.setState({
			tasks: newTasks,
			loading:false
		});
	}

	getCompany(item,props){
		let task = props.tasks.find((task)=>task.id===item.task);
		let company = undefined;
		if(task){
			company = props.companies.find((company)=>company.id===task.company);
			if(company){
				company = {...company,pricelist:props.pricelists.find((pricelist)=>pricelist.id===company.pricelist)}
			}
		}
		return company;
	}

	getPrice(type,company){
		if(type===undefined||company===undefined){
			return NaN;
		}
		let price = type.prices.find((price)=>price.pricelist===company.pricelist.id);
		if(price === undefined){
			price = NaN;
		}else{
			price = price.price;
		}
		return parseFloat(parseFloat(price).toFixed(2));
	}

	processWorkTypes(props){
		return props.taskTypes.map((workType)=>{
			return {
				...workType,
				prices: props.prices.filter((price)=>price.type===workType.id)
			}
		})
	}

	processWorks(props){
		let workTypes = this.processWorkTypes(props);
		return props.taskWorks.map((work, index)=>{
			let company = this.getCompany(work,props);
			let type = workTypes.find((item)=>item.id===work.type||item.id===work.workType);
			let price = work.finished ? work.price : this.getPrice(type,company);
			if(type===undefined){
				type={title:'Unknown',id:Math.random(),prices:[]}
			}
			let dph = (company && company.dph && !isNaN(parseInt(company.dph)) && (parseInt(company.dph) > 0)) ? parseInt(company.dph) : 20;
			let afterHours = company && company.pricelist ? parseInt(company.pricelist.afterHours) : 0;
			return {
				finished: work.finished === true,
				id:work.id,
				title:work.title,
				quantity:work.quantity,
				discount:work.discount,
				assignedTo:work.assignedTo,
				task:work.task,
				price,
				dph: work.finished? work.dph : dph,
				afterHours: work.finished ? work.afterHours: afterHours,
				order: !isNaN(parseInt(work.order)) ? parseInt(work.order) : index,
				type
			}
		})
	}

	processMaterials(props){
		return props.materials.map((material, index)=>{
			let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100)).toFixed(2);
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(2);
			return{...material,
				unit:props.units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice,
				order: !isNaN(parseInt(material.order)) ? parseInt(material.order) : index,
			}
		})
	}

	processCustomItems(props){
		return props.customItems.map((item, index)=>{
			let finalUnitPrice=(parseFloat(item.price)).toFixed(2);
			let totalPrice=(finalUnitPrice*parseFloat(item.quantity)).toFixed(2);
			return{...item,
				unit:props.units.find((unit)=>unit.id===item.unit),
				finalUnitPrice,
				totalPrice,
				order: !isNaN(parseInt(item.order)) ? parseInt(item.order) : index,
			}
		})
	}

	processTripTypes(props){
		return props.tripTypes.map((tripType)=>{
			return {...tripType,
			prices:props.prices.filter((price)=>price.type===tripType.id)}
		})
	}

	processTrips(props){
		let tripTypes = this.processTripTypes(props);
		return props.workTrips.map((trip, index)=>{
			let company = this.getCompany(trip,props);
			let type = tripTypes.find((item)=>item.id===trip.type);
			let price = this.getPrice(type,company);

			if(type===undefined){
				type={title:'Unknown',id:Math.random(),prices:[]}
			}

			let dph = company && company.dph && !isNaN(parseInt(company.dph)) && parseInt(company.dph) > 0 ? parseInt(company.dph) : 20;
			let afterHours = company && company.pricelist ? parseInt(company.pricelist.afterHours) : 0;


			return {
				finished:trip.finished===true,
				id:trip.id,
				quantity:trip.quantity,
				discount:trip.discount,
				task:trip.task,
				price:trip.finished?trip.price:price,
				dph: trip.finished?trip.dph:dph,
				afterHours: trip.finished?trip.afterHours:afterHours,
				order: !isNaN(parseInt(trip.order)) ? parseInt(trip.order) : index,
				type
			}
		})
	}

	render() {
		return (
			<div className="scrollable fit-with-header">
				<div className="p-20">
					<h2 className="m-b-15">Výkaz prác</h2>
					<div>
							<div className="m-b-30">
								<h3>Služby</h3>
								<hr />
								<table className="table m-b-10">
									<thead>
										<tr>
											<th>ID</th>
											<th style={{ width: '20%' }}>	Name</th>
											<th>Zadal</th>
											<th>Riesi</th>
											<th>Status</th>
											<th>Status date</th>
											<th>Služby</th>
											<th style={{width:'150px'}}>Typ práce</th>
											<th style={{width:'50px'}}>Hodiny</th>
											<th style={{width:'70px'}}>Cena/hodna</th>
											<th style={{width:'70px'}}>Cena spolu</th>
										</tr>
									</thead>
									<tbody>
										{ this.state.tasks.filter( (task) => task.works.length > 0 ).map( (task,index) =>
											<tr key={index}>
												<td>{task.id}</td>
												<td className="clickable" style={{ color: "#1976d2" }} onClick={()=>this.setState({taskOpened:task})}>{task.title}</td>
												<td>{task.requester?task.requester.email:'Nikto'}</td>
												<td>{task.assigned?task.assigned.email:'Nikto'}</td>
												<td>
													<span className="label label-info"
														style={{backgroundColor: task.status && task.status.color ? task.status.color: 'white' }}>
														{ task.status ? task.status.title: 'Neznámy status' }
													</span>
												</td>
												<td>{timestampToString(task.statusChange)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.works.map( (work) =>
																<tr key={work.id}>
																	<td key={work.id+ '-title'} style={{paddingLeft:0}}>{work.title}</td>
																	<td key={work.id+ '-type'} style={{width:'150px'}}>{work.type.title}</td>
																	<td key={work.id+ '-time'} style={{width:'50px'}}>{work.quantity}</td>
																	<td key={work.id+ '-pricePerUnit'} style={{width:'70px'}}>{task.overtime?this.getUnitAHPrice(work):this.getUnitDiscountedPrice(work)}</td>
																	<td key={work.id+ '-totalPrice'} style={{width:'70px'}}>{task.overtime?this.getTotalAHPrice(work):this.getTotalDiscountedPrice(work)}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>

							<div className="m-b-30">
								<h3>Výjazd</h3>
								<hr />
								<table className="table m-b-10">
									<thead>
										<tr>
											<th>ID</th>
											<th style={{ width: '20%' }}>	Name</th>
											<th>Zadal</th>
											<th>Riesi</th>
											<th>Status</th>
											<th>Status date</th>
											<th>Služby</th>
											<th style={{width:'150px'}}>Výjazd</th>
											<th style={{width:'50px'}}>Mn.</th>
											<th style={{width:'50px'}}>Cena/ks</th>
											<th style={{width:'50px'}}>Cena spolu</th>
										</tr>
									</thead>
									<tbody>
										{ this.state.tasks.filter( (task) => task.trips.length > 0 ).map( (task,index) =>
											<tr key={index}>
												<td>{task.id}</td>
												<td className="clickable" style={{ color: "#1976d2" }} onClick={()=>this.setState({taskOpened:task})}>{task.title}</td>
												<td>{task.requester?task.requester.email:'Nikto'}</td>
												<td>{task.assigned?task.assigned.email:'Nikto'}</td>
												<td>
													<span className="label label-info"
														style={{backgroundColor: task.status && task.status.color ? task.status.color: 'white' }}>
														{ task.status ? task.status.title: 'Neznámy status' }
													</span>
												</td>
												<td>{timestampToString(task.statusChange)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.trips.map((trip)=>
																<tr key={trip.id}>
																	<td key={trip.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{trip.type?trip.type.title:"Undefined"}</td>
																	<td key={trip.id+ '-time'} style={{width:'50px'}}>{trip.quantity}</td>
																	<td key={trip.id+ '-unitPrice'} style={{width:'50px'}}>{task.overtime?this.getUnitAHPrice(trip):this.getUnitDiscountedPrice(trip)}</td>
																	<td key={trip.id+ '-totalPrice'} style={{width:'50px'}}>{task.overtime?this.getTotalAHPrice(trip):this.getTotalDiscountedPrice(trip)}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>

						<div>
							<h3>Materiále a voľné položky</h3>
							<hr />
							<table className="table p-10">
								<thead>
									<tr>
										<th>ID</th>
										<th style={{ width: '20%' }}>Name</th>
										<th>Zadal</th>
										<th>Riesi</th>
										<th>Status</th>
										<th>Status date</th>
										<th style={{width:'150px',paddingLeft:0}}>Material</th>
										<th style={{width:'50px'}}>Mn.</th>
										<th style={{width:'100px'}}>Jednotka</th>
										<th style={{width:'100px'}}>Cena/Mn.</th>
										<th style={{width:'100px'}}>Cena spolu</th>
									</tr>
								</thead>
								<tbody>
									{ this.state.tasks.filter( (task) => task.materials.length > 0 || task.customItems.length > 0 ).map( (task,index) =>
										<tr key={index}>
											<td>{task.id}</td>
											<td className="clickable" style={{ color: "#1976d2" }} onClick={()=>this.setState({taskOpened:task})}>{task.title}</td>
											<td>{task.requester?task.requester.email:'Nikto'}</td>
											<td>{task.assigned?task.assigned.email:'Nikto'}</td>
											<td>
												<span className="label label-info"
													style={{backgroundColor: task.status && task.status.color ? task.status.color: 'white' }}>
													{ task.status ? task.status.title: 'Neznámy status' }
												</span>
											</td>
											<td>{timestampToString(task.statusChange)}</td>
											<td colSpan="5">
												<table className="table-borderless full-width">
													<tbody>
														{task.materials.map((material)=>
															<tr key={material.id}>
																<td key={material.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{material.title}</td>
																<td key={material.id+ '-quantity'} style={{width:'50px'}}>{material.quantity}</td>
																<td key={material.id+ '-unit'} style={{width:'100px'}}>{material.unit.title}</td>
																<td key={material.id+ '-unitPrice'} style={{width:'100px'}}>{material.finalUnitPrice}</td>
																<td key={material.id+ '-totalPrice'} style={{width:'100px'}}>{material.totalPrice}</td>
															</tr>
														)}
														{task.customItems.map((item)=>
															<tr key={item.id}>
																<td key={item.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{item.title}</td>
																<td key={item.id+ '-quantity'} style={{width:'50px'}}>{item.quantity}</td>
																<td key={item.id+ '-unit'} style={{width:'100px'}}>{item.unit.title}</td>
																<td key={item.id+ '-unitPrice'} style={{width:'100px'}}>{item.finalUnitPrice}</td>
																<td key={item.id+ '-totalPrice'} style={{width:'100px'}}>{item.totalPrice}</td>
															</tr>
														)}
													</tbody>
												</table>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<Modal isOpen={this.state.taskOpened!==null} toggle={()=>this.setState({taskOpened:null})} >
					<ModalHeader toggle={()=>this.setState({taskOpened:null})}>{this.state.taskOpened!==null?('Editing: '+this.state.taskOpened.title):''}</ModalHeader>
					<ModalBody>
						{ this.state.taskOpened!==null &&
							<TaskEdit inModal={true} columns={true} match={{params:{taskID:this.state.taskOpened.id}}} closeModal={()=>this.setState({taskOpened:null})}/>
						}
					</ModalBody>
				</Modal>
			</div>
		);
	}

	//Unit prices
	getUnitDiscountedPrice(item){
		return parseFloat((parseFloat(item.price)*(100-parseInt(item.discount))/100).toFixed(2))
	}

	getUnitAHExtraPrice(item){
		return parseFloat((this.getUnitDiscountedPrice(item)*(parseFloat(item.afterHours)/100)).toFixed(2));
	}

	getUnitAHPrice(item){
		return parseFloat((this.getUnitDiscountedPrice(item)+this.getUnitAHExtraPrice(item)).toFixed(2));
	}

	//Total prices
	getTotalPrice(item){
		return parseFloat(parseFloat(item.price)*parseInt(item.quantity).toFixed(2))
	}

	getTotalDiscountedPrice(item){
		return parseFloat((this.getTotalPrice(item)*(100-parseInt(item.discount))/100).toFixed(2))
	}

	getTotalAHExtraPrice(item){
		return parseFloat((this.getTotalDiscountedPrice(item)*(parseFloat(item.afterHours)/100)).toFixed(2));
	}

	getTotalAHPrice(item){
		return parseFloat((this.getTotalDiscountedPrice(item)+this.getTotalAHExtraPrice(item)).toFixed(2));
	}

	getTotalWithDPH(item,ah){
		if(ah){
			return parseFloat(this.getTotalAHPrice(item)*(1+parseInt(item.dph)/100).toFixed(2));
		}
		return parseFloat(this.getTotalDiscountedPrice(item)*(1+parseInt(item.dph)/100).toFixed(2));
	}
}

const mapStateToProps = ({
	filterReducer,
	userReducer,
	storageHelpTaskTypes,
	storageHelpTasks,
	storageHelpStatuses,
	storageHelpUnits,
	storageUsers,
	storageHelpTaskMaterials,
	storageHelpTaskWorks,
	storageHelpProjects,
	storageHelpPricelists,
	storageHelpPrices,
	storageCompanies,
	storageHelpTaskCustomItems,
	storageHelpTaskWorkTrips,
	storageHelpTripTypes
}) => {
	const { filter, project, milestone } = filterReducer;

	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
	const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { unitsActive, units, unitsLoaded } = storageHelpUnits;
	const { usersActive, users, usersLoaded } = storageUsers;
	const { materialsActive, materials, materialsLoaded } = storageHelpTaskMaterials;
	const { taskWorksActive, taskWorks, taskWorksLoaded } = storageHelpTaskWorks;
	const { projectsActive, projectsLoaded, projects } = storageHelpProjects;
	const { pricelistsLoaded, pricelistsActive, pricelists } = storageHelpPricelists;
	const { pricesLoaded, pricesActive, prices } = storageHelpPrices;
	const { companiesActive, companies, companiesLoaded } = storageCompanies;
	const { customItemsActive, customItems, customItemsLoaded } = storageHelpTaskCustomItems;
	const { workTripsActive, workTrips, workTripsLoaded } = storageHelpTaskWorkTrips;
	const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;

	return {
		filter, project, milestone,
		currentUser:userReducer,
		tasksActive, tasks,tasksLoaded,
		statusesActive, statuses,statusesLoaded,
		taskTypesLoaded, taskTypesActive, taskTypes,
		unitsActive, units,unitsLoaded,
		usersActive, users,usersLoaded,
		materialsActive, materials,materialsLoaded,
		taskWorksActive, taskWorks,taskWorksLoaded,
		projectsActive, projectsLoaded, projects,
		pricelistsLoaded, pricelistsActive, pricelists,
		pricesLoaded, pricesActive, prices,
		companiesActive, companies, companiesLoaded,
		customItemsActive, customItems, customItemsLoaded,
		workTripsActive, workTrips, workTripsLoaded,
		tripTypesActive, tripTypes, tripTypesLoaded,
	};
};

export default connect(mapStateToProps, {
	storageHelpTasksStart,
	storageHelpStatusesStart,
	storageHelpUnitsStart,
	storageUsersStart,
	storageHelpTaskMaterialsStart,
	storageHelpTaskWorksStart,
	storageHelpTaskTypesStart,
	storageHelpProjectsStart,
	storageHelpPricelistsStart,
	storageHelpPricesStart,
	storageCompaniesStart,
	storageHelpTaskCustomItemsStart,
	storageHelpTaskWorkTripsStart,
	storageHelpTripTypesStart,
})(Reports);
