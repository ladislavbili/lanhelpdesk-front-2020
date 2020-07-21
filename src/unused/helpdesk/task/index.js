import React, { Component } from 'react';
import { connect } from "react-redux";
import {rebase} from '../../index';
import ShowData from '../../components/showData';
import {timestampToString} from '../../helperFunctions';
import TaskEdit from './taskEdit';
import TaskEmpty from './taskEmpty';
import {setTasksOrderBy, setTasksAscending} from '../../redux/actions';


class TasksRow extends Component {

	constructor(props){
		super(props);
		this.state={
			tasks:[],
			statuses:[],
			projects:[],
			users:[],
			tags:[],
			companies:[],
			filterName:''
		}
		this.filterTasks.bind(this);
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
	this.ref6 = rebase.listenToCollection('/companies', {
		context: this,
		withIds: true,
		then:content=>{this.setState({companies:content })},
	});
	this.getFilterName(this.props.match.params.listID);
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
		rebase.removeBinding(this.ref2);
		rebase.removeBinding(this.ref3);
		rebase.removeBinding(this.ref4);
		rebase.removeBinding(this.ref5);
		rebase.removeBinding(this.ref6);
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.listID!==props.match.params.listID){
			this.getFilterName(props.match.params.listID);
		}
	}

	getFilterName(id){
		if(!id){
			this.setState({filterName:''});
			return;
		}else if(id==='all'){
			this.setState({filterName:'All'});
			return;
		}
		rebase.get('help-filters/'+id, {
			context: this,
		}).then((result)=>{
			this.setState({filterName:result.title});
		})
	}

	filterTasks(){
		let newTasks=this.state.tasks.map((task)=>{
			return {
				...task,
				company:this.state.companies.find((company)=>company.id===task.company),
				status:this.state.statuses.find((status)=>status.id===task.status),
				project:this.state.projects.find((project)=>project.id===task.project),
				requester:this.state.users.find((user)=>user.id===task.requester),
				tags:this.state.tags.filter((tag)=>task.tags && task.tags.includes(tag.id)),
				assignedTo:this.state.users.filter((user)=>task.assignedTo && task.assignedTo.includes(user.id)),
				id:parseInt(task.id)
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
			(this.props.project===null||(task.project && task.project.id===this.props.project))
		})
	}

	render() {
		let link='';
		if(this.props.match.params.hasOwnProperty('listID')){
			link = '/helpdesk/taskList/i/'+this.props.match.params.listID;
		}else{
			link = '/helpdesk/taskList'
		}
		return (
			<ShowData
				data={this.filterTasks()}
				filterBy={[
					{value:'assignedTo',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
					{value:'tags',type:'list',func:((cur,item)=>cur+item.title+' ')},
					{value:'statusChange',type:'date'},
					{value:'createdAt',type:'date'},
					{value:'requester',type:'user'},
					{value:'deadline',type:'date'},
					{value:'status',type:'object'},
					{value:'title',type:'text'},
					{value:'id',type:'int'},
					{value:'company',type:'object'},
				]}
				displayCol={(task)=>
					<li className="" >
						<div className="m-b-0">
							<label>#{task.id} {task.title}</label>
							<p className="pull-right m-0 font-13">
								<span className="label label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>{task.status?task.status.title:'Neznámy status'}</span>
							</p>
						</div>
						<div className="m-t-0">
							<p className="pull-right m-b-0 font-13">
								<i className="fa fa-clock-o" /> <span>Created: {task.createdAt?timestampToString(task.createdAt):'None'}</span>
							</p>
							<p className="text-muted m-b-0 font-13">
								<span className="">Zadal: {task.requester?(task.requester.name+' '+task.requester.surname):'Neznámy používateľ'}</span>
							</p>
							<p className="pull-right m-r-5 font-13">
								<i className="fa fa-clock-o" /> <span>Dealine: {task.deadline?timestampToString(task.deadline):'None'}</span>
							</p>
							<p className="text-muted m-b-0 font-13">
								<span className="" style={{textOverflow: 'ellipsis'}}>Riesi: {task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.name+' '+user.surname+', ','').slice(0,-2):'Neznámy používateľ'}</span>
							</p>
						</div>
							<div className="taskList-tags">
								{task.tags.map((tag)=>
									<span key={tag.id} className="label label-info m-r-5">{tag.title}</span>
								)}
							</div>
					</li>
				}
				displayValues={[
					{value:'id',label:'ID',type:'int'},
					{value:'status',label:'Status',type:'object'},
					{value:'title',label:'Title',type:'text'},
					{value:'requester',label:'Requester',type:'user'},
					{value:'company',label:'Company',type:'object'},
					{value:'assignedTo',label:'Assigned to',type:'list',func:(items)=>
						(<div>
							{
								items.map((item)=><div key={item.id}>{item.name+' '+item.surname + ' ('+item.email+')'}</div>)
							}
						</div>)
					},
					{value:'createdAt',label:'Created at',type:'date'},
					{value:'tags',label:'Tags',type:'list',func:(items)=>
						(<div>
						{items.map((item)=>
							<span key={item.id} className="label label-info m-r-5">{item.title}</span>)
						}
						</div>)
					},
					{value:'deadline',label:'Deadline',type:'date'}
				]}
				orderByValues={[
					{value:'id',label:'ID',type:'int'},
					{value:'status',label:'Status',type:'object'},
					{value:'title',label:'Title',type:'text'},
					{value:'requester',label:'Requester',type:'user'},
					{value:'assignedTo',label:'Assigned to',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
					{value:'createdAt',label:'Created at',type:'date'},
					{value:'tags',label:'Tags',type:'list',func:((cur,item)=>cur+item.title+' ')},
					{value:'deadline',label:'Deadline',type:'date'}
				]}
				link={link}
				history={this.props.history}
				orderBy={this.props.orderBy}
				setOrderBy={this.props.setTasksOrderBy}
				ascending={this.props.ascending}
				setAscending={this.props.setTasksAscending}
				itemID={this.props.match.params.taskID}
				listID={this.props.match.params.listID}
				match={this.props.match}
				isTask={true}
				listName={this.state.filterName}
				edit={TaskEdit}
				empty={TaskEmpty}
				 />
		);
	}
}

const mapStateToProps = ({ filterReducer, taskReducer }) => {
	const { project, filter } = filterReducer;
	const { orderBy, ascending } = taskReducer;
	return { project, filter,orderBy,ascending };
};

export default connect(mapStateToProps, { setTasksOrderBy, setTasksAscending })(TasksRow);
