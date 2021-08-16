import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import {
  toSelArr,
  getMyData,
} from 'helperFunctions';
import Empty from 'components/Empty';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import TaskAdd from './taskAdd';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import ProjectSelectModal from './projectSelectModal';
import classnames from 'classnames';

import {
  noMilestone
} from 'configs/constants/sidebar';

import {
  GET_TASK_TYPES,
  TASK_TYPES_SUBSCRIPTION,
} from 'helpdesk/settings/taskTypes/queries';
import {
  GET_TRIP_TYPES,
  TRIP_TYPES_SUBSCRIPTION,
} from 'helpdesk/settings/tripTypes/queries';

import {
  GET_BASIC_USERS,
  USERS_SUBSCRIPTION,
} from 'helpdesk/settings/users/queries';

import {
  GET_BASIC_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from 'helpdesk/settings/companies/queries';

import {
  GET_MY_PROJECTS,
  PROJECTS_SUBSCRIPTION,
} from 'helpdesk/settings/projects/queries';

import {
  SET_TASK_LAYOUT,
  ADD_TASK,
  SET_AFTER_TASK_CREATE,
} from '../queries';

export default function TaskAddContainer( props ) {
  const {
    disabled,
    projectID: sidebarProjectID,
    noText
  } = props;

  //data & queries
  const {
    data: companiesData,
    loading: companiesLoading,
    refetch: companiesRefetch,
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: usersData,
    loading: usersLoading,
    refetch: usersRefetch,
  } = useQuery( GET_BASIC_USERS, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: taskTypesData,
    loading: taskTypesLoading,
    refetch: taskTypesRefetch,
  } = useQuery( GET_TASK_TYPES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: tripTypesData,
    loading: tripTypesLoading,
    refetch: tripTypesRefetch,
  } = useQuery( GET_TRIP_TYPES, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: projectsData,
    loading: projectsLoading,
    refetch: projectsRefetch,
  } = useQuery( GET_MY_PROJECTS, {
    fetchPolicy: 'network-only'
  } );

  //mutations
  const [ addTask ] = useMutation( ADD_TASK );
  const [ setTaskLayout ] = useMutation( SET_TASK_LAYOUT );
  const [ setAfterTaskCreate ] = useMutation( SET_AFTER_TASK_CREATE );

  //subscriptions
  useSubscription( TASK_TYPES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      taskTypesRefetch();
    }
  } );

  useSubscription( TRIP_TYPES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tripTypesRefetch();
    }
  } );

  useSubscription( PROJECTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      projectsRefetch();
    }
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      companiesRefetch();
    }
  } );

  useSubscription( USERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      usersRefetch();
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
      .catch( ( err ) => addLocalError( err ) );
  }

  const currentUser = getMyData();

  const loading = (
    companiesLoading ||
    usersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    projectsLoading ||
    !currentUser
  );

  const renderCopyButton = () => {
    return (
      <button
        type="button"
        className={classnames("btn-link btn-distance", { 'task-add-layout-button': !noText })}
        disabled={disabled}
        onClick={()=> {
          setOpenAddTaskModal(true);
        }}
        >
        <i className="far fa-copy"/>
        {!noText && 'Copy'}
      </button>
    )
  }

  const renderAddTaskButton = () => {
    return (
      <button
        className="btn sidebar-btn"
        onClick={() => {
          setOpenAddTaskModal(true);
        }}
        >
        <i className="fa fa-plus"/>
        Task
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
              users: myProject.usersWithRights.map((userWithRights) => userWithRights.user.id)
            }) )).filter((project) => project.right.addTasks )
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
      <Modal isOpen={openAddTaskModal} className="task-add-container" modalClassName="scroll-x-auto" >
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
                  users: myProject.usersWithRights
                }) )).filter((project) => project.right.addTasks )
              }
              myProjects={loading ? [] : projectsData.myProjects}
              users={ usersData ? toSelArr(usersData.basicUsers, 'email') : [] }
              companies={ toSelArr(companiesData.basicCompanies) }
              taskTypes={ toSelArr(taskTypesData.taskTypes) }
              tripTypes={ toSelArr(tripTypesData.tripTypes) }
              currentUser={ currentUser }
              milestones={[noMilestone]}
              defaultUnit={null}
              closeModal={ (clearProject = false) => {
                setOpenAddTaskModal(false);
                if(!sidebarProjectID || clearProject){
                  setProjectID(null);
                }
              }}
              addTask={addTask}
              setTaskLayout={setTaskLayoutFunc}
              setAfterTaskCreate={setAfterTaskCreate}
              />
          }
        </ModalBody>
      </Modal>
    )
  }

  if ( props.task ) {
    return (
      <Empty>
        {renderCopyButton()}
        {renderModal()}
      </Empty>
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