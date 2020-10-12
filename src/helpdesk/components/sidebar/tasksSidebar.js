import React from 'react';
import { useQuery, useApolloClient  } from "@apollo/react-hooks";
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

import { getEmptyFilter, getEmptyGeneralFilter } from 'configs/fixedFilters';
import { toSelArr, toSelItem } from 'helperFunctions';
import { dashboard, addProject, allMilestones, addMilestone } from 'configs/constants/sidebar';
import moment from 'moment';

import { filter, generalFilter, project } from 'localCache';

export const GET_PROJECTS = gql`
query {
  myProjects {
    project {
      id
      updatedAt
      title
      milestones {
        id
        title
      }
    }
    right {
      read
			write
			delete
			internal
			admin
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
      oneOf
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

const LOCAL_CACHE = gql`
  query getLocalCache {
    projectName @client
    milestone @client {
      id
      title
      value
      label
    }
  }
`;

export default function TasksSidebar(props) {
  //data & queries
  const { history, location } = props;
  const { data } = useQuery(GET_MY_DATA);
  const { data: projectsData } = useQuery(GET_PROJECTS);
  const { data: myFiltersData, loading: myFiltersLoading } = useQuery(GET_MY_FILTERS);
  const { data: localCache } = useQuery(LOCAL_CACHE);

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  const client = useApolloClient();

  //state
  const [ openProjectAdd, setOpenProjectAdd ] = React.useState(false);
  const [ openMilestoneAdd, setOpenMilestoneAdd ] = React.useState(false);
  const [ activeTab, setActiveTab ] = React.useState(0);

  const [ currentProject, setCurrentProject ] = React.useState(dashboard);

  // sync
  React.useEffect( () => {
    if (!myFiltersLoading){
      const startId = location.pathname.lastIndexOf("i/") + 2;
      const endId = location.pathname.lastIndexOf("/") + 1;
      let filterId = "";
      if (startId === endId){
        filterId = location.pathname.slice(startId);
      } else {
        filterId = location.pathname.slice(startId, endId - 1);
      }
      if (location.pathname.length > 12 && !isNaN(filterId)) {
        const newFilter = myFiltersData.myFilters.find(item => item.id === parseInt(filterId) );
        filter( newFilter.filter );
        generalFilter( newFilter );
      }
    }
  }, [myFiltersLoading]);


  const FILTERS = [ ...(myFiltersData === undefined ? [] : myFiltersData.myFilters  )];
  const MY_PROJECTS = !projectsData ? [] : (toSelArr(projectsData.myProjects.map(item => ({...item.project, projectRights: item.right}) )));
  const PROJECTS = [...(accessRights.addProjects ? [dashboard,addProject] : [dashboard] ), ...MY_PROJECTS ];
  const MILESTONES = ([allMilestones, addMilestone]).concat(toSelArr( project().id !== null && project().id !== -1 ? project().milestones : [] ));

  const addNewProject = (newProject) => {
      project(toSelItem(newProject));
      setCurrentProject(toSelItem(newProject));
      client.writeData({ data: { milestone:  allMilestones, projectName: newProject.title} });
      filter( getEmptyFilter() );
      generalFilter( {...getEmptyGeneralFilter(), project: toSelItem(newProject)} );
  }

  const addNewMilestone = (newMilestone, changedProject) => {
      const newProject = toSelItem( {...changedProject.project, projectRights: changedProject.right} );
      project( newProject  );
      setCurrentProject( newProject );
      let milestone = {
        id: newMilestone.id,
        title: newMilestone.title,
        value: newMilestone.id,
        label: newMilestone.title,
        __typename: "Milestone"
      };
      client.writeData({ data: { milestone} });
  }

  const editCacheMilestone = (editedMilestone, changedProject) => {
      const newProject = toSelItem( {...changedProject.project, projectRights: changedProject.right} );
      project( newProject  );
      setCurrentProject( newProject );
      let milestone = {
        id: editedMilestone.id,
        title: editedMilestone.title,
        value: editedMilestone.id,
        label: editedMilestone.title,
        __typename: "Milestone"
      };
      client.writeData({ data: { milestone} });
  }

  const deleteCacheMilestone = ( changedProject ) => {
      const newProject = toSelItem( {...changedProject.project, projectRights: changedProject.right} );
      project( newProject  );
      setCurrentProject( newProject );
      client.writeData({ data: { milestone:  allMilestones} });
  }

  return (
    <div>
      <Select
        options={PROJECTS}
        value={project()}
        styles={sidebarSelectStyle}
        onChange={pro => {
          if (pro.id !== -1){
            project(pro);
            setCurrentProject(pro);
            client.writeData({ data: { milestone:  allMilestones, projectName: pro.title} });
            filter( getEmptyFilter() );
            generalFilter( {...getEmptyGeneralFilter(), project: pro} );
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
      {  project().id !== -1 &&
        project().id !== null &&
        <div className="">
          <Select
            options={ MILESTONES }
            value={ localCache ? localCache.milestone : null }
            styles={sidebarSelectStyle}
            onChange={mile => {
              if (mile.id !== -1){
                let milestone = {
                  id: mile.id,
                  title: mile.title,
                  value: mile.id,
                  label: mile.title,
                  __typename: "Milestone"
                };
                client.writeData({ data: { milestone} });
              } else {
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
        projectID={ project().id }
        triggerDate={ parseInt(project().updatedAt) }
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
              filter( getEmptyFilter() );
              generalFilter( null );
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
            { FILTERS.map((item)=> {
                const startId = location.pathname.lastIndexOf("i/") + 2;
                const endId = location.pathname.lastIndexOf("/") + 1;
                let filterId = "";
                if (startId === endId){
                  filterId = location.pathname.slice(startId);
                } else {
                  filterId = location.pathname.slice(startId, endId - 1);
                }
                let isActive = false;
                if (location.pathname.length > 12 && !isNaN(filterId)) {
                   isActive = item.id === parseInt(filterId);
                }
                return (
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
                      filter(newFilter);
                      generalFilter(item);
                    }}
                    >
                    {item.title}
                  </Link>

                  <div
                    className={classnames("sidebar-icon", "clickable" , {"active" : isActive})}
                    onClick={() => {
                      if (isActive){
                        history.push(`/helpdesk/taskList/i/`+item.id);
                        const newFilter = {
                          ...item.filter,
                          updatedAt: moment().unix(),
                        }
                        filter(newFilter);
                        generalFilter(item);
                        setActiveTab(1);
                      }
                    }}
                    >
                    <i className="fa fa-cog"/>
                  </div>
                </NavItem>
              )}
            )}

          </Nav>
        </TabPane>
        <TabPane tabId={1}>
          <Filter
            filterID={generalFilter() ? generalFilter().id : null}
            history={history}
            filterData={filter()}
            resetFilter={()=> {
              filter(getEmptyFilter());
              generalFilter(null);
            }}
            close={ () => setActiveTab(0)}
            />
        </TabPane>
      </TabContent>

      { openProjectAdd &&
        <ProjectAdd open={openProjectAdd} closeModal={() => setOpenProjectAdd(false)} addProject={(e) => addNewProject(e)}/>
      }

      { project().projectRights &&
        project().projectRights.write &&
        <ProjectEdit  projectID={project().id} {...props} />
      }

      { openMilestoneAdd &&
        currentProject && currentProject.id &&
        <MilestoneAdd projectID={currentProject.id} open={openMilestoneAdd}  closeModal={() => setOpenMilestoneAdd(false)} addNewMilestone={(e1, e2) => addNewMilestone(e1, e2)} />
      }
      { project().projectRights &&
        project().projectRights.write &&
        localCache &&
        localCache.milestone &&
        localCache.milestone.id !== -1 &&
        localCache.milestone.id !== null &&
        <MilestoneEdit milestoneID={localCache.milestone.id} projectID={project().id} {...props} editCacheMilestone={(e1, e2) => editCacheMilestone(e1, e2)} deleteCacheMilestone={(e) => deleteCacheMilestone(e)} />
      }

    </div>
  );
}
