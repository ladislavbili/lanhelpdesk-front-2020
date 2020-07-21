import React, { Component } from 'react';
import Select from 'react-select';
import { selectStyle, invisibleSelectStyle} from 'configs/components/select';

export default class Rozpocet extends Component {
	constructor(props){
		super(props);
		const newMargin= this.props.company? this.props.company.pricelist.materialMargin : 0;
		const newUnit= this.props.units.find((item)=>item.id===this.props.defaultUnit);
		this.state={
			editedMaterialTitle: "",
			editedMaterialQuantity: "0",
			editedMaterialUnit:null,
			editedMaterialMargin:null,
			editedMaterialPrice:null,
			focusedMaterial: null,
			selectedIDs:[],

			newTitle:'',
			newQuantity:1,
			newUnit:newUnit?newUnit:null,
			newMargin,
			newPrice:0,
			marginChanged:false,
		}
	}

	componentWillReceiveProps(props){
		if((this.props.company===null && props.company!==null) ||
		(props.company!==null && props.company!==null && props.company.id!==this.props.company.id)){
			this.setState({newMargin:props.company.pricelist.materialMargin});
		}
		if((this.props.units.length!==props.units.length)){
			let newUnit= props.units[0];
			if(props.defaultUnit!==null){
				newUnit=props.units.find((item)=>item.id===props.defaultUnit)
			}
			this.setState({newUnit});
		}
		if(this.props.match.params.taskID!==props.match.params.taskID){
			let newUnit= props.units[0];
			if(props.defaultUnit!==null){
				newUnit=props.units.find((item)=>item.id===props.defaultUnit)
			}
			this.setState({
				newTitle:'',
				newQuantity:1,
				newUnit,
				newMargin:props.company? props.company.pricelist.materialMargin : 0,
				newPrice:0,
				marginChanged:false,
			})
		}
	}

	render() {
		const unitPrice= this.state.newPrice?(this.state.newPrice*(this.state.newMargin/100+1)):0;
		let editedFinalUnitPrice = 0;
		if(this.state.focusedMaterial!==null){
			editedFinalUnitPrice = (parseFloat(this.state.editedMaterialPrice)*(1+parseFloat(this.state.editedMaterialMargin)/100))
		}
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<div>
							<table className="table">
								<thead>
									<tr>
										<th>
											<input type="checkbox"
												checked={this.props.materials.length===this.state.selectedIDs.length}
												onChange={()=>this.setState({selectedIDs:(this.props.materials.length===this.state.selectedIDs.length?[]:this.props.materials.map((item)=>item.id))})} />
										</th>
										<th >Názov</th>
										<th width="100">Mn.</th>
										<th width="170">Jednotka</th>
										<th width="130">Nákupná cena</th>
										<th width="120">Marža</th>
										<th width="124">Predajná cena</th>
										<th width="120">Cena</th>
										<th className="t-a-c" width="124">Action</th>
									</tr>
								</thead>
								<tbody>
									{
										this.props.materials.map((material)=>
										<tr key={material.id}>
											<td className="table-checkbox">
												<input
													type="checkbox"
													checked={this.state.selectedIDs.includes(material.id)}
													onChange={()=>{
														if(!this.state.selectedIDs.includes(material.id)){
															this.setState({selectedIDs:[...this.state.selectedIDs,material.id]})
														}else{
															let newSelectedIDs=[...this.state.selectedIDs];
															newSelectedIDs.splice(newSelectedIDs.findIndex((item)=>item.id===material.id),1);
															this.setState({selectedIDs:newSelectedIDs})
														}
													}
												} />
											</td>
											<td>
													<input
														className="form-control hidden-input"
														value={
															material.id === this.state.focusedMaterial
															? this.state.editedMaterialTitle
															: material.title
														}
														onBlur={() => {
															//submit
															this.props.updateMaterial(material.id,{title:this.state.editedMaterialTitle})
															this.setState({ focusedMaterial: null });
														}}
														onFocus={() => {
															this.setState({
																editedMaterialTitle:material.title,
																editedMaterialQuantity:material.quantity,
																editedMaterialUnit:material.unit,
																editedMaterialMargin:material.margin,
																editedMaterialPrice:material.price,
																focusedMaterial: material.id
															});
														}}
														onChange={e =>{
															this.setState({ editedMaterialTitle: e.target.value })}
														}
														/>
											</td>
											<td>
												<input
													type="number"
													className="form-control hidden-input h-30"
													value={
														material.id === this.state.focusedMaterial
														? this.state.editedMaterialQuantity
														: material.quantity
													}
													onBlur={() => {
														//submit
														this.props.updateMaterial(material.id,{quantity:this.state.editedMaterialQuantity})
														this.setState({ focusedMaterial: null });
													}}
													onFocus={() => {
														this.setState({
															editedMaterialTitle:material.title,
															editedMaterialQuantity:material.quantity,
															editedMaterialUnit:material.unit,
															editedMaterialMargin:material.margin,
															editedMaterialPrice:material.price,
															focusedMaterial: material.id
														});
													}}
													onChange={e =>{
														this.setState({ editedMaterialQuantity: e.target.value })}
													}
													/>
											</td>
											<td>
												<Select
													value={material.unit}
													onChange={(unit)=>{
														this.props.updateMaterial(material.id,{unit})
													}}
													options={this.props.units}
													styles={invisibleSelectStyle}
													/>
											</td>
											<td className="table-highlight-background">
												<input
													type="number"
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
													onFocus={() => {
														this.setState({
															editedMaterialTitle:material.title,
															editedMaterialQuantity:material.quantity,
															editedMaterialUnit:material.unit,
															editedMaterialMargin:material.margin,
															editedMaterialPrice:material.price,
															focusedMaterial: material.id
														});
													}}
													onChange={e =>{
														this.setState({ editedMaterialPrice: e.target.value })}
													}
													/>
											</td>
											<td className="table-highlight-background">
												<input
													type="number"
													className="form-control hidden-input h-30"
													value={
														parseInt(material.id === this.state.focusedMaterial
															? this.state.editedMaterialMargin
															: material.margin)
														}
														onBlur={() => {
															this.props.updateMaterial(material.id,{margin:this.state.editedMaterialMargin})
															this.setState({ focusedMaterial: null });
														}}
														onFocus={() => {
															this.setState({
																editedMaterialTitle:material.title,
																editedMaterialQuantity:material.quantity,
																editedMaterialUnit:material.unit,
																editedMaterialMargin:material.margin,
																editedMaterialPrice:material.price,
																focusedMaterial: material.id
															});
														}}
														onChange={e =>{
															this.setState({ editedMaterialMargin: e.target.value })}
														}
														/>
											</td>
											<td>
												{parseFloat(material.id === this.state.focusedMaterial
														? editedFinalUnitPrice
														: material.finalUnitPrice).toFixed(2)
													}
											</td>
												<td>
													{
														(
														(parseFloat(material.id === this.state.focusedMaterial
																? editedFinalUnitPrice
																: material.finalUnitPrice))*
														parseInt(material.id === this.state.focusedMaterial?(this.state.editedMaterialQuantity===''?0:this.state.editedMaterialQuantity):material.quantity)
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

												<button className="btn btn-link waves-effect"
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeMaterial(material.id);
														}
													}}>
													<i className="fa fa-times" />
												</button>
											</td>

											</tr>
										)
									}


									<tr>
										<td>
										</td>
										<td>
											<input
												type="text"
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
												value={this.state.newTitle}
												onChange={(e)=>this.setState({newTitle:e.target.value})}
												/>
										</td>
										<td >
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
												value={this.state.newUnit}
												onChange={(newUnit)=>{
													this.setState({newUnit})
												}
											}
											options={this.props.units}
											styles={selectStyle}
											/>
									</td>
									<td className="table-highlight-background">
										<input
											type="number"
											value={this.state.newPrice}
											onChange={(e)=>{
												let newPrice = e.target.value;
												if(!this.state.marginChanged){
													if(newPrice==='' || parseFloat(newPrice) < 50 ){
														this.setState({newPrice,newMargin:(this.props.company? this.props.company.pricelist.materialMargin : 0)});
													}else{
														this.setState({newPrice,newMargin:(this.props.company? this.props.company.pricelist.materialMarginExtra : 0)});
													}
												}else{
													this.setState({newPrice});
												}
											}}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
									<td className="table-highlight-background">
										<input
											type="number"
											value={this.state.newMargin}
											onChange={(e)=>this.setState({newMargin:e.target.value,marginChanged:true})}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
									<td>
										{unitPrice.toFixed(2)}
									</td>
									<td>
										{
											(unitPrice*this.state.newQuantity).toFixed(2)
										}
									</td>
										<td className="t-a-r">
											<button className="btn btn-link waves-effect"
												disabled={this.state.newUnit===null}
												onClick={()=>{
													let body={
											      margin:this.state.newMargin!==''?this.state.newMargin:0,
											      price:this.state.newPrice!==''?this.state.newPrice:0,
											      quantity:this.state.newQuantity!==''?this.state.newQuantity:0,
											      title:this.state.newTitle,
											      unit:this.state.newUnit.id
													}
													this.setState({
														newTitle:'',
														newQuantity:1,
														newMargin:0,
														newPrice:0,
														marginChanged:false
													});
													this.props.submitMaterial(body);
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
								<p className="text-right">
									<b>Sub-total:</b>
									{(this.props.materials.map((material)=>parseFloat(material.totalPrice)).reduce((acc, cur)=> acc+cur,0)).toFixed(2)}
								</p>
								</div>
							</div>
						</div>

					</div>
				</div>
			);
		}
	}
