import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {Nav, NavItem, TabPane, TabContent} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import {sidebarSelectStyle} from 'configs/components/select';

import classnames from 'classnames';
import {testing} from 'helperFunctions';

import TaskAdd from '../../task/taskAddContainer';
import Filter from '../filter';
import ProjectEdit from '../projects/projectEdit';
import ProjectAdd from '../projects/projectAdd';
import MilestoneEdit from '../milestones/milestoneEdit';
import MilestoneAdd from '../milestones/milestoneAdd';

import { getEmptyFilter } from 'configs/fixedFilters';
import { toSelArr } from 'helperFunctions';
import { dashboard, addProject, allMilestones, addMilestone } from 'configs/constants/sidebar';

const GET_PROJECTS = gql`
query {
  projects{
    id
    title
    descrption
    lockedRequester
    updatedAt
    projectRights {
			read
			write
			delete
			internal
			admin
			user {
				id
			}
		}
    def {
			assignedTo {
				def
				fixed
				show
				value {
					id
				}
			}
			company {
				def
				fixed
				show
				value {
					id
				}
			}
			overtime {
				def
				fixed
				show
				value
			}
			pausal {
				def
				fixed
				show
				value
			}
			requester {
				def
				fixed
				show
				value {
					id
				}
			}
			status {
				def
				fixed
				show
				value {
					id
				}
			}
			tag {
				def
				fixed
				show
				value {
					id
				}
			}
			taskType {
				def
				fixed
				show
				value {
					id
				}
			}
		}
  }
}
`;

const GET_MY_DATA = gql`
query {
  getMyData{
    id
    company{
      id
    }
    role {
      level
      accessRights {
        addProjects
        projects
      }
    }
  }
}
`;

export default function TasksSidebar(props) {
  //data & queries
  const { history, match, location } = props;
  const { data, loading } = useQuery(GET_MY_DATA);
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS);

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  //state
  const [ openAddStatusModal, setOpenAddStatusModal ] = React.useState(false);
  const [ openProjectAdd, setOpenProjectAdd ] = React.useState(false);
  const [ openMilestoneAdd, setOpenMilestoneAdd ] = React.useState(false);
  const [ isColumn, setIsColumn ] = React.useState(false);
  const [ search, setSearch ] = React.useState("");
  const [ activeTab, setActiveTab ] = React.useState(0);
  const [ projects, setProjects ] = React.useState( (accessRights.addProjects ? toSelArr([dashboard,addProject]) : toSelArr([dashboard]) ) );
  const [ currentProject, setCurrentProject ] = React.useState( projects[0] );
  const [ milestones, setMilestones ] = React.useState( toSelArr([allMilestones]) );

  // sync
  React.useEffect( () => {
    if (!projectsLoading){
      const pro = (accessRights.addProjects ? toSelArr([dashboard,addProject]) : toSelArr([dashboard]) ).concat(projectsData.projects);
      setProjects(pro);
      setCurrentProject( projects[0] );
    }
  }, [projectsLoading]);

  const filters = [];
  const filterState = null;
  const milestoneState = {id: 0};

  return (
    <div>
      <Select
        options={
            !projectsLoading ?
            toSelArr(projects.filter((project)=>{
            if( accessRights.projects || (project.id === -1 || project.id === null) ){
              return true;
            }
            let permission = project.projectRights.find((right)=> right.user.is === currentUser.id);
            return permission && permission.read;
          })) :
          []
        }
        value={currentProject}
        styles={sidebarSelectStyle}
        onChange={project => setCurrentProject(project)}
        components={{
          DropdownIndicator: ({ innerProps, isDisabled }) =>
          <div style={{marginTop: "-15px"}}>
            <img
              className=""
              style={{position:'absolute', left:15, color: "#212121", height: "17px"}}
              src={require('scss/icons/folder.svg')}
              alt="Generic placeholder XX"
              />
            <i className="fa fa-chevron-down" style={{position:'absolute', right:15, color: "#212121"}}/>
          </div>
        }}
        />
      <hr className="m-l-15 m-r-15"/>
      { currentProject !== null &&
        currentProject.id !== -1 &&
        currentProject.id !== null &&
        <div className="">
          <Select
            options={[]}
            value={{label: "Hello", value: 99999}}
            styles={sidebarSelectStyle}
            onChange={milestone => {}}
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

      <TaskAdd
        history={history}
        projectID={projects.map((item)=>item.id).includes(currentProject.id) ? currentProject.id : null}
        triggerDate={ parseInt(currentProject.updatedAt) }
        currentUser={currentUser}
        />

      {	activeTab !== 1 &&
        <div
          className="sidebar-btn"
          >
          <div
            onClick={() => {
              history.push(`/helpdesk/taskList/i/all`);
              setActiveTab( (activeTab === 0 ? 1 : 0) );
              //CHANGE LOCAL CACHE
              //this.props.setHelpSidebarFilter(null);
              //this.props.setFilter(getEmptyFilter());
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

      <TabContent activeTab={activeTab}>
        <TabPane tabId={0} >
          <Nav vertical>
            { filters.map((item)=>
              <NavItem key={item.id} className="row">
                <Link
                  className="sidebar-menu-item"
                  to={{ pathname: `/helpdesk/taskList/i/`+item.id }}
                  onClick={()=>{

                    //LOCAL cache
                    /*
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
                    });*/
                  }}
                  >
                  {item.title}
                </Link>

                <div
                  className={classnames("sidebar-icon", "clickable" , {"active" : location.pathname.includes(item.id)})}
                  onClick={() => {
                    if (location.pathname.includes(item.id)){
                      history.push(`/helpdesk/taskList/i/`+item.id);
                      //LOCAL CACHE
                      /*
                      this.props.setHelpSidebarFilter(item);
                      this.props.setFilter({
                        ...item.filter,
                        updatedAt:(new Date()).getTime()
                      });*/
                      setActiveTab(1);
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
            filterID={filterState?filterState.id:null}
            history={history}
            filterData={filterState}
            resetFilter={()=>{/*this.props.setHelpSidebarFilter(null)*/}}
            close={ () => setActiveTab(0)}
            />
        </TabPane>
      </TabContent>

      { openProjectAdd &&
        <ProjectAdd close={() => setOpenProjectAdd(false)}/>
      }
      { accessRights.projects && false && 
        <ProjectEdit item={currentProject} triggerChange={()=>{/*this.setState({projectChangeDate:(new Date()).getTime()})*/}}/>
      }
      { openMilestoneAdd &&
        <MilestoneAdd close={() => setOpenMilestoneAdd(false)}/>
      }
      { accessRights.projects && milestoneState.id &&
        milestones.map((item)=>item.id).includes(milestoneState.id) &&
        <MilestoneEdit item={milestoneState}/>
      }

    </div>
  );
}
