import React from 'react';
import {
  useQuery
} from "@apollo/client";
import {
  gql
} from '@apollo/client';;
import {
  toSelArr
} from 'helperFunctions';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button
} from 'reactstrap';
import TaskAdd from './taskAdd';
import {
  getCreationError as getVykazyError
} from 'helpdesk/components/vykazyTable';

import {
  noMilestone
} from 'configs/constants/sidebar';

import {
  GET_TASK_TYPES
} from 'helpdesk/settings/taskTypes/querries';
import {
  GET_TRIP_TYPES
} from 'helpdesk/settings/tripTypes/querries';

import {
  GET_BASIC_USERS
} from 'helpdesk/settings/users/querries';

import {
  GET_BASIC_COMPANIES
} from 'helpdesk/settings/companies/querries';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/querries';

import {
  GET_STATUSES
} from 'helpdesk/settings/statuses/querries';

import {
  GET_MY_DATA
} from '../querries';

export default function TaskAddContainer( props ) {
  //data & queries
  const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUSES, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: tripTypesData,
    loading: tripTypesLoading
  } = useQuery( GET_TRIP_TYPES, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );

  const {
    data: projectsData,
    loading: projectsLoading
  } = useQuery( GET_MY_PROJECTS, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );
  const {
    data: currentUserData,
    loading: currentUserLoading
  } = useQuery( GET_MY_DATA, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );

  //state
  const [ openAddTaskModal, setOpenAddTaskModal ] = React.useState( false );
  const [ taskType, setTaskType ] = React.useState( null );
  const [ assignedTo, setAssignedTo ] = React.useState( [] );
  const [ company, setCompany ] = React.useState( null );

  const loading = (
    statusesLoading ||
    companiesLoading ||
    usersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    projectsLoading ||
    currentUserLoading
  );
  const canCreateVykazyError = () => {
    if ( getVykazyError( taskType, assignedTo.filter( ( user ) => user.id !== null ), company ) === '' ) {
      return null;
    }
    return (
      <span className="center-hor m-l-10" style={{color: "#FF4500", height: "20px", fontSize: "14px"}}>
        {getVykazyError(taskType, assignedTo.filter((user) => user.id !== null ), company)}
      </span>
    );
  }

  return (
    <div className="display-inline">
      {
        !props.task &&
        <Button
          className="btn sidebar-btn"
          onClick={() => {
            setOpenAddTaskModal(true);
          }}
          >  Add task
        </Button>
      }

      {
        props.task &&
        <button
          type="button"
          className="btn btn-link-reversed waves-effect"
          disabled={props.disabled}
          onClick={()=> {
            setOpenAddTaskModal(true);
          }}
          >
          <i className="far fa-copy"/>
          Copy
        </button>
      }

      <Modal isOpen={openAddTaskModal} className="task-add-container" >
        <ModalHeader>
          Create new task
          {canCreateVykazyError()}
        </ModalHeader>
        <ModalBody className="scrollable" >
          {  openAddTaskModal && !loading &&
            <TaskAdd {...props}
              loading={loading}
              statuses={ toSelArr(statusesData.statuses.filter((status) => !status.action.toLowerCase().includes('invoiced') )) }
              projects={
                toSelArr(projectsData.myProjects.map((myProject) => ({
                  ...myProject.project,
                  right: myProject.right,
                  users: myProject.usersWithRights.map((user) => user.id)
                }) ))
              }
              users={ usersData ? toSelArr(usersData.basicUsers, 'email') : [] }
              companies={ toSelArr(companiesData.basicCompanies) }
              taskTypes={ toSelArr(taskTypesData.taskTypes) }
              tripTypes={ toSelArr(tripTypesData.tripTypes) }
              currentUser={ currentUserData.getMyData }
              milestones={[noMilestone]}
              defaultUnit={null}
              closeModal={ () => {
                setOpenAddTaskModal(false);
                setTaskType(null);
                setAssignedTo([]);
                setCompany(null);
              }}
              setTaskTypeCreationError={setTaskType}
              setAssignedToCreationError={setAssignedTo}
              setCompanyCreationError={setCompany}
              />
          }
        </ModalBody>
      </Modal>
    </div>
  );
}