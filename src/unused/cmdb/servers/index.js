import React, { Component } from 'react';
import {Button} from 'reactstrap';
import {rebase} from '../../index';


export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			servers:[],
			companies:[],
			statuses:[],
		};
	}

	componentWillMount(){
		this.ref = rebase.listenToCollection('/cmdb-servers', {
			context: this,
			withIds: true,
			then:content=>{this.setState({servers:content})},
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
		let newServers= this.state.servers.map((server)=>{
			let newServer={...server};
			let company = this.state.companies.find((item)=>item.id===server.company)
			if(company!==undefined){
				newServer.company = company.title;
			}else{
				newServer.company = '';
			}
			let status = this.state.statuses.find((item)=>item.id===server.status)
			if(status!==undefined){
				newServer.status = status.title;
			}else{
				newServer.status = '';
			}
			return newServer;
		});
		return newServers.filter((server)=>
			(server.title.toLowerCase().includes(this.state.search.toLowerCase()))||
			(server.IP.toLowerCase().includes(this.state.search.toLowerCase()))||
			(server.company.toLowerCase().includes(this.state.search.toLowerCase()))||
			(server.status.toLowerCase().includes(this.state.search.toLowerCase()))
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
							this.props.history.push('/cmdb/server/add');
						}}>
						<i className="fa fa-plus clickable pr-2"/>
						Server
					</Button>
				</div>
				<div className="fit-with-header scrollable">
					<h2>Servers</h2>
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
										<th>Server name</th>
										<th>Company</th>
										<th>IP</th>
										<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{
									this.getData().map((item)=>
										<tr key={item.id} className="clickable" onClick={()=>this.props.history.push('/cmdb/servers/'+item.id)}>
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
