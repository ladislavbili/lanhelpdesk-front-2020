import React from 'react';
import {
  useQuery,
  useMutation,
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

import ProjectSelectModal from './projectSelectModal';

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
  GET_MY_DATA,
  SET_TASK_LAYOUT,
  ADD_TASK,
} from '../queries';

export default function TaskAddContainer( props ) {
  const {
    disabled,
    projectID: sidebarProjectID,
  } = props;

  const [ addTask ] = useMutation( ADD_TASK );
  const [ setTaskLayout ] = useMutation( SET_TASK_LAYOUT );

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
    loading: currentUserLoading,
    refetch: currentUserRefetch,
  } = useQuery( GET_MY_DATA, {
    options: {
      fetchPolicy: 'network-only'
    }
  } );

  //state
  const [ openAddTaskModal, setOpenAddTaskModal ] = React.useState( false );
  const [ projectID, setProjectID ] = React.useState( sidebarProjectID ? sidebarProjectID : null );

  React.useEffect( () => {
    setProjectID( sidebarProjectID ? sidebarProjectID : null );
  }, [ sidebarProjectID ] );

  const setTaskLayoutFunc = ( value ) => {
    setTaskLayout( {
        variables: {
          taskLayout: value,
        }
      } )
      .then( ( response ) => {
        currentUserRefetch();
      } )
      .catch( ( err ) => console.log( err ) );
  }

  const loading = (
    companiesLoading ||
    usersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    projectsLoading ||
    currentUserLoading
  );

  const renderCopyButton = () => {
    return (
      <button
        type="button"
        className="btn btn-link waves-effect task-add-layout-button"
        disabled={disabled}
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
      <button
        className="btn sidebar-btn"
        disabled={disabled}
        onClick={() => {
          setOpenAddTaskModal(true);
        }}
        > <i className="fa fa-plus"/> Task
      </button>
    )
  }

  const renderModal = () => {
    if ( !openAddTaskModal ) {
      return null;
    }
    if ( projectID === null ) {
      return (
        <ProjectSelectModal
          projects={
            loading ? [] :
            toSelArr(projectsData.myProjects.map((myProject) => ({
              ...myProject.project,
              right: myProject.right,
              users: myProject.usersWithRights.map((user) => user.id)
            }) ))
          }
          onSubmit= {(projectID) => {
            setProjectID(projectID);
          }}
          closeModal={() => {
            setOpenAddTaskModal(false);
          }}
          loading={loading}
          />
      )
    }
    return (
      <Modal isOpen={openAddTaskModal} className="task-add-container" >
        <ModalBody>
          {  openAddTaskModal && !loading &&
            <TaskAdd
              {...props}
              projectID={projectID}
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
                if(!sidebarProjectID){
                  setProjectID(null);
                }
              }}
              addTask={addTask}
              setTaskLayout={setTaskLayoutFunc}
              />
          }
        </ModalBody>
      </Modal>
    )
  }

  if ( props.task ) {
    return (
      <>
        {renderCopyButton()}
      {renderModal()}
    </>
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