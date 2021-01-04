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
} from 'helpdesk/settings/taskTypes/queries';
import {
  GET_TRIP_TYPES
} from 'helpdesk/settings/tripTypes/queries';

import {
  GET_BASIC_USERS
} from 'helpdesk/settings/users/queries';

import {
  GET_BASIC_COMPANIES
} from 'helpdesk/settings/companies/queries';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/queries';

import {
  GET_MY_DATA
} from '../queries';

export default function TaskAddContainer( props ) {
  //data & queries
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

  const renderCopyButton = () => {
    return (
      <button
        type="button"
        className="btn btn-link waves-effect"
        disabled={props.disabled}
        onClick={()=> {
          setOpenAddTaskModal(true);
        }}
        >
        <i className="far fa-copy"/>
        Copy
      </button>
    )
  }

  const renderAddTaskButton = () => {
    return (
      <Button
        className="btn sidebar-btn"
        onClick={() => {
          setOpenAddTaskModal(true);
        }}
        >  Add task
      </Button>
    )
  }

  const renderModal = () => {
    return (
      <Modal isOpen={openAddTaskModal} className="task-add-container" >
        <ModalHeader>
          Create new task
          {canCreateVykazyError()}
        </ModalHeader>
        <ModalBody className="scrollable" >
          {  openAddTaskModal && !loading &&
            <TaskAdd {...props}
              loading={loading}
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
    )
  }

  if ( props.task && !openAddTaskModal ) {
    return (
      renderCopyButton()
    );
  }

  if ( props.task && openAddTaskModal ) {
    return (
      renderModal()
    );
  }
  return (
    <div className="display-inline">
      {
        !props.task &&
        renderAddTaskButton()
      }

      { renderModal() }

    </div>
  );
}