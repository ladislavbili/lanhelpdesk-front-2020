import React, { Component } from 'react';
import {NavItem, Nav } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { connect } from "react-redux";

import {toSelArr, sameStringForms} from '../helperFunctions';
import {setProject, setMilestone, setFilter, storageHelpFiltersStart, storageHelpProjectsStart, storageHelpMilestonesStart} from '../redux/actions';
import { dashboard, addProject, allMilestones, addMilestone } from 'configs/constants/sidebar';
import settings from 'configs/constants/settings'

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
			projects:[dashboard,addProject],
			project:dashboard,
			milestones:[allMilestones,addMilestone],
			milestone:allMilestones,
			filterID:null,
			filterData:null,

			projectChangeDate:(new Date()).getTime(),
		};
	}

	componentWillReceiveProps(props){
		if(!sameStringForms(props.filters,this.props.filters)){
			this.setState({filters:props.filters.filter((filter)=>filter.createdBy===props.currentUser.id||filter.public)})
		}
		if(!sameStringForms(props.projects,this.props.projects)){
			let project = toSelArr([dashboard].concat(props.projects)).find((item)=>item.id===props.project);
			this.setState({
				projects:toSelArr([dashboard].concat(props.projects).concat([addProject])),
				project:project?project:dashboard
			});
		}
		if(!sameStringForms(props.milestones,this.props.milestones)){
			let milestone = toSelArr([allMilestones].concat(props.milestones)).find((item)=>item.id===props.milestone);
			this.setState({
				milestones:toSelArr([allMilestones].concat(props.milestones).concat([addMilestone])),
				milestone:milestone?milestone:dashboard
			});
		}
	}

	componentWillMount(){
		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		this.setState({
			projects:toSelArr([dashboard].concat(this.props.projects).concat([addProject])),
			project:toSelArr([dashboard].concat(this.props.projects)).find((item)=>item.id===this.props.project)
		});

		if(!this.props.milestonesActive){
			this.props.storageHelpMilestonesStart();
		}
		this.setState({
			milestones:toSelArr([allMilestones].concat(this.props.milestones).concat([addMilestone])),
			milestone:toSelArr([allMilestones].concat(this.props.milestones)).find((item)=>item.id===this.props.milestone)
		});


		if(!this.props.filtersActive){
			this.props.storageHelpFiltersStart();
		}
		this.setState({filters:this.props.filters.filter((filter)=>filter.createdBy===this.props.currentUser.id||filter.public)});
	}

/*
<Button className="btn-link full-width t-a-l"  onClick={()=>{
		this.setState({opened:true});
	}} >
<i className="fa fa-plus" /> Project
</Button>

*/
	render() {
		let showSettings= this.props.history.location.pathname.includes('settings');
		return (
			<div className="sidebar">
				<div className="scrollable fit-with-header">
					{!showSettings && <div>
						<div>
							<Nav vertical>
								<NavItem>
									<Link
										className="sidebar-menu-item"
										to={{ pathname: `/reports/monthly/companies` }}>Firmy</Link>
								</NavItem>
								<NavItem>
									<Link
										className=" sidebar-menu-item"
										to={{ pathname: `/reports/monthly/requester` }}>Agenti</Link>
								</NavItem>
							</Nav>
							<hr className="m-b-10 m-t-10"/>
							<Nav vertical>
								<NavItem>
									<Link
										className="sidebar-menu-item"
										to={{ pathname: `/reports/company_invoices` }}>Uložené firmy</Link>
								</NavItem>
							</Nav>
						</div>
					</div>}
					{showSettings &&
						<Nav vertical>
							{settings.map((setting)=>
								<NavItem key={setting.link}>
									<Link className="sidebar-menu-item"
										to={{ pathname:'/reports/settings/'+setting.link }}>{setting.title}</Link>
								</NavItem>
							)}
						</Nav>
					}
					</div>
				</div>
			);
		}
	}
	const mapStateToProps = ({ filterReducer,storageHelpFilters, storageHelpProjects, storageHelpMilestones, userReducer }) => {
    const { project } = filterReducer;
		const { filtersActive, filters } = storageHelpFilters;
		const { projectsActive, projects } = storageHelpProjects;
		const { milestonesActive, milestones } = storageHelpMilestones;
    return { project,filtersActive,filters,projectsActive,projects, milestonesActive, milestones, currentUser:userReducer };
  };

  export default connect(mapStateToProps, { setProject, setMilestone, setFilter, storageHelpFiltersStart, storageHelpProjectsStart, storageHelpMilestonesStart })(Sidebar);
