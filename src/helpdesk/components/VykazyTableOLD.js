import React from 'react';
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";

import classnames from "classnames";
import { Nav, NavItem, NavLink} from 'reactstrap';
import Select from 'react-select';
import {selectStyle, invisibleSelectStyle} from 'configs/components/select';
import {sameStringForms} from '../../helperFunctions';
import Checkbox from '../../components/checkbox';

export default class Rozpocet extends React.Component {
	constructor(props){
		super(props);
		const newMaterialMargin= this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMargin : 0;
		const newMaterialUnit= this.props.units.find((item)=>item.id===this.props.defaultUnit);
		const newCustomItemUnit= this.props.units.find((item)=>item.id===this.props.defaultUnit);

		this.state={
			toggleTab: "1",

			//prace
			showAddSubtask:false,

			editedSubtaskTitle: "",
			editedSubtaskType:null,
			editedSubtaskQuantity: 0,
			editedSubtaskDiscount:0,
			focusedSubtask: null,
			selectedIDs:[],

			newSubtaskTitle:'',
			newSubtaskType:this.props.defaultType,
			newSubtaskAssigned:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
			newSubtaskQuantity:0,
			newSubtaskDiscount:0,

			//trips
			showAddTrip:false,

			focusedTrip:null,
			editedTripQuantity:0,
			editedTripDiscount:0,

			newTripType:this.props.tripTypes.length>0?this.props.tripTypes[0]:null,
			newTripAssignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
			newTripQuantity:1,
			newTripDiscount:0,

			//Materials
			showAddMaterial: false,
			marginChanged:false,
			focusedMaterial: null,

			editedMaterialTitle: "",
			editedMaterialQuantity: 0,
			editedMaterialUnit:null,
			editedMaterialMargin:null,
			editedMaterialPrice:null,

			newMaterialTitle:'',
			newMaterialQuantity:1,
			newMaterialUnit:newMaterialUnit?newMaterialUnit:null,
			newMaterialMargin,
			newMaterialPrice:0,

			// Custom items
			showAddCustomItem: false,
			focusedCustomItem: null,

			editedCustomItemTitle: "",
			editedCustomItemQuantity: 0,
			editedCustomItemUnit:null,
			editedCustomItemPrice:null,

			newCustomItemTitle:'',
			newCustomItemQuantity:1,
			newCustomItemUnit:newCustomItemUnit?newCustomItemUnit:null,
			newCustomItemPrice:0,
		}
		this.getCreationError.bind(this);
		this.onFocusWorkTrip.bind(this);
		this.onFocusSubtask.bind(this);
		this.onFocusMaterial.bind(this);
		this.onFocusCustomItem.bind(this);
		this.getPrice.bind(this);
		this.getTotalPrice.bind(this);
		this.getTotalDiscountedPrice.bind(this);
		this.getDPH.bind(this);
	}

	componentWillReceiveProps(props){
		if(this.props.taskID!==props.taskID){
			let newMaterialUnit= props.units[0];
			if(props.defaultUnit!==null){
				newMaterialUnit=props.units.find((item)=>item.id===props.defaultUnit)
			}
			let newCustomItemUnit= props.units[0];
			if(props.defaultUnit!==null){
				newCustomItemUnit=props.units.find((item)=>item.id===props.defaultUnit)
			}
			this.setState({
				toggleTab: props.showSubtasks ? '0' : '1',

				focusedSubtask:null,
				showAddSubtask:false,
				newSubtaskTitle:'',
				newSubtaskType:props.defaultType,
				newSubtaskQuantity:0,
				newSubtaskDiscount:0,
				newSubtaskAssigned:props.taskAssigned.length>0?props.taskAssigned[0]:null,

				focusedTrip:null,
				showAddTrip:false,
				newTripType:props.tripTypes.length>0?props.tripTypes[0]:null,
				newTripAssignedTo:props.taskAssigned.length>0?props.taskAssigned[0]:null,
				newTripQuantity:1,
				newTripDiscount:0,

				newMaterialTitle:'',
				newMaterialQuantity:1,
				newMaterialUnit,
				newMaterialMargin: props.company && props.company.pricelist ? props.company.pricelist.materialMargin : 0,
				newMaterialPrice:0,
				marginChanged:false,

				newCustomItemTitle:'',
				newCustomItemQuantity:1,
				newCustomItemUnit,
				newCustomItemPrice:0,
			})
		}else if(!sameStringForms(this.props.defaultType,props.defaultType)){
			this.setState({
				newSubtaskType:props.defaultType,
				toggleTab: props.showSubtasks ? '0' : '1',
			})
		}

		if(!sameStringForms(this.props.taskAssigned,props.taskAssigned)){
			if(!props.taskAssigned.some((item)=>item.id===(this.state.newSubtaskAssigned?this.state.newSubtaskAssigned.id:null))){
				if(props.taskAssigned.length>0){
					this.setState({newSubtaskAssigned:props.taskAssigned[0],newTripAssignedTo:props.taskAssigned[0] });
				}else{
					this.setState({newSubtaskAssigned:null, newTripAssignedTo:null});
				}
			}
		}

		if((this.props.company===null && props.company!==null) ||
		(this.props.company && props.company && props.company.id!==this.props.company.id)){
			this.setState({newMaterialMargin: (props.company && props.company.pricelist ? props.company.pricelist.materialMargin : 0)});
		}

		if(this.props.units && props.units && this.props.units.length!==props.units.length){
			let newUnit= props.units[0];
			if(props.defaultUnit!==null){
				newUnit=props.units.find((item)=>item.id===props.defaultUnit)
			}
			this.setState({newMaterialUnit: newUnit, newCustomItemUnit: newUnit});
		}

		if (this.props.showSubtasks !== props.showSubtasks){
			this.setState({toggleTab: props.showSubtasks ? '0' : '1'});
		}
	}

	getCreationError(){
		let noType = this.state.newSubtaskType===null;
		let noAssigned = this.state.newSubtaskAssigned===null;
		let noCompany = this.props.company===null;
		if(!noType && !noAssigned && !noCompany){
			return ''
		}
		if(noType && noAssigned && noCompany){
			return 'First assign the task to someone, pick task type and company!';
		}
		if(!noType && noAssigned && noCompany){
			return 'First assign the task to someone and pick company!';
		}
		if(!noType && !noAssigned && noCompany){
			return 'First pick company!';
		}
		if(!noType && noAssigned && !noCompany){
			return 'First assign the task to someone!';
		}
		if(noType && !noAssigned && noCompany){
			return 'First pick task type and company!';
		}
		if(noType && !noAssigned && !noCompany){
			return 'First pick task type!';
		}
		if(noType && noAssigned && !noCompany){
			return 'First assign the task to someone and pick task type!';
		}
	}

	onFocusWorkTrip(trip){
		this.setState({
			editedTripQuantity:trip.quantity,
			editedTripDiscount:trip.discount,
			focusedTrip:trip.id
		})
	}

	onFocusSubtask(subtask){
		this.setState({
			editedSubtaskTitle: subtask.title,
			editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
			editedSubtaskType: subtask.type,
			editedSubtaskDiscount: subtask.discount,
			focusedSubtask: subtask.id
		});
	}

	onFocusMaterial(material){
		this.setState({
			editedMaterialTitle:material.title,
			editedMaterialQuantity:material.quantity,
			editedMaterialUnit:material.unit,
			editedMaterialMargin:material.margin,
			editedMaterialPrice:material.price,
			focusedMaterial: material.id
		});
	}

	onFocusCustomItem(customItem){
		this.setState({
			editedCustomItemTitle:customItem.title,
			editedCustomItemQuantity:customItem.quantity,
			editedCustomItemUnit:customItem.unit,
			editedCustomItemPrice:customItem.price,
			focusedCustomItem: customItem.id
		});
	}

	getPrice(type){
		if(!type){
			return NaN;
		}
		let price = (this.props.company.pricelist ? type.prices.find((price)=>price.pricelist===this.props.company.pricelist.id) : undefined);
		if(price === undefined){
			price = NaN;
		}else{
			price = price.price;
		}
		return parseFloat(parseFloat(price).toFixed(2));
	}

	getTotalPrice(item){
		return parseFloat(this.getPrice(item.type).toFixed(2))
	}

	getTotalDiscountedPrice(item){
		return parseFloat(parseFloat(this.getTotalPrice(item)*(100-parseInt(item.discount))/100).toFixed(2))
	}

	getDiscountedMaterialPrice(material){
		return parseFloat( material.price * ( 1 + material.margin / 100 ))
	}

	getBasicMaterialPrice(material){
		return parseFloat( material.price / ( 1 + material.margin / 100 ))
	}

	getDPH(){
		let dph = 20;
		if(this.props.company && this.props.company.dph > 0){
			dph = this.props.company.dph;
		}
		return (100+dph)/100;
	}

	render() {
		let sortedWorks = this.props.subtasks.sort((work1,work2) => work1.order - work2.order);
		let sortedTrips = this.props.workTrips.sort((trip1,trip2) => trip1.order - trip2.order);
		let sortedMaterials = this.props.materials.sort((material1,material2) => material1.order - material2.order);
		let sortedCustomItems = this.props.customItems.sort((customItem1,customItem2) => customItem1.order - customItem2.order);
		return (
			<div className="vykazyTable">
				<div className="" style={{color: "#FF4500", height: "20px"}}>
					{this.getCreationError()}
				</div>
				<table className="table">
					<thead>
						<tr>
							<th colSpan={this.props.showColumns.includes(0) ? 2 : 1}>
								<Nav tabs className="b-0 m-0">
									{ this.props.showSubtasks &&
										<NavItem>
										<NavLink
											className={classnames({ active: this.state.toggleTab === '0'}, "clickable", "")}
											onClick={() => { this.setState({toggleTab:'0'}); }}
											>
											Subtasks
										</NavLink>
									</NavItem>
									}
									{ !this.props.showSubtasks &&
										<NavItem>
										<NavLink
											className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
											onClick={() => { this.setState({toggleTab:'1'}); }}
											>
											Výkaz
										</NavLink>
									</NavItem>
									}
									{ !this.props.showSubtasks &&
									<NavItem>
									<NavLink>
										|
									</NavLink>
									</NavItem>
									}
									{ !this.props.showSubtasks &&
									<NavItem>
										<NavLink
											className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
											onClick={() => { this.setState({toggleTab:'2'}); }}
											>
											Rozpočet
										</NavLink>
									</NavItem>
									}
								</Nav>
							</th>
							{this.props.showColumns.includes(1) && this.state.toggleTab !== "0" && <th width="190">Rieši</th> }
							{this.props.showColumns.includes(2) && this.state.toggleTab !== "0" && <th width="100">Typ</th> }
							{this.props.showColumns.includes(3) && <th width="50" className="t-a-r">Mn.</th> }
							{this.props.showColumns.includes(4) && this.state.toggleTab === "2" && <th width="70" className="table-highlight-background t-a-r">Cenník/Nákup</th> }
							{this.props.showColumns.includes(5) && this.state.toggleTab === "2" && <th width="70" className="table-highlight-background t-a-r">Zľava/Marža</th> }
							{this.props.showColumns.includes(6) && this.state.toggleTab !== "0" && <th width="70" className="t-a-r">Cena</th> }
							{this.props.showColumns.includes(7) && <th width="120" className="t-a-c">Akcie</th> }
						</tr>
					</thead>
					<tbody>
						{/* Works */}
						{ sortedWorks.map((subtask, index) =>
							<tr key={subtask.id}>
								{/*Checkbox done*/}
								{this.props.showColumns.includes(0) &&
									<td width="10">
										<Checkbox
											className="m-t-5"
											disabled= { this.props.disabled }
											value={ subtask.done }
											onChange={()=>{
												this.props.updateSubtask(subtask.id,{done:!subtask.done})
											}}
											/>
									</td>
								}
								{/*Name*/}
								{this.props.showColumns.includes(1) &&
									<td className="">
										<input
											disabled={this.props.disabled}
											className="form-control hidden-input"
											value={
												subtask.id === this.state.focusedSubtask ?
												this.state.editedSubtaskTitle :
												subtask.title
											}
											onBlur={() => {
												this.props.updateSubtask(subtask.id,{title:this.state.editedSubtaskTitle})
												this.setState({ focusedSubtask: null });
											}}
											onFocus={() => {
												this.onFocusSubtask(subtask);
											}}
											onChange={e =>{
												this.setState({ editedSubtaskTitle: e.target.value })
											}}
											/>
									</td>
								}
								{/*Riesi*/}
								{this.props.showColumns.includes(2) && this.state.toggleTab !== "0" &&
									<td>
										<Select
											isDisabled={this.props.disabled}
											value={subtask.assignedTo}
											onChange={(assignedTo)=>{
												this.props.updateSubtask(subtask.id,{assignedTo:assignedTo.id})
											}}
											options={this.props.taskAssigned}
											styles={invisibleSelectStyle}
											/>
									</td>
								}
								{/*Type*/}
								{this.props.showColumns.includes(3) && this.state.toggleTab !== "0" &&
									<td>
										<Select
											isDisabled={this.props.disabled}
											value={subtask.type}
											onChange={(type)=>{
												this.props.updateSubtask(subtask.id,{type:type.id})
											}}
											options={this.props.workTypes}
											styles={invisibleSelectStyle}
											/>
									</td>
								}
								{/*Mnozstvo*/}
								{this.props.showColumns.includes(4) &&
									<td>
										<input
											disabled={this.props.disabled}
											type="text"
											pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
											className="form-control hidden-input h-30"
											value={
												subtask.id === this.state.focusedSubtask
												? this.state.editedSubtaskQuantity.toString()
												: subtask.quantity.toString()
											}
											onBlur={() => {
												this.props.updateSubtask(subtask.id,{quantity:isNaN(parseFloat(this.state.editedSubtaskQuantity))?0:parseFloat(this.state.editedSubtaskQuantity)})
												this.setState({ focusedSubtask: null });
											}}
											onFocus={() => {
												this.onFocusSubtask(subtask);
											}}
											onChange={e =>{
												this.setState({ editedSubtaskQuantity: e.target.value.replace(',', '.') })
											}}
											/>
									</td>
								}
								{/*Cennik/Nakup*/}
								{this.props.showColumns.includes(5) && this.state.toggleTab === "2" &&
									<td className="table-highlight-background p-l-8">
										<span className="text" style={{float: "right"}}>
											<div style={{float: "right"}} className="p-t-8 p-r-8">
												€
											</div>
											<input
												disabled={true}
												type="number"
												style={{display: "inline", width: "70%", float: "right"}}
												className="form-control hidden-input h-30"
												value={this.getPrice(subtask.type)}
												/>
										</span>
									</td>
								}
								{/*Zlava/Marža*/}
								{this.props.showColumns.includes(6) && this.state.toggleTab === "2" &&
									<td className="table-highlight-background">
										<span className="text p-l-8">
											-
											<input
												disabled={this.props.disabled}
												style={{display: "inline", width: "60%"}}
												type="number"
												className="form-control hidden-input h-30"
												value={ parseInt(
													subtask.id === this.state.focusedSubtask ?
													this.state.editedSubtaskDiscount :
													subtask.discount
												)}
												onBlur={() => {
													this.props.updateSubtask(subtask.id,{discount:isNaN(parseInt(this.state.editedSubtaskDiscount))?0:parseInt(this.state.editedSubtaskDiscount)})
													this.setState({ focusedSubtask: null });
												}}
												onFocus={() => {
													this.onFocusSubtask(subtask);
												}}
												onChange={e =>{
													this.setState({ editedSubtaskDiscount: e.target.value })
												}}
												/>
											%
										</span>
									</td>
								}
								{/*Cena*/}
								{this.props.showColumns.includes(7) && this.state.toggleTab !== "0" &&
									<td className="p-t-15 p-l-8 p-r-8 t-a-r font-14">
										{
											isNaN(this.getTotalDiscountedPrice(subtask)) ?
											'No price' :
											this.getTotalDiscountedPrice(subtask) + " €"
										}
									</td>
								}
								{/*Toolbar*/}
								{this.props.showColumns.includes(8) &&
									<td className="t-a-r">	{/* //akcie*/}
										<button
											className="btn waves-effect"
											disabled={ this.props.disabled || index === 0 }
											onClick={()=>{
												this.props.updateSubtasks([
													//update below
													{ id: sortedWorks[ index - 1 ].id, newData: { order: index } },
													//update current
													{ id: subtask.id, newData: { order: index - 1 } }
												]);
											}}
											>
											<i className="fa fa-arrow-up"  />
										</button>
										<button
											className="btn waves-effect"
											disabled={ this.props.disabled || index === sortedWorks.length - 1 }
											onClick={()=>{
												this.props.updateSubtasks([
													//update below
													{ id: sortedWorks[ index + 1 ].id, newData: { order: index } },
													//update current
													{ id: subtask.id, newData: { order: index + 1 } }
												]);
											}}
											>
											<i className="fa fa-arrow-down"  />
										</button>
										<button className="btn waves-effect" disabled={this.props.disabled}
											onClick={()=>{
												if(window.confirm('Are you sure?')){
													this.props.removeSubtask(subtask.id);
												}
											}}>
											<i className="fa fa-times" />
										</button>
									</td>
								}
							</tr>
						)}
						{/* Trips */}
						{ sortedTrips.map((trip, index) => {
								if (this.state.toggleTab !== "0"){
									return (<tr key={trip.id}>
										{/*Checkbox done*/}
										{this.props.showColumns.includes(0) &&
											<td width="10">
												<Checkbox
													className="m-t-5"
													disabled= { this.props.disabled }
													value={ trip.done }
													onChange={()=>{
														this.props.updateTrip(trip.id,{done:!trip.done})
													}}
													/>
											</td>
										}
										{/*Name*/}
										{this.props.showColumns.includes(1) &&
											<td>
												<Select
													isDisabled={this.props.disabled}
													value={trip.type}
													onChange={(type)=>{
														this.props.updateTrip(trip.id,{type:type.id})
													}}
													options={this.props.tripTypes}
													styles={invisibleSelectStyle}
													/>
											</td>
										}
										{/*Riesi*/}
										{this.props.showColumns.includes(2) &&
											<td>
												<Select
													isDisabled={this.props.disabled}
													value={trip.assignedTo}
													onChange={(assignedTo)=>{
														this.props.updateTrip(trip.id,{assignedTo:assignedTo.id})
													}}
													options={this.props.taskAssigned}
													styles={invisibleSelectStyle}
													/>
											</td>
										}
										{/*Type*/}
										{this.props.showColumns.includes(3) &&
											<td className="p-t-15 p-l-8">Výjazd</td>
										}
										{/*Mnozstvo*/}
										{this.props.showColumns.includes(4) &&
											<td>
												<input
													disabled={this.props.disabled}
													type="text"
													pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
													className="form-control hidden-input h-30"
													value={
														trip.id === this.state.focusedTrip
														? this.state.editedTripQuantity.toString()
														: trip.quantity.toString()
													}
													onBlur={() => {
														this.props.updateTrip(trip.id,{quantity:isNaN(parseFloat(this.state.editedTripQuantity))?0:parseFloat(this.state.editedTripQuantity)})
														this.setState({ focusedTrip: null });
													}}
													onFocus={() => {
														this.onFocusWorkTrip(trip);
													}}
													onChange={e =>{
														this.setState({ editedTripQuantity: e.target.value.replace(',', '.') })
													}}
													/>
											</td>
										}
										{/*Cennik/Nakup*/}
										{this.props.showColumns.includes(5) && this.state.toggleTab === "2" &&
											<td className="table-highlight-background p-l-8">
												<span className="text" style={{float: "right"}}>
													<div style={{float: "right"}} className="p-t-8 p-r-8">
														€
													</div>
													<input
														disabled={true}
														type="number"
														style={{display: "inline", width: "70%", float: "right"}}
														className="form-control hidden-input h-30"
														value={this.getPrice(trip.type)}
														/>
												</span>
											</td>
										}
										{/*Zlava/Marža*/}
										{this.props.showColumns.includes(6) && this.state.toggleTab === "2" &&
											<td className="table-highlight-background">
												<span className="text p-l-8">
													-
													<input
														disabled={this.props.disabled}
														type="number"
														style={{display: "inline", width: "60%"}}
														className="form-control hidden-input h-30"
														value={
															trip.id === this.state.focusedTrip ?
															this.state.editedTripDiscount :
															trip.discount
														}
														onBlur={() => {
															this.props.updateTrip(trip.id,{discount:isNaN(parseInt(this.state.editedTripDiscount))?0:parseInt(this.state.editedTripDiscount)})
															this.setState({ focusedTrip: null });
														}}
														onFocus={() => {
															this.onFocusWorkTrip(trip);
														}}
														onChange={e =>{
															this.setState({ editedTripDiscount: e.target.value })
														}}
														/>
													%
												</span>
											</td>
										}
										{/*Cena*/}
										{this.props.showColumns.includes(7) &&
											<td className="p-t-15 p-l-8 p-r-8 t-a-r font-14">
												{isNaN(this.getTotalDiscountedPrice(trip)) ?
													'No price' :
													this.getTotalDiscountedPrice(trip) + " €"
												}
											</td>
										}
										{/*Toolbar*/}
										{this.props.showColumns.includes(8) &&
											<td className="t-a-r">
												<button
													className="btn waves-effect"
													disabled={ this.props.disabled || index === 0 }
													onClick={()=>{
														this.props.updateTrips([
															//update below
															{ id: sortedTrips[ index - 1 ].id, newData: { order: index } },
															//update current
															{ id: trip.id, newData: { order: index - 1 } }
														]);
													}}
													>
													<i className="fa fa-arrow-up"  />
												</button>
												<button
													className="btn waves-effect"
													disabled={ this.props.disabled || index === sortedTrips.length - 1 }
													onClick={()=>{
														this.props.updateTrips([
															//update below
															{ id: sortedTrips[ index + 1 ].id, newData: { order: index } },
															//update current
															{ id: trip.id, newData: { order: index + 1 } }
														]);
													}}
													>
													<i className="fa fa-arrow-down"  />
												</button>
												<button
													className="btn waves-effect"
													disabled={this.props.disabled}
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeTrip(trip.id);
														}
													}}
													>
													<i className="fa fa-times" />
												</button>
											</td>
										}
									</tr>)
								}
							}
						)}
						{/* Materials */}
						{ sortedMaterials.map((material,index) => {
								if (this.state.toggleTab !== "0"){
									return (<tr key={material.id}>
										{/*Checkbox done*/}
										{this.props.showColumns.includes(0) &&
											<td width="10">
												<Checkbox
													className="m-t-5"
													disabled= { this.props.disabled }
													value={ material.done }
													onChange={()=>{
														this.props.updateMaterial(material.id,{done:!material.done})
													}}
													/>
											</td>
										}
										{/*Name*/}
										{this.props.showColumns.includes(1) &&
											<td className="">
												<input
													disabled={this.props.disabled}
													className="form-control hidden-input"
													value={
														material.id === this.state.focusedMaterial
														? this.state.editedMaterialTitle
														: material.title
													}
													onBlur={() => {
														this.props.updateMaterial(material.id,{title:this.state.editedMaterialTitle})
														this.setState({ focusedMaterial: null });
													}}
													onFocus={() => this.onFocusMaterial(material)}
													onChange={e =>{
														this.setState({ editedMaterialTitle: e.target.value })
													}}
													/>
											</td>
										}
										{/*Riesi*/}
										{this.props.showColumns.includes(2) &&
											<td></td>
										}
										{/*Type*/}
										{this.props.showColumns.includes(3) &&
											<td className="p-l-8 p-t-15">
												Materiál
											</td>
										}
										{/*Mnozstvo*/}
										{this.props.showColumns.includes(4) &&
											<td>
												<input
													disabled={this.props.disabled}
													type="text"
													pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
													className="form-control hidden-input h-30"
													value={
														material.id === this.state.focusedMaterial
														? this.state.editedMaterialQuantity.toString()
														: material.quantity.toString()
													}
													onBlur={() => {
														//submit
														this.props.updateMaterial(material.id,{quantity: parseFloat(this.state.editedMaterialQuantity)})
														this.setState({ focusedMaterial: null });
													}}
													onFocus={() => this.onFocusMaterial(material)}
													onChange={e =>{
														this.setState({ editedMaterialQuantity: e.target.value.replace(',', '.') })
													}}
													/>
											</td>
										}
										{/*Cennik/Nakup*/}
										{this.props.showColumns.includes(5) && this.state.toggleTab === "2" &&
											<td className="table-highlight-background p-l-8">
												<span className="text" style={{float: "right"}}>
													<div style={{float: "right"}} className="p-t-8 p-r-8">
														€
													</div>
													<input
														disabled={this.props.disabled}
														type="number"
														style={{display: "inline", width: "70%", float: "right"}}
														className="form-control hidden-input h-30"
														value={
															material.id === this.state.focusedMaterial
															? this.state.editedMaterialPrice
															: material.price
														}
														onBlur={() => {
															//submit
															this.props.updateMaterial(material.id,{price:this.state.editedMaterialPrice})
															this.setState({ focusedMaterial: null });
														}}
														onFocus={() => this.onFocusMaterial(material)}
														onChange={e =>{
															this.setState({ editedMaterialPrice: e.target.value })}
														}
														/>
												</span>
											</td>
										}
										{/*Zlava/Marža*/}
										{this.props.showColumns.includes(6) && this.state.toggleTab === "2" &&
											<td className="table-highlight-background p-l-8"> {/* //zlava/marza*/}
												<span className="text">
													+
													<input
														disabled={this.props.disabled}
														type="number"
														style={{display: "inline", width: "60%"}}
														className="form-control hidden-input h-30"
														value={parseInt(
															material.id === this.state.focusedMaterial ?
															this.state.editedMaterialMargin :
															material.margin
														)}
														onBlur={() => {
															this.props.updateMaterial(material.id,{margin:this.state.editedMaterialMargin})
															this.setState({ focusedMaterial: null });
														}}
														onFocus={() => this.onFocusMaterial(material)}
														onChange={e =>{
															this.setState({ editedMaterialMargin: e.target.value })
														}}
														/>
													%
												</span>
											</td>
										}
										{/*Cena*/}
										{this.props.showColumns.includes(7) &&
											<td className="p-l-8 p-t-15 p-r-8 t-a-r font-14">
												{
													material.id === this.state.focusedMaterial ?
													(  this.getDiscountedMaterialPrice({price:this.state.editedMaterialPrice, margin:this.state.editedMaterialMargin}).toFixed(2) + " €" ) :
													( this.getDiscountedMaterialPrice(material) ).toFixed(2) + " €"
												}
											</td>
										}
										{/*Toolbar*/}
										{this.props.showColumns.includes(8) &&
											<td className="t-a-r">
												<button className="btn waves-effect" disabled={this.props.disabled}>
													<i
														className="fa fa-sync-alt"
														onClick={()=>{
															if(parseInt(material.price) <= 50){
																this.props.updateMaterial(material.id,{margin:(this.props.company && this.props.company.pricelist)?parseInt(this.props.company.pricelist.materialMargin):material.margin})
															}else{
																this.props.updateMaterial(material.id,{margin:(this.props.company && this.props.company.pricelist)?parseInt(this.props.company.pricelist.materialMarginExtra):material.margin})
															}
														}}
														/>
												</button>
												<button
													className="btn waves-effect"
													disabled={ this.props.disabled || index === 0 }
													onClick={()=>{
														this.props.updateMaterials([
															//update below
															{ id: sortedMaterials[ index - 1 ].id, newData: { order: index } },
															//update current
															{ id: material.id, newData: { order: index - 1 } }
														]);
													}}
													>
													<i className="fa fa-arrow-up"  />
												</button>
												<button
													className="btn waves-effect"
													disabled={ this.props.disabled || index === sortedMaterials.length - 1 }
													onClick={()=>{
														this.props.updateMaterials([
															//update below
															{ id: sortedMaterials[ index + 1 ].id, newData: { order: index } },
															//update current
															{ id: material.id, newData: { order: index + 1 } }
														]);
													}}
													>
													<i className="fa fa-arrow-down"  />
												</button>
												<button className="btn waves-effect"
													disabled={this.props.disabled}
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeMaterial(material.id);
														}
													}}>
													<i className="fa fa-times" />
												</button>
											</td>
										}
									</tr>)
								}
							}
						)}
						{/* Custom Items */}
						{ sortedCustomItems.map((customItem, index)=> {
								if (this.state.toggleTab !== "0"){
									return (<tr key={customItem.id}>
										{/*Checkbox done*/}
										{this.props.showColumns.includes(0) &&
											<td width="10">
												<Checkbox
													className="m-t-5"
													disabled= { this.props.disabled }
													value={ customItem.done }
													onChange={()=>{
														this.props.updateCustomItem(customItem.id,{done:!customItem.done})
													}}
													/>
											</td>
										}
										{/*Name*/}
										{this.props.showColumns.includes(1) &&
											<td className="">
												<input
													disabled={this.props.disabled}
													className="form-control hidden-input"
													value={
														customItem.id === this.state.focusedCustomItem
														? this.state.editedCustomItemTitle
														: customItem.title
													}
													onBlur={() => {
														this.props.updateCustomItem(customItem.id,{title:this.state.editedCustomItemTitle})
														this.setState({ focusedCustomItem: null });
													}}
													onFocus={() => this.onFocusCustomItem(customItem)}
													onChange={e =>{
														this.setState({ editedCustomItemTitle: e.target.value })
													}}
													/>
											</td>
										}
										{/*Riesi*/}
										{this.props.showColumns.includes(2) &&
											<td></td>
										}
										{/*Type*/}
										{this.props.showColumns.includes(3) &&
											<td className="p-l-8 p-t-15">
												Voľná položka
											</td>
										}
										{/*Mnozstvo*/}
										{this.props.showColumns.includes(4) &&
											<td>
												<input
													disabled={this.props.disabled}
													type="text"
													pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
													className="form-control hidden-input h-30"
													value={
														customItem.id === this.state.focusedCustomItem
														? this.state.editedCustomItemQuantity.toString()
														: customItem.quantity.toString()
													}
													onBlur={() => {
														//submit
														this.props.updateCustomItem(customItem.id,{quantity: parseFloat(this.state.editedCustomItemQuantity)})
														this.setState({ focusedCustomItem: null });
													}}
													onFocus={() => this.onFocusCustomItem(customItem)}
													onChange={e =>{
														this.setState({ editedCustomItemQuantity: e.target.value.replace(',', '.') })
													}}
													/>
											</td>
										}
										{/*Cennik/Nakup*/}
										{this.props.showColumns.includes(5) && this.state.toggleTab === "2" &&
											<td className="table-highlight-background p-l-8">
											</td>
										}
										{/*Zlava/Marža*/}
										{this.props.showColumns.includes(6) && this.state.toggleTab === "2" &&
											<td className="table-highlight-background p-l-8">
											</td>
										}
										{/*Cena*/}
										{this.props.showColumns.includes(7) &&
											<td className="p-l-8">
												<span className="text" style={{float: "right"}}>
													<div style={{float: "right"}} className="p-t-8 p-r-8">
														€
													</div>
													<input
														disabled={this.props.disabled}
														type="number"
														style={{display: "inline", width: "70%", float: "right"}}
														className="form-control hidden-input h-30"
														value={
															customItem.id === this.state.focusedCustomItem
															? this.state.editedCustomItemPrice
															: customItem.price
														}
														onBlur={() => {
															this.props.updateCustomItem(customItem.id,{price:this.state.editedCustomItemPrice})
															this.setState({ focusedCustomItem: null });
														}}
														onFocus={() => this.onFocusCustomItem(customItem)}
														onChange={e =>{
															this.setState({ editedCustomItemPrice: e.target.value })}
														}
														/>
												</span>
											</td>
										}
										{/*Toolbar*/}
										{this.props.showColumns.includes(8) &&
											<td className="t-a-r">
												<button
													className="btn waves-effect"
													disabled={ this.props.disabled || index === 0 }
													onClick={()=>{
														this.props.updateCustomItems([
															//update below
															{ id: sortedCustomItems[ index - 1 ].id, newData: { order: index } },
															//update current
															{ id: customItem.id, newData: { order: index - 1 } }
														]);
													}}
													>
													<i className="fa fa-arrow-up"  />
												</button>
												<button
													className="btn waves-effect"
													disabled={ this.props.disabled || index === sortedCustomItems.length - 1 }
													onClick={()=>{
														this.props.updateCustomItems([
															//update below
															{ id: sortedCustomItems[ index + 1 ].id, newData: { order: index } },
															//update current
															{ id: customItem.id, newData: { order: index + 1 } }
														]);
													}}
													>
													<i className="fa fa-arrow-down"  />
												</button>
												<button className="btn waves-effect"
													disabled={this.props.disabled}
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeCustomItem(customItem.id);
														}
													}}>
													<i className="fa fa-times" />
												</button>
											</td>
										}
									</tr>)
								}
							}
						)}

						{/* ADD Work */}
						{this.state.showAddSubtask && !this.props.disabled &&
							<tr>
								{/*Name*/}
								{this.props.showColumns.includes(1) &&
									<td colSpan={2} className="p-r-8">
										<input
											disabled={this.props.disabled}
											type="text"
											className="form-control"
											id="inlineFormInput"
											placeholder=""
											value={this.state.newSubtaskTitle}
											onKeyPress={(e)=>{
												if(
													e.key === 'Enter' &&
													this.state.newSubtaskType !== null &&
													this.state.newSubtaskAssigned !== null &&
													this.state.newSubtaskTitle.length > 0
												){
													let body={
														done:false,
														title:this.state.newSubtaskTitle,
														type: this.state.newSubtaskType.id,
														quantity:this.state.newSubtaskQuantity!==''?parseInt(this.state.newSubtaskQuantity):0,
														discount:this.state.newSubtaskDiscount!==''?parseInt(this.state.newSubtaskDiscount):0,
														assignedTo:this.state.newSubtaskAssigned?this.state.newSubtaskAssigned.id:null,
														order:this.props.subtasks.length,
													}
													this.setState({
														newSubtaskTitle:'',
														newSubtaskQuantity:0,
														newSubtaskDiscount:0,
														assignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
														showAddSubtask: false,
													});
													this.props.submitService(body);
												}
											}}
											onChange={(e)=>this.setState({newSubtaskTitle:e.target.value})}
											/>
									</td>
								}
								{/*Riesi*/}
								{this.props.showColumns.includes(2) && this.state.toggleTab !== "0" &&
									<td className="p-l-8">
										<Select
											isDisabled={this.props.disabled}
											value={this.state.newSubtaskAssigned}
											onChange={(newSubtaskAssigned)=>{
												this.setState({newSubtaskAssigned})
											}}
											options={this.props.taskAssigned}
											styles={selectStyle}
											/>
									</td>
								}
								{/*Type*/}
								{this.props.showColumns.includes(3) && this.state.toggleTab !== "0" &&
									<td className="p-l-8">{/*typ*/}
										<Select
											isDisabled={this.props.disabled}
											value={this.state.newSubtaskType}
											options={this.props.workTypes}
											onChange={(type)=>{
												this.setState({newSubtaskType:type})
											}}
											styles={selectStyle}
											/>
									</td>
								}
								{/*Mnozstvo*/}
								{this.props.showColumns.includes(4) &&
									<td className="p-l-8 p-r-8">
										<input
											disabled={this.props.disabled}
											type="text"
											pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
											value={this.state.newSubtaskQuantity.toString()}
											onChange={(e)=>this.setState({newSubtaskQuantity:e.target.value.replace(',', '.')})}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
								}
								{/*Cennik/Nakup*/}
								{this.props.showColumns.includes(5) && this.state.toggleTab === "2" &&
									<td></td>
								}
								{/*Zlava/Marža*/}
								{this.props.showColumns.includes(6) && this.state.toggleTab === "2" &&
									<td className="table-highlight-background p-r-8 p-l-8">
										<input
											disabled={this.props.disabled}
											type="number"
											value={this.state.newSubtaskDiscount}
											onChange={(e)=>this.setState({newSubtaskDiscount:e.target.value})}
											className="form-control input h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
								}
								{/*Cena*/}
								{this.props.showColumns.includes(7) &&
									<td className="p-t-15 p-l-8 p-r-8 t-a-r font-14">
										{
											isNaN(this.getTotalDiscountedPrice({discount: this.state.newSubtaskDiscount, type: this.state.newSubtaskType, quantity: this.state.newSubtaskQuantity }))
											?'No price'
											: (this.getTotalDiscountedPrice({discount: this.state.newSubtaskDiscount, type: this.state.newSubtaskType, quantity: this.state.newSubtaskQuantity })  ).toFixed(2)  + " €"
										}
									</td>
								}
								{/*Toolbar*/}
								{this.props.showColumns.includes(8) &&
									<td className="t-a-r">
										<button className="btn waves-effect"
											disabled={this.state.newSubtaskType===null||this.props.disabled|| this.state.newSubtaskAssigned===null}
											onClick={()=>{
												let body={
													done:false,
													title:this.state.newSubtaskTitle,
													type: this.state.newSubtaskType.id,
													quantity: this.state.newSubtaskQuantity !== '' ? parseFloat(this.state.newSubtaskQuantity) : 0,
													discount:this.state.newSubtaskDiscount!==''?this.state.newSubtaskDiscount:0,
													assignedTo:this.state.newSubtaskAssigned?this.state.newSubtaskAssigned.id:null,
													order:this.props.subtasks.length,
												}
												this.setState({
													newSubtaskTitle:'',
													newSubtaskQuantity:0,
													newSubtaskDiscount:0,
													assignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
													showAddSubtask: false,
												});
												this.props.submitService(body);
											}}
											>
											<i className="fa fa-plus" />
										</button>
										<button className="btn waves-effect"
											disabled={this.props.disabled}
											onClick={()=>{
												this.setState({showAddSubtask: false})
											}}
											>
											<i className="fa fa-times"  />
										</button>
									</td>
								}
							</tr>
						}
						{/* ADD Trip */}
						{this.state.showAddTrip && !this.props.disabled &&
							<tr>
								{/*Name*/}
								{this.props.showColumns.includes(1) &&
									<td colSpan={2} className="p-r-8">
										<Select
											isDisabled={this.props.disabled}
											value={this.state.newTripType}
											onChange={(newTripType)=>{
												this.setState({newTripType})
											}}
											options={this.props.tripTypes}
											styles={selectStyle}
											/>
									</td>
								}
								{/*Riesi*/}
								{this.props.showColumns.includes(2) &&
									<td className="p-l-8">
										<Select
											isDisabled={this.props.disabled}
											value={this.state.newTripAssignedTo}
											onChange={(newTripAssignedTo)=>{
												this.setState({newTripAssignedTo})
											}}
											options={this.props.taskAssigned}
											styles={selectStyle}
											/>
									</td>
								}
								{/*Type*/}
								{this.props.showColumns.includes(3) &&
									<td className="p-t-15 p-l-8">Výjazd</td>
								}
								{/*Mnozstvo*/}
								{this.props.showColumns.includes(4) &&
									<td className="p-l-8 p-r-8">
										<input
											disabled={this.props.disabled}
											type="text"
											pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
											value={this.state.newTripQuantity.toString()}
											onChange={(e)=>this.setState({newTripQuantity: e.target.value.replace(',', '.')})}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder="Quantity"
											/>
									</td>
								}
								{/*Cennik/Nakup*/}
								{this.props.showColumns.includes(5) && this.state.toggleTab === "2" &&
									<td></td>
								}
								{/*Zlava/Marža*/}
								{this.props.showColumns.includes(6) && this.state.toggleTab === "2" &&
									<td className="table-highlight-background p-l-8 p-r-8">
										<input
											disabled={this.props.disabled}
											type="number"
											value={this.state.newTripDiscount}
											onChange={(e)=>this.setState({newTripDiscount:e.target.value})}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder="Discount"
											/>
									</td>
								}
								{/*Cena*/}
								{this.props.showColumns.includes(7) &&
									<td className="p-t-15 p-l-8 p-r-8 t-a-r font-14">
										{
											isNaN(this.getTotalDiscountedPrice({discount:this.state.newTripDiscount,quantity:this.state.newTripQuantity,type:this.state.newTripType})) ?
											'No price' :
											(this.getTotalDiscountedPrice({discount:this.state.newTripDiscount,quantity:this.state.newTripQuantity,type:this.state.newTripType}) ).toFixed(2) + " €"
										}
									</td>
								}
								{/*Toolbar*/}
								{this.props.showColumns.includes(8) &&
									<td className="t-a-r">
										<button className="btn waves-effect"
											disabled={this.state.newTripType===null||isNaN(parseInt(this.state.newTripQuantity))||this.props.disabled|| this.state.newTripAssignedTo===null}
											onClick={()=>{
												let body={
													type:this.state.newTripType?this.state.newTripType.id:null,
													assignedTo: this.state.newTripAssignedTo?this.state.newTripAssignedTo.id:null,
													quantity: this.state.newTripQuantity !== '' ? parseFloat(this.state.newTripQuantity) : 0,
													discount: this.state.newTripDiscount!==''?this.state.newTripDiscount:0,
													done: false,
													order: this.props.workTrips.length,
												}

												this.setState({
													newTripAssignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
													newTripQuantity:1,
													newTripDiscount:0,
													showAddTrip:false
												});
												this.props.submitTrip(body);
											}}
											>
											<i className="fa fa-plus" />
										</button>
										<button className="btn waves-effect"
											disabled={this.props.disabled}
											onClick={()=>{
												this.setState({showAddTrip: false,showAddSubtask:false})
											}}>
											<i className="fa fa-times"  />
										</button>
									</td>
								}
							</tr>
						}
						{/* ADD Material */}
						{this.state.showAddMaterial && !this.props.disabled &&
							<tr>
								{/*Name*/}
								{this.props.showColumns.includes(1) &&
									<td  colSpan={2} className="p-r-8">
										<input
											disabled={this.props.disabled}
											type="text"
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											value={this.state.newMaterialTitle}
											onChange={(e)=>this.setState({newMaterialTitle:e.target.value})}
											/>
									</td>
								}
								{/*Text Nakupna cena*/}
								{this.props.showColumns.includes(2) &&
									<td className="p-r-8 p-l-8 table-highlight-background">
										{
											this.state.toggleTab === '1' &&
											<div className="row">
												 <div className="w-50 center-hor">
													Nákupná cena
												 </div>
												 <div className="w-50">
													<input
														disabled={this.props.disabled}
														type="number"
														value={this.state.newMaterialPrice}
														onChange={(e)=>{
															let newMaterialPrice = e.target.value;
															if(!this.state.marginChanged){
																if(newMaterialPrice==='' || parseFloat(newMaterialPrice) < 50 ){
																	let newMaterialMargin = (this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMargin : 0);
																	this.setState({
																		newMaterialPrice,
																		newDiscountedMaterialPrice: (this.getDiscountedMaterialPrice({price: newMaterialPrice, margin: newMaterialMargin}).toFixed(2)),
																		newMaterialMargin,
																	});
																}else{
																	let newMaterialMargin = (this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMarginExtra : 0);
																	this.setState({
																		newMaterialPrice,
																		newDiscountedMaterialPrice: ( this.getDiscountedMaterialPrice({price: newMaterialPrice, margin: newMaterialMargin}) ).toFixed(2),
																		newMaterialMargin,
																	});
																}
															}else{
																this.setState({
																	newMaterialPrice,
																	newDiscountedMaterialPrice: ( this.getDiscountedMaterialPrice({price: newMaterialPrice, margin: this.state.newMaterialMargin}) ).toFixed(2)
																});
															}
														}}
														className="form-control h-30"
														id="inlineFormInput"
														placeholder="Nákupná cena"
														/>
											  </div>
										 </div>
										}
									</td>
								}
								{/*Input Nakupna cena*/}
								{this.props.showColumns.includes(3) &&
									<td className="p-t-15 p-l-8">
										Materiál
									</td>
								}
								{/*Mnozstvo*/}
								{this.props.showColumns.includes(4) &&
									<td className="p-r-8 p-l-8">
										<input
											disabled={this.props.disabled}
											type="text"
											pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
											value={this.state.newMaterialQuantity.toString()}
											onChange={(e)=>this.setState({newMaterialQuantity: e.target.value.replace(',', '.') })}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
								}
								{/*Cennik/Nakup*/}
								{this.props.showColumns.includes(5) && this.state.toggleTab === "2" &&
									<td className="table-highlight-background p-l-8 p-r-8">
										<input
											disabled={this.props.disabled}
											type="number"
											value={this.state.newMaterialPrice}
											onChange={(e)=>{
												let newMaterialPrice = e.target.value;
												if(!this.state.marginChanged){
													if(newMaterialPrice==='' || parseFloat(newMaterialPrice) < 50 ){
														this.setState({newMaterialPrice,newMaterialMargin:(this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMargin : 0)});
													}else{
														this.setState({newMaterialPrice,newMaterialMargin:(this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMarginExtra : 0)});
													}
												}else{
													this.setState({newMaterialPrice});
												}
											}}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
								}
								{/*Zlava/Marža*/}
								{this.props.showColumns.includes(6) && this.state.toggleTab === "2" &&
									<td className="table-highlight-background p-r-8">
										<input
											disabled={this.props.disabled}
											type="number"
											value={this.state.newMaterialMargin}
											onChange={(e)=>this.setState({newMaterialMargin:e.target.value,marginChanged:true})}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
								}
								{/*Cena*/}
								{this.props.showColumns.includes(7) &&
									<td className="p-l-8 p-r-8 t-a-r">
										<input
											disabled={this.props.disabled}
											type="number"
											value={this.state.newDiscountedMaterialPrice}
											onChange={(e)=>{
												let newDiscountedMaterialPrice = e.target.value;

												if(!this.state.marginChanged){
													let newMaterialMargin = (this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMargin : 0);
													let basicMaterialPrice = this.getBasicMaterialPrice({price: newDiscountedMaterialPrice, margin: newMaterialMargin});

													if(newDiscountedMaterialPrice === '' || parseFloat(basicMaterialPrice) > 50 ){
														newMaterialMargin = (this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMarginExtra : 0);
														this.setState({
															newMaterialPrice: this.getBasicMaterialPrice({price: newDiscountedMaterialPrice, margin: newMaterialMargin}),
															newDiscountedMaterialPrice,
															newMaterialMargin,
														});

													}else{
														this.setState({
															newMaterialPrice:basicMaterialPrice,
															newDiscountedMaterialPrice,
															newMaterialMargin,
														});
													}

												}else{
													this.setState({
														newMaterialPrice: (this.getBasicMaterialPrice({price: newDiscountedMaterialPrice, margin:this.state.newMaterialMargin}) ),
														newDiscountedMaterialPrice,
													});
												}
											}}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder="Cena"
											/>
									</td>
								}
								{/*Toolbar*/}
								{this.props.showColumns.includes(8) &&
									<td className="t-a-r">
										<button className="btn waves-effect"
											disabled={this.state.newMaterialUnit===null||this.props.disabled}
											onClick={()=>{
												let body={
													margin:this.state.newMaterialMargin!==''?this.state.newMaterialMargin:0,
													price:this.state.newMaterialPrice!==''?this.state.newMaterialPrice:0,
													quantity:this.state.newMaterialQuantity!==''? parseFloat(this.state.newMaterialQuantity) :0,
													title:this.state.newMaterialTitle,
													unit:this.state.newMaterialUnit.id,
													done:false,
													order: this.props.materials.length,
												}
												this.setState({
													showAddMaterial: false,
													newMaterialTitle:'',
													newMaterialQuantity:1,
													newMaterialMargin:0,
													newMaterialPrice:0,
													marginChanged:false
												});
												this.props.submitMaterial(body);
											}}
											>
											<i className="fa fa-plus" />
										</button>
										<button className="btn waves-effect"
											disabled={this.props.disabled}
											onClick={()=>{
												this.setState({showAddMaterial: false})
											}}>
											<i className="fa fa-times"  />
										</button>
									</td>
								}
							</tr>
						}
						{/* ADD Custom item */}
						{this.state.showAddCustomItem && !this.props.disabled &&
							<tr>
								{/*Name*/}
								{this.props.showColumns.includes(1) &&
									<td  colSpan={2} className="p-r-8">
										<input
											disabled={this.props.disabled}
											type="text"
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											value={this.state.newCustomItemTitle}
											onChange={(e)=>this.setState({newCustomItemTitle:e.target.value})}
											/>
									</td>
								}
								{/*Riesi */}
								{this.props.showColumns.includes(2) &&
									<td></td>
								}
								{/*Type*/}
								{this.props.showColumns.includes(3) &&
									<td className="p-t-15 p-l-8">
										Voľná položka
									</td>
								}
								{/*Mnozstvo*/}
								{this.props.showColumns.includes(4) &&
									<td className="p-r-8 p-l-8">
										<input
											disabled={this.props.disabled}
											type="text"
											pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
											value={this.state.newCustomItemQuantity.toString()}
											onChange={(e)=>this.setState({newCustomItemQuantity: e.target.value.replace(',', '.')})}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
								}
								{/*Cennik/Nakup*/}
								{this.props.showColumns.includes(5) && this.state.toggleTab === "2" &&
									<td className="table-highlight-background p-l-8 p-r-8">
									</td>
								}
								{/*Zlava/Marža*/}
								{this.props.showColumns.includes(6) && this.state.toggleTab === "2" &&
									<td className="table-highlight-background">
									</td>
								}
								{/*Cena*/}
								{this.props.showColumns.includes(7) &&
									<td className="p-l-8 p-r-8 t-a-r">
										<input
											disabled={this.props.disabled}
											type="number"
											value={this.state.newCustomItemPrice}
											onChange={(e)=>{
												let newCustomItemPrice = e.target.value;
												this.setState({newCustomItemPrice});
											}}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
								}
								{/*Toolbar*/}
								{this.props.showColumns.includes(8) &&
									<td className="t-a-r">
										<button className="btn waves-effect"
											disabled={this.state.newCustomItemUnit===null||this.props.disabled}
											onClick={()=>{
												let body={
													price:this.state.newCustomItemPrice!==''?this.state.newCustomItemPrice:0,
													quantity:this.state.newCustomItemQuantity!==''? parseFloat(this.state.newCustomItemQuantity):0,
													title:this.state.newCustomItemTitle,
													unit:this.state.newCustomItemUnit.id,
													done:false,
													order:this.props.customItems.length,
												}
												this.setState({
													newCustomItemPrice:0,
													newCustomItemQuantity:1,
													newCustomItemTitle:'',
													showAddCustomItem: false,
												});
												this.props.submitCustomItem(body);
											}}
											>
											<i className="fa fa-plus" />
										</button>
										<button className="btn waves-effect"
											disabled={this.props.disabled}
											onClick={()=>{
												this.setState({showAddCustomItem: false})
											}}>
											<i className="fa fa-times"  />
										</button>
									</td>
								}
							</tr>
						}
						{/* ADD Buttons */}
						{!this.state.showAddSubtask && !this.state.showAddTrip && !this.state.showAddMaterial && !this.state.showAddCustomItem && !this.props.disabled &&
							<tr>
								<td colSpan={(this.state.toggleTab === '1' ? 8 : 10)}>
									{!this.state.showAddSubtask &&
										<button className="btn"
											disabled={this.props.disabled}
											onClick={()=>{
												this.setState({showAddSubtask: true});
											}}
											>
											<i className="fa fa-plus" /> Práca
										</button>
									}
									{!this.state.showAddTrip && !this.props.showSubtasks &&
										<button className="btn"
											disabled={this.props.disabled}
											onClick={()=>{
												this.setState({showAddTrip: true});
											}}
											>
											<i className="fa fa-plus" /> Výjazd
										</button>
									}
									{!this.state.showAddMaterial && !this.props.showSubtasks &&
										<button className="btn"
											disabled={this.props.disabled}
											onClick={()=>{
												this.setState({showAddMaterial: true});
											}}
											>
											<i className="fa fa-plus" /> Materiál
										</button>
									}
									{!this.state.showAddCustomItem && !this.props.showSubtasks &&
										<button className="btn"
											disabled={this.props.disabled}
											onClick={()=>{
												this.setState({showAddCustomItem: true});
											}}
											>
											<i className="fa fa-plus" /> Vlastná položka
										</button>
									}
								</td>
							</tr>
						}
					</tbody>
				</table>
				{/* Statistics */}
				{(this.props.workTrips.length + this.props.subtasks.length + this.props.materials.length + this.props.customItems.length > 0) &&
					<div className="row">
						<div className="text-right ml-auto m-r-5">
							<b>Cena bez DPH: </b>
							{
								(
									this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalPrice(cur))?0:this.getTotalPrice(cur)),0)
									+ this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseFloat(this.getDiscountedMaterialPrice(cur))) || isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(this.getDiscountedMaterialPrice(cur))*parseInt(cur.quantity)),0)
									+ this.props.customItems.reduce((acc, cur)=> acc+(isNaN(parseFloat(cur.price))||isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(cur.price) * parseInt(cur.quantity)),0)
								).toFixed(2)
							}
						</div>
						<div className="text-right m-r-5">
							<b>DPH: </b>
							{((this.getDPH()-1)*100).toFixed(2) + ' %' }
						</div>
						<div className="text-right">
							<b>Cena s DPH: </b>
							{
								(
									(
										this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalPrice(cur))?0:this.getTotalPrice(cur)),0)
										+ this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseFloat(this.getDiscountedMaterialPrice(cur))) || isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(this.getDiscountedMaterialPrice(cur))*parseInt(cur.quantity)),0)
										+ this.props.customItems.reduce((acc, cur)=> acc+(isNaN(parseFloat(cur.price))||isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(cur.price) * parseInt(cur.quantity)),0)
									)*this.getDPH()
								).toFixed(2)
							}
						</div>
					</div>
				}
			</div>
		);
	}
}
