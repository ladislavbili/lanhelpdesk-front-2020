import React, { Component } from 'react';
import {Button } from 'reactstrap';
import ProjectAdd from './projectAdd';
import { connect } from "react-redux";
import ProjectEdit from './projectEdit';
import {storageHelpProjectsStart} from '../../../redux/actions';

class ProjectList extends Component{
  constructor(props){
    super(props);
    this.state={
      projectFilter:''
    }
  }

  componentWillMount(){
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
  }


  render(){
    return (
      <div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.projectFilter}
                    onChange={(e)=>this.setState({projectFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>this.props.history.push('/helpdesk/settings/projects/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Project
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible scrollable fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
  							Project names
  						</h2>
              <table className="table table-hover">
                <tbody>
                  {this.props.projects.filter((project)=>{
										if(this.props.role === 3){
											return true;
										}
										let permission = project.permissions.find((permission)=>permission.user===this.props.currUserID);
										return permission && permission.read;
									}).filter((item)=>item.title.toLowerCase().includes(this.state.projectFilter.toLowerCase())).map((project)=>
                    <tr key={project.id}
                      className={"clickable" + (this.props.match.params.id === project.id ? " active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/projects/'+project.id)}>
                      <td>
                        {project.title}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
            <div className="col-lg-8">
              <div className="commandbar"></div>
              {
                this.props.match.params.id && this.props.match.params.id==='add' && <ProjectAdd />
              }
              {
                this.props.match.params.id && this.props.match.params.id!=='add' && this.props.projects.some((item)=>item.id===this.props.match.params.id) && <ProjectEdit match={this.props.match} history={this.props.history} item={{id:this.props.match.params.id}} />
              }
            </div>
          </div>
        </div>
    );
  }
}


const mapStateToProps = ({ storageHelpProjects, userReducer }) => {
  const { projectsActive, projects } = storageHelpProjects;
  const role = userReducer.userData ? userReducer.userData.role.value : 0;
  const currUserID = userReducer.id ;
  return { projectsActive, projects, role, currUserID };
};

export default connect(mapStateToProps, { storageHelpProjectsStart })(ProjectList);
