import React, { Component } from 'react';
import { Modal, Button, NavItem, Nav} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import {rebase} from '../index';
import FolderAdd from './folders/folderAdd';
import FolderEdit from './folders/folderEdit';

import classnames from "classnames";

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			folders:[],
			openedEdit: false,
		};
		this.toggleEdit.bind(this);
	}

	componentWillMount(){
		this.ref1 = rebase.listenToCollection('/pass-folders', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				folders:content
				});
			},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
	}

	toggleEdit(){
		this.setState({openedEdit:!this.state.openedEdit})
	}

	render() {
		return (
			<div className="sidebar">
				<div className="scrollable fit-with-header">
					<FolderAdd />
					<Button
						className="btn-link t-a-l"
						onClick={()=>{this.props.history.push('/passmanager/add')}}
						>
						<i className="fa fa-plus sidebar-plus"  /> Heslo
					</Button>
						<Nav vertical>
							{	this.state.folders.map((item)=>
							<NavItem key={item.id}  className="row">
								<Link className="sidebar-menu-item" to={{ pathname: `/passmanager/i/`+item.id }}>{item.title}</Link>
								<div className={classnames("sidebar-icon", "clickable", {"active" : this.props.location.pathname.includes(item.id)})}
												onClick={() => {this.setState({folderEdit: item, openedEdit: true})}}>
										<i className="fa fa-cog"/>
								</div>
							</NavItem>
							)}
						</Nav>

						<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
							<FolderEdit folder={this.state.folderEdit} close={this.toggleEdit.bind(this)}/>
						</Modal>

				</div>

			</div>
			);
		}
	}
