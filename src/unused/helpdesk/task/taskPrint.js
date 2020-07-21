import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import Materials from '../components/materials/materialsPrint';
import Subtasks from '../components/subtasks/pracePrint';

import {timestampToString} from '../../helperFunctions';

export default class TaskPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="display-inline">
					<ReactToPrint
						trigger={() =>
							<button className="btn btn-link waves-effect">
								<i
									className="fas fa-print icon-M mr-3"
									/>
								Print
							</button>
						}
						content={() => this.componentRef}
					/>

				<div style={{display: "none"}}>
					<TaskInfo ref={el => (this.componentRef = el)} {...this.props}/>
				</div>
			</div>
		)
	}
}

class TaskInfo extends Component {


	render() {
			let taskWorks= this.props.taskWorks.map((work)=>{
				let finalUnitPrice=parseFloat(work.price);
				if(work.extraWork){
					finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
				}
				let totalPrice=(finalUnitPrice*parseFloat(work.quantity)*(1-parseFloat(work.discount)/100)).toFixed(3);
				finalUnitPrice=finalUnitPrice.toFixed(3);
				let workType= this.props.workTypes.find((item)=>item.id===work.workType);
				let assignedTo=work.assignedTo?this.props.users.find((item)=>item.id===work.assignedTo):null

				return {
					...work,
					workType,
					unit:this.props.units.find((unit)=>unit.id===work.unit),
					finalUnitPrice,
					totalPrice,
					assignedTo:assignedTo?assignedTo:null
				}
			});

			let taskMaterials= this.props.taskMaterials.map((material)=>{
				let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100));
				let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(3);
				finalUnitPrice=finalUnitPrice.toFixed(3);
				return {
					...material,
					unit:this.props.units.find((unit)=>unit.id===material.unit),
					finalUnitPrice,
					totalPrice
				}
			});

		return (
				<div className="m-100">
					<div className="d-flex p-2">
						<div className="row flex">
							<h1 className="center-hor text-extra-slim"># {this.props.match.params.taskID}</h1>
							<span className="center-hor">
					    	<input type="text" value={this.props.title} onChange={() => {}} className="task-title-input text-extra-slim hidden-input"/>
							</span>
							<div className="ml-auto center-hor">
								<span className="label label-info" style={{backgroundColor:this.props.status && this.props.status.color?this.props.status.color:'white'}}>{this.props.status?this.props.status.title:'Neznámy status'}</span>
							</div>
						</div>
					</div>

					<hr/>

					<div className="row">
						<div className="col-lg-12 d-flex">
							<p className="text-muted">Created by Branislav Šusta at {this.props.createdAt?(timestampToString(this.props.createdAt)):''}</p>
							<p className="text-muted ml-auto">{this.props.statusChange?('Status changed at ' + timestampToString(this.props.statusChange)):''}</p>
						</div>

					</div>

						<div className="col-lg-12 row">
							<div className="center-hor text-slim row m-r-5">Tagy: </div>
							{this.props.tags.length === 0 &&
								<div className="display-inline m-r-5">
									no tags
								</div>
							}
								{
									this.props.tags.map(tag =>
										<div className="display-inline m-r-5">
											{tag.title + " |"}
										</div>
									)
								}
						</div>
						<div className="col-lg-12 row">
							<div className="center-hor text-slim row m-r-5">Assigned to: </div>
								{this.props.assignedTo.length === 0 &&
									<div className="display-inline m-r-5">
										no people were assigned
									</div>
								}
								{
									this.props.assignedTo.map(at =>
										<div className="display-inline m-r-5">
											{at.email + " |"}
										</div>
									)
								}
						</div>
						<div className="col-lg-12">
							<div className="col-lg-6">
									<div className="row">
										<label className="col-5 col-form-label text-slim">Typ</label>
										<div className="col-7">
											{this.props.type ? this.props.type.label : ""}
										</div>
									</div>
									<div className="row">
										<label className="col-5 col-form-label text-slim">Projekt</label>
										<div className="col-7">
											{this.props.project ? this.props.project.label : ""}
										</div>
									</div>
									<div className="row">
										<label className="col-5 col-form-label text-slim">Zadal</label>
										<div className="col-7">
											{this.props.requester ? this.props.requester.label : ""}
										</div>
									</div>
							</div>

							<div className="col-lg-6">
								<div className="">
									<div className="row">
										<label className="col-5 col-form-label text-slim">Firma</label>
										<div className="col-7">
											{this.props.company ? this.props.company.label : ""}
										</div>
									</div>
									<div className="row">
										<label className="col-5 col-form-label text-slim">Deadline</label>
										<div className="col-7">
											{this.props.deadline ? this.props.deadline : "no deadline"}
										</div>
									</div>

								</div>
							</div>
						</div>


					{false && <div className="form-group m-b-0 row">
						<label className="col-5 col-form-label text-slim">Mimo pracovných hodín</label>
						<div className="col-7">
							{this.props.overtime}
						</div>
					</div>}
					{false && <div className="row">
						<label className="col-5 col-form-label text-slim">Pripomienka</label>
						<div className="col-7">
							{this.props.reminder}
						</div>
					</div>}


					<label className="m-t-5  text-slim">Popis</label>
					<textarea className="form-control b-r-0" placeholder="Enter task description" value={this.props.description} onChange={() => {}} />

						<Subtasks
							taskAssigned={this.props.assignedTo}
							subtasks={taskWorks}
							workTypes={this.props.workTypes}
							company={this.props.company}
							match={this.props.match}
							/>

						<Materials
							dataOnly={true}
							materials={taskMaterials}
							submitMaterial={() => {}}
							updateMaterial={() => {}}
							removeMaterial={() => {}}
							units={this.props.units}
							defaultUnit={this.props.defaultUnit}
							company={this.props.company}
							match={this.props.match}
						/>

				</div>
		);
	}
}
