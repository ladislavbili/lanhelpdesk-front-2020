import React, { Component } from 'react';
import { Button, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import {timestampToString} from '../../helperFunctions';
import TaskEditModal from './taskEditModal';
import { connect } from "react-redux";
import classnames from 'classnames';
import TaskEdit from './taskEditColumn';
import TaskEmpty from './taskEmpty';


const statuses = [{id:0,title:'New'},{id:1,title:'Open'},{id:2,title:'Pending'},{id:3,title:'Closed'}]

class TaskList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			tasks:[],
			users:[],
			newTitle:'',
			statusFilter:[],
			statuses:[0,1,2,3],
			saving:false,
			openedID:null,
			editOpened:false
		};
		this.ref=null;
		this.fetchData.bind(this);
		this.addTask.bind(this);
		this.fetchData(this.props.match.params.projectID);
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.projectID!==props.match.params.projectID){
			rebase.removeBinding(this.ref);
			rebase.removeBinding(this.ref2);
			this.fetchData(props.match.params.projectID);
		}
	}

	fetchData(id){
		if(id==='all'){
			this.ref = rebase.listenToCollection('/proj-tasks', {
				context: this,
				withIds: true,
				then:tasks=>{this.setState({tasks})},
			});

		}else{
			this.ref = rebase.listenToCollection('/proj-tasks', {
				context: this,
				withIds: true,
				query: (ref) => ref.where('project', '==', id),
				then:tasks=>{this.setState({tasks})},
			});
		}

		this.ref2 = rebase.listenToCollection('/users', {
			context: this,
			withIds: true,
			then:users => {this.setState({users})},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
		rebase.removeBinding(this.ref2);
	}

	getData(){
		let tasks = this.state.tasks.map((item)=>{
			return{
				...item,
				assignedTo:this.state.users.find((user)=>user.id===item.assignedTo),
				assignedBy:this.state.users.find((user)=>user.id===item.assignedBy),
				status:statuses.find((status)=>status.id===item.status)
			}
		});
		return tasks.filter((item)=>
				item.status && this.state.statuses.includes(item.status.id) &&
				(this.props.match.params.milestoneID === 'all' || (item.milestone ? item.milestone === this.props.match.params.milestoneID : false))
			).filter((item)=>
			(item.title && item.title.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.createdAt && timestampToString(item.createdAt).toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.assignedTo && item.assignedTo.email.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.assignedBy && item.assignedBy.email.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.status && item.status.title.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.hours && item.hours.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.deadline && timestampToString(item.deadline).toLowerCase().includes(this.state.search.toLowerCase()))
		)
	}


	addTask(){
		this.setState({saving:true});
		rebase.addToCollection('/proj-tasks',
		{title:this.state.newTitle,
			project:this.props.match.params.projectID!=='all'?this.props.match.params.projectID:null,
			status:0,
			createdAt: (new Date()).getTime(),
			hours: 0,
			price:0,
			milestone: this.props.match.params.milestoneID !== 'all' ? this.props.match.params.milestoneID : null,
		})
		.then(()=>{
			this.setState({newTitle:'',saving:false})
		})
	}



	render() {
		return (
			<div>
				<div className="commandbar p-l-20">
					<div className="search-row">
					<div className="search">
						<button className="search-btn" type="button">
							<i className="fa fa-search" />
						</button>
						<input
							type="text"
							value={this.state.search}
							className="form-control search-text"
							onChange={(e)=>this.setState({search:e.target.value})}
							placeholder="Search" />
					</div>

						<Button className="btn-link center-hor">
							Global
						</Button>
					</div>

						<span className="center-hor m-l-10">
								<Input
									type="checkbox"
									id="check-new"
									checked={this.state.statuses.includes(0)}
									onChange={()=>{
										this.setState({
											statuses: this.state.statuses.includes(0)?this.state.statuses.filter((item)=>item!==0):[...this.state.statuses,0]
										})
									}} />{' '}
								<Label htmlFor="check-new" check className="clickable m-l-15">
									New
								</Label>
						</span>

						<span className="center-hor m-l-10">
								<Input type="checkbox"
									id="check-open"
									checked={this.state.statuses.includes(1)}
									onChange={()=>{
										this.setState({
											statuses: this.state.statuses.includes(1)?this.state.statuses.filter((item)=>item!==1):[...this.state.statuses,1]
										})
									}} />{' '}
								<Label htmlFor="check-open" check className="clickable m-l-15">
									Open
								</Label>
						</span>

						<span className="center-hor m-l-10">
								<Input type="checkbox"
									id="check-pending"
									checked={this.state.statuses.includes(2)}
									onChange={()=>{
										this.setState({
											statuses: this.state.statuses.includes(2)?this.state.statuses.filter((item)=>item!==2):[...this.state.statuses,2]
										})
									}} />{' '}
								<Label htmlFor="check-pending" check className="clickable m-l-15">
									Pending
								</Label>
						</span>

						<span className="center-hor m-l-10">
								<Input type="checkbox"
									id="check-close"
									checked={this.state.statuses.includes(3)}
									onChange={()=>{
										this.setState({
											statuses: this.state.statuses.includes(3)?this.state.statuses.filter((item)=>item!==3):[...this.state.statuses,3]
										})
									}} />{' '}
								<Label htmlFor="check-close" check className="clickable m-l-15">
									Closed
								</Label>
						</span>
					</div>

				<div className="fit-with-header-and-commandbar row">
					<div className="p-20 scrollable golden-ratio-618" style={this.props.layout===1?{flex:'auto'}:{}}>
						<h2>Tasks</h2>

							<div className="p-2 max-width-400">
								<div className="input-group">
									<input
										type="text"
										className="form-control h-30"
										value={this.state.newTitle}
										onChange={(e)=>this.setState({newTitle:e.target.value})}
										placeholder="New task name"
										onKeyPress={(e)=>{
			                if(e.key==='Enter' && !this.state.saving && this.state.newTitle!==''){
			                  this.addTask();
			                }
			              }}
									/>
									<div className="input-group-append">
										<button className="btn"
											type="button"
											disabled={this.state.saving || this.state.newTitle===''}
											onClick={this.addTask.bind(this)}>
											<i className="fa fa-plus" />
										</button>
									</div>
								</div>
							</div>

						<table className={classnames({ 'project-table-fixed': this.props.layout === 0, table:true})}>
								<thead>
									<tr>
										<th>Created</th>
										<th>Title</th>
										<th>Assigned by</th>
										<th>Assigned to</th>
										<th>Status</th>
										<th>Deadline</th>
										<th>Hours</th>
										{/*<th>Price</th>*/}
									</tr>
								</thead>
								<tbody>
									{
										this.getData().map((item)=>
											<tr
												className={classnames({ 'active': this.props.match.params.taskID === item.id, clickable:true })}
												key={item.id}
												onClick={()=>{
													if(this.props.layout===1){
														this.setState({editOpened:true, openedID:item.id});
													}else{
														this.props.history.push(`/projects/${this.props.match.params.projectID}/${this.props.match.params.milestoneID}/edit/${item.id}`)
													}
											}}>
												<td>{item.createdAt?timestampToString(item.createdAt):'No date'}</td>
												<td>{item.title}</td>
												<td>{item.assignedBy?item.assignedBy.email:'No user'}</td>
												<td>{item.assignedTo?item.assignedTo.email:'No user'}</td>
												<td>{item.status.title}</td>
												<td>{item.deadline?timestampToString(item.deadline):'No deadline'}</td>
												<td>{item.hours?item.hours:0}</td>
												{/*<td>{item.price?item.price:0}</td>*/}
											</tr>
										)
									}
									<tr>
										<td colSpan="6">
											<b>Totals:</b>
										</td>
										<td>
												{
													this.getData().reduce((acc, cur)=>{
														let hours = parseFloat(cur.hours);
														if(!isNaN(hours)){
															acc+=hours;
														}
														return acc;
													},0)
												}
										</td>
								{/*
										<td>
											{
												this.getData().reduce((acc, cur)=>{
													let price = parseFloat(cur.price);
													if(!isNaN(price)){
														acc+=price;
													}
													return acc;
												},0)
											}
										</td>
									*/}
									</tr>
								</tbody>
							</table>
					</div>
					{!this.props.match.params.taskID && this.props.layout === 0 && <TaskEmpty />}
					{this.props.match.params.taskID && this.props.layout === 0 && <TaskEdit {...this.props} id={this.props.match.params.taskID} toggle={()=>{}}/>}



					</div>
					<TaskEditModal id={this.state.openedID} opened={this.state.editOpened} toggle={()=>this.setState({editOpened:!this.state.editOpened})} />
				</div>
			);
		}
	}

	const mapStateToProps = ({ appReducer }) => {
		return { layout:appReducer.layout };
	};

	export default connect(mapStateToProps, { })(TaskList);
