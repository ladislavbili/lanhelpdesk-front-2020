import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  Label,
  Nav,
  NavItem,
  TabPane,
  TabContent,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import {
  NavLink as Link
} from 'react-router-dom';
import Loading from 'components/loading';
import Select from "react-select";
import {
  sidebarSelectStyleNoIcon
} from 'configs/components/select';

import classnames from 'classnames';

import Filter from '../filter';
import TaskAdd from '../../task/add';
import ProjectAdd from '../projects/projectAddContainer';
import MilestoneEdit from '../milestones/milestoneEdit';
import MilestoneAdd from '../milestones/milestoneAdd';
import UserAdd from 'helpdesk/settings/users/userAdd';
import CompanyAdd from 'helpdesk/settings/companies/companyAdd';

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
  addMilestone,
  addUser,
  addCompany,
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
  const [ showFilters, setShowFilters ] = React.useState( true );
  const [ showProjects, setShowProjects ] = React.useState( true );
  const [ showMilestones, setShowMilestones ] = React.useState( true );
  const [ showFilterAdd, setShowFilterAdd ] = React.useState( false );
  const [ openProjectAdd, setOpenProjectAdd ] = React.useState( false );
  const [ openMilestoneAdd, setOpenMilestoneAdd ] = React.useState( false );
  const [ openCompanyAdd, setOpenCompanyAdd ] = React.useState( false );
  const [ openUserAdd, setOpenUserAdd ] = React.useState( false );
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

  const canAddTask = (
    projectData.localProject.id === null ||
    (
      projectData.localProject.right !== undefined &&
      projectData.localProject.right.addTasks
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

  const repeatPage = window.location.pathname === '/helpdesk/repeats';

  const renderProjects = () => {
    const URLprefix = `/helpdesk/taskList/i/${ filterData.localFilter.id ? filterData.localFilter.id :'all'}`
    return (
      <Nav vertical>
        {
          projects.map((project) => ({...project, id: project.project.id, title: project.project.title}) ).map(project =>
            <NavItem key={project.id} className={classnames("row full-width sidebar-item", { "active": projectData.localProject.id === project.id }) }>
              <span
                className={ classnames("clickable sidebar-menu-item link", { "active": projectData.localProject.id === project.id }) }
                onClick={() => {
                  setProject(project);
                  if(!repeatPage){
                    history.push(URLprefix);
                  }else{
                    history.push(`/helpdesk/repeats`)
                  }
                }}
                >
                {project.title}
              </span>
              { canEditProject &&  projectData.localProject.id !== null &&  projectData.localProject.id === project.id &&
                <Button
                  className='btn btn-link ml-auto m-r-15'
                  onClick={() => history.push( `/helpdesk/project/${projectData.localProject.id}` )}
                  >
                  <i className="fa fa-cog"/>
                </Button>
              }
            </NavItem>
          )
        }
      </Nav>
    )
  }

  const renderMilestones = () => {
    return (
      <Nav vertical>
        {
          milestones.map(milestone =>
            <NavItem key={milestone.id} className={classnames("row full-width sidebar-item", { "active": milestoneData.localMilestone.id === milestone.id }) }>
              <span
                className={ classnames("clickable sidebar-menu-item link", { "active": milestoneData.localMilestone.id === milestone.id }) }
                onClick={() => {
                  setMilestone(milestone);
                  history.push(`${match.url}`);
                }}
                >
                {milestone.title}
              </span>
              { canEditProject && milestoneData.localMilestone.id !== null && milestoneData.localMilestone.id === milestone.id &&
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
            </NavItem>
          )
        }
      </Nav>
    )
  }

  const renderFilters = () => {
    return (
      <Nav vertical>
        <NavItem key='all' className={classnames("row full-width sidebar-item", { "active": 'all' === match.params.filterID }) }>
          <span
            className={ classnames("clickable sidebar-menu-item link", { "active": 'all' === match.params.filterID }) }
            onClick={() => history.push(`/helpdesk/taskList/i/all`)}
            >
            All tasks
          </span>
        </NavItem>
        { myFiltersData.myFilters.map((filter) => (
          <NavItem key={filter.id} className={classnames("row full-width sidebar-item", { "active": filter.id === parseInt(match.params.filterID) }) }>
            <span
              className={ classnames("clickable sidebar-menu-item link", { "active": filter.id === parseInt(match.params.filterID) }) }
              onClick={() => history.push(`/helpdesk/taskList/i/${filter.id}`)}
              >
              {filter.title}
            </span>

            <div className={classnames("sidebar-icon", "clickable", { "active": filter.id === parseInt(match.params.filterID) })}
              onClick={() => {
                if (filter.id === parseInt(match.params.filterID)) {
                  setShowFilterAdd(true);
                }
              }}
              >
              <i className="fa fa-cog"/>
            </div>
          </NavItem>
        )) }
        <NavItem key='repeats' className={classnames("row full-width sidebar-item", { "active": repeatPage }) }>
          <span
            className={ classnames("clickable sidebar-menu-item link", { "active": repeatPage }) }
            onClick={() => history.push(`/helpdesk/repeats`)}
            >
            Repeats
          </span>
        </NavItem>
      </Nav>
    )
  }

  return (
    <div>
      <TaskAdd
        history={history}
        match={match}
        disabled={ !canAddTask }
        projectID={ projectData.localProject.id }
        />

      <hr className = "m-l-15 m-r-15 m-t-15" />

      { !showFilterAdd &&
        <div>
          <div className="sidebar-label row" onClick={() => setShowFilters(!showFilters)}>
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
              <Label>
                Filters
              </Label>
            </div>
            <div className="ml-auto">
              { showFilters && <i className="fas fa-chevron-up" /> }
              { !showFilters && <i className="fas fa-chevron-down" /> }
            </div>
          </div>

          { showFilters && renderFilters() }

          { showFilters &&
            <Button
              className='btn btn-link ml-auto m-l-15'
              onClick={() => setShowFilterAdd(true)}
              >
              <i className="fa fa-plus"/>
              Filter
            </Button>
          }
          <hr className = "m-l-15 m-r-15 m-t-11" />
        </div>
      }


      <div className="sidebar-label row" onClick={() => setShowProjects(!showProjects)}>
        <div>
          <img
            className="m-r-9"
            src={folderIcon}
            alt="Folder icon not found"
            />
          <Label>
            Project
          </Label>
        </div>
        <div className="ml-auto">
          { showProjects && <i className="fas fa-chevron-up" /> }
          { !showProjects && <i className="fas fa-chevron-down" /> }
        </div>
      </div>

      { showProjects && renderProjects() }

      { showProjects && myData.getMyData.role.accessRights.addProjects &&
        <NavItem className="row full-width">
          <Button
            className='btn btn-link'
            onClick={() => setOpenProjectAdd(true)}
            >
            <i className="fa fa-plus p-l-15" />
            { addProject.project.title }
          </Button>
        </NavItem>
      }

      { projectData.localProject.id !== null && <hr className="m-l-15 m-r-15 m-t-11" /> }

      { projectData.localProject.id !== null &&
        <div className="">
          <div className="sidebar-label row"  onClick={() => setShowMilestones(!showMilestones)}>
            <div>
              <i className="fas fa-retweet "/>
              <Label>
                Milestone
              </Label>
            </div>
            <div className="ml-auto">
              { showMilestones && <i className="fas fa-chevron-up" /> }
              { !showMilestones && <i className="fas fa-chevron-down" /> }
            </div>
          </div>
          { showMilestones && renderMilestones() }
          { showMilestones && projectData.localProject.project.id !== null && canEditProject &&
            <NavItem className="row full-width">
              <Button
                className='btn btn-link p-l-15'
                onClick={() => setOpenMilestoneAdd(true)}
                >
                <i className="fa fa-plus" />
                { addMilestone.title }
              </Button>
            </NavItem>
          }
        </div>
      }

      { showFilterAdd && <hr className="m-l-15 m-r-15 m-t-15" /> }

      { showFilterAdd &&
        <div className="sidebar-label row" onClick={() => setShowFilters(!showFilters)}>
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
            <Label>
              { parseInt(match.params.filterID) ? "Edit filter" : "Add filter" }
            </Label>
          </div>
        </div>
      }
      { showFilterAdd &&
        <Filter
          history={history}
          close={ () => {
            setShowFilterAdd(false);
          }}
          />
      }
      <hr className = "m-l-15 m-r-15 m-t-11 m-b-11" />

      { !showFilterAdd &&
        <div className='p-l-15 p-r-15'>

          { myData.getMyData.role.accessRights.companies &&
            <NavItem className="row full-width">
              <Button
                className='btn btn-link'
                onClick={() => setOpenCompanyAdd(true)}
                >
                <i className="fa fa-plus" />
                { addCompany.title }
              </Button>
            </NavItem>
          }

          { myData.getMyData.role.accessRights.users &&
            <NavItem className="row full-width">
              <Button
                className='btn btn-link'
                onClick={() => setOpenUserAdd(true)}
                >
                <i className="fa fa-plus" />
                { addUser.title }
              </Button>
            </NavItem>
          }
        </div>
      }

      { openProjectAdd &&
        <ProjectAdd
          open={openProjectAdd}
          closeModal={(newProject, rights) => {
            setOpenProjectAdd(false);
            if(newProject!==null){
              const project = {
                project: {
                  ...newProject,
                  milestones: [],
                },
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

      { openUserAdd &&
        <Modal isOpen={openUserAdd} className="modal-without-borders">
          <ModalBody>
            <UserAdd
              closeModal={() => setOpenUserAdd(false)}
              addUserToList={() => {}}
              />
          </ModalBody>
        </Modal>
      }

      { openCompanyAdd &&
        <Modal isOpen={openCompanyAdd} className="modal-without-borders">
          <ModalBody>
            <CompanyAdd
              closeModal={() => setOpenCompanyAdd(false)}
              addCompanyToList={() => {}}
              />
          </ModalBody>
        </Modal>
      }

    </div>
  ); {
    /*
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
    */
  }
}