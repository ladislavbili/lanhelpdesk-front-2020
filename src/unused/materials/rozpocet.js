import React, { Component } from 'react';
import Select from 'react-select';
import { rebase } from '../../../index';
import { selectStyle, invisibleSelectStyle} from 'configs/components/select';


const tableStyle = {
	border: 'none',
};

const tableStyleCenter = {
	textAlign: 'right',
	border: 'none',
};

const tableHighlightBackground ={
	backgroundColor: '#d5e5f2',
}

const tableStyleCenterNoBorder = {
	textAlign: 'center',
	border: 'none',
};

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
	}

	render() {
		const afterHours= this.props.company && this.state.newExtraWork ? this.props.company.pricelist.afterHours : 0;
		return (
			<div className="">
				<div className="row">
					<div className="col-md-12">
						<div>
							<table className="table table-centered table-borderless table-hover mb-0">
								<thead className="thead-light">
									<tr>
										<th style={tableStyle} width="25">
											<input type="checkbox"
												checked={this.props.subtasks.length===this.state.selectedIDs.length}
												onChange={()=>this.setState({selectedIDs:(this.props.subtasks.length===this.state.selectedIDs.length?[]:this.props.subtasks.map((item)=>item.id))})} />
										</th>
										<th style={tableStyle} width="250">Názov</th>
											<th style={tableStyle} width="100">Mn.</th>
										<th style={tableStyle} width="170">Typ</th>
										<th style={{...tableStyleCenterNoBorder}} width="124">Action</th>
										<th style={tableStyle} width="120">Cena/Mn.</th>
										<th style={tableStyle} width="124">Zlava</th>
										<th style={tableStyle} width="130">Spolu</th>
										<th style={tableStyle} width="120"></th>
									</tr>
								</thead>
								<tbody>
									{
										this.props.subtasks.map((subtask)=>
										<tr key={subtask.id}>
											<td style={tableStyle}>
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
											<td style={tableStyle}>
												<div>
													<input
														className="invisible-input"
														value={
															subtask.id === this.state.focusedSubtask
															? this.state.editedSubtaskTitle
															: subtask.title
														}
														onBlur={() => {
															//submit
															this.props.updateSubtask(subtask.id,{title:this.state.editedSubtaskTitle})
															rebase.updateDoc('taskWorks/'+subtask.id,{title:this.state.editedSubtaskTitle});
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
											<td style={tableStyle}>
												<input
													type="number"
													className="invisible-input"
													value={
														subtask.id === this.state.focusedSubtask
														? this.state.editedSubtaskQuantity
														: subtask.quantity
													}
													onBlur={() => {
														//submit
														this.props.updateSubtask(subtask.id,{quantity:this.state.editedSubtaskQuantity})
														rebase.updateDoc('taskWorks/'+subtask.id,{quantity:this.state.editedSubtaskQuantity});
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
											<td style={tableStyle}>
												<Select
													value={subtask.workType}
													onChange={(workType)=>{
														let price = workType.prices.find((item)=>item.pricelist===this.props.company.pricelist.id);
														if(price === undefined){
																price = 0;
														}else{
															price = price.price;
														}
														this.props.updateSubtask(subtask.id,{workType:workType.id,price})
														rebase.updateDoc('taskWorks/'+subtask.id,{workType:workType.id,price});
													}}
													options={this.props.workTypes}
													styles={invisibleSelectStyle}
													/>
											</td>
											<td style={tableStyleCenter}>
												<button className="btn btn-link waves-effect">
													<i className="fa fa-arrow-up"  />
												</button>
												<button className="btn btn-link waves-effect">
														<i className="fa fa-arrow-down"  />
												</button>
												<button className="btn btn-link waves-effect" onClick={()=>{
														if(window.confirm('Are you sure?')){
															rebase.removeDoc('taskWorks/'+subtask.id).then(()=>this.props.removeSubtask(subtask.id));
														}
													}}>
													<i className="fa fa-times" />
												</button>
											</td>
											<td style={{...tableStyle,...tableHighlightBackground}}>
											<input
												type="number"
												className="invisible-input"
												value={
													subtask.id === this.state.focusedSubtask
													? this.state.editedSubtaskPrice
													: subtask.price
												}
												onBlur={() => {
													//submit
													this.props.updateSubtask(subtask.id,{price:this.state.editedSubtaskPrice})
													rebase.updateDoc('taskWorks/'+subtask.id,{price:this.state.editedSubtaskPrice});
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
											<td style={{...tableStyle,...tableHighlightBackground}}>
												<input
													type="number"
													className="invisible-input"
													value={
														parseInt(subtask.id === this.state.focusedSubtask
															? this.state.editedSubtaskDiscount
															: subtask.discount)
														}
														onBlur={() => {
															this.props.updateSubtask(subtask.id,{discount:this.state.editedSubtaskDiscount})
															rebase.updateDoc('taskWorks/'+subtask.id,{discount:this.state.editedSubtaskDiscount});
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
												<td style={{...tableStyle,...tableHighlightBackground}}>
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
											</tr>
										)
									}
									{/* END OF GENERATED DATA*/}

									<tr>
										<td style={tableStyle}>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												value={this.state.newTitle}
												onChange={(e)=>this.setState({newTitle:e.target.value})}
												style={{ height: 30 }}
												/>
										</td>
										<td style={tableStyle}>
											<input
												type="number"
												value={this.state.newQuantity}
												onChange={(e)=>this.setState({newQuantity:e.target.value})}
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
												/>
										</td>
										<td style={tableStyle} className="p-t-0">
											<Select
												value={this.state.workType}
												onChange={(workType)=>{
													let price=0;
													price = workType.prices.find((item)=>item.pricelist===this.props.company.pricelist.id);
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
										<td style={tableStyleCenter}>
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
														workType: this.state.newWorkType.id
													}
													this.setState({
														newDiscount:0,
														newExtraWork:false,
														newQuantity:0,
														newTitle:'',
													});
													this.props.submitService(body);
													}
												}
												>
												<i className="fa fa-plus" />
											</button>
										</td>
										<td style={{...tableStyle}}>
										<input
											type="number"
											value={this.state.newPrice}
											onChange={(e)=>this.setState({newPrice:e.target.value})}
											className="form-control mb-2"
											id="inlineFormInput"
											placeholder=""
											style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="number"
												value={this.state.newDiscount}
												onChange={(e)=>this.setState({newDiscount:e.target.value})}
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
												/>
										</td>
										<td style={tableStyle}>
											{
												((this.state.newPrice-this.state.newPrice*0.01*this.state.newDiscount)*this.state.newQuantity).toFixed(2)
											}
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
				</div>
			);
		}
	}
