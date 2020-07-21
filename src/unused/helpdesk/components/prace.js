import React, { Component } from 'react';
import {Input } from 'reactstrap';
import Select from 'react-select';
import { selectStyle, invisibleSelectStyle} from 'configs/components/select';
import { sameStringForms} from '../../helperFunctions';

export default class Prace extends Component {
	constructor(props){
		super(props);
		this.state={
			editedSubtaskTitle: "",
			editedSubtaskQuantity: "0",
			editedSubtaskDiscount:0,
			editedSubtaskWorkType:null,
			focusedSubtask: null,
			editedSubtaskPrice: 0,
			selectedIDs:[],

			newTitle:'',
			newPrice:0,
			newWorkType:this.props.defaultType,
			newQuantity:0,
			newExtraWork:false,
			newDiscount:0,
			newAssigned:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null
		}
	}


	componentWillReceiveProps(props){
		if(this.props.match.params.taskID!==props.match.params.taskID){
			this.setState({
				newTitle:'',
				newWorkType:props.defaultType,
				newQuantity:0,
				newExtraWork:false,
				newDiscount:0,
				newPrice:0,
				newAssigned:null,
			})
		}else if(!sameStringForms(this.props.defaultType,props.defaultType)){
			this.setState({
				newWorkType:props.defaultType,
			})
	}

		if(!sameStringForms(this.props.taskAssigned,props.taskAssigned)){
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
			let price = this.state.newWorkType.prices.find((item)=>props.company!==null && item.pricelist===props.company.pricelist.id);
			if(price === undefined){
				price = 0;
			}else{
				price = price.price;
			}
			this.setState({newPrice:price})
		}
	}

	getCreationError(){
		if(this.props.extended || (this.state.newWorkType!==null && this.state.newAssigned!==null)){
			return ''
		}else if(this.state.newWorkType===null && this.state.newAssigned===null){
			return 'You must first assign the task to someone and pick task type!'
		}else if(this.state.newWorkType===null){
			return 'You must first pick task type!'
		}else{
			return 'You must first assign the task to someone!'
		}
	}

	render() {
		//const afterHours= this.props.company && this.state.newExtraWork ? this.props.company.pricelist.afterHours : 0;
		return (
				<div className="row m-b-30 m-t-20">
					<div className="col-md-12">
						<div>
							<table className="table m-t--30">
								<thead>
									<tr>
										<th width="25" className="col-form-label">
											Práce
										</th>
										<th style={{color: "#FF4500"}}>
											{this.getCreationError()}
										</th>
										{this.props.extended &&  <th style={{fontSize: "12px", fontFamily: "Segoe UI", fontWeight: "500", color: "#333"}} width="170">Rieši</th>}
										{this.props.extended &&  <th width="100">Typ</th>}
										<th width="100">Mn.</th>
										{this.props.showAll && <th width="100" className="table-highlight-background">Cena/Mn.</th>}
										{this.props.showAll && <th width="100" className="table-highlight-background">Zlava</th>}
										{false && <th width="130">Spolu</th>}
										<th className="t-a-c" width="100"></th>
									</tr>
								</thead>
								<tbody>
									{
										this.props.subtasks.map((subtask)=>
										<tr key={subtask.id}>
											<td className="table-checkbox">
												<label className="custom-container">
													<Input type="checkbox"
														checked={subtask.done}
														disabled={this.props.disabled}
														onChange={()=>{
															this.props.updateSubtask(subtask.id,{done:!subtask.done})
															}} />
														<span className="checkmark" style={{ marginTop: "-3px", marginLeft:"-8px"}}> </span>
												</label>
											</td>
											<td>
												<div>
													<input
														disabled={this.props.disabled}
														className="form-control hidden-input"
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
																editedSubtaskDiscount: subtask.discount,
																editedSubtaskPrice: subtask.price,
																focusedSubtask: subtask.id
															});
														}}
														onChange={e =>{
															this.setState({ editedSubtaskTitle: e.target.value })}
														}
														/>
												</div>
											</td>
											{ this.props.extended && <td>
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

											{ this.props.extended && <td >
												<Select
													isDisabled={this.props.disabled}
													value={subtask.workType}
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
											</td>}

											<td>
												<input
													disabled={this.props.disabled}
													type="number"
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
															editedSubtaskDiscount: subtask.discount,
															editedSubtaskPrice: subtask.price,
															focusedSubtask: subtask.id
														});
													}}
													onChange={e =>{
														this.setState({ editedSubtaskQuantity: e.target.value })}
													}
													/>
											</td>

											{ this.props.showAll && <td className="table-highlight-background">
											<input
												disabled={this.props.disabled}
												type="number"
												className="form-control hidden-input h-30"
												value={
													subtask.id === this.state.focusedSubtask
													? this.state.editedSubtaskPrice
													: subtask.price
												}
												onBlur={() => {
													//submit
													this.props.updateSubtask(subtask.id,{price:this.state.editedSubtaskPrice})
													this.setState({ focusedSubtask: null });
												}}
												onFocus={() => {
													this.setState({
														editedSubtaskTitle: subtask.title,
														editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
														editedSubtaskWorkType: subtask.workType,
														editedSubtaskDiscount: subtask.discount,
														editedSubtaskPrice: subtask.price,
														focusedSubtask: subtask.id
													});
												}}
												onChange={e =>{
													this.setState({ editedSubtaskPrice: e.target.value })}
												}
												/>
											</td>}
											{ this.props.showAll && <td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														parseInt(subtask.id === this.state.focusedSubtask
															? this.state.editedSubtaskDiscount
															: subtask.discount)
														}
														onBlur={() => {
															this.props.updateSubtask(subtask.id,{discount:this.state.editedSubtaskDiscount})
															this.setState({ focusedSubtask: null });
														}}
														onFocus={() => {
															this.setState({
																editedSubtaskTitle: subtask.title,
																editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
																editedSubtaskWorkType: subtask.workType,
																editedSubtaskDiscount: subtask.discount,
																editedSubtaskPrice: subtask.price,
																focusedSubtask: subtask.id
															});
														}}
														onChange={e =>{
															this.setState({ editedSubtaskDiscount: e.target.value })}
														}
														/>
												</td>}
												{false &&
													<td className="table-highlight-background">
													{
														(
														(parseFloat(subtask.id === this.state.focusedSubtask?(this.state.editedSubtaskPrice===''?0:this.state.editedSubtaskPrice):subtask.finalUnitPrice)
														-
														parseFloat(subtask.id === this.state.focusedSubtask?(this.state.editedSubtaskPrice===''?0:this.state.editedSubtaskPrice):subtask.finalUnitPrice)*
														parseInt(subtask.id === this.state.focusedSubtask?(this.state.editedSubtaskDiscount===''?0:this.state.editedSubtaskDiscount):subtask.discount)
														/100)*
														parseInt(subtask.id === this.state.focusedSubtask?(this.state.editedSubtaskQuantity===''?0:this.state.editedSubtaskQuantity):subtask.quantity)
														)
														.toFixed(2)
													}
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
																this.props.removeSubtask(subtask.id);
															}
														}}>
														<i className="fa fa-times" />
													</button>
												</td>
											</tr>
										)
									}
									{/* END OF GENERATED DATA*/}

									{!this.state.showAddItem && !this.props.disabled &&
									<tr >

										<td></td>
										<td colSpan={this.props.showAll?"7":"3"}>
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
											<td></td>
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
										{ this.props.extended && <td>
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
										{ this.props.extended && <td>
											<Select
												isDisabled={this.props.disabled}
												value={this.state.newWorkType}
												options={this.props.workTypes}
												onChange={(workType)=>{
													let price=0;
													price = workType.prices.find((item)=>this.props.company!==null && item.pricelist===this.props.company.pricelist.id);
													if(price === undefined){
														price = 0;
													}else{
														price = price.price;
													}
													this.setState({newWorkType:workType,newPrice:price})
													}
												}
												styles={selectStyle}
												/>
										</td>}
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
										{ this.props.showAll && <td className="table-highlight-background">
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newPrice}
												onChange={(e)=>this.setState({newPrice:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
											/>
										</td>}
										{ this.props.showAll && <td className="table-highlight-background">
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newDiscount}
												onChange={(e)=>this.setState({newDiscount:e.target.value})}
												className="form-control input h-30"
												id="inlineFormInput"
												placeholder=""
												/>
										</td>}
										{false &&
											<td className="table-highlight-background">
											{
												((this.state.newPrice-this.state.newPrice*0.01*this.state.newDiscount)*this.state.newQuantity).toFixed(2)
											}
										</td>}
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
														assignedTo:this.state.newAssigned?this.state.newAssigned.id:null
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
						<div className="row justify-content-end">
							<div className="col-md-6">
							{false &&
									<button
										disabled={this.props.disabled}
										type="button"
										className="btn btn-link waves-effect"
										onClick={()=>this.props.updatePrices(this.state.selectedIDs)}
										>
									<i
										className="fas fa-sync"
										style={{
											color: '#4a81d4',
											fontSize: '1em',
										}}
										/>
									<span style={{
											color: '#4a81d4',
											fontSize: '1em',
										}}
										> Aktualizovať ceny podla cenníka</span>
								</button>}
							</div>
							<div className="col-md-6">
									<p className="text-right" style={{marginTop: ((this.state.showAddItem || this.props.disabled) ? "" : "-45px")}}>
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
