import React, { Component } from 'react';
import {Button, NavItem, Nav, Modal} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { connect } from "react-redux";

import TagAdd from './Tags/TagAdd';
import TagEdit from './Tags/TagEdit';
import {rebase} from '../index';
import {setProject, setFilter} from '../redux/actions';

import classnames from "classnames";

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags : [],
			tagEdit: null,
			openedAdd: false,
			openedEdit: false,
		};
		this.toggleEdit.bind(this);
		this.toggleAdd.bind(this);
		this.createNew.bind(this);
	}

	componentWillMount(){
    this.ref = rebase.listenToCollection('/lanwiki-tags', {
      context: this,
      withIds: true,
      then: tags=>{this.setState({tags});},
    });
  }

  componentWillUnmount() {
    rebase.removeBinding(this.ref);
  }

	toggleAdd(){
		this.setState({openedAdd:!this.state.openedAdd})
	}

	toggleEdit(){
		this.setState({openedEdit:!this.state.openedEdit})
	}

	createNew(){
		let start = window.location.pathname.indexOf("/i/") + 3;
		let id = window.location.pathname.substring(start);
		let end = id.indexOf("/");
		if (end !== -1){
			id = id.substring(0, end);
		}

		rebase.addToCollection('/lanwiki-notes',
		{ name: "Untitled",
			tags: (id !== "all" ? [id] : []),
			body: "",
			lastUpdated: new Date().getTime(),
			dateCreated: new Date().getTime(),
		})
		.then((note) => {
			this.props.history.push(`/lanwiki/i/${id}/${note.id}`);
		});
	}

	render() {
		return (
			<div className="sidebar">
				<div className="scrollable fit-with-header">
					<Button
						block
						className="btn-link t-a-l"
						onClick={()=>{this.setState({openedAdd:true})}}
						>
						<i className="fa fa-plus sidebar-plus"/> Tag
					</Button>

					<Button
						block
					  className="btn-link t-a-l"
            onClick={(e) => {
              e.preventDefault();
              this.createNew();
            }}>
						<i className="fa fa-plus sidebar-plus"/> Note
					</Button>


					<Nav vertical>
						<NavItem>
							<Link  className="sidebar-menu-item" to={{ pathname: `/lanwiki/i/all` }}>All</Link>
						</NavItem>

						{
							this.state.tags
							.sort((item1,item2)=>item1.title.toLowerCase()>item2.title.toLowerCase()?1:-1)
							.map((item)=>
								<NavItem key={item.id}  className="row">
									<Link className= "sidebar-menu-item" to={{ pathname:`/lanwiki/i/`+item.id}}>{item.title}</Link>
									<div  className={classnames("sidebar-icon", "clickable", {"active" : this.props.location.pathname.includes(item.id)})}
										onClick={() => {this.setState({tagEdit: item, openedEdit: true})}}
										>
										<i className="fa fa-cog"/>
									</div>
								</NavItem>
							)
						}

				</Nav>

					<Modal isOpen={this.state.openedAdd} toggle={this.toggleAdd.bind(this)}>
						<TagAdd close={this.toggleAdd.bind(this)}/>
					</Modal>

					<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
						<TagEdit tag={this.state.tagEdit} close={this.toggleEdit.bind(this)}/>
					</Modal>

				</div>
			</div>
			);
		}
	}
	const mapStateToProps = ({ filterReducer }) => {
    const { project } = filterReducer;
    return { project };
  };

  export default connect(mapStateToProps, { setProject,setFilter })(Sidebar);
