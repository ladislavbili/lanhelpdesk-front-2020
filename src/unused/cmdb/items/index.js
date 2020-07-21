import React, { Component } from 'react';
import {Button} from 'reactstrap';
import {rebase} from '../../index';


export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			items:[],
			companies:[],
			statuses:[],
		};
	}

	componentWillMount(){
		this.ref = rebase.listenToCollection('/cmdb-items', {
			context: this,
			withIds: true,
			then:content=>{this.setState({items:content})},
		});
		this.ref2 = rebase.listenToCollection('/cmdb-statuses', {
			context: this,
			withIds: true,
			then:content=>{this.setState({statuses:content})},
		});
		this.ref3 = rebase.listenToCollection('/companies', {
			context: this,
			withIds: true,
			then:content=>{this.setState({companies:content})},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
		rebase.removeBinding(this.ref2);
		rebase.removeBinding(this.ref3);
	}

	getData(){
		let newItems= this.state.items.map((item)=>{
			let newItem={...item};
			let company = this.state.companies.find((i)=>i.id===item.company);
			if(company!==undefined){
				newItem.company = company.title;
			}else{
				newItem.company = '';
			}
			let status = this.state.statuses.find((i)=>i.id===item.status);
			if(status!==undefined){
				newItem.status = status.title;
			}else{
				newItem.status = '';
			}
			return newItem;
		});
		return newItems.filter((item)=>
			(item.title.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.IP.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.company.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.status.toLowerCase().includes(this.state.search.toLowerCase()))
		)
	}



	render() {
		return (
			<div>
				<div className="commandbar row">
					<div className="commandbar-item ml-2">
						<input
							type="text"
							value={this.state.search}
							className="form-control command-search"
							onChange={(e)=>this.setState({search:e.target.value})}
							placeholder="Search" />
					</div>
					<Button color="primary" className="mb-auto mt-auto" onClick={()=>{
							this.props.history.push('/cmdb/item/add');
						}}>
						<i className="fa fa-plus clickable pr-2"/>
						Item
					</Button>
				</div>
				<div className="fit-with-header scrollable">
					<h2>Items</h2>
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
										<th>Item name</th>
										<th>Company</th>
										<th>IP</th>
										<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{
									this.getData().map((item)=>
										<tr key={item.id} className="clickable" onClick={()=>this.props.history.push('/cmdb/item/'+item.id)}>
												<td>{item.title}</td>
												<td>{item.company}</td>
												<td>{item.IP.map((item2)=><span key={item2}>{item2}  </span>)}</td>
												<td>{item.status}</td>
										</tr>
									)
								}
							</tbody>
						</table>
				</div>
			</div>
			);
		}
	}
