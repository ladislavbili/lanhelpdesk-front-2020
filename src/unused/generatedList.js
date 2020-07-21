import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink} from 'reactstrap';
import classnames from 'classnames';
import {rebase, database} from '../../index';

const attributes=[{title:'Server name',id:'title'},{title:'IP',id:'IP'},{title:'Status',id:'status'},{title:'Company',id:'company'}];

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			attributes:[],
			items:[],
			companies:[],
			statuses:[],
			currentSidebarItem:{title:'None',attributesToDisplay:[]},
		};
		this.ref=null;
		this.ref2=null;
		this.ref3=null;
		this.fetchData.bind(this);
		this.fetchData(this.props.match.params.id);
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.id!==props.match.params.id){
			this.fetchData(props.match.params.id);
		}
	}

	fetchData(id){
		if(this.ref2!==null){
			rebase.removeBinding(this.ref2);
		}
		this.ref2 = rebase.listenToCollection('/cmdb-statuses', {
			context: this,
			withIds: true,
			then:content=>{this.setState({statuses:content})},
		});

		if(this.ref3!==null){
			rebase.removeBinding(this.ref3);
		}
		this.ref3 = rebase.listenToCollection('/companies', {
			context: this,
			withIds: true,
			then:content=>{this.setState({companies:content})},
		});

		rebase.get('cmdb-sidebar/'+id, {
			context: this,
		}).then((currentSidebarItem)=>{
			this.setState({currentSidebarItem});
			if(this.ref!==null){
				rebase.removeBinding(this.ref);
			}
			if(id==="all"){
				this.ref = rebase.listenToCollection('/cmdb-list-items', {
					context: this,
					withIds: true,
					then:content=>{this.setState({items:content})},
				});
			}else{
				this.ref = rebase.listenToCollection('/cmdb-list-items', {
					context: this,
					query: (ref) => ref.where('sidebarItemID', '==', id),
					withIds: true,
					then:content=>{this.setState({items:content})},
				});
			}
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
			let company = this.state.companies.find((item2)=>item2.id===item.company)
			if(company!==undefined){
				newItem.company = company.title;
			}else{
				newItem.company = '';
			}
			let status = this.state.statuses.find((item2)=>item2.id===item.status)
			if(status!==undefined){
				newItem.status = status.title;
			}else{
				newItem.status = '';
			}
			return newItem;
		});
		return newItems.filter((item)=>
			(item.title!==undefined && item.title.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.IP!==undefined && item.IP.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.company!==undefined && item.company.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.status!==undefined && item.status.toLowerCase().includes(this.state.search.toLowerCase()))
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
				</div>
				<div className="fit-with-header scrollable">
					<h2>{this.state.currentSidebarItem.title}</h2>
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
									{
										attributes.filter((item)=>this.state.currentSidebarItem.attributesToDisplay.includes(item.id)).map((header)=>
										<th key={header.id}>
											{header.title}
										</th>
									)
									}
								</tr>
							</thead>
							<tbody>
								{
									this.getData().map((item)=>
										<tr key={item.id}>
											{
												attributes.filter((item)=>this.state.currentSidebarItem.attributesToDisplay.includes(item.id)).map((header)=>
												<td key={header.id}>
													{item[header.id]?item[header.id]:''}
												</td>
											)}
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
