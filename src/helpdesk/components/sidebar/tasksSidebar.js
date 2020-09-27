import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {Nav, NavItem, TabPane, TabContent} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import {sidebarSelectStyle} from 'configs/components/select';

import classnames from 'classnames';

import Filter from '../filter';
import TaskAdd from '../../task/taskAddContainer';
import ProjectEdit from '../projects/projectEditContainer';
import ProjectAdd from '../projects/projectAddContainer';
import MilestoneEdit from '../milestones/milestoneEdit';
import MilestoneAdd from '../milestones/milestoneAdd';

import { getEmptyFilter } from 'configs/fixedFilters';
import { toSelArr } from 'helperFunctions';
import { dashboard, addProject, allMilestones, addMilestone } from 'configs/constants/sidebar';
import moment from 'moment';

import { selectedProject, selectedMilestone,/* filter, filters, filterName */} from 'localCache';

export const GET_PROJECTS = gql`
query {
  projects{
    id
    title
    descrption
    lockedRequester
    updatedAt
    milestones {
      id
      title
    }
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

export const GET_MY_FILTERS = gql`
query {
  myFilters {
    title
    id
    createdAt
    updatedAt
    id
    title
    pub
    global
    dashboard
    project {
      id
      title
    }
    roles {
      id
      title
    }
    filter {
      assignedToCur
      assignedTo {
        id
        email
      }
      requesterCur
      requester {
        id
        email
      }
      companyCur
      company {
        id
        title
      }
      taskType {
        id
        title
      }
      statusDateFrom
      statusDateFromNow
      statusDateTo
      statusDateToNow
      pendingDateFrom
      pendingDateFromNow
      pendingDateTo
      pendingDateToNow
      closeDateFrom
      closeDateFromNow
      closeDateTo
      closeDateToNow
      deadlineFrom
      deadlineFromNow
      deadlineTo
      deadlineToNow
    }
  }
}
`;

const GET_PUBLIC_FILTERS = gql`
query {
  publicFilters {
    title
    id
    createdAt
    updatedAt
    createdBy {
      id
    }
    pub
    global
    dashboard
    filter {
      taskType {
        id
      }
    }
    project {
      id
    }
    roles {
      id
    }
  }
}
`;

export default function TasksSidebar(props) {
  //data & queries
  const { history, location } = props;
  const { data } = useQuery(GET_MY_DATA);
  const { data: projectsData, loading: projectsLoading, refetch: projectsRefetch } = useQuery(GET_PROJECTS);
  const { data: myFiltersData, loading: myFiltersLoading } = useQuery(GET_MY_FILTERS);
//  const { data: publicFiltersData, loading: publicFiltersLoading } = useQuery(GET_PUBLIC_FILTERS, { options: { fetchPolicy: 'network-only' }});

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  //state
  const [ openProjectAdd, setOpenProjectAdd ] = React.useState(false);
  const [ openMilestoneAdd, setOpenMilestoneAdd ] = React.useState(false);
  const [ activeTab, setActiveTab ] = React.useState(0);
  const [ projects, setProjects ] = React.useState( (accessRights.addProjects ? [dashboard,addProject] : [dashboard] ) );
  const [ currentProject, setCurrentProject ] = React.useState( projects[0] );
  const [ currentMilestone, setCurrentMilestone ] = React.useState( allMilestones );

  const [ filter, setFilter ] = React.useState( getEmptyFilter() );

  // sync
  React.useEffect( () => {
    if (!projectsLoading){
      const pro = (accessRights.addProjects ? [dashboard, addProject] : [dashboard] ).concat(toSelArr(projectsData.projects));
      setProjects(pro);
      setCurrentProject( projects[0] );
      selectedProject(null);
    }
  }, [projectsLoading]);

  React.useEffect( () => {
    if (!projectsLoading){
      projectsRefetch();
      const pro = (accessRights.addProjects ? [dashboard, addProject] : [dashboard] ).concat(toSelArr(projectsData.projects));
      setProjects(pro);
      const index = pro.findIndex(p => p.id === currentProject.id);
      setCurrentProject( (index >= 0 ? pro[index] : [dashboard]) );
      selectedProject((index >= 0 ? pro[index] : null));
    }
  }, [projectsData]);

  React.useEffect( () => {
    if (!myFiltersLoading){
      if (!isNaN(location.pathname.slice(location.pathname.lastIndexOf("/") + 1))) {
        const newFilter = myFiltersData.myFilters.find(item => item.id === parseInt(location.pathname.slice(location.pathname.lastIndexOf("/") + 1) ) );
        setFilter(newFilter);
      }
    //  filters({myFilters: [...myFiltersData.myFilters], publicFilters: [...filters().publicFilters]});
    }
  }, [myFiltersLoading]);

/*  React.useEffect( () => {
    if (!publicFiltersLoading){*/
    //  filters({myFilters: [...filters().myFilters], publicFilters: [...publicFiltersData.publicFilters]});
  /*  }
  }, [publicFiltersLoading]);*/

  const addNewProject = (newProject) => {
      projectsRefetch();
      const pro = (accessRights.addProjects ? [dashboard,addProject] : [dashboard] ).concat(toSelArr(projectsData.projects));
      setProjects(pro);
      setCurrentProject( newProject );
      selectedProject(newProject);
  }

  const FILTERS = [ ...(myFiltersLoading ? [] : myFiltersData.myFilters  )];//, ...(publicFiltersLoading ? [] : publicFiltersData.publicFilters  )]

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
        onChange={project => {
          if (project.id !== -1){
            setCurrentProject(project);
            selectedProject(project);
          } else {
            setOpenProjectAdd(true);
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
            options={([allMilestones, addMilestone]).concat(toSelArr( currentProject.milestones )) }
            value={currentMilestone}
            styles={sidebarSelectStyle}
            onChange={milestone => {
              if (milestone.id !== -1){
                setCurrentMilestone(milestone);
                selectedMilestone(milestone);
              } else{
                setOpenMilestoneAdd(true);
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
              setFilter(getEmptyFilter());
            //  filter(getEmptyFilter());
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
            { FILTERS.map((item)=>
              <NavItem key={item.id} className="row">
                <Link
                  className="sidebar-menu-item"
                  to={{ pathname: `/helpdesk/taskList/i/`+item.id }}
                  onClick={()=>{
                    const newFilter = {
                      ...item.filter,
                      statusDateFrom: isNaN(parseInt(item.filter.statusDateFrom)) ? null : parseInt(item.filter.statusDateFrom),
                      statusDateFromNow: item.filter.statusDateFromNow === true,
                      statusDateTo: isNaN(parseInt(item.filter.statusDateTo)) ? null : parseInt(item.filter.statusDateTo),
                      statusDateToNow: item.filter.statusDateToNow === true,
                      pendingDateFrom: isNaN(parseInt(item.filter.pendingDateFrom)) ? null : parseInt(item.filter.pendingDateFrom),
                      pendingDateFromNow: item.filter.pendingDateFromNow === true,
                      pendingDateTo: isNaN(parseInt(item.filter.pendingDateTo)) ? null : parseInt(item.filter.pendingDateTo),
                      pendingDateToNow: item.filter.pendingDateToNow === true,
                      closeDateFrom: isNaN(parseInt(item.filter.closeDateFrom)) ? null : parseInt(item.filter.closeDateFrom),
                      closeDateFromNow: item.filter.closeDateFromNow === true,
                      closeDateTo: isNaN(parseInt(item.filter.closeDateTo)) ? null : parseInt(item.filter.closeDateTo),
                      closeDateToNow: item.filter.closeDateToNow === true,
                      deadlineFrom: isNaN(parseInt(item.filter.deadlineFrom)) ? null : parseInt(item.filter.deadlineFrom),
                      deadlineFromNow: item.filter.deadlineFromNow === true,
                      deadlineTo: isNaN(parseInt(item.filter.deadlineTo)) ? null : parseInt(item.filter.deadlineTo),
                      deadlineToNow: item.filter.deadlineToNow === true,
                      updatedAt: moment().unix(),
                    }
                    setFilter({...item, filter: newFilter});
                  //  filter(newFilter);
                  }}
                  >
                  {item.title}
                </Link>

                <div
                  className={classnames("sidebar-icon", "clickable" , {"active" : parseInt(location.pathname.slice(location.pathname.lastIndexOf("/") + 1)) === item.id})}
                  onClick={() => {
                    if (location.pathname.includes(item.id)){
                      history.push(`/helpdesk/taskList/i/`+item.id);
                      const newFilter = {
                        ...item.filter,
                        updatedAt: moment().unix(),
                      }
              //        filter(newFilter);
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
            filterID={filter ? filter.id : null}
            history={history}
            filterData={filter}
            resetFilter={()=> {/*filter(getEmptyFilter())*/}}
            close={ () => setActiveTab(0)}
            />
        </TabPane>
      </TabContent>

      { openProjectAdd &&
        <ProjectAdd open={openProjectAdd} closeModal={() => setOpenProjectAdd(false)} addProject={(e) => addNewProject(e)}/>
      }
      { accessRights.projects &&
        currentProject.id !== null &&
        <ProjectEdit  projectID={currentProject.id} {...props} />
      }

      { openMilestoneAdd &&
        <MilestoneAdd projectID={currentProject.id} open={openMilestoneAdd}  closeModal={() => setOpenMilestoneAdd(false)} />
      }
      { accessRights.projects &&
        currentProject.id !== null &&
        currentMilestone.id !== null &&
        currentMilestone.id !== -1 &&
        <MilestoneEdit milestoneID={currentMilestone.id} projectID={currentProject.id} {...props} />
      }

    </div>
  );
}
