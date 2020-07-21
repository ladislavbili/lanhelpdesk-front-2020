import React, { Component } from 'react';
import {Input, Label} from 'reactstrap';
import Select from 'react-select';
import { selectStyle, invisibleSelectStyle} from 'configs/components/select';


export default class Prace extends Component {
	constructor(props){
		super(props);
		this.state={
			editedSubtaskTitle: "",
			editedSubtaskQuantity: "0",
			editedSubtaskWorkType:null,
			focusedSubtask: null,

			newTitle:'',
			newWorkType:null,
			newQuantity:0,
			newExtraWork:false,
			newDiscount:0,
			newPrice:0,
			newAssigned:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null
		}
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.taskID!==props.match.params.taskID){
			this.setState({
				newTitle:'',
				newWorkType:null,
				newQuantity:0,
				newExtraWork:false,
				newDiscount:0
			})
		}
		if(this.props.taskAssigned.length!==props.taskAssigned.length || (props.taskAssigned.length>0 && props.taskAssigned[0].id!==this.props.taskAssigned[0].id) ){
			if(!props.taskAssigned.some((item)=>item.id===(this.state.newAssigned?this.state.newAssigned.id:null))){
				if(props.taskAssigned.length>0){
					this.setState({newAssigned:props.taskAssigned[0]});
				}else{
					this.setState({newAssigned:null});
				}
			}
		}
		if(this.state.newWorkType &&
			((this.props.company===null && props.company!==null)||
			(props.company===null && this.props.company!==null)||
			(this.props.company!==null && props.company!==null && this.props.company.id!==props.company.id))){

			let price = this.state.newWorkType.prices.find((item)=>props.company && item.pricelist===props.company.pricelist.id);
			if(price === undefined){
				price = 0;
			}else{
				price = price.price;
			}
			this.setState({newPrice:price})
		}
	}

	render() {
		//const afterHours= this.props.company && this.state.newExtraWork ? this.props.company.pricelist.afterHours : 0;
		//const unitPrice= this.state.newPrice?(this.state.newPrice/100*afterHours+this.state.newPrice):0;
		return (
			<div className="row m-t-20">
				<div className="col-md-12">
					<div>
						<Label>Práce</Label>
						<table className="table m-t--30">
							<thead >
								<tr >
									<th width="25">
									</th>
									<th className="t-a-l p-l-15"></th>
									<th width="100">Mn.</th>
									{false && <th width="170">Rieši</th>}
									<th width="190">Typ</th>
									<th className="t-a-r" width="124"></th>
								</tr>
							</thead>
							<tbody>
								{
									this.props.subtasks.map((subtask)=>
									<tr key={subtask.id}>
										<td className="table-checkbox">
											<label className="custom-container">
												<Input type="checkbox"
													disabled={this.props.disabled}
													checked={subtask.done} onChange={()=>{
														this.props.updateSubtask(subtask.id,{done:!subtask.done})
														}} />
													<span className="checkmark" style={{ marginTop: "-3px", marginLeft:"-8px"}}> </span>
											</label>
										</td>
										<td>
											<div>
												<input
													className="form-control hidden-input"
													disabled={this.props.disabled}
													value={
														subtask.id === this.state.focusedSubtask
														? this.state.editedSubtaskTitle
														: subtask.title
													}
													onBlur={() => {
													//submit
													this.props.updateSubtask(subtask.id,{title:this.state.editedSubtaskTitle})
													this.setState({ focusedSubtask: null });
												}}
												onFocus={() => {
													this.setState({
														editedSubtaskTitle: subtask.title,
														editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
														editedSubtaskWorkType: subtask.workType,
														focusedSubtask: subtask.id
													});
												}}
												onChange={e =>{
													this.setState({ editedSubtaskTitle: e.target.value })}
												}
												/>
										</div>
									</td>
									<td>
										<input
											type="number"
											disabled={this.props.disabled}
											className="form-control hidden-input h-30"
											value={
												subtask.id === this.state.focusedSubtask
												? this.state.editedSubtaskQuantity
												: subtask.quantity
											}
											onBlur={() => {
											//submit
											this.props.updateSubtask(subtask.id,{quantity:this.state.editedSubtaskQuantity})
											this.setState({ focusedSubtask: null });
										}}
										onFocus={() => {
											this.setState({
												editedSubtaskTitle: subtask.title,
												editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
												editedSubtaskWorkType: subtask.workType,
												focusedSubtask: subtask.id
											});
										}}
										onChange={e =>{
											this.setState({ editedSubtaskQuantity: e.target.value })}
										}
										/>
									</td>
									{false && <td >
										<Select
											value={subtask.assignedTo}
											onChange={(assignedTo)=>{
												this.props.updateSubtask(subtask.id,{assignedTo:assignedTo.id})
											}}
											options={this.props.taskAssigned}
											styles={invisibleSelectStyle}
											/>
									</td>}
									<td>
										<Select
											value={subtask.workType}
											isDisabled={this.props.disabled}
											onChange={(workType)=>{
												let price = workType.prices.find((item)=>this.props.company && item.pricelist===this.props.company.pricelist.id);
												if(price === undefined){
														price = 0;
												}else{
													price = price.price;
												}
												this.props.updateSubtask(subtask.id,{workType:workType.id,price})
											}}
											options={this.props.workTypes}
											styles={invisibleSelectStyle}
											/>
									</td>
									<td className="t-a-r">
										<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
											<i className="fa fa-arrow-up"  />
										</button>
										<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
												<i className="fa fa-arrow-down"  />
										</button>
										<button className="btn btn-link waves-effect" disabled={this.props.disabled} onClick={()=>{
												if(window.confirm('Are you sure?')){
													this.props.removeSubtask(subtask.id);
												}
											}}>
											<i className="fa fa-times"  />
											</button>
										</td>
									</tr>
								)
							}

							{!this.state.showAddItem && !this.props.disabled &&
								<tr >
									<td>
									</td>
									<td>
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

				{this.state.showAddItem && !this.props.disabled && <tr>
								<td>
									<button className="btn btn-link waves-effect"
										disabled={this.props.disabled}
										onClick={()=>{
											this.setState({showAddItem: false})
										}}>
										<i className="fa fa-times"  />
										</button>
								</td>
								<td>
									<input
										disabled={this.props.disabled}
										type="text"
										className="form-control"
										id="inlineFormInput"
										placeholder=""
										value={this.state.newTitle}
										onChange={(e)=>this.setState({newTitle:e.target.value})}
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
										placeholder=""
										/>
								</td>
								{false && <td>
									<Select
										isDisabled={this.props.disabled}
										value={this.state.newAssigned}
										onChange={(newAssigned)=>{
											this.setState({newAssigned})
											}
										}
										options={this.props.taskAssigned}
										styles={selectStyle}
										/>
								</td>}
								<td>
									<Select
										isDisabled={this.props.disabled}
										value={this.state.workType}
										onChange={(workType)=>{
											let price=0;
											price = workType.prices.find((item)=>this.props.company && item.pricelist===this.props.company.pricelist.id);
											if(price === undefined){
												price = 0;
											}else{
												price = price.price;
											}
											this.setState({newWorkType:workType,newPrice:price})
											}
										}
										options={this.props.workTypes}
										styles={selectStyle}
										/>
								</td>
								<td className="t-a-r">
									<button className="btn btn-link waves-effect"
										disabled={this.state.newWorkType===null||this.props.disabled}
										onClick={()=>{
											let body={
												discount:this.state.newDiscount!==''?this.state.newDiscount:0,
												extraPrice:this.props.company?parseFloat(this.props.company.pricelist.afterHours) : 0,
												extraWork:this.state.newExtraWork,
												price:this.state.newPrice!==''?this.state.newPrice:0,
												quantity:this.state.newQuantity!==''?this.state.newQuantity:0,
												title:this.state.newTitle,
												workType: this.state.newWorkType.id,
												assignedTo:this.state.newAssigned?this.state.newAssigned.id:null,
											}
											this.setState({
												showAddItem: false,
												newDiscount:0,
												newExtraWork:false,
												newQuantity:0,
												newTitle:'',
												assignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null
											});
											this.props.submitService(body);
											}
										}
										>
										<i className="fa fa-plus" />
									</button>
								</td>
							</tr>}
						</tbody>
					</table>
				</div>
				<div className="row justify-content-end">
					<div className="col-md-3">
						<p className="text-right"  style={{marginTop: ((this.state.showAddItem || this.props.disabled) ? "" : "-45px")}}>
							<b>Sub-total:</b>
							{(this.props.subtasks.map((subtask)=>parseFloat(subtask.totalPrice)).reduce((acc, cur)=> acc+cur,0)).toFixed(2)}
						</p>

						</div>
					</div>
				</div>

			</div>
		);
	}
}
