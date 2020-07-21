import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import TaskAdd from '../../task/taskAddContainer';
import Filter from '../filter';
import ProjectEdit from '../projects/projectEdit';
import ProjectAdd from '../projects/projectAdd';
import MilestoneEdit from '../milestones/milestoneEdit';
import MilestoneAdd from '../milestones/milestoneAdd';
import { toSelArr, sameStringForms,testing } from 'helperFunctions';
import {
	setProject,
	setMilestone,
	setFilter,
	storageHelpFiltersStart,
	storageHelpProjectsStart,
	storageHelpMilestonesStart,
	setHelpSidebarProject,
	setHelpSidebarMilestone,
	setHelpSidebarFilter
} from 'redux/actions';

import { getEmptyFilter } from 'configs/fixedFilters';
import {sidebarSelectStyle} from 'configs/components/select';
import { dashboard, addProject, allMilestones, addMilestone } from 'configs/constants/sidebar';
import settings from 'configs/constants/settings';
import classnames from "classnames";

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			openProjectAdd: false,
			openMilestoneAdd: false,
			isColumn: false,
			filters:[],
			search: '',
			activeTab:0,
			projects:this.props.currentUser.userData.role.value>0?[dashboard,addProject]:[dashboard],
			milestones:[allMilestones],

			projectChangeDate:(new Date()).getTime(),
		};
		this.readFilterFromURL.bind(this);
	}

	componentWillReceiveProps(props){
		if(!sameStringForms(props.filters,this.props.filters)){
			this.setState({
				filters: props.filters.filter((filter) => (filter.createdBy === props.currentUser.id || filter.public) && this.filterByRole(filter, props) ),
			})
			this.props.setHelpSidebarFilter((this.props.filterState && props.filters.length>0) ? props.filters.find((filter)=>filter.id===this.props.filterState.id):null);
		}

		if(!this.props.filtersLoaded && props.filtersLoaded){
			this.readFilterFromURL(props);
		}

		if(!sameStringForms(props.projects,this.props.projects)||!sameStringForms(this.props.currentUser,props.currentUser)){
			let project = toSelArr([dashboard].concat(props.projects)).find((item)=>item.id===props.project);
			this.setState({
				projects:toSelArr([dashboard].concat(props.projects).concat(props.currentUser.userData.role.value>0?[addProject]:[]))
			});
			this.props.setHelpSidebarProject(project?project:dashboard);
		}
		if(!sameStringForms(props.milestones,this.props.milestones)||!sameStringForms(this.props.currentUser,props.currentUser)){
			let milestone = toSelArr([allMilestones].concat(props.milestones)).find((item)=>item.id===props.milestone);
			this.props.setHelpSidebarMilestone(milestone?milestone:dashboard);
			this.setState({
				milestones:toSelArr([allMilestones].concat(props.milestones)),
			});
		}
	}

	filterByRole(filter, props){
		if( !filter.roles ){
			return filter.createdBy === props.currentUser.id && !filter.public;
		}
		return filter.roles.includes(`${props.currentUser.userData.role.value}`)
	}

	readFilterFromURL(props){
		let url = props.location.pathname;
		if(url.includes('helpdesk/settings/')){
			return;
		}
		url = url.substring(url.indexOf('taskList/i/')+'taskList/i/'.length,url.length);
		if(url.includes('/')){
			url = url.substring(0,url.indexOf('/'));
		}
		let filterID = url;
		/*
		let filter = fixedFilters.find( ( filter ) => filter.id === filterID )
		if(filter !== undefined ){
			this.props.setHelpSidebarFilter(null);
			props.setFilter( filter.filter );
		}
		*/
		let filter = props.filters.find((filter)=>filter.id === filterID);
		if( filter !== undefined ){
			props.setHelpSidebarFilter(filter);
			props.setFilter({
				...filter.filter,
				updatedAt:(new Date()).getTime()
			});
		}
	}

	componentWillMount(){
		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		let project = toSelArr([dashboard].concat(this.props.projects)).find((item)=>item.id===this.props.project);
		this.setState({
			projects:toSelArr([dashboard].concat(this.props.projects).concat(this.props.currentUser.userData.role.value>0?[addProject]:[])),
		});
		this.props.setHelpSidebarProject(project?project:dashboard);

		if(!this.props.milestonesActive){
			this.props.storageHelpMilestonesStart();
		}
		this.props.setHelpSidebarMilestone(toSelArr([allMilestones].concat(this.props.milestones)).find((item)=>item.id===this.props.milestone));
		this.setState({
			milestones:toSelArr([allMilestones].concat(this.props.milestones)),
		});

		if(!this.props.filtersActive){
			this.props.storageHelpFiltersStart();
		}
		this.setState({
			filters: this.props.filters.filter(
				(filter) => ( filter.createdBy === this.props.currentUser.id || filter.public )
				&& this.filterByRole( filter, this.props )
			)
		});

		this.readFilterFromURL(this.props);
	}

	render() {
		const showSettings = this.props.history.location.pathname.includes('settings')&&(this.props.currentUser.userData.role.value > 0 ||testing);
		return (
			<div className="sidebar">
				<div className="scrollable fit-with-header">
					{!showSettings &&
						this.getTaskSidebar()
					}
					{showSettings &&
						this.getSettingsSidebar()
					}
				</div>
			</div>
		);
	}

	getTaskSidebar(){
		let managesProjects = this.props.projectState.id!==null && this.props.projectState.id!==-1 && (
			this.props.currentUser.userData.role.value===3 || testing ||
			(this.props.projectState.permissions.find((permission)=>permission.user===this.props.currentUser.id)!==undefined && this.props.projectState.permissions.find((permission)=>permission.user===this.props.currentUser.id).isAdmin)
		);

		let addsMilestones = this.props.projectState.id!==null && this.props.projectState.id!==-1 && (
			this.props.currentUser.userData.role.value===3 || testing ||
			(this.props.projectState.permissions.find((permission)=>permission.user===this.props.currentUser.id)!==undefined && this.props.projectState.permissions.find((permission)=>permission.user===this.props.currentUser.id).isAdmin)
		);
		let filters = [...this.state.filters];
		if(this.props.projectState.id===null){
			filters = filters.filter((filter) => filter.dashboard && this.filterByRole(filter, this.props) );
		}else{
			filters =(
				filters.filter((filter) => (filter.global ||
				(filter.project!==null && filter.project===this.props.projectState.id)) &&
				this.filterByRole(filter, this.props) )
			)
		}
		return (
			<div>
				<Select
					options={this.state.projects.filter((project)=>{
						let curr = this.props.currentUser;
						if((curr.userData && curr.userData.role.value===3)||(project.id===-1||project.id===null)){
							return true;
						}
						let permission = project.permissions.find((permission)=>permission.user===curr.id);
						return permission && permission.read;
					})}
					value={this.props.projectState}
					styles={sidebarSelectStyle}
					onChange={project => {
						if (project.id === -1) {
							this.setState({openProjectAdd: true})
						} else {
							if(this.props.filterState!== null && !this.props.filterState.global && this.props.filterState.project!==project.id){
								this.props.setHelpSidebarFilter(null);
								this.props.setFilter(getEmptyFilter());
								this.props.history.push('/helpdesk/taskList/i/all');
							}
							this.props.setHelpSidebarProject(project);
							this.props.setProject(project.value);
							this.props.setHelpSidebarMilestone(allMilestones);
							this.props.setMilestone(null);
						}
					}}
					components={{
						DropdownIndicator: ({ innerProps, isDisabled }) =>
						<div style={{marginTop: "-15px"}}>
							<img
								className=""
								style={{position:'absolute', left:15, color: "#212121", height: "17px"}}
								src={require('scss/icons/folder.svg')}
								alt="Generic placeholder XX"
								/>
							{false &&	<i className="fa fa-folder-open" style={{position:'absolute', left:15, color: "#212121", height: "17px"}}/> }
							<i className="fa fa-chevron-down" style={{position:'absolute', right:15, color: "#212121"}}/>
						</div>
					}}
					/>
				<hr className="m-l-15 m-r-15"/>
				{ this.props.project!==null && this.props.project!==-1 &&
					<div className="">
						<Select
							options={
								this.state.milestones.concat(addsMilestones?[addMilestone]:[])
								.filter((milestone)=> milestone.id===-1|| milestone.id===null|| milestone.project===this.props.project)
							}
							value={this.props.milestoneState}
							styles={sidebarSelectStyle}
							onChange={milestone => {
								if (milestone.id === -1) {
									this.setState({openMilestoneAdd: true})
								} else {
									this.props.setHelpSidebarMilestone(milestone);
									this.props.setMilestone(milestone.value);
								}
							}}
							components={{
								DropdownIndicator: ({ innerProps, isDisabled }) =>
								<div style={{marginTop: "-15px"}}>
									<img
										className=""
										style={{position:'absolute', left:15, color: "#212121", height: "17px"}}
										src={require('scss/icons/sign.svg')}
										alt="Generic placeholder XX"
										/>
									<i className="fa fa-chevron-down" style={{position:'absolute', right:15, color: "#212121"}}/>
								</div>,
							}}
							/>
						<hr className="m-l-15 m-r-15"/>
					</div>
				}

				<TaskAdd history={this.props.history} project={this.state.projects.map((item)=>item.id).includes(this.props.projectState.id)?this.props.projectState.id:null} triggerDate={this.state.projectChangeDate} />

				{	this.state.activeTab !== 1 &&
					<div
						className="sidebar-btn"
						>
						<div
							onClick={() => {
								this.props.history.push(`/helpdesk/taskList/i/all`);
								this.setState({ activeTab: (this.state.activeTab === 0 ? 1 : 0)})
								this.props.setHelpSidebarFilter(null);
								this.props.setFilter(getEmptyFilter());
							}}
							>
							<i className="fa fa-plus pull-right m-r-5 m-t-5 clickable" />
						</div>
						<div>
							<img
								className="m-r-5"
								style={{color: "#212121", height: "17px", marginBottom: "3px"}}
								src={require('scss/icons/filter.svg')}
								alt="Generic placeholder XX"
								/>
							Filters
						</div>
					</div>
				}

				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId={0} >
						<Nav vertical>
							{ filters.map((item)=>
								<NavItem key={item.id} className="row">
									<Link
										className="sidebar-menu-item"
										to={{ pathname: `/helpdesk/taskList/i/`+item.id }}
										onClick={()=>{
											this.props.setHelpSidebarFilter(item);
											this.props.setFilter({
												...item.filter,
												statusDateFrom: isNaN(parseInt(item.filter.statusDateFrom)) ? null : parseInt(item.filter.statusDateFrom),
												statusDateTo: isNaN(parseInt(item.filter.statusDateTo)) ? null : parseInt(item.filter.statusDateTo),
												pendingDateFrom: isNaN(parseInt(item.filter.pendingDateFrom)) ? null : parseInt(item.filter.pendingDateFrom),
												pendingDateTo: isNaN(parseInt(item.filter.pendingDateTo)) ? null : parseInt(item.filter.pendingDateTo),
												closeDateFrom: isNaN(parseInt(item.filter.closeDateFrom)) ? null : parseInt(item.filter.closeDateFrom),
												closeDateTo: isNaN(parseInt(item.filter.closeDateTo)) ? null : parseInt(item.filter.closeDateTo),
												updatedAt:(new Date()).getTime()
											});
										}}
										>
										{item.title}
									</Link>

									<div
										className={classnames("sidebar-icon", "clickable" , {"active" : this.props.location.pathname.includes(item.id)})}
										onClick={() => {
											if (this.props.location.pathname.includes(item.id)){
												this.props.history.push(`/helpdesk/taskList/i/`+item.id);
												this.props.setHelpSidebarFilter(item);
												this.props.setFilter({
													...item.filter,
													updatedAt:(new Date()).getTime()
												});
												this.setState({activeTab: 1});
											}
										}}
										>
										<i className="fa fa-cog"/>
									</div>
								</NavItem>
							)}

						</Nav>
					</TabPane>
					<TabPane tabId={1}>
						<Filter
							filterID={this.props.filterState?this.props.filterState.id:null}
							history={this.props.history}
							filterData={this.props.filterState}
							resetFilter={()=>this.props.setHelpSidebarFilter(null)}
							close={ () => this.setState({activeTab: 0})}
							/>
					</TabPane>
				</TabContent>
				{ this.state.openProjectAdd &&
					<ProjectAdd close={() => this.setState({openProjectAdd: false})}/>
				}
				{ managesProjects &&
					<ProjectEdit item={this.props.projectState} triggerChange={()=>{this.setState({projectChangeDate:(new Date()).getTime()})}}/>
				}
				{ this.state.openMilestoneAdd &&
					<MilestoneAdd close={() => this.setState({openMilestoneAdd: false})}/>
				}
				{ managesProjects && this.props.milestoneState.id &&
					this.state.milestones.map((item)=>item.id).includes(this.props.milestoneState.id) &&
					<MilestoneEdit item={this.props.milestoneState}/>
				}
				{/*<FilterOrder />*/}
			</div>
		)
	}

	getSettingsSidebar(){
		return (
			<Nav vertical>
				{settings.filter((setting)=>setting.minimalRole <= this.props.currentUser.userData.role.value).map((setting)=>
					<NavItem key={setting.link}>
						<Link className="sidebar-align sidebar-menu-item"
							to={{ pathname:'/helpdesk/settings/'+setting.link }}>{setting.title}</Link>
					</NavItem>
				)}
			</Nav>
		)
	}
}
const mapStateToProps = ({ filterReducer,storageHelpFilters, storageHelpProjects, storageHelpMilestones, userReducer, helpSidebarStateReducer }) => {
	const { project, milestone } = filterReducer;
	const { filtersActive, filters, filtersLoaded } = storageHelpFilters;
	const { projectsActive, projects } = storageHelpProjects;
	const { milestonesActive, milestones } = storageHelpMilestones;
	return { project, milestone,
		filtersActive,filters, filtersLoaded,
		projectsActive,projects,
		milestonesActive, milestones,
		currentUser:{...userReducer, userData:{...(userReducer.userData?userReducer.userData:{role:{value:0}})}},
		projectState:helpSidebarStateReducer.project,
		milestoneState:helpSidebarStateReducer.milestone,
		filterState:helpSidebarStateReducer.filter,
	};
};

export default connect(mapStateToProps, { setProject, setMilestone, setFilter,
	storageHelpFiltersStart, storageHelpProjectsStart, storageHelpMilestonesStart,
	setHelpSidebarProject, setHelpSidebarMilestone, setHelpSidebarFilter,
})(Sidebar);
