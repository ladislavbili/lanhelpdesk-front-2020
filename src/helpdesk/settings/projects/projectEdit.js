import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import { connect } from "react-redux";
import {storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart, storageHelpProjectsStart, setProject, storageHelpTasksStart} from '../../../redux/actions';
import {rebase, database} from '../../../index';
import firebase from 'firebase';
import {toSelArr, sameStringForms, snapshotToArray,testing} from '../../../helperFunctions';
import Permissions from "../../components/projects/permissions";
import ProjectDefaultValues from "../../components/projects/defaultValues";
import booleanSelects from 'configs/constants/boolSelect'
import { noDef } from 'configs/constants/projects';

class ProjectEdit extends Component{
	constructor(props){
		super(props);
		this.state={
			title: '',
			description: '',
			statuses:[],
			allTags:[],
			users:[],
			types:[],
			companies:[],
			permissions:[],
			lockedRequester: false,

			...noDef,
			saving: false,
			loaded: false,
		}
	}

	storageLoaded(props){
		return props.statusesLoaded &&
			props.tagsLoaded &&
			props.usersLoaded &&
			props.taskTypesLoaded &&
			props.companiesLoaded &&
			props.projectsLoaded &&
			props.tasksLoaded
	}

  componentWillReceiveProps(props){
    if (this.props.item.id !== props.item.id){
			this.setProjectsData(props);
    }

		if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
			this.setData(props);
			this.setProjectsData(props);
		}

		if(!sameStringForms(props.statuses,this.props.statuses) &&
			!sameStringForms(props.tags,this.props.tags) &&
			!sameStringForms(props.users,this.props.users) &&
			!sameStringForms(props.taskTypes,this.props.taskTypes) &&
			!sameStringForms(props.companies,this.props.companies) &&
			!sameStringForms(props.projects,this.props.projects) &&
			!sameStringForms(props.tasks,this.props.tasks)
		){
				this.setData(props);
			}
  }

	componentWillMount(){
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}

		if(!this.props.tagsActive){
			this.props.storageHelpTagsStart();
		}

		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}

		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}

		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}

		if(!this.props.tasksActive){
			this.props.storageHelpTasksStart();
		}

		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		this.setData(this.props);
		this.setProjectsData(this.props);
	}

	setProjectsData(props){
		if(!this.storageLoaded(props)){
			return;
		}

		let project = props.projects.find((project)=>project.id===props.item.id);
		let statuses = toSelArr(props.statuses);
		let allTags = toSelArr(props.tags);
		let users = toSelArr(props.users,'email');
		let types = toSelArr(props.taskTypes);
		let companies = toSelArr(props.companies);

		let status = statuses.find(item=> project.def && item.id===project.def.status.value);
		let tags = allTags.filter(item=> project.def && project.def.tags.value.includes(item.id));
		let assignedTo = users.filter(item=> project.def && project.def.assignedTo.value.includes(item.id));
		let type = types.find(item=> project.def && item.id===project.def.type.value);
		let requester = users.find(item=> project.def && item.id===project.def.requester.value);
		let company = companies.find(item=> project.def && item.id===project.def.company.value);
		let pausal = booleanSelects.find(item=> project.def && project.def.pausal && item.value===project.def.pausal.value);
		let overtime = booleanSelects.find(item=> project.def && project.def.overtime && item.value===project.def.overtime.value);
		let permissions = project.permissions?project.permissions:[];
		permissions = permissions.map((permission)=>{
			return {
				...permission,
				user:users.find((user)=>user.id===permission.user)
			}
		})
		let def = project.def;

		this.setState({
			title:project.title,
			description:project.description?project.description:'',
			lockedRequester: project.lockedRequester ? project.lockedRequester : false,
			permissions,

			status:status?				{...def.status,value:status}					:{def:false, fixed:false, value: null, show:true },
			tags:def?							{...def.tags,value:tags}							:{def:false, fixed:false, value: [], show:true },
			assignedTo:def?				{...def.assignedTo,value:assignedTo}	:{def:false, fixed:false, value: [], show:true },
			type:type?						{...def.type,value:type}							:{def:false, fixed:false, value: null, show:true },
			requester:requester?	{...def.requester,value:requester}		:{def:false, fixed:false, value: null, show:true },
			company:company?			{...def.company,value:company}				:{def:false, fixed:false, value: null, show:true },
			pausal:pausal?				{...def.pausal,value:pausal}					:{def:false, fixed:false, value: booleanSelects[0], show: true },
			overtime:overtime?		{...def.overtime,value:overtime}			:{def:false, fixed:false, value: booleanSelects[0], show: true },
		});
	}

	setData(props){
		if(!this.storageLoaded(props)){
			return;
		}

		this.setState({
      statuses:toSelArr(props.statuses),
      allTags: toSelArr(props.tags),
      users: toSelArr(props.users,'email'),
      types: toSelArr(props.taskTypes),
      companies: toSelArr(props.companies),
    });
	}

	deleteProject(){
		let projectID = this.props.item.id;
		if(window.confirm("Are you sure?")){
			this.props.tasks.filter((task)=>task.project===projectID).map((task)=>this.deleteTask(task));
			rebase.removeDoc('/help-projects/'+projectID).then(()=>{
				this.props.setProject(null);
			});
		}
	}

	deleteTask(task){
		let taskID = task.id;
		Promise.all(
			[
				database.collection('help-task_materials').where("task", "==", taskID).get(),
				database.collection('help-task_custom_items').where("task", "==", taskID).get(),
				database.collection('help-task_works').where("task", "==", taskID).get(),
				database.collection('help-repeats').doc(taskID).get(),
				database.collection('help-comments').where("task", "==", taskID).get()
		]).then(([taskMaterials,customItems, taskWorks,repeat,comments])=>{

			let storageRef = firebase.storage().ref();
			task.attachments.map((attachment)=>storageRef.child(attachment.path).delete());

			rebase.removeDoc('/help-tasks/'+taskID);
			snapshotToArray(taskMaterials).forEach((material)=>rebase.removeDoc('/help-task_materials/'+material.id))
			snapshotToArray(customItems).forEach((item)=>rebase.removeDoc('/help-task_custom_items/'+item.id))
			snapshotToArray(taskWorks).forEach((work)=>rebase.removeDoc('/help-task_works/'+work.id))
			if(repeat.exists){
				rebase.removeDoc('/help-repeats/'+taskID);
			}
			snapshotToArray(comments).forEach((item)=>rebase.removeDoc('/help-comments/'+item.id));
			database.collection('help-calendar_events').where("taskID", "==", taskID).get()
			.then((data)=>{
				snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-calendar_events/'+item.id));
			});
		});
	}

  render(){
		let canReadUserIDs = this.state.permissions.map((permission)=>permission.user.id);
		let canBeAssigned = this.state.users.filter((user)=>canReadUserIDs.includes(user.id));

    return (
      <div className="p-20 fit-with-header-and-commandbar scroll-visible">
				<FormGroup>
					<Label>Project name</Label>
					<Input type="text" className="from-control" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
				</FormGroup>

				<FormGroup>
					<Label htmlFor="body">Popis</Label>
					<Input type="textarea" className="form-control" id="body" placeholder="Zadajte text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
				</FormGroup>

				<Permissions
					addUser={(user)=>{
						this.setState({
							permissions:[...this.state.permissions,{user,read:true,write:false,delete:false,isAdmin:false}]
						})
					}}
					givePermission={(user,permission)=>{
						let permissions=[...this.state.permissions];
						let index = permissions.findIndex((permission)=>permission.user.id===user.id);
						let item = permissions[index];
						item.read=permission.read;
						item.write=permission.write;
						item.delete=permission.delete;
						item.isAdmin=permission.isAdmin;
						if(!item.read){
							permissions.splice(index,1);
							this.setState({permissions,assignedTo:{...this.state.assignedTo,value:this.state.assignedTo.value.filter((user)=>user.id!==item.user.id)}});
						}else{
							this.setState({permissions});
						}
					}}
					permissions={this.state.permissions}
					userID={this.props.currentUser.id}
					isAdmin={this.props.currentUser.userData.role.value===3||testing}
					lockedRequester={this.state.lockedRequester}
					lockRequester={() => this.setState({lockedRequester: !this.state.lockedRequester})}
					/>

					<ProjectDefaultValues
						updateState={(newState)=>this.setState(newState)}
						state={this.state}
						canBeAssigned={canBeAssigned}
						/>

					{((this.state.company.value===null&&this.state.company.fixed)||(this.state.status.value===null&&this.state.status.fixed)||(this.state.assignedTo.value.length===0 && this.state.assignedTo.fixed)||(this.state.type.value===null&&this.state.type.fixed)) && <div className="red" style={{color:'red'}}>
						Status, assigned to, task type and company can't be empty if they are fixed!
					</div>}

					<div className="row">
					<Button
						className="btn"
						disabled={this.state.saving||this.state.title===""||(this.state.company.value===null&&this.state.company.fixed)||(this.state.status.value===null&&this.state.status.fixed)||(this.state.assignedTo.value.length===0 && this.state.assignedTo.fixed)||(this.state.type.value===null&&this.state.type.fixed)}
						onClick={()=>{
							this.setState({saving:true});
							let body = {
								title: this.state.title,
								description: this.state.description,
								lockedRequester: this.state.lockedRequester,
								def:{
									status:this.state.status.value?{...this.state.status,value:this.state.status.value.id}:{def:false,fixed:false, value: null, show:true },
									tags:this.state.tags.value?{...this.state.tags,value:this.state.tags.value.map(item=>item.id)}:{def:false,fixed:false, value: [], show:true },
									assignedTo:this.state.assignedTo.value?{...this.state.assignedTo,value:this.state.assignedTo.value.map(item=>item.id)}:{def:false,fixed:false, value: [], show:true },
									type:this.state.type.value?{...this.state.type,value:this.state.type.value.id}:{def:false,fixed:false, value: null, show:true },
									requester:this.state.requester.value?{...this.state.requester,value:this.state.requester.value.id}:{def:false,fixed:false, value: null, show:true },
									company:this.state.company.value?{...this.state.company,value:this.state.company.value.id}:{def:false,fixed:false, value: null, show:true },
									pausal:this.state.pausal.value?{...this.state.pausal,value:this.state.pausal.value.value}:{def:false,fixed:false, value: false, show:true},
									overtime:this.state.overtime.value?{...this.state.overtime,value:this.state.overtime.value.value}:{def:false,fixed:false, value: false, show:true},
								},
								permissions:this.state.permissions.map((permission)=>{
									return {
										...permission,
										user:permission.user.id,
									}
								})
							};
							rebase.updateDoc(`/help-projects/${this.props.item.id}`, body)
										.then(()=>{
											this.setState({saving:false, opened: false});
									});
					}}>
						{(this.state.saving?'Saving...':'Save project')}
					</Button>
					<Button className="btn-red m-l-5" disabled={this.state.saving} onClick={this.deleteProject.bind(this)}>
						Delete
					</Button>
				</div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpStatuses, storageHelpTags, storageUsers, storageHelpTaskTypes, storageCompanies, storageHelpProjects, storageHelpTasks,userReducer }) => {
	const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { tagsActive, tags, tagsLoaded } = storageHelpTags;
	const { usersActive, users, usersLoaded } = storageUsers;
	const { taskTypesActive, taskTypes, taskTypesLoaded } = storageHelpTaskTypes;
	const { companiesActive, companies, companiesLoaded } = storageCompanies;
	const { projectsActive, projects, projectsLoaded } = storageHelpProjects;
	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
	return {
		currentUser:userReducer,
		statusesActive, statuses, statusesLoaded,
		tagsActive, tags, tagsLoaded,
		usersActive, users, usersLoaded,
		taskTypesActive, taskTypes, taskTypesLoaded,
		companiesActive, companies, companiesLoaded,
		projectsActive, projects, projectsLoaded,
		tasksActive, tasks, tasksLoaded,
	 };
};

export default connect(mapStateToProps, { storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart, storageHelpProjectsStart, setProject, storageHelpTasksStart })(ProjectEdit);
