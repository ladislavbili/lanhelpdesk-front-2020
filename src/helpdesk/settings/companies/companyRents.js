import React, { Component } from 'react';

export default class CompanyRents extends Component {
	constructor(props){
		super(props);
		this.state={
			title:'',
			quantity:1,
			unitCost:0,
			unitPrice:0,
			totalPrice:0,
		}
	}

	componentWillReceiveProps(props){
		if(props.clearForm){
			this.props.setClearForm();
			this.setState({
				title:'',
				quantity:1,
				unitCost:0,
				unitPrice:0,
				totalPrice:0,
			})
		}
	}

	render() {
		return (
			<div className="row m-t-20">
				<div className="col-md-12">
					<div>
						<h4>Prenájom Hardware & Software </h4>
						<table className="table m-t--30">
							<thead>
								<tr >
									<th>Názov</th>
									<th>Mn.</th>
									<th>Náklad/ks/mesiac</th>
									<th>Cena/ks/mesiac</th>
									<th>Cena/mesiac</th>
								</tr>
							</thead>
							<tbody>
								{
									this.props.data.map((rent)=>
									<tr key={rent.id}>
										<td>
											<input
												disabled={this.props.disabled}
												className="form-control hidden-input"
												value={rent.title}
												onChange={e =>{
													this.props.updateRent({...rent,title:e.target.value});
												}}
												/>
										</td>
										<td>
											<input
												disabled={this.props.disabled}
												type="number"
												className="form-control hidden-input"
												value={rent.quantity}
												onChange={(e)=>{
													if(isNaN(parseInt(e.target.value))||isNaN(parseFloat(rent.unitPrice))){
														this.props.updateRent({...rent, quantity:e.target.value,totalPrice:0 });
													}else{
														this.props.updateRent({...rent, quantity:e.target.value,totalPrice:parseFloat(rent.unitPrice)*parseInt(e.target.value) });
													}
												}}
												/>
										</td>
										<td>
											<input
												disabled={this.props.disabled}
												type="number"
												className="form-control hidden-input"
												value={rent.unitCost}
												onChange={(e)=>{
													if(isNaN(parseFloat(e.target.value))||isNaN(parseFloat(rent.unitPrice))){
														this.props.updateRent({...rent, unitCost:e.target.value });
													}else if(parseFloat(e.target.value)>parseFloat(rent.unitPrice)){
														if(isNaN(parseInt(rent.quantity))){
															this.props.updateRent({...rent, unitCost:e.target.value,unitPrice:e.target.value });
														}else{
															this.props.updateRent({...rent, unitCost:e.target.value,unitPrice:e.target.value,totalPrice:parseInt(rent.quantity)*parseFloat(e.target.value) });
														}
													}else{
														this.props.updateRent({...rent, unitCost:e.target.value });
													}
												}}
												/>
										</td>
										<td>
											<input
												disabled={this.props.disabled}
												type="number"
												className="form-control hidden-input"
												value={rent.unitPrice}
												onChange={(e)=>{
													if(isNaN(parseFloat(e.target.value))||isNaN(parseInt(rent.quantity))){
														this.props.updateRent({...rent, unitPrice:e.target.value });
													}else{
														this.props.updateRent({...rent, unitPrice:e.target.value, totalPrice:parseInt(rent.quantity)*parseFloat(e.target.value) });
													}
												}}
												/>
										</td>
										<td>
											<input
												disabled={this.props.disabled||isNaN(rent.quantity)||parseInt(rent.quantity) <= 0}
												type="number"
												className="form-control hidden-input"
												value={rent.totalPrice}
												onChange={(e)=>{
													if(isNaN(parseFloat(e.target.value))){
														this.props.updateRent({...rent, totalPrice:e.target.value});
													}else{
														this.props.updateRent({...rent, totalPrice:e.target.value,unitPrice:parseFloat(e.target.value)/parseInt(rent.quantity) });
													}
												}}
												/>
										</td>

										<td className="t-a-r">
											<button className="btn btn-link waves-effect"
												disabled={this.props.disabled}
												onClick={()=>{
													if(window.confirm('Are you sure?')){
														this.props.removeRent(rent);
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
										<input
											disabled={this.props.disabled}
											type="text"
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											value={this.state.title}
											onChange={(e)=>this.setState({title:e.target.value})}
											/>
									</td>
									<td>
										<input
											disabled={this.props.disabled}
											type="number"
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											value={this.state.quantity}
											onChange={(e)=>{
												if(isNaN(parseInt(e.target.value))||isNaN(parseFloat(this.state.unitPrice))){
													this.setState({quantity:e.target.value,totalPrice:0})
												}else{
													this.setState({quantity:e.target.value,totalPrice:parseFloat(this.state.unitPrice)*parseInt(e.target.value)})
												}
											}}
											/>
									</td>
									<td>
										<input
											disabled={this.props.disabled}
											type="number"
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											value={this.state.unitCost}
											onChange={(e)=>{
												if(isNaN(parseFloat(e.target.value))||isNaN(parseFloat(this.state.unitPrice))){
													this.setState({unitCost:e.target.value})
												}else if(parseFloat(e.target.value)>parseFloat(this.state.unitPrice)){
													if(isNaN(parseInt(this.state.quantity))){
														this.setState({unitCost:e.target.value,unitPrice:e.target.value})
													}else{
														this.setState({unitCost:e.target.value,unitPrice:e.target.value,totalPrice:parseInt(this.state.quantity)*parseFloat(e.target.value)})
													}
												}else{
													this.setState({unitCost:e.target.value })
												}
											}}
											/>
									</td>
									<td>
										<input
											disabled={this.props.disabled}
											type="number"
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											value={this.state.unitPrice}
											onChange={(e)=>{
												if(isNaN(parseFloat(e.target.value))||isNaN(parseInt(this.state.quantity))){
													this.setState({unitPrice:e.target.value})
												}else{
													this.setState({unitPrice:e.target.value, totalPrice:parseInt(this.state.quantity)*parseFloat(e.target.value) })
												}
											}}
											/>
									</td>
									<td>
										<input
											disabled={this.props.disabled||isNaN(this.state.quantity)||parseInt(this.state.quantity) <= 0}
											type="number"
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											value={this.state.totalPrice}
											onChange={(e)=>{
												if(isNaN(parseFloat(e.target.value))){
													this.setState({totalPrice:e.target.value})
												}else{
													this.setState({totalPrice:e.target.value,unitPrice:parseFloat(e.target.value)/parseInt(this.state.quantity)})
												}
											}}
											/>
									</td>
									<td className="t-a-r">
										<button className="btn btn-link waves-effect"
											disabled={
												this.state.disabled||
												this.state.title===''||
												isNaN(parseInt(this.state.quantity))||
												isNaN(parseInt(this.state.unitCost))||
												isNaN(parseInt(this.state.unitPrice))||
												isNaN(parseInt(this.state.totalPrice))||
												parseInt(this.state.quantity) < 0||
												parseInt(this.state.unitCost) < 0||
												parseInt(this.state.unitPrice) < 0||
												parseInt(this.state.totalPrice) < 0
											}
											onClick={()=>{
												let body={
										      title:this.state.title,
													quantity:this.state.quantity,
													unitCost:this.state.unitCost,
													unitPrice:this.state.unitPrice,
													totalPrice:this.state.totalPrice,
												}
												this.setState({
													title:'',
													quantity:1,
													unitCost:0,
													unitPrice:0,
													totalPrice:0,
												});
												this.props.addRent(body);
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
								{(this.props.data.map((rent)=>parseFloat(rent.totalPrice)).reduce((acc, cur)=>{
									if(!isNaN(cur)){
										return acc+parseInt(cur);
									}
									return acc;
								},0)).toFixed(2)}
							</p>
							</div>
						</div>
					</div>

				</div>
			);
		}
	}
