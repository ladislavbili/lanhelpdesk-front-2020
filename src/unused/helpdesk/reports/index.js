import React, { Component } from 'react';
import {database} from '../../index';
import { connect } from "react-redux";
import { snapshotToArray, timestampToString} from '../../helperFunctions';
import { Link } from 'react-router-dom';



class Reports extends Component {
	constructor(props){
		super(props);
		this.state={
			tasks:[],
			statuses:[],
			workTypes:[],
			users:[],
			units:[],
			taskMaterials:[],
			taskWorks:[],
			loading:false
		}
		this.fetchData();
	}
	//tasks, materiale a sluzby	worktype user status

	fetchData(){
		Promise.all(
			[
				database.collection('help-tasks').get(),
				database.collection('help-statuses').get(),
				database.collection('help-work_types').get(),
				database.collection('help-units').get(),
				database.collection('users').get(),
				database.collection('help-task_materials').get(),
				database.collection('help-task_works').get()
			]).then(([tasks,statuses, workTypes, units, users,taskMaterials, taskWorks])=>{
				this.setData(snapshotToArray(tasks),snapshotToArray(statuses),snapshotToArray(users),
				snapshotToArray(workTypes), snapshotToArray(units),
				snapshotToArray(taskMaterials),snapshotToArray(taskWorks));
			});
		}

		setData(tasks,statuses, users,workTypes,units,taskMaterials,taskWorks){
			let newTasks=tasks.map((task)=>{
				return {
					...task,
					requester:task.requester===null ? null:users.find((user)=>user.id===task.requester),
					assigned:task.assigned===null ? null:users.find((user)=>user.id===task.assigned),
					status:task.status===null ? null: statuses.find((status)=>status.id===task.status),
				}
			});
			this.setState({
				tasks:newTasks,
				statuses,
				workTypes,
				users,
				units,
				taskMaterials,
				taskWorks,
				loading:false
			});
		}

	processWorks(works){
		let newWorks = works.map((work)=>{
			let finalUnitPrice=parseFloat(work.price);
			if(work.extraWork){
				finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
			}
			let discountPerItem = finalUnitPrice*parseFloat(work.discount)/100;
			finalUnitPrice=(finalUnitPrice*(1-parseFloat(work.discount)/100)).toFixed(2)
			let totalPrice=(finalUnitPrice*parseFloat(work.quantity)).toFixed(2);
			let workType= this.state.workTypes.find((item)=>item.id===work.workType);
			return{
				...work,
				task:this.state.tasks.find((task)=>work.task===task.id),
				workType:workType?workType:{title:'Unknown',id:Math.random()},
				finalUnitPrice,
				totalPrice,
				totalDiscount:(parseFloat(work.quantity)*discountPerItem).toFixed(2)

			}
		});
		newWorks = newWorks.filter((work)=>
			(this.props.filter.status===null||(work.task.status&&work.task.status.id===this.props.filter.status)) &&
			(this.props.filter.requester===null||(work.task.requester&&work.task.requester.id===this.props.filter.requester)) &&
			(this.props.filter.company===null||work.task.company===this.props.filter.company) &&
			(this.props.filter.assigned===null||(work.task.assigned&&work.task.assigned.id===this.props.filter.assigned)) &&
			(this.props.filter.workType===null||(work.workType.id===this.props.filter.workType)) &&
			(this.props.filter.statusDateFrom===''||work.task.statusChange >= this.props.filter.statusDateFrom) &&
			(this.props.filter.statusDateTo===''||work.task.statusChange <= this.props.filter.statusDateTo)
			);

		let groupedWorks = newWorks.filter((item, index)=>{
			return newWorks.findIndex((item2)=>item2.task.id===item.task.id)===index
			});
		return groupedWorks.map((item)=>{
			let works = newWorks.filter((item2)=>item.task.id===item2.task.id);
			return{
				...item,
				title: works.map((item)=>item.title),
				workType: works.map((item)=>item.workType),
				quantity: works.map((item)=>item.quantity),
				finalUnitPrice: works.map((item)=>item.finalUnitPrice),
				totalPrice: works.map((item)=>item.totalPrice),
				totalDiscount: works.map((item)=>item.totalDiscount)
			}
		});
	}

	processMaterials(materials){
		let newMaterials = materials.map((material)=>{
			let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100)).toFixed(2);
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(2);
			return{...material,
				task:this.state.tasks.find((task)=>material.task===task.id),
				unit:this.state.units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice
			}
		})
		newMaterials = newMaterials.filter((material)=>
			(this.props.filter.status===null||(material.task.status&& material.task.status.id===this.props.filter.status)) &&
			(this.props.filter.requester===null||(material.task.requester&& material.task.requester.id===this.props.filter.requester)) &&
			(this.props.filter.company===null||material.task.company===this.props.filter.company) &&
			(this.props.filter.assigned===null||(material.task.assigned&& material.task.assigned.id===this.props.filter.assigned)) &&
			(this.props.filter.statusDateFrom===''||material.task.statusChange >= this.props.filter.statusDateFrom) &&
			(this.props.filter.statusDateTo===''||material.task.statusChange <= this.props.filter.statusDateTo)
		);

		let groupedMaterials = newMaterials.filter((item, index)=>{
			return newMaterials.findIndex((item2)=>item2.task.id===item.task.id)===index
		});

		return groupedMaterials.map((item)=>{
			let materials = newMaterials.filter((item2)=>item.task.id===item2.task.id);
			return{
				...item,
				title:materials.map((item)=>item.title),
				unit:materials.map((item)=>item.unit),
				quantity:materials.map((item)=>item.quantity),
				finalUnitPrice:materials.map((item)=>item.finalUnitPrice),
				totalPrice:materials.map((item)=>item.totalPrice),
			}
		});
	}



	render() {
		return (
				<div className="scrollable fit-with-header">
					<div className="commandbar">
						<div className="d-flex flex-row align-items-center p-2">
							<button type="button" className="btn-link waves-effect">
								<i
									className="fa fa-file-pdf"
									/>
								{"  "}Export
								</button>
								<button type="button" className="btn-link waves-effect">
									<i
										className="fas fa-print"
										/>
									{"  "}Print
									</button>
									<button type="button" className="btn-link waves-effect">
										<i
											className="fas fa-sync"
											/>
										{"  "}Aktualizovať ceny podla cenníka
									</button>
						</div>
							<div className="p-10">
								<h2 className="m-b-15">Výkaz prác</h2>
								<div>
									<h3>Služby</h3>
									<hr />
									<div className="m-b-30">
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
													<th>Typ práce</th>
													<th>Hodiny</th>
													<th >	Cena/ks </th>
													<th>Cena spolu</th>
												</tr>
											</thead>
											<tbody>
												{
													this.processWorks(this.state.taskWorks).map((item,index)=>
													<tr key={index}>
														<td>{item.task.id}</td>
														<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/`+item.task.id }} style={{ color: "#1976d2" }}>{item.task.title}</Link></td>
														<td>{item.task.requester?item.task.requester.email:'Nikto'}</td>
														<td>{item.task.assigned?item.task.assigned.email:'Nikto'}</td>
														<td>{item.task.status.title}</td>
														<td>{timestampToString(item.task.statusChange)}</td>
														<td>
															{item.title.map((item2,index)=>
																<p key={index}>{item2}</p>
															)}
														</td>
														<td>
															{item.workType.map((item2,index)=>
																<p key={index}>{item2.title}</p>
															)}
														</td>
														<td>
															{item.quantity.map((item2,index)=>
																<p key={index}>{item2}</p>
															)}
														</td>
														<td>
															{item.finalUnitPrice.map((item2,index)=>
																<p key={index}>{item2}</p>
															)}
														</td>
														<td>
															{item.totalPrice.map((item2,index)=>
																<p key={index}>{item2}</p>
															)}
														</td>
													</tr>
												)
											}
										 </tbody>
									</table>
									<p className="m-0">Spolu zlava bez DPH: {(this.processWorks(this.state.taskWorks).reduce((acc,item)=>{
											return acc+item.totalDiscount.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
										},0)).toFixed(2)} EUR</p>
										<p className="m-0">Spolu cena bez DPH: {(this.processWorks(this.state.taskWorks).reduce((acc,item)=>{
												return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
											},0)).toFixed(2)} EUR</p>
										<p className="m-0">Spolu cena s DPH: {(this.processWorks(this.state.taskWorks).reduce((acc,item)=>{
												return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
											},0)*1.2).toFixed(2)} EUR</p>
								</div>

								<div>
									<h3>Material</h3>
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
												<th>Material</th>
												<th>Mn.</th>
												<th>Jednotka</th>
												<th >Cena/Mn.</th>
												<th>Cena spolu</th>
											</tr>
										</thead>
										<tbody>
											{
												this.processMaterials(this.state.taskMaterials).map((material, index)=>
												<tr key={index}>
													<td>{material.task.id}</td>
													<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/`+material.task.id }} style={{ color: "#1976d2" }}>{material.task.title}</Link></td>
													<td>{material.task.requester?material.task.requester.email:'Nikto'}</td>
													<td>{material.task.assigned?material.task.assigned.email:'Nikto'}</td>
													<td>{material.task.status.title}</td>
													<td>{timestampToString(material.task.statusChange)}</td>
														<td>
															{material.title.map((item2,index)=>
																<p key={index}>{item2}</p>
															)}
														</td>
														<td>
															{material.quantity.map((item2,index)=>
																<p key={index}>{item2}</p>
															)}
														</td>
														<td>
															{material.unit.map((item2,index)=>
																<p key={index}>{item2.title}</p>
															)}
														</td>
														<td>
															{material.finalUnitPrice.map((item2,index)=>
																<p key={index}>{item2}</p>
															)}
														</td>
														<td>
															{material.totalPrice.map((item2,index)=>
																<p key={index}>{item2}</p>
															)}
														</td>
												</tr>
											)}
										</tbody>
									</table>
									<p className="m-0">Spolu cena bez DPH: {(this.processMaterials(this.state.taskMaterials).reduce((acc,item)=>{
											return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
										},0)).toFixed(2)} EUR</p>
									<p className="m-0">Spolu cena s DPH: {(this.processMaterials(this.state.taskMaterials).reduce((acc,item)=>{
											return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
										},0)*1.2).toFixed(2)} EUR</p>
								</div>
							</div>
						</div>
					</div>
				 </div>
			);
		}
	}

	const mapStateToProps = ({ filterReducer }) => {
		const { filter } = filterReducer;
		return { filter };
	};

	export default connect(mapStateToProps, {  })(Reports);
