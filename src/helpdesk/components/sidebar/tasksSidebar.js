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
    role {
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
  const { history, match } = props;
  const { data, loading } = useQuery(GET_MY_DATA);
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS);

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  //state
  const [ openAddStatusModal, setOpenAddStatusModal ] = React.useState(false);
  const [ openAddTaskModal, setOpenAddTaskModal ] = React.useState(false);
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
    </div>
  );
}
