import React, { Component } from 'react';
import {NavItem, Nav, Modal } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import {rebase} from '../index';
import ProjectAdd from './projects/projectAdd';
import ProjectEdit from './projects/projectEdit';
import MilestoneEdit from './milestones/milestoneEdit';

import classnames from "classnames";

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects:[],
			milestones: [],
			projectEdit: null,
			openedEdit: false,
			milestoneEdit: null,
			openMilestoneEdit: false,
		};
		this.toggleEdit.bind(this);
	}

	componentWillMount(){
		this.ref1 = rebase.listenToCollection('/proj-projects', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				projects:content
				});
			},
		});
		this.ref2 = rebase.listenToCollection('/proj-milestones', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				milestones:content
				});
			},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
		rebase.removeBinding(this.ref2);
	}

	toggleEdit(){
		this.setState({openedEdit:!this.state.openedEdit})
	}

	toggleMilestoneEdit(){
		this.setState({openMilestoneEdit:!this.state.openMilestoneEdit})
	}

	render() {
		return (
			<div className="sidebar">
				<div className="scrollable fit-with-header">
					<ProjectAdd />
					<Nav vertical>
						<NavItem>
							<Link
								className="sidebar-menu-item"
								to={{ pathname: `/projects/all/all` }}>
								All
							</Link>
						</NavItem>
					</Nav>
							{
								this.state.projects.map((project)=>
								<Nav vertical key={project.id}>
									<NavItem key={project.id}  className="row">
										<Link
											className="sidebar-menu-item"
											key={project.id}
											to={{ pathname: `/projects/${project.id}/all` }}>
											{project.title}
										</Link>
									<div className={classnames("sidebar-icon", "clickable", {"active" : this.props.location.pathname.includes(`${project.id}/all`)})}
										onClick={() => {this.setState({projectEdit: project, openedEdit: true})}}
										>
												<i className="fa fa-cog"/>
										</div>
									</NavItem>
									{
										this.props.location.pathname.split("/")[2] === project.id &&
										this.state.milestones.map((mil) => {
												if (mil.project === project.id){
													return (
														<NavItem key={mil.id}  className="row " >
															<Link
																className="sidebar-menu-item"
																key={mil.id}
																to={{ pathname: `/projects/${project.id}/${mil.id}` }}>
																{mil.title}
															</Link>
															<div
																className={classnames("sidebar-icon", "clickable", {"active" : this.props.location.pathname.includes(project.id) && this.props.location.pathname.includes(mil.id)})}
																onClick={() => {this.setState({milestoneEdit: mil, openMilestoneEdit: true})}}
																>
																	<i className="fa fa-cog"/>
															</div>
														</NavItem>
												)
												}
												return null;
										})
									}
								</Nav>
							)}

					<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
						<ProjectEdit project={this.state.projectEdit} {...this.props} close={this.toggleEdit.bind(this)}/>
					</Modal>

					<Modal isOpen={this.state.openMilestoneEdit} toggle={this.toggleMilestoneEdit.bind(this)}>
						<MilestoneEdit milestone={this.state.milestoneEdit} {...this.props} close={this.toggleMilestoneEdit.bind(this)}/>
					</Modal>

				</div>

			</div>
			);
		}
	}
