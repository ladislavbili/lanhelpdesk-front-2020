import React from 'react';
import {
  useQuery
} from "@apollo/client";

import {
  Nav,
  NavItem,
  TabPane,
  TabContent,
  Button
} from 'reactstrap';
import {
  NavLink as Link
} from 'react-router-dom';
import Loading from 'components/loading';
import Select from "react-select";
import {
  sidebarSelectStyle
} from 'configs/components/select';

import classnames from 'classnames';

import Filter from '../filter';
import TaskAdd from '../../task/add';
import ProjectAdd from '../projects/projectAddContainer';
import MilestoneEdit from '../milestones/milestoneEdit';
import MilestoneAdd from '../milestones/milestoneAdd';

import {
  getEmptyGeneralFilter
} from 'configs/constants/filter';

import {
  toSelArr,
  toSelItem
} from 'helperFunctions';

import {
  dashboard,
  addProject,
  allMilestones,
  addMilestone
} from 'configs/constants/sidebar';
import moment from 'moment';

import {
  GET_MY_DATA,
} from './queries';
import {
  GET_MY_PROJECTS,
} from 'helpdesk/settings/projects/queries';
import {
  GET_MY_FILTERS,
} from '../filter/queries';

import {
  GET_FILTER,
  GET_PROJECT,
  GET_MILESTONE,
} from 'apollo/localSchema/queries';

import {
  setFilter,
  setProject,
  setMilestone,
} from 'apollo/localSchema/actions';
import folderIcon from 'scss/icons/folder.svg';
import filterIcon from 'scss/icons/filter.svg';

export default function TasksSidebar( props ) {
  //data & queries
  const {
    history,
    match,
    location
  } = props;

  //network
  const {
    data: myData,
    loading: myDataLoading
  } = useQuery( GET_MY_DATA );

  const {
    data: myProjectsData,
    loading: myProjectsLoading,
    refetch: refetchMyProjects,
  } = useQuery( GET_MY_PROJECTS );

  const {
    data: myFiltersData,
    loading: myFiltersLoading
  } = useQuery( GET_MY_FILTERS );

  //local
  const {
    data: filterData,
    loading: filterLoading
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
    loading: projectLoading,
    refetch: reloadProject
  } = useQuery( GET_PROJECT );

  const {
    data: milestoneData,
    loading: milestoneLoading
  } = useQuery( GET_MILESTONE );

  //state
  const [ openProjectAdd, setOpenProjectAdd ] = React.useState( false );
  const [ openMilestoneAdd, setOpenMilestoneAdd ] = React.useState( false );
  const [ activeTab, setActiveTab ] = React.useState( 0 );

  // sync
  React.useEffect( () => {
    if ( !myFiltersLoading ) {
      if ( location.pathname.length > 12 ) {
        const newFilter = myFiltersData.myFilters.find( item => item.id === parseInt( match.params.filterID ) );
        if ( newFilter ) {
          setFilter( newFilter )
        } else {
          setFilter( getEmptyGeneralFilter() )
        }
      }
    }
  }, [ myFiltersLoading, match.params.filterID ] );
  const dataLoading = (
    myDataLoading ||
    myProjectsLoading ||
    myFiltersLoading ||
    filterLoading ||
    projectLoading ||
    milestoneLoading
  )

  if ( dataLoading ) {
    return ( <Loading /> )
  }

  const canEditProject = projectData.localProject.id !== null && (
    myData.getMyData.role.accessRights.projects ||
    (
      projectData.localProject.right !== undefined &&
      projectData.localProject.right.projectPrimaryRead
    )
  )

  const projects = [ dashboard, ...myProjectsData.myProjects ];

  const milestones = [ allMilestones, ...( projectData.localProject.project.id !== null ? projectData.localProject.project.milestones : [] ) ]

  const DropdownIndicator = ( {
    innerProps,
    isDisabled
  } ) => (
    <div style={{ marginTop: "-15px" }}>
      <img
        className=""
        style={{
          position: 'absolute',
          left: 15,
          color: "#212121",
          height: "17px"
        }}
        src={folderIcon}
        alt="Folder icon not found"
        />
      <i
        className="fa fa-chevron-down"
        style={{
          position: 'absolute',
          right: 15,
          color: "#212121"
        }}
        />
    </div>
  )

  return (
    <div>
      <Select
        options={toSelArr(projects.map((project) => ({...project, id: project.project.id, title: project.project.title}) ))}
        value={projectData.localProject}
        styles={sidebarSelectStyle}
        onChange={pro => {
          setProject(pro)
        }}
        components={{ DropdownIndicator }}
        />
      <hr className = "m-l-15 m-r-15" />
      { projectData.localProject.id !== null &&
        <div className="">
          <Select
            options={toSelArr(milestones)}
            value={milestoneData.localMilestone}
            styles={sidebarSelectStyle}
            onChange={mile => {
              setOpenMilestoneAdd(true);
            }}
            components={{ DropdownIndicator }}
            />
          <hr className = "m-l-15 m-r-15" />
        </div>
      }

      <TaskAdd
        history={history}
        match={match}
        projectID={ projectData.localProject.id}
        />
      { activeTab !== 1 &&
        <div className="sidebar-btn">
          <div onClick={() => {
              history.push(`/helpdesk/taskList/i/all`);
              setActiveTab((
                activeTab === 0
                ? 1
                : 0
              ));
              setFilter(getEmptyGeneralFilter())
            }}>
            <i className="fa fa-plus pull-right m-r-5 m-t-5 clickable"/>
          </div>
          <div>
            <img
              className="m-r-5"
              style={{
                color: "#212121",
                height: "17px",
                marginBottom: "3px"
              }}
              src={filterIcon}
              alt="Filter icon not found"
              />
            Filters
          </div>
        </div>
      }
      <TabContent activeTab={activeTab}>
        <TabPane tabId={0}>
          <Nav vertical>
            <NavItem key='all' className="row full-width">
              <span
                className={ classnames("clickable sidebar-menu-item link", { "active": 'all' === match.params.filterID }) }
                onClick={() => {
                  setMilestone(allMilestones);
                  setProject(dashboard);
                  history.push(`/helpdesk/taskList/i/all`)
                }}>
                All tasks
              </span>
            </NavItem>
            { myFiltersData.myFilters.map((filter) => (
              <NavItem key={filter.id} className="row full-width">
                <span
                  className={ classnames("clickable sidebar-menu-item link", { "active": filter.id === filterData.localFilter.id }) }
                  onClick={() => {
                    history.push(`/helpdesk/taskList/i/${filter.id}`)
                  }}>
                  {filter.title}
                </span>

                <div className={classnames("sidebar-icon", "clickable", { "active": filter.id === filterData.localFilter.id })}
                  onClick={() => {
                    if (filter.id === filterData.localFilter.id) {
                      setActiveTab(1);
                    }
                  }}>
                  <i className="fa fa-cog"/>
                </div>
              </NavItem>
            )) }
          </Nav>
        </TabPane>
        <TabPane tabId={1}>
          <Filter
            history={history}
            close={ () => {
              setActiveTab(0);
            }}
            />
        </TabPane>
      </TabContent>
      <div className='p-l-15 p-r-15'>
        <hr className='m-t-10 m-b-10'/>
        { myData.getMyData.role.accessRights.addProjects &&
          <NavItem className="row full-width">
          <Button
            className='btn-link p-0'
            onClick={() => setOpenProjectAdd(true)}
            >
            <i className="fa fa-plus" />
            { addProject.project.title }
          </Button>
        </NavItem>
        }
        { projectData.localProject.project.id !== null && canEditProject &&
          <NavItem className="row full-width">
          <Button
            className='btn-link p-0'
            onClick={() => setOpenMilestoneAdd(true)}
            >
            <i className="fa fa-plus" />
            { addMilestone.title }
          </Button>
        </NavItem>
        }
      </div>
      { openProjectAdd &&
        <ProjectAdd
          open={openProjectAdd}
          closeModal={(newProject, rights) => {
            setOpenProjectAdd(false);
            if(newProject!==null){
              const project = {
                project: newProject,
                right: rights,
                id: newProject.id,
                value: newProject.id,
                title: newProject.title,
                label: newProject.title,
              }
              setProject(project);
            }
          }}
          />
      }
      { canEditProject && projectData.localProject.id &&
          <Button
            className='btn-link m-l-15 m-r-15 p-0'
            onClick={() => history.push( `/helpdesk/project/${projectData.localProject.id}` )}
            >
            <i className="fa fa-cog"/>
            Project
          </Button>
        }
          {/*

        <ProjectEdit
          closeModal={(editedProject, rights) => {
            if(editedProject !== null){
              const project = {
                project: { ...projectData.localProject.project, ...editedProject },
                right: rights,
                id: editedProject.id,
                value: editedProject.id,
                title: editedProject.title,
                label: editedProject.title,
              }
              setProject(project);
              refetchMyProjects();
            }
          }}
          projectDeleted={()=>{
            setProject(dashboard);
            refetchMyProjects();
          }}
          />
        */}

      { canEditProject && openMilestoneAdd &&
        <MilestoneAdd
          open={openMilestoneAdd}
          closeModal={(newMilestone) => {
            if(newMilestone){
              setMilestone(toSelItem(newMilestone));
              refetchMyProjects();
            }
            setOpenMilestoneAdd(false);
          }}
          />
      }

      { canEditProject && milestoneData.localMilestone.id !== null &&
        <MilestoneEdit
          closeModal={(editedMilestone) => {
            if(editedMilestone !== null){
              const milestone = {
                id: editedMilestone.id,
                value: editedMilestone.id,
                title: editedMilestone.title,
                label: editedMilestone.title,
              }
              setMilestone(milestone);
              setProject({
                ...projectData.localProject,
                project:{
                  ...projectData.localProject.project,
                  milestones: [...projectData.localProject.project.milestones.filter((milest => milest.id !== milestone.id)), milestone],
                }
              })
              refetchMyProjects();
            }
          }}
          milestoneDeleted={()=>{
            refetchMyProjects();
            setProject({
              ...projectData.localProject,
              project:{
                ...projectData.localProject.project,
                milestones: projectData.localProject.project.milestones.filter((milest => milest.id !== milestoneData.localMilestone.id)),
              }
            });
            setMilestone(allMilestones);
          }}
          />
      }

    </div>
  );
}