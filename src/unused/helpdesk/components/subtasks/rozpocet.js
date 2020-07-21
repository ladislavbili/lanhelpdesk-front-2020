import React, { Component } from 'react';
import Select from 'react-select';
import { selectStyle, invisibleSelectStyle} from 'configs/components/select';

export default class Rozpocet extends Component {
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
			newWorkType:null,
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
				newWorkType:null,
				newQuantity:0,
				newExtraWork:false,
				newDiscount:0,
				newPrice:0,
				newAssigned:null,
			})
		}

		if(this.props.taskAssigned.length!==props.taskAssigned.length){
			if(!props.taskAssigned.some((item)=>item.id===(this.state.newAssigned?this.state.newAssigned.id:null))){
				if(props.taskAssigned.length>0){
					this.setState({newAssigned:props.taskAssigned[0]});
				}else{
					this.setState({newAssigned:null});
				}
			}
		}

		if(((this.props.company===null && props.company!==null)||
		(props.company===null && this.props.company!==null)||
		(this.props.company!==null && this.props.company.id!==props.company.id))
		&& this.state.newWorkType ){
			let price = this.state.newWorkType.prices.find((item)=>props.company!==null && item.pricelist===props.company.pricelist.id);
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
		return (
				<div className="row">
					<div className="col-md-12">
						<div>
							<table className="table">
								<thead>
									<tr>
										<th width="25">
											<input type="checkbox"
												checked={this.props.subtasks.length===this.state.selectedIDs.length}
												onChange={()=>this.setState({selectedIDs:(this.props.subtasks.length===this.state.selectedIDs.length?[]:this.props.subtasks.map((item)=>item.id))})} />
										</th>
										<th >Názov</th>
										<th width="100">Mn.</th>
										<th width="170">Rieši</th>
										<th width="170">Typ</th>
										<th width="120">Cena/Mn.</th>
										<th width="124">Zlava</th>
										<th width="130">Spolu</th>
										<th className="t-a-c" width="124">Action</th>
									</tr>
								</thead>
								<tbody>
									{
										this.props.subtasks.map((subtask)=>
										<tr key={subtask.id}>
											<td className="table-checkbox">
												<input
													type="checkbox"
													checked={this.state.selectedIDs.includes(subtask.id)}
													onChange={()=>{
														if(!this.state.selectedIDs.includes(subtask.id)){
															this.setState({selectedIDs:[...this.state.selectedIDs,subtask.id]})
														}else{
															let newSelectedIDs=[...this.state.selectedIDs];
															newSelectedIDs.splice(newSelectedIDs.findIndex((item)=>item.id===subtask.id),1);
															this.setState({selectedIDs:newSelectedIDs})
														}
													}
												} />
											</td>
											<td>
												<div>
													<input
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
											<td>
												<input
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
											<td>
												<Select
													value={subtask.assignedTo}
													onChange={(assignedTo)=>{
														this.props.updateSubtask(subtask.id,{assignedTo:assignedTo.id})
													}}
													options={this.props.taskAssigned}
													styles={invisibleSelectStyle}
													/>
											</td>
											<td >
												<Select
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
											</td>

											<td className="table-highlight-background">
											<input
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
											</td>
											<td className="table-highlight-background">
												<input
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
												</td>
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
												</td>
												<td className="t-a-r">
													<button className="btn btn-link waves-effect">
														<i className="fa fa-arrow-up"  />
													</button>
													<button className="btn btn-link waves-effect">
															<i className="fa fa-arrow-down"  />
													</button>
													<button className="btn btn-link waves-effect" onClick={()=>{
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

									<tr>
										<td>
										</td>
										<td>
											<input
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
												type="number"
												value={this.state.newQuantity}
												onChange={(e)=>this.setState({newQuantity:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
												/>
										</td>
										<td>
											<Select
												value={this.state.newAssigned}
												onChange={(newAssigned)=>{
													this.setState({newAssigned})
													}
												}
												options={this.props.taskAssigned}
												styles={selectStyle}
												/>
										</td>
										<td>
											<Select
												value={this.state.workType}
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
												options={this.props.workTypes}
												styles={selectStyle}
												/>
										</td>

										<td className="table-highlight-background">
										<input
											type="number"
											value={this.state.newPrice}
											onChange={(e)=>this.setState({newPrice:e.target.value})}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
										</td>
										<td className="table-highlight-background">
											<input
												type="number"
												value={this.state.newDiscount}
												onChange={(e)=>this.setState({newDiscount:e.target.value})}
												className="form-control input h-30"
												id="inlineFormInput"
												placeholder=""
												/>
										</td>
										<td className="table-highlight-background">
											{
												((this.state.newPrice-this.state.newPrice*0.01*this.state.newDiscount)*this.state.newQuantity).toFixed(2)
											}
										</td>
										<td className="t-a-r">
											<button className="btn btn-link waves-effect"
												disabled={this.state.newWorkType===null}
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
									</tr>
								</tbody>
							</table>
						</div>
						<div className="row justify-content-end">
							<div className="col-md-6">
								<button type="button" className="btn btn-link waves-effect">
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
										onClick={()=>this.props.updatePrices(this.state.selectedIDs)}
										> Aktualizovať ceny podla cenníka</span>
								</button>
							</div>
							<div className="col-md-6">
								<p className="text-right">
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
