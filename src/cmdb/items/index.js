import React, { Component } from 'react';
import {Button} from 'reactstrap';
import { connect } from "react-redux";
import {rebase} from '../../index';
import {setCompany, setCMDBAscending, setCMDBOrderBy} from '../../redux/actions';
import classnames from "classnames";

class ItemList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			activeSearch:'',
			items:[],
			companies:[],
			statuses:[],
			sidebarItem:null,

			filterData: [],
		};
		this.fetchData.bind(this);
		this.getSortValue.bind(this);
	}

	fetchData(id){
		rebase.get('cmdb-sidebar', {
			context: this,
			query: (ref) => ref.where('url', '==', ""+id),
		}).then((sidebarItem)=>this.setState({sidebarItem:sidebarItem[0]}));
		if(this.ref){
			rebase.removeBinding(this.ref);
		}
		this.ref = rebase.listenToCollection('/cmdb-items', {
			context: this,
			withIds: true,
			query: (ref) => ref.where('sidebarID', '==', ""+id),
			then:content=>{this.setState({items:content})},
		});
	}

	componentWillReceiveProps(props){
		if(props.match.params.sidebarID!==this.props.match.params.sidebarID){
			this.fetchData(props.match.params.sidebarID)
		}
	}

	componentWillMount(){
		this.fetchData(this.props.match.params.sidebarID);
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

	getSortValue(item){
		switch (this.props.orderBy) {
			case 'IP': return item.IP.reduce(((ac,item)=>ac+= item+' '),'');
			case 'company': return item.status?item.status.title:null;
			case 'title': return item.title;
			case 'status': return item.status?item.status.title:null;
			default:

		}
	}

	getData(){
		let newItems= this.state.items.map((item)=>{
			let newItem={...item};
				newItem.company = this.state.companies.find((company)=>company.id===item.company);
				newItem.status = this.state.statuses.find((status)=>status.id===item.status);
			return newItem;
		});
		return newItems.filter((item)=>
			(item.title.toLowerCase().includes(this.state.activeSearch.toLowerCase()))||
			(item.IP.reduce(((ac,item)=>ac+= item+' '),'').toLowerCase().includes(this.state.activeSearch.toLowerCase()))||
			(item.company && item.company.title.toLowerCase().includes(this.state.activeSearch.toLowerCase()))||
			(item.status && item.status.title.toLowerCase().includes(this.state.activeSearch.toLowerCase()))
		).filter((item)=>this.props.company===null|| this.props.company === (item.company?item.company.id:'')
		).sort((item1,item2)=>{
			let val1 = this.getSortValue(item1);
			let val2 = this.getSortValue(item2);
			if(this.props.ascending){
				if(val1===null){
					return 1;
				}
				return val1 > val2? 1 : -1;
			}else{
				if(val2===null){
					return 1;
				}
				return val1 < val2? 1 : -1;
			}
		})
	}

	clearFilter(){
		if(window.confirm("Are you sure you want to clear the filter?")){
			let newFilterData = [];
			this.setState({
				filterData: newFilterData,
			});
		}
	}


	render() {
		return (
			<div className="row">
				<div className="commandbar p-l-20">
					<div className="center-hor">
						<h2>{this.state.sidebarItem?this.state.sidebarItem.title:'Item'}</h2>
					</div>
				</div>

				<div className="fit-with-header-and-commandbar full-width scroll-visible task-container">
					<div className="d-flex m-b-10 flex-row">
						<div className={classnames({"m-l-0": this.props.layout === 0},

																			 {"m-l-20": this.props.layout !== 0},
																			 "search-row")}>
							<div className="search">
								<button className="search-btn" type="button" onClick={()=>this.setState({activeSearch:this.state.search})}>
									<i className="fa fa-search" />
								</button>
								<input
									type="text"
									className="form-control search-text"
									value={this.state.search}
									onKeyPress={(e)=>{
										if(e.key==='Enter'){
											this.setState({activeSearch:this.state.search})
										}
									}}
									onChange={(e)=>this.setState({search:e.target.value})}
									placeholder="Search"
									/>
							</div>

							<Button
								className="btn-link center-hor"
								onClick={()=>{
									this.props.setCompany(null);
								}}
								>
								Global
							</Button>
						</div>

						<Button
							className="btn-link center-hor"
							onClick={()=>{
								this.props.history.push('/cmdb/i/'+this.props.match.params.sidebarID+'/i/add');
							}}
							> <i className="fa fa-plus text-highlight p-l-5 p-r-5"/>
							{(this.state.sidebarItem?this.state.sidebarItem.title:'item')}
						</Button>

						<div className="d-flex flex-row align-items-center ml-auto m-r-20">
							<div className="text-basic m-r-5 m-l-5">
								Sort by
							</div>

							<select
								value={this.props.orderBy}
								className="invisible-select text-bold text-highlight"
								onChange={(e)=>this.props.setCMDBOrderBy(e.target.value)}>
								{
									[{value:'title',label:'Title'},{value:'company',label:'Company'},{value:'IP',label:'IP'},{value:'status',label:'Status'}].map((item,index)=>
									<option value={item.value} key={index}>{item.label}</option>
								)
								}
							</select>

							{ !this.props.ascending &&
								<button type="button" className="btn btn-link btn-outline-blue waves-effect center-hor" onClick={()=>this.props.setCMDBAscending(true)}>
									<i
										className="fas fa-arrow-up"
										/>
								</button>
							}

							{ this.props.ascending &&
								<button type="button" className="btn btn-link btn-outline-blue waves-effect center-hor" onClick={()=>this.props.setCMDBAscending(false)}>
									<i
										className="fas fa-arrow-down"
										/>
								</button>
						}
						</div>
					</div>

						<table className="table">
							<thead>
								<tr>
										<th>Name</th>
										<th>Company</th>
										<th>IP</th>
										<th colSpan="2">Status</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									 <th key="0">
											<input
												type="text"
												value={this.state.filterData[0]}
												className="form-control hidden-input"
												style={{fontSize: "12px", marginRight: "10px"}}
												onChange={(e) => {
													let newFilterData = [...this.state.filterData];
													newFilterData[0] = e.target.value;
													this.setState({
														filterData: newFilterData
													});
												}}/>
									 </th>
									 <th key="1">
											<input
												type="text"
												value={this.state.filterData[1]}
												className="form-control hidden-input"
												style={{fontSize: "12px", marginRight: "10px"}}
												onChange={(e) => {
													let newFilterData = [...this.state.filterData];
													newFilterData[1] = e.target.value;
													this.setState({
														filterData: newFilterData
													});
												}}/>
									 </th>
									 <th key="2">
											<input
												type="text"
												value={this.state.filterData[2]}
												className="form-control hidden-input"
												style={{fontSize: "12px", marginRight: "10px"}}
												onChange={(e) => {
													let newFilterData = [...this.state.filterData];
													newFilterData[2] = e.target.value;
													this.setState({
														filterData: newFilterData
													});
												}}/>
									 </th>
									 <th key="3">
											<input
												type="text"
												value={this.state.filterData[3]}
												className="form-control hidden-input"
												style={{fontSize: "12px", marginRight: "10px"}}
												onChange={(e) => {
													let newFilterData = [...this.state.filterData];
													newFilterData[3] = e.target.value;
													this.setState({
														filterData: newFilterData
													});
												}}/>
									 </th>
									 <th key="4" width="30px">
										 <button type="button" className="btn btn-link waves-effect" onClick={this.clearFilter.bind(this)}>
											 <i
												 className="fas fa-times commandbar-command-icon m-l-8 text-highlight"
												 />
										 </button>
									 </th>
								 </tr>
								{
									this.getData().map((item)=>
										<tr key={item.id} className="clickable" onClick={()=>this.props.history.push('/cmdb/i/'+this.props.match.params.sidebarID+'/'+item.id)}>
												<td>{item.title}</td>
												<td>{item.company?item.company.title:'Žiadna'}</td>
												<td>{item.IP.map((item2)=><span key={item2}>{item2}  </span>)}</td>
												<td colSpan="2">{item.status?item.status.title:'Žiadny'}</td>

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


	const mapStateToProps = ({ filterReducer, cmdbReducer }) => {
		const { company } = filterReducer;
		const { ascending, orderBy } = cmdbReducer;
		return { ascending, orderBy,company };
	};

	export default connect(mapStateToProps, { setCompany, setCMDBAscending, setCMDBOrderBy})(ItemList);
