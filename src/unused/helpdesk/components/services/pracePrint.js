import React, { Component } from 'react';


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
				newDiscount:0,
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
		if(((this.props.company===null && props.company!==null)|| (props.company===null && this.props.company!==null)|| (this.props.company!==null && this.props.company.id!==props.company.id)) && this.state.newWorkType ){
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
		return (
			<div className="row">
				<div className="col-md-12">
					<h3 className="m-t-30"> Práca </h3>
					<div >
						<table className="table">
							<thead >
								<tr >
									<th >Názov</th>
									<th width="100">Mn.</th>
									<th width="250">Rieši</th>
									<th width="170">Typ</th>
								</tr>
							</thead>
							<tbody>
								{
									this.props.subtasks.map((subtask)=>
									<tr key={subtask.id}>
											<td>
												{
													subtask.id === this.props.focusedSubtask
													? this.props.editedSubtaskTitle
													: subtask.title
												}
											</td>
											<td>
												{
													subtask.id === this.props.focusedSubtask
													? this.props.editedSubtaskQuantity
													: subtask.quantity
												}
											</td>
											<td>{subtask.assignedTo ? subtask.assignedTo.email : "" }</td>
											<td>{subtask.workType ? subtask.workType.title : ""}</td>
										</tr>)
								}
						</tbody>
					</table>
				</div>
				<div className="row justify-content-end">
					<div className="col-md-3">
						<p className="text-right">
							<b>Sub-total: </b>
							{(this.props.subtasks.map((subtask)=>parseFloat(subtask.totalPrice)).reduce((acc, cur)=> acc+cur,0)).toFixed(2)}
						</p>

						</div>
					</div>
				</div>

			</div>
		);
	}
}
