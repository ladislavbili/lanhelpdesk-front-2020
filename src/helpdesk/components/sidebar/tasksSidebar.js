import React from 'react';
import {
  useQuery,
  useApolloClient
} from "@apollo/client";

import {
  Nav,
  NavItem,
  TabPane,
  TabContent
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
import TaskAdd from '../../task/taskAddContainer';
import ProjectEdit from '../projects/projectEditContainer';
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
} from './querries';
import {
  GET_MY_PROJECTS,
} from 'helpdesk/settings/projects/querries';
import {
  GET_MY_FILTERS,
} from '../filter/querries';

import {
  GET_FILTER,
  GET_PROJECT,
  GET_MILESTONE,
} from 'apollo/localSchema/querries';

import {
  setFilter,
  setProject,
  setMilestone,
} from 'apollo/localSchema/actions';


export default function TasksSidebar( props ) {
  //data & queries
  const {
    history,
    location
  } = props;

  //network
  const {
    data: myData,
    loading: myDataLoading
  } = useQuery( GET_MY_DATA );

  const {
    data: myProjectsData,
    loading: myProjectsLoading
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
    loading: projectLoading
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
      const startId = location.pathname.lastIndexOf( "i/" ) + 2;
      const endId = location.pathname.lastIndexOf( "/" ) + 1;
      let filterId = "";
      if ( startId === endId ) {
        filterId = location.pathname.slice( startId );
      } else {
        filterId = location.pathname.slice( startId, endId - 1 );
      }
      if ( location.pathname.length > 12 ) {
        const newFilter = myFiltersData.myFilters.find( item => item.id === parseInt( filterId ) );
        if ( newFilter ) {
          setFilter( newFilter )
        } else {
          setFilter( getEmptyGeneralFilter() )
        }
      }
    }
  }, [ myFiltersLoading ] );

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

  const projects = [
    ...( myData.getMyData.role.accessRights.addProjects ? [ dashboard, addProject ] : [ dashboard ] ),
    ...myProjectsData.myProjects,
  ]

  let milestones = [];
  if ( projectData.project.project.id === null ) {
    milestones = [ allMilestones ];
  } else {
    if ( projectData.project.right && projectData.project.right.admin ) {
      milestones = [ allMilestones, addMilestone, ...projectData.project.project.milestones ];
    } else {
      milestones = [ allMilestones, ...projectData.project.project.milestones ];
    }
  }

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
        src={require('scss/icons/folder.svg')}
        alt="Generic placeholder XX"
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
        value={projectData.project}
        styles={sidebarSelectStyle}
        onChange={pro => {
          if (pro.id !== -1) {
            setProject(pro)
          } else {
            setOpenProjectAdd(true);
          }
        }}
        components={{ DropdownIndicator }}
        />
      <hr className = "m-l-15 m-r-15" / >
        { projectData.project.id !== null &&
          <div className="">
            <Select
              options={toSelArr(milestones)}
              value={milestoneData.milestone}
              styles={sidebarSelectStyle}
              onChange={mile => {
                if (mile.id !== -1) {
                  setMilestone(mile)
                } else {
                  setOpenMilestoneAdd(true);
                }
              }}
              components={{ DropdownIndicator }}
              />
            <hr className = "m-l-15 m-r-15" />
          </div>
        }

        <TaskAdd
          history={history}
          projectID={ projectData.project.id}
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
                src={require('scss/icons/filter.svg')}
                alt="Generic placeholder XX"
                />
              Filters
            </div>
          </div>
        }

        <TabContent activeTab={activeTab}>
          <TabPane tabId={0}>
            <Nav vertical>
              {
                myFiltersData.myFilters.map((filter) => (
                  <NavItem key={filter.id} className="row full-width">
                    <span
                      className={ classnames("clickable sidebar-menu-item link", { "active": filter.id === filterData.filter.id }) }
                      onClick={() => {
                        history.push(`/helpdesk/taskList/i/${filter.id}`)
                        setFilter(filter);
                      }}>
                      {filter.title}
                    </span>

                    <div className={classnames("sidebar-icon", "clickable", { "active": filter.id === filterData.filter.id })}
                      onClick={() => {
                        if (filter.id === filterData.filter.id) {
                          setActiveTab(1);
                        }
                      }}>
                      <i className="fa fa-cog"/>
                    </div>
                  </NavItem>
                ))
              }
            </Nav>
          </TabPane>
        </TabContent>
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

      </div> );
}