import React, { Component } from 'react';
import Select from 'react-select';
import { selectStyle, invisibleSelectStyle} from 'configs/components/select';
import { sameStringForms} from '../../helperFunctions';

export default class Prace extends Component {
	constructor(props){
		super(props);
		this.state={
			focusedTrip:null,
			editedQuantity:0,
			editedDiscount:0,

			newType:this.props.tripTypes.length>0?this.props.tripTypes[0]:null,
			newAssignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
			newQuantity:1,
			newDiscount:0,
		}
		this.onFocus.bind(this);
	}

	componentWillReceiveProps(props){
		if(this.props.taskID!==props.taskID){
			this.setState({
				newType:props.tripTypes.length>0?props.tripTypes[0]:null,
				newAssignedTo:props.taskAssigned.length>0?props.taskAssigned[0]:null,
				newQuantity:1,
				newDiscount:0,
			})
		}

		if(!sameStringForms(this.props.taskAssigned,props.taskAssigned)){
			if(!props.taskAssigned.some((item)=>item.id===(this.state.newAssigned?this.state.newAssigned.id:null))){
				if(props.taskAssigned.length>0){
					this.setState({newAssignedTo:props.taskAssigned[0]});
				}else{
					this.setState({newAssignedTo:null});
				}
			}
		}
	}

	onFocus(trip){
		this.setState({
			editedQuantity:trip.quantity,
			editedDiscount:trip.discount,
			focusedTrip:trip.id
		})
	}

	render() {
		return (
				<div className="row m-b-30 m-t-20">
					<div className="col-md-12">
						<div>
							<table className="table m-t--30">
								<thead>
									<tr>
										<th className="col-form-label">
											Výjazd
										</th>
										<th width="170">Rieši</th>
										<th width="100">Mn.</th>
										{this.props.showAll && <th width="100">Zľava %</th>}
										<th className="t-a-c" width="100"></th>
									</tr>
								</thead>
								<tbody>
									{
										this.props.workTrips.map((trip)=>
										<tr key={trip.id}>
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

											<td>
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														trip.id === this.state.focusedTrip
														? this.state.editedQuantity
														: trip.quantity
													}
													onBlur={() => {
														this.props.updateTrip(trip.id,{quantity:isNaN(parseFloat(this.state.editedQuantity))?0:this.state.editedQuantity})
														this.setState({ focusedTrip: null });
													}}
													onFocus={() => {
														this.onFocus(trip);
													}}
													onChange={e =>{
														this.setState({ editedQuantity: e.target.value })}
													}
													/>
											</td>

											{this.props.showAll && <td>
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														trip.id === this.state.focusedTrip
														? this.state.editedDiscount
														: trip.discount
													}
													onBlur={() => {
														this.props.updateTrip(trip.id,{discount:isNaN(parseFloat(this.state.editedDiscount))?0:this.state.editedDiscount})
														this.setState({ focusedTrip: null });
													}}
													onFocus={() => {
														this.onFocus(trip);
													}}
													onChange={e =>{
														this.setState({ editedDiscount: e.target.value })}
													}
													/>
											</td>}
											<td className="t-a-r">
												<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
													<i className="fa fa-arrow-up"  />
												</button>
												<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
														<i className="fa fa-arrow-down"  />
												</button>
												<button className="btn btn-link waves-effect" disabled={this.props.disabled}
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeTrip(trip.id);
														}
													}}>
													<i className="fa fa-times" />
												</button>
											</td>
										</tr>
									)}
									{/* END OF GENERATED DATA*/}

									{!this.state.showAddItem && !this.props.disabled &&
									<tr >
										<td colSpan={this.props.showAll?"5":"4"}>
											<button className="btn btn-table-add-item"
												disabled={this.props.disabled}
												onClick={()=>{
												 this.setState({showAddItem: true});
												}}>
												+ Add New Item
											</button>
										</td>
									</tr>
									}

									{this.state.showAddItem && !this.props.disabled &&
										<tr>
										<td>
											<Select
												isDisabled={this.props.disabled}
												value={this.state.newType}
												onChange={(newType)=>{
													this.setState({newType})
													}
												}
												options={this.props.tripTypes}
												styles={selectStyle}
												/>
										</td>
										<td>
											<Select
												isDisabled={this.props.disabled}
												value={this.state.newAssignedTo}
												onChange={(newAssignedTo)=>{
													this.setState({newAssignedTo})
													}
												}
												options={this.props.taskAssigned}
												styles={selectStyle}
												/>
										</td>
										<td>
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newQuantity}
												onChange={(e)=>this.setState({newQuantity:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder="Quantity"
												/>
										</td>
										{this.props.showAll && <td>
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newDiscount}
												onChange={(e)=>this.setState({newDiscount:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder="Discount"
												/>
										</td>}
										<td className="t-a-r">
											<button className="btn btn-link waves-effect"
												disabled={this.state.newType===null||isNaN(parseInt(this.state.newQuantity))||this.props.disabled}
												onClick={()=>{
													let body={
														type:this.state.newType?this.state.newType.id:null,
														assignedTo: this.state.newAssignedTo?this.state.newAssignedTo.id:null,
														quantity: this.state.newQuantity!==''?this.state.newQuantity:0,
														discount: this.state.newDiscount!==''?this.state.newDiscount:0,
													}
													this.setState({
														newType:this.props.tripTypes.length>0?this.props.tripTypes[0]:null,
														newAssignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
														newQuantity:1,
														newDiscount:0,
													});
													this.props.submitTrip(body);
													}
												}
												>
												<i className="fa fa-plus" />
											</button>
											<button className="btn btn-link waves-effect"
												disabled={this.props.disabled}
												onClick={()=>{
													this.setState({showAddItem: false})
												}}>
												<i className="fa fa-times"  />
												</button>
										</td>
									</tr>}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				);
		}
	}
