import React, { Component } from 'react';
import TasksTwoEdit from './TasksTwoEdit';
import {rebase} from '../../index';
import { connect } from "react-redux";
import {timestampToString} from '../../helperFunctions';

class TasksRow extends Component {

	constructor(props){
		super(props);
		this.state={
			tasks:[],
			statuses:[],
			projects:[],
			users:[],
			tags:[]
		}
	}
	componentWillMount(){
		this.ref1 = rebase.listenToCollection('/help-tasks', {
			context: this,
			withIds: true,
			then:content=>{this.setState({tasks:content })},
		});
		this.ref2 = rebase.listenToCollection('/help-statuses', {
			context: this,
			withIds: true,
			then:content=>{this.setState({statuses:content })},
		});
		this.ref3 = rebase.listenToCollection('/help-projects', {
			context: this,
			withIds: true,
			then:content=>{this.setState({projects:content })},
		});
		this.ref4 = rebase.listenToCollection('/users', {
			context: this,
			withIds: true,
			then:content=>{this.setState({users:content })},
		});
		this.ref5 = rebase.listenToCollection('/help-tags', {
			context: this,
			withIds: true,
			then:content=>{this.setState({tags:content })},
		});
	}

	filterTasks(tasks){

		let newTasks=tasks.map((task)=>{
			return {
				...task,
				status:this.state.statuses.find((status)=>status.id===task.status),
				project:this.state.projects.find((project)=>project.id===task.project),
				requester:this.state.users.find((user)=>user.id===task.requester),
				tags:this.state.tags.filter((tag)=>task.tags && task.tags.includes(tag.id)),
				assignedTo:this.state.users.filter((user)=>task.assignedTo && task.assignedTo.includes(user.id))
			}
		});
		return newTasks.filter((task)=>{
			return (this.props.filter.status===null||(task.status && task.status.id===this.props.filter.status)) &&
			(this.props.filter.requester===null||(task.requester && task.requester.id===this.props.filter.requester)) &&
			(this.props.filter.workType===null||(task.type===this.props.filter.workType)) &&
			(this.props.filter.company===null||task.company===this.props.filter.company) &&
			(this.props.filter.assigned===null||(task.assignedTo && task.assignedTo.includes(this.props.filter.assigned))) &&
			(this.props.filter.statusDateFrom===''||task.statusChange >= this.props.filter.statusDateFrom) &&
			(this.props.filter.statusDateTo===''||task.statusChange <= this.props.filter.statusDateTo) &&
			((task.status?task.status.title:'')+task.title+task.id+
				(task.deadline?timestampToString(task.deadline):'')+
				(task.requester?(task.requester.email+task.requester.name+' '+task.requester.surname):'')+
				(task.statusChange?timestampToString(task.statusChange):'')+
				(task.tags.reduce(((cur,item)=>cur+item.title+' '),''))+
				(task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.email+user.name+' '+user.surname+' ',''):'')
			).toLowerCase().includes(this.props.search.toLowerCase()) &&

			(this.props.project===null||(task.project && task.project.id===this.props.project))
				}
			);
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
		rebase.removeBinding(this.ref2);
		rebase.removeBinding(this.ref3);
		rebase.removeBinding(this.ref4);
		rebase.removeBinding(this.ref5);
	}

	render() {
		return (
			<div>
				<div className="row taskList-container">
					<div className="col-lg-4 scrollable fit-with-header-and-commandbar">
						{
							this.filterTasks(this.state.tasks).map((task)=>
							<ul
								className={"taskList list-unstyled clickable"+(this.props.match.params.taskID===task.id?' active selected-item':'')}
								id="upcoming"
								onClick={()=>{
									if(this.props.match.params.listID){
										this.props.history.push('/helpdesk/taskList/i/'+this.props.match.params.listID+'/'+task.id);
									}else{
										this.props.history.push('/helpdesk/taskList/'+task.id)}
									}
								}
								key={task.id} >
								<li>
									<div className="">
										<label>#{task.id} {task.title}</label>
									</div>
									<div>
										<p className="pull-right font-13 m-0">
											<span className="label label-info">{task.status?task.status.title:'Neznámy status'}</span>
										</p>
										<p className="text-muted font-13 m-0">
											<span className="">Zadal: {task.requester?(task.requester.name+' '+task.requester.surname):'Neznámy používateľ'}</span>
										</p>
										<p className="pull-right font-13 m-0">
											<i className="fa fa-clock-o" /> <span>Created: {task.statusChange?timestampToString(task.statusChange):'None'}</span>
										</p>
										<p className="text-muted font-13 m-0">
											<span className="" style={{textOverflow: 'ellipsis'}}>Riesi: {task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.name+' '+user.surname+', ','').slice(0,-2):'Neznámy používateľ'}</span>
										</p>
									</div>
										<p className="pull-right font-13">
											<i className="fa fa-clock-o" /> <span>Dealine: {task.deadline?timestampToString(task.deadline):'None'}</span>
										</p>
										<div className="taskList-tags">
											{task.tags.map((tag)=>
												<span key={tag.id} className="label tag">{tag.title}</span>
											)}
										</div>
								</li>
							</ul>
						)
					}

					</div>
					<div className="col-lg-8 p-0">
						{
							this.props.match.params.taskID && this.props.match.params.taskID==='add' && <TasksTwoEdit />
						}
						{
							this.props.match.params.taskID && this.props.match.params.taskID!=='add' && this.state.tasks.some((item)=>item.id===this.props.match.params.taskID) &&
							<TasksTwoEdit match={this.props.match} columns={true} />
						}

					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ filterReducer }) => {
	const { project, filter, search } = filterReducer;
	return { project, filter, search };
};

export default connect(mapStateToProps, {  })(TasksRow);
