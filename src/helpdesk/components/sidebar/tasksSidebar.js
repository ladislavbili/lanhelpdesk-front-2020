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
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';
import {
  NavLink as Link
} from 'react-router-dom';
import Select from "react-select";

import Loading from 'components/loading';
import Empty from 'components/Empty';
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
  GET_LOCAL_CALENDAR_USER_ID,
} from 'apollo/localSchema/queries';

import {
  setFilter,
  setProject,
  setMilestone,
  setCalendarUserId,
} from 'apollo/localSchema/actions';
import folderIcon from 'scss/icons/folder.svg';
import filterIcon from 'scss/icons/filter.svg';

export default function TasksSidebar( props ) {
  //data & queries
  const {
    history,
    match,
    location,
    toggleSidebar,
    sidebarOpen
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
    data: localCalendarUserId,
  } = useQuery( GET_LOCAL_CALENDAR_USER_ID );

  const {
    data: milestoneData,
    loading: milestoneLoading
  } = useQuery( GET_MILESTONE );

  //state
  const [ showFilters, setShowFilters ] = React.useState( true );
  const [ showProjects, setShowProjects ] = React.useState( true );
  const [ showCalendarUsers, setShowCalendarUsers ] = React.useState( false );
  const [ showMilestones, setShowMilestones ] = React.useState( true );
  const [ showFilterAdd, setShowFilterAdd ] = React.useState( false );
  const [ openProjectAdd, setOpenProjectAdd ] = React.useState( false );
  const [ openMilestoneAdd, setOpenMilestoneAdd ] = React.useState( false );
  const [ openCompanyAdd, setOpenCompanyAdd ] = React.useState( false );
  const [ openUserAdd, setOpenUserAdd ] = React.useState( false );
  const [ activeTab, setActiveTab ] = React.useState( 0 );

  const [ popoverOpen, setPopoverOpen ] = React.useState( false );

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

  const togglePopover = () => {
    setPopoverOpen( !popoverOpen );
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

  const renderProjectsList = () => {
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

  const renderProjects = () => {
    return (
      <div>
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
        {showProjects && renderProjectsList()}
        {showProjects && renderProjectAddBtn()}
      </div>
    )
  }

  const renderCalendarUsersList = () => {
    const myID = myData.getMyData.id;
    const userID = localCalendarUserId.localCalendarUserId;
    return (
      <Nav vertical>
        { projectData.localProject.usersWithRights.map( user =>
            <NavItem
              key={user.id}
              className={classnames("row full-width sidebar-item", { "active": userID === user.id || userID === null && myID === user.id }) }
              >
              <span
                className={ classnames("clickable sidebar-menu-item link", { "active": userID === user.id || userID === null && myID === user.id }) }
                onClick={() => {
                  setCalendarUserId(user.id)
                }}
                >
                {user.fullName}
              </span>
            </NavItem>
          )
        }
      </Nav>
    )
  }

  const renderCalendarUsers = () => {
    return (
      <div>
        <div className="sidebar-label row clickable" onClick={() => setShowCalendarUsers(!showCalendarUsers)}>
          <div>
            <i className="m-r-9 fa fa-user" />
            <Label>
              Calendar users
            </Label>
          </div>
          <div className="ml-auto">
            { showCalendarUsers && <i className="fas fa-chevron-up" /> }
            { !showCalendarUsers && <i className="fas fa-chevron-down" /> }
          </div>
        </div>
        {showCalendarUsers && renderCalendarUsersList()}
      </div>
    )
  }

  const renderMilestonesList = () => {
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

  const renderMilestones = () => {
    return (
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
        { showMilestones && renderMilestonesList() }
        {
          showMilestones &&
          projectData.localProject.project.id !== null &&
          canEditProject &&
          renderMilestoneAddBtn()
        }
      </div>
    )
  }

  const renderFiltersList = () => {
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
            Repetitive Tasks
          </span>
        </NavItem>
      </Nav>
    )
  }

  const renderFilters = () => {
    return (
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
        { showFilters && renderFiltersList() }
        { showFilters && renderFilterAddBtn() }
      </div>
    )
  }

  const renderFilterAdd = () => {
    return (
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
              { parseInt(match.params.filterID) ? "Edit filter" : "Add filter" }
            </Label>
          </div>
        </div>
        <Filter
          history={history}
          close={ () => {
            setShowFilterAdd(false);
          }}
          />
      </div>
    )
  }

  const renderTaskAddBtn = () => {
    return (
      <TaskAdd
        history={history}
        match={match}
        disabled={ !canAddTask }
        projectID={ projectData.localProject.id }
        />
    )
  }

  const renderFilterAddBtn = () => {
    return (
      <button
        className='btn-link p-l-15'
        onClick={() => {
          setFilter( getEmptyGeneralFilter() );
          setShowFilterAdd(true);
        }}
        >
        <i className="fa fa-plus"/>
        Filter
      </button>
    )
  }

  const renderMilestoneAddBtn = () => {
    return (
      <NavItem className="row full-width">
        <button
          className='btn-link p-l-15'
          onClick={() => setOpenMilestoneAdd(true)}
          >
          <i className="fa fa-plus" />
          { addMilestone.title }
        </button>
      </NavItem>
    )
  }

  const renderCompanyAddBtn = () => {
    return (
      <NavItem className="row full-width">
        <button
          className='btn-link'
          onClick={() => setOpenCompanyAdd(true)}
          >
          <i className="fa fa-plus" />
          { addCompany.title }
        </button>
      </NavItem>
    )
  }

  const renderProjectAddBtn = () => {
    return (
      <NavItem className="row full-width">
        <button
          className='btn-link'
          onClick={() => setOpenProjectAdd(true)}
          >
          <i className="fa fa-plus p-l-15" />
          { addProject.project.title }
        </button>
      </NavItem>
    )
  }

  const renderUserAddBtn = () => {
    return (
      <NavItem className="row full-width">
        <button
          className='btn-link'
          onClick={() => setOpenUserAdd(true)}
          >
          <i className="fa fa-plus" />
          { addUser.title }
        </button>
      </NavItem>
    )
  }

  const renderAddButtons = () => {
    return (
      <div className="popover">
        {  renderTaskAddBtn() }
        { renderFilterAddBtn() }
        { renderProjectAddBtn() }
        { renderMilestoneAddBtn() }
        { renderCompanyAddBtn() }
        { renderUserAddBtn() }
      </div>
    )
  }

  const renderFilterContainer = () => {
    return (
      <div className="popover">
        { showFilterAdd && renderFilterAdd() }
        { !showFilterAdd && renderFilters() }
      </div>
    )
  }

  const renderProjectsPopover = () => {
    return (
      <div className="popover">
        { renderProjects() }
      </div>
    )
  }

  const renderCalendarUsersPopover = () => {
    return (
      <div className="popover">
        { renderCalendarUsers() }
      </div>
    )
  }

  const renderMilestonesPopover = () => {
    return (
      <div className="popover">
        { renderMilestones() }
      </div>
    )
  }

  const renderOpenSidebar = () => {
    return (
      <div>
        { renderTaskAddBtn() }

        <hr className = "m-l-15 m-r-15 m-t-15" />

        { !showFilterAdd && renderFilters() }

        <hr className = "m-l-15 m-r-15 m-t-11" />

        { !showFilterAdd && renderProjects() }

        { !showFilterAdd && projectData.localProject.id !== null && projectData.localProject.right.scheduledRead && myData.getMyData.tasklistLayout === 3 && (
          <Empty>
            <hr className = "m-l-15 m-r-15 m-t-11" />
            {renderCalendarUsers()}
          </Empty>
        )}

        { !showFilterAdd && projectData.localProject.id !== null && <hr className="m-l-15 m-r-15 m-t-11" /> }

        { !showFilterAdd && projectData.localProject.id !== null && renderMilestones() }

        { showFilterAdd && renderFilterAdd() }

        <hr className = "m-l-15 m-r-15 m-t-11 m-b-11" />

        {
          !showFilterAdd &&
          <div className='p-l-15 p-r-15'>
            { myData.getMyData.role.accessRights.companies && renderCompanyAddBtn() }
            { myData.getMyData.role.accessRights.users && renderUserAddBtn() }
          </div>
        }
      </div>
    )
  }

  return (
    <div>
      { !sidebarOpen &&
        <div>
          <span
            className='btn popover-toggler'
            >
            <i className="fa fa-plus"/>
            {renderAddButtons()}
          </span>

          <span
            className='btn popover-toggler'
            >
            <img
              src={filterIcon}
              className="invert"
              id="filter-icon"
              alt="Filter icon not found"
              style={{
                color: "white",
              }}
              />
            {renderFilterContainer()}
          </span>

          <span
            className='btn popover-toggler'
            >
            <img
              src={folderIcon}
              className="invert"
              id="folder-icon"
              alt="Folder icon not found"
              style={{
                color: "white",
              }}
              />
            {renderProjectsPopover()}
          </span>

          { projectData.localProject.id !== null && projectData.localProject.right.scheduledRead && myData.getMyData.tasklistLayout === 3 &&
            <span
              className='btn popover-toggler'
              >
                <i className="fa fa-user" style={{ color: "white", }} />
              {renderCalendarUsersPopover()}
            </span>
          }

          {
            projectData.localProject.id !== null &&
            <button
              className='btn popover-toggler'
              >
              <i className="fas fa-retweet "/>

              {renderMilestonesPopover()}
            </button>
          }
        </div>
      }

      { sidebarOpen && renderOpenSidebar()}

      {
        openProjectAdd &&
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

      {
        canEditProject &&
        openMilestoneAdd &&
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

      {
        openUserAdd &&
        <Modal isOpen={openUserAdd} className="modal-without-borders">
          <ModalBody>
            <UserAdd
              closeModal={() => setOpenUserAdd(false)}
              addUserToList={() => {}}
              />
          </ModalBody>
        </Modal>
      }

      {
        openCompanyAdd &&
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
  );
}