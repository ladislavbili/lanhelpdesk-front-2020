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
  pickSelectStyle,
} from 'configs/components/select';

import classnames from 'classnames';

import Filter from '../filter';
import TaskAdd from '../../task/add';
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
  splitArrayByFilter,
  translateSelectItem,
  translateAllSelectItems,
} from 'helperFunctions';

import {
  dashboard,
  addProject,
  allMilestones,
  addMilestone,
  addUser,
  addCompany,
} from 'configs/constants/sidebar';
import settings from 'configs/constants/settings';
import moment from 'moment';

import {
  useTranslation
} from "react-i18next";

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
  GET_FILTER_OPEN,
} from 'apollo/localSchema/queries';

import {
  setFilter,
  setProject,
  setMilestone,
  setCalendarUserId,
  setFilterOpen,
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

  const {
    t
  } = useTranslation();

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
    data: filterOpenData,
  } = useQuery( GET_FILTER_OPEN );

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
  const [ openProjectAdd, setOpenProjectAdd ] = React.useState( false );
  const [ openMilestoneAdd, setOpenMilestoneAdd ] = React.useState( false );
  const [ openCompanyAdd, setOpenCompanyAdd ] = React.useState( false );
  const [ openUserAdd, setOpenUserAdd ] = React.useState( false );
  const [ activeTab, setActiveTab ] = React.useState( 0 );

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
  }, [ myProjectsData, myProjectsLoading ] );

  const currentUser = getMyData();
  const localProject = projectData.localProject;
  const filterOpen = filterOpenData.filterOpen;

  const getApplicableFilters = () => {
    if ( myFiltersLoading || projectLoading ) {
      return [];
    }
    let [ publicFilters, customFilters ] = splitArrayByFilter( myFiltersData.myFilters, ( filter ) => filter.pub );
    publicFilters = sortBy( publicFilters, [ {
      key: 'order',
      asc: true
    } ] );
    customFilters = sortBy( customFilters, [ {
      key: 'title',
      asc: true
    } ] );

    if ( localProject.id === null ) {
      return [
        ...publicFilters,
        ...customFilters,
      ]
    }
    if ( localProject.id ) {
      return [
        ...publicFilters.filter( ( myFilter ) => myFilter.global || ( myFilter.project && myFilter.project.id === localProject.id ) ),
        ...customFilters.filter( ( myFilter ) => myFilter.global || ( myFilter.project && myFilter.project.id === localProject.id ) ),
      ]
    }
    return [];
  }

  const getProjectFilters = () => {
    if ( localProject.id === null ) {
      return [];
    }
    return sortBy( localProject.project.projectFilters, [ {
      key: 'order',
      asc: true
    } ] );
  }

  const setLocalFilter = () => {
    if ( location.pathname.length > 12 ) {
      const allAvailableFilters = [ ...getApplicableFilters(), ...getProjectFilters() ];
      const newFilter = allAvailableFilters.find( item => item.id === parseInt( match.params.filterID ) );
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

  //Constants
  const myRights = currentUser.role.accessRights;
  const myProjects = [ ...myProjectsData.myProjects ].sort( ( project1, project2 ) => project1.project.title > project2.project.title ? 1 : -1 );

  const canEditProject = (
    localProject.id !== null &&
    (
      myRights.projects ||
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
  const milestones = [ allMilestones ];
  //const milestones = [ allMilestones, ...( localProject.project.id !== null ? localProject.project.milestones : [] ) ]
  const tasklistPage = ![ '/helpdesk/repeats', '/helpdesk/companies', '/helpdesk/users' ].some( ( url ) => window.location.pathname.includes( url ) );

  const renderProjects = () => {
    let selectProjects = toSelArr( projects.map( ( project ) => ( {
      ...project,
      id: project.project.id,
      title: t( project.project.title )
    } ) ) );
    if ( myRights.addProjects && false ) {
      selectProjects.push( {
        label: `+ ${t('project')}`,
        value: -1
      } );
    }
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
              {t('project')}
            </Label>
          </div>
          { localProject.id !== null && localProject.right.projectRead &&
            <Button
              className='btn-link ml-auto center-hor m-r-3'
              onClick={() => history.push( `/helpdesk/project/${localProject.id}/description` )}
              >
              <i className="fa fa-cog"/>
            </Button>
          }
          { localProject.id === null && myRights.addProjects &&
            <Button
              className='btn-link ml-auto center-hor m-r-2'
              onClick={() => history.push( `/helpdesk/project/add` ) }
              >
              <i className="fa fa-plus"/>
            </Button>
          }
        </div>
        <div className="sidebar-menu-item">
          <Select
            options={selectProjects}
            value={translateSelectItem(localProject, t)}
            styles={pickSelectStyle([ 'invisible', 'blueFont', 'sidebar', 'flex' ])}
            onChange={project => {
              console.log(project);
              if( project.value === -1 ){
                history.push( `/helpdesk/project/add` )
                return;
              }
              setMilestone(translateSelectItem(allMilestones, t));
              setProject(project);
              if(tasklistPage){
                history.push(URLprefix);
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
                {t('project')}
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
                    if(tasklistPage){
                      history.push(URLprefix);
                    }
                  }}
                  >
                  {project.title}
                </span>
                { canEditProject &&  localProject.id !== null &&  localProject.id === project.id &&
                  <Button
                    className='btn btn-link ml-auto m-r-15'
                    onClick={() => history.push( `/helpdesk/project/${localProject.id}/description` )}
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
    if ( !myRights.addProjects ) {
      return null;
    }
    return (
      <NavItem className="row full-width">
        <button
          className='btn-link'
          onClick={() => history.push( `/helpdesk/project/add` )}
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
              if(tasklistPage){
                history.push(URLprefix);
              }
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
          { milestones.map( milestone => (
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
          )) }
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
              {t('calendarUsers')}
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
    if ( !myRights.tasklistCalendar ) {
      return null;
    }
    const myID = currentUser.id;
    const userID = localCalendarUserId.localCalendarUserId;
    let usersToRender = [];
    if ( localProject.id !== null ) {
      usersToRender = localProject.usersWithRights.filter( ( userWithRights ) => userWithRights.assignable );
    } else {
      usersToRender = myProjects
        .filter( ( myProject ) => myProject.attributeRights.assigned.view )
        .reduce( ( acc, cur ) => {
          const usersToAdd = cur.usersWithRights.filter( ( userWithRights ) => userWithRights.assignable );
          return [ ...acc, ...usersToAdd ]
        }, [] )
    }
    usersToRender = sortBy( filterUnique( usersToRender.map( ( userToRender ) => userToRender.user ), 'id' ), [ {
      key: 'fullName',
      asc: true
    } ] )

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
    if ( !myRights.tasklistCalendar ) {
      return null;
    }
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
            {t('allTasks')}
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
            { ( (filter.pub && myRights.publicFilters) || (!filter.pub && myRights.customFilters) ) &&
              <div className={classnames("sidebar-icon clickable", { "active": filter.id === parseInt(match.params.filterID) })}
                onClick={() => {
                  if (filter.id === parseInt(match.params.filterID)) {
                    setFilterOpen(true);
                  }
                }}
                >
                <i className="fa fa-cog p-r-3"/>
              </div>
            }
          </NavItem>
        )) }
        { getProjectFilters().map((filter) => (
          <NavItem key={filter.id} className={classnames("row full-width sidebar-item", { "active": filter.id === parseInt(match.params.filterID) }) }>
            <span
              className={ classnames("clickable sidebar-menu-item link", { "active": filter.id === parseInt(match.params.filterID) }) }
              onClick={() => history.push(`/helpdesk/taskList/i/${filter.id}`)}
              >
              {filter.title}
            </span>
          </NavItem>
        )) }
        <NavItem key='repeats' className={classnames("row full-width sidebar-item", { "active": window.location.pathname.includes( '/helpdesk/repeats' ) }) }>
          <span
            className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/helpdesk/repeats' ) }) }
            onClick={() => history.push(`/helpdesk/repeats`)}
            >
            {t('repetitiveTasks')}
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
              {t('filters')}
            </Label>
          </div>
          { !alwaysShow &&
            <div className="ml-auto m-r-3">
              { showFilters && <i className="fas fa-chevron-up" /> }
              { !showFilters && <i className="fas fa-chevron-down" /> }
            </div>
          }
        </div>
        { (showFilters || alwaysShow) && renderFiltersList() }
        { (showFilters || alwaysShow) && ( myRights.customFilters || myRights.publicFilters ) && renderFilterAddBtn() }
      </div>
    )
  }
  const renderFilterAddBtn = () => {
    if ( !myRights.customFilters && !myRights.publicFilters ) {
      return null;
    }
    return (
      <button
        className='btn-link p-l-15'
        onClick={() => {
          history.push('/helpdesk/taskList/i/all');
          setFilterOpen(true);
        }}
        >
        <i className="fa fa-plus"/>
        {t('filter')}
      </button>
    )
  }
  const renderFilterAdd = () => {
    if ( !myRights.customFilters && !myRights.publicFilters ) {
      return null;
    }
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
              { parseInt(match.params.filterID) ? `${t('edit')} ${t('filter').toLowerCase()}` : `${t('add')} ${t('filter').toLowerCase()}` }
            </Label>
          </div>
        </div>
        <Filter
          history={history}
          close={ () => {
            setFilterOpen(false);
          }}
          />
      </div>
    )
  }
  const renderFilterContainer = () => {
    return (
      <div className="popover"  style={{top: 'calc( 0.5em + ( 4.5em * 3 ) )'}}>
        { filterOpen && ( myRights.customFilters || myRights.publicFilters ) && renderFilterAdd() }
        { !filterOpen && renderFilters(true) }
      </div>
    )
  }

  const renderTaskAddBtn = () => {
    return (
      <TaskAdd
        history={history}
        match={match}
        disabled={ !canAddTask }
        projectID={ localProject.id !== null && localProject.right.addTask ? localProject.id : null }
        />
    )
  }

  const renderCompanyAddBtn = () => {
    if ( !myRights.companies ) {
      return null;
    }
    return (
      <NavItem className="row full-width">
        <button
          className='btn-link'
          onClick={() => setOpenCompanyAdd(true)}
          >
          <i className="fa fa-plus" />
          { translateSelectItem(addCompany, t).title }
        </button>
      </NavItem>
    )
  }
  const renderUserAddBtn = () => {
    if ( !myRights.users ) {
      return null;
    }
    return (
      <NavItem className="row full-width">
        <button
          className='btn-link'
          onClick={() => setOpenUserAdd(true)}
          >
          <i className="fa fa-plus" />
          { translateSelectItem(addUser, t).title }
        </button>
      </NavItem>
    )
  }

  const renderSettings = ( canSeeSettings ) => {
    return (
      <div>
        { canSeeSettings &&
          <div className="sidebar-label row" onClick={() => history.push('/helpdesk/settings') }>
            <div className="clickable noselect">
              <i className="fa fa-cog" />
              <Label className="clickable">
                {t('settings')}
              </Label>
            </div>
          </div>
        }
        { myRights.users &&
          <NavItem key='users' className={classnames("row full-width sidebar-item", { "active": window.location.pathname.includes( '/helpdesk/users' ) }) }>
            <span
              className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/helpdesk/users' ) }) }
              onClick={() => history.push(`/helpdesk/users`)}
              >
              <i className="fas fa-users m-r-1 m-t-3" />
              {t('users')}
            </span>
          </NavItem>
        }
        { myRights.companies &&
          <NavItem key='companies' className={classnames("row full-width sidebar-item", { "active": window.location.pathname.includes( '/helpdesk/companies' ) }) }>
            <span
              className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/helpdesk/companies' ) }) }
              onClick={() => history.push(`/helpdesk/companies`)}
              >
              <i className="far fa-building m-r-5 m-t-3" />
              {t('companies')}
            </span>
          </NavItem>
        }
        { myRights.vykazy &&
          <hr className = "m-l-15 m-r-15 m-t-11" />
        }
        { myRights.vykazy &&
          <NavItem key='vykazy' className={classnames("row full-width sidebar-item") }>
            <span
              className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/invoices' ) }) }
              onClick={() => history.push(`/invoices/monthly/companies`)}
              >
              <i className="far fa-file-alt m-r-5 m-t-3" />
              {t('invoices')}
            </span>
          </NavItem>
        }
      </div>
    )
  }

  const renderAddButtons = () => {
    return (
      <div className="popover">
        {  renderTaskAddBtn() }
        { ( myRights.customFilters || myRights.publicFilters ) && renderFilterAddBtn() }
        { renderProjectAddBtn() }
        { renderCompanyAddBtn() }
        { renderUserAddBtn() }
      </div>
    )
  }
  const renderOpenSidebar = () => {
    const canSeeSettings = settings.some( ( setting ) => myRights[ setting.value ] );
    return (
      <div>
        { renderTaskAddBtn() }

        <hr className = "m-l-15 m-r-15 m-t-15" />
        { !filterOpen &&
          <Empty>
            { renderProjects() }

            <hr className = "m-l-15 m-r-15 m-t-11" />
            { renderFilters() }


            {  (localProject.id === null || localProject.attributeRights.assigned.view) && currentUser.tasklistLayout === 3 && (
              <Empty>
                <hr className = "m-l-15 m-r-15 m-t-11" />
                {renderCalendarUsers()}
              </Empty>
            )}

          </Empty>
        }

        { filterOpen && ( myRights.customFilters || myRights.publicFilters ) && renderFilterAdd() }

        { ( filterOpen || canSeeSettings || myRights.vykazy ) && <hr className = "m-l-15 m-r-15 m-t-11 m-b-11" /> }

        { !filterOpen && ( canSeeSettings || myRights.vykazy ) &&
          renderSettings(canSeeSettings)
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

          { ( localProject.id === null || localProject.attributeRights.assigned.view) && currentUser.tasklistLayout === 3 &&
            <span
              className='btn popover-toggler'
              >
              <i className="fa fa-user" style={{ color: "white", }} />
              {renderCalendarUsersPopover()}
            </span>
          }

        </div>
      }

      { sidebarOpen && renderOpenSidebar() }

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