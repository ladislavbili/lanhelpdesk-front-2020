import React from 'react';
import {
  useQuery,
  useSubscription,
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
  sidebarSelectStyle,
  pickSelectStyle,
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
  toSelItem,
  sortBy,
  filterUnique,
  getMyData,
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
  GET_MY_PROJECTS,
  PROJECTS_SUBSCRIPTION,
} from 'helpdesk/settings/projects/queries';
import {
  MILESTONES_SUBSCRIPTION,
} from './queries';
import {
  GET_MY_FILTERS,
  FILTERS_SUBSCRIPTION,
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

  //ziskaj len z networku data
  //prichystaj refresg ak sa nieco zmeni
  //listener zmien updatne lokalny projekt/filter/milestone
  //network
  const {
    data: myProjectsData,
    loading: myProjectsLoading,
    refetch: myProjectsRefetch,
  } = useQuery( GET_MY_PROJECTS, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: myFiltersData,
    loading: myFiltersLoading,
    refetch: myFiltersRefetch,
  } = useQuery( GET_MY_FILTERS, {
    fetchPolicy: 'network-only'
  } );

  //local
  const {
    data: filterData,
    loading: filterLoading
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
    loading: projectLoading,
  } = useQuery( GET_PROJECT );

  const {
    data: localCalendarUserId,
  } = useQuery( GET_LOCAL_CALENDAR_USER_ID );

  const {
    data: milestoneData,
    loading: milestoneLoading
  } = useQuery( GET_MILESTONE );

  useSubscription( PROJECTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      myProjectsRefetch();
    }
  } );

  useSubscription( MILESTONES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      myProjectsRefetch();
    }
  } );

  useSubscription( FILTERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      myFiltersRefetch();
    }
  } );

  //state
  const [ showFilters, setShowFilters ] = React.useState( true );
  const [ showCalendarUsers, setShowCalendarUsers ] = React.useState( true );
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
      setLocalFilter();
    }
  }, [ myFiltersData, myFiltersLoading, match.params.filterID ] );

  React.useEffect( () => {
    if ( !myProjectsLoading ) {
      if ( myProjectsData.myProjects ) {
        const currentProject = myProjectsData.myProjects.find( ( project ) => project.project.id === projectData.localProject.id );
        if ( currentProject ) {
          setProject( {
            ...currentProject,
            id: currentProject.project.id,
            value: currentProject.project.id,
            title: currentProject.project.title,
            label: currentProject.project.title,
          } );
        }
      }
    }
  }, [ myProjectsData ] );

  const currentUser = getMyData();
  const setLocalFilter = () => {
    if ( location.pathname.length > 12 ) {
      const newFilter = myFiltersData.myFilters.find( item => item.id === parseInt( match.params.filterID ) );
      if ( newFilter ) {
        setFilter( newFilter )
      } else {
        setFilter( getEmptyGeneralFilter() )
      }
    }
  }

  const dataLoading = (
    !currentUser ||
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

  //Constants
  const localProject = projectData.localProject;
  const myProjects = myProjectsData.myProjects;

  const canEditProject = (
    localProject.id !== null &&
    (
      currentUser.role.accessRights.projects ||
      (
        localProject.right !== undefined &&
        localProject.right.projectPrimaryRead
      )
    )
  )

  const canAddTask = (
    localProject.id === null ||
    (
      localProject.right !== undefined &&
      localProject.right.addTasks
    )
  )

  const projects = [ dashboard, ...myProjects ];
  const milestones = [ allMilestones, ...( localProject.project.id !== null ? localProject.project.milestones : [] ) ]

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

  const getApplicableFilters = () => {
    if ( localProject.id === null ) {
      return myFiltersData.myFilters.filter( ( myFilter ) => myFilter.dashboard );
    }
    if ( localProject.id ) {
      return myFiltersData.myFilters.filter( ( myFilter ) => myFilter.global || ( myFilter.project && myFilter.project.id === localProject.id ) );
    }
    return [];
  }

  const renderProjects = () => {
    const URLprefix = `/helpdesk/taskList/i/all`;
    return (
      <div>
        <div className="sidebar-label row">
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
          { localProject.id !== null &&
            <Button
              className='btn-link ml-auto center-hor'
              onClick={() => history.push( `/helpdesk/project/${localProject.id}` )}
              >
              <i className="fa fa-cog"/>
            </Button>
          }
        </div>
        <div className="sidebar-menu-item">
          <Select
            options={[ ...toSelArr(projects.map((project) => ({...project, id: project.project.id, title: project.project.title}) )), { label: '+ Project', value: -1 } ]}
            value={localProject}
            styles={pickSelectStyle([ 'invisible', 'blueFont', 'sidebar' ])}
            onChange={pro => {
              if(pro.value === -1 ){
                setOpenProjectAdd(true);
                return;
              }
              setMilestone(allMilestones);
              setProject(pro);
              if(!repeatPage){
                history.push(URLprefix);
              }else{
                history.push(`/helpdesk/repeats`)
              }
            }}
            />
        </div>
      </div>
    )
  }
  const renderProjectsPopover = () => {
    const URLprefix = `/helpdesk/taskList/i/all`;

    return (
      <div className="popover"  style={{top: 'calc( 0.5em + ( 4.5em * 1 ) )'}}>
        <div>
          <div className="sidebar-label row">
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
          </div>
          <Nav vertical>
            { projects.map((project) => ({...project, id: project.project.id, title: project.project.title}) ).map(project =>
              <NavItem key={project.id} className={classnames("row full-width sidebar-item", { "active": localProject.id === project.id }) }>
                <span
                  className={ classnames("clickable sidebar-menu-item link", { "active": localProject.id === project.id }) }
                  onClick={() => {
                    setMilestone(allMilestones);
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
                { canEditProject &&  localProject.id !== null &&  localProject.id === project.id &&
                  <Button
                    className='btn btn-link ml-auto m-r-15'
                    onClick={() => history.push( `/helpdesk/project/${localProject.id}` )}
                    >
                    <i className="fa fa-cog"/>
                  </Button>
                }
              </NavItem>
            )}
          </Nav>
          { renderProjectAddBtn() }
        </div>
      </div>
    )
  }
  const renderProjectAddBtn = () => {
    if ( !currentUser.role.accessRights.addProjects ) {
      return null;
    }
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


  const renderMilestones = () => {
    const URLprefix = `/helpdesk/taskList/i/${ filterData.localFilter.id ? filterData.localFilter.id :'all'}`;
    return (
      <div>
        <hr className = "m-l-15 m-r-15 m-t-11" />
        <div className="sidebar-label row">
          <div>
            <i className="fas fa-retweet "/>
            <Label>
              Milestone
            </Label>
          </div>
          { localProject.id !== null && milestoneData.localMilestone.id !== null && localProject.right.milestoneWrite &&
            <div className="row ml-auto center-hor">
              <MilestoneEdit
                label=""
                containerClassName=""
                buttonClassName="btn-link p-0"
                closeModal={(editedMilestone) => {
                  if(editedMilestone !== null){
                    const milestone = {
                      id: editedMilestone.id,
                      value: editedMilestone.id,
                      title: editedMilestone.title,
                      label: editedMilestone.title,
                    }
                    setMilestone(milestone);
                  }
                }}
                milestoneDeleted={()=>{
                  setMilestone(allMilestones);
                }}
                />
            </div>
          }
        </div>
        <div className="sidebar-menu-item">
          <Select
            options={[ ...toSelArr(milestones), , { label: '+ Milestone', value: -1 } ]}
            value={milestoneData.localMilestone}
            styles={pickSelectStyle([ 'invisible', 'blueFont', 'sidebar' ])}
            onChange={milestone => {
              if(milestone.value === -1 ){
                setOpenMilestoneAdd(true);
                return;
              }
              setMilestone(milestone);
              history.push(`${match.url}`);

            }}
            />
        </div>
      </div>
    )
  }
  const renderMilestonesPopover = () => {
    return (
      <div className="popover"  style={{top: 'calc( 0.5em + ( 4.5em * 2 ) )'}}>
        <div className="sidebar-label row">
          <div>
            <i className="fas fa-retweet "/>
            <Label>
              Milestone
            </Label>
          </div>
        </div>
        <Nav vertical>
          { milestones.map(milestone =>
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
                    }
                  }}
                  milestoneDeleted={()=>{
                    setMilestone(allMilestones);
                  }}
                  />
              }
            </NavItem>
          )
        }
      </Nav>
      { localProject.project.id !== null &&
        canEditProject &&
        renderMilestoneAddBtn()
      }
    </div>
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

  const renderCalendarUsers = ( alwaysShow ) => {
    return (
      <div className={classnames({ clickable: !alwaysShow })} >
      <div className="sidebar-label row clickable" onClick={() => setShowCalendarUsers( alwaysShow ? showCalendarUsers : !showCalendarUsers)}>
        <div>
          <i className="m-r-9 fa fa-user" />
          <Label className={classnames({ clickable: !alwaysShow })}>
            Calendar users
          </Label>
        </div>
        { !alwaysShow &&
          <div className="ml-auto">
            { showCalendarUsers && <i className="fas fa-chevron-up" /> }
            { !showCalendarUsers && <i className="fas fa-chevron-down" /> }
          </div>
        }
      </div>
      {( showCalendarUsers || alwaysShow ) && renderCalendarUsersList()}
    </div>
    )
  }
  const renderCalendarUsersList = () => {
    const myID = currentUser.id;
    const userID = localCalendarUserId.localCalendarUserId;
    let usersToRender = [];
    if ( localProject.id !== null ) {
      usersToRender = localProject.usersWithRights.filter( ( userWithRights ) => userWithRights.assignable );
    } else {
      usersToRender = myProjects
        .filter( ( myProject ) => myProject.right.assignedRead )
        .reduce( ( acc, cur ) => {
          const usersToAdd = cur.usersWithRights.filter( ( userWithRights ) => userWithRights.assignable );
          return [ ...acc, ...usersToAdd ]
        }, [] )
    }
    usersToRender = sortBy( filterUnique( usersToRender.map( ( userToRender ) => userToRender.user ), 'id' ), [ 'fullName' ] )

    return (
      <Nav vertical>
      { usersToRender.map( user =>
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
      )}
    </Nav>
    )
  }
  const renderCalendarUsersPopover = () => {
    return (
      <div className="popover"  style={{top: 'calc( 0.5em + ( 4.5em * 4 ) )'}}>
      { renderCalendarUsers(true) }
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
      { getApplicableFilters().map((filter) => (
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
  const renderFilters = ( alwaysShow ) => {
    return (
      <div className={classnames({ clickable: !alwaysShow })} >
      <div className="sidebar-label row" onClick={() => setShowFilters( alwaysShow ? showFilters : !showFilters)}>
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
          <Label className={classnames({ clickable: !alwaysShow })}>
            Filters
          </Label>
        </div>
        { !alwaysShow &&
          <div className="ml-auto">
            { showFilters && <i className="fas fa-chevron-up" /> }
            { !showFilters && <i className="fas fa-chevron-down" /> }
          </div>
        }
      </div>
      { (showFilters || alwaysShow) && renderFiltersList() }
      { (showFilters || alwaysShow) && renderFilterAddBtn() }
    </div>
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
  const renderFilterContainer = () => {
    return (
      <div className="popover"  style={{top: 'calc( 0.5em + ( 4.5em * 3 ) )'}}>
      { showFilterAdd && renderFilterAdd() }
      { !showFilterAdd && renderFilters(true) }
    </div>
    )
  }

  const renderTaskAddBtn = () => {
    return (
      <TaskAdd
      history={history}
      match={match}
      disabled={ !canAddTask }
      projectID={ localProject.id !== null && localProject.right.addTasks ? localProject.id : null }
      />
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
  const renderOpenSidebar = () => {
    return (
      <div>
      { renderTaskAddBtn() }

      <hr className = "m-l-15 m-r-15 m-t-15" />
      { !showFilterAdd &&
        <Empty>
          { renderProjects() }

          { localProject.id !== null &&
            renderMilestones()
          }

          <hr className = "m-l-15 m-r-15 m-t-11" />
          { renderFilters() }


          {  (localProject.id === null || localProject.right.assignedRead) && currentUser.tasklistLayout === 3 && (
            <Empty>
              <hr className = "m-l-15 m-r-15 m-t-11" />
              {renderCalendarUsers()}
            </Empty>
          )}

        </Empty>
      }

      { showFilterAdd && renderFilterAdd() }

      <hr className = "m-l-15 m-r-15 m-t-11 m-b-11" />

      {
        !showFilterAdd &&
        <div className='p-l-15 p-r-15'>
          { currentUser.role.accessRights.companies && renderCompanyAddBtn() }
          { currentUser.role.accessRights.users && renderUserAddBtn() }
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

        { localProject.id !== null &&
          <button
            className='btn popover-toggler'
            >
            <i className="fas fa-retweet "/>

            {renderMilestonesPopover()}
          </button>
        }

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

        { ( localProject.id === null || localProject.right.assignedRead) && currentUser.tasklistLayout === 3 &&
          <span
            className='btn popover-toggler'
            >
            <i className="fa fa-user" style={{ color: "white", }} />
            {renderCalendarUsersPopover()}
          </span>
        }

      </div>
    }

    { sidebarOpen && renderOpenSidebar()}

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

    { canEditProject &&
      openMilestoneAdd &&
      <MilestoneAdd
        open={openMilestoneAdd}
        closeModal={(newMilestone) => {
          if(newMilestone){
            setMilestone(toSelItem(newMilestone));
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
  );
}