import React, { Component } from 'react';

export default class Rozpocet extends Component {
	constructor(props){
		super(props);
		const newMargin= this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMargin : 0;
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
			this.setState({newMargin: (props.company && props.company.pricelist ? props.company.pricelist.materialMargin : 0)});
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
				newMargin: props.company && props.company.pricelist ? props.company.pricelist.materialMargin : 0,
				newPrice:0,
				marginChanged:false,
			})
		}
	}

	render() {
		let editedFinalUnitPrice = 0;
		if(this.props.focusedMaterial!==null){
			editedFinalUnitPrice = (parseFloat(this.props.editedMaterialPrice)*(1+parseFloat(this.props.editedMaterialMargin)/100))
		}
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<h3 className="m-t-30"> Materials </h3>
						<div>
							<table className="table">
								<thead>
									<tr>
										<th >Názov</th>
										<th width="100">Mn.</th>
										<th width="170">Jednotka</th>
										<th width="130">Nákupná cena</th>
										<th width="124">Predajná cena</th>
										<th width="120">Cena</th>
									</tr>
								</thead>
								<tbody>
									{
										this.props.materials.map((material)=>
										<tr key={material.id}>

											<td>{
															material.id === this.props.focusedMaterial
															? this.props.editedMaterialTitle
															: material.title
														}
											</td>
											<td>{
														material.id === this.props.focusedMaterial
														? this.props.editedMaterialQuantity
														: material.quantity
													}
											</td>
											<td>{material.unit.title}</td>
											<td>{
														material.id === this.props.focusedMaterial
														? this.props.editedMaterialPrice
														: material.price
													}
											</td>
											<td>
												{parseFloat(material.id === this.props.focusedMaterial
														? editedFinalUnitPrice
														: material.finalUnitPrice).toFixed(2)
													}
											</td>
											<td>
												{
													(
													(parseFloat(material.id === this.props.focusedMaterial
															? editedFinalUnitPrice
															: material.finalUnitPrice))*
													parseInt(material.id === this.props.focusedMaterial?(this.props.editedMaterialQuantity===''?0:this.props.editedMaterialQuantity):material.quantity)
													)
													.toFixed(2)
												}
											</td>
										</tr>
										)
									}

								</tbody>
							</table>
						</div>
						<div className="row justify-content-end">
							<div className="col-md-6">
								<p className="text-right">
									<b>Sub-total: </b>
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
