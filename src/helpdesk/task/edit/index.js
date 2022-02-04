import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription,
} from "@apollo/client";

import Loading from 'components/loading';
import TaskEdit from './taskEdit';
import AccessDenied from 'components/accessDenied';
import ErrorMessage from 'components/errorMessage';
import axios from 'axios';

import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  useTranslation
} from "react-i18next";

import {
  toSelArr,
  localFilterToValues,
  getMyData,
} from 'helperFunctions';

import {
  GET_TASK_TYPES,
  TASK_TYPES_SUBSCRIPTION,
} from 'helpdesk/settings/taskTypes/queries';

import {
  GET_TRIP_TYPES,
  TRIP_TYPES_SUBSCRIPTION,
} from 'helpdesk/settings/tripTypes/queries';

import {
  GET_MY_PROJECTS,
  PROJECTS_SUBSCRIPTION,
} from 'helpdesk/settings/projects/queries';

import {
  GET_BASIC_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from 'helpdesk/settings/companies/queries';

import {
  GET_BASIC_USERS,
  USERS_SUBSCRIPTION,
} from 'helpdesk/settings/users/queries';

import {
  GET_TASK,
  GET_TASKS,

  DELETE_TASK,
  TASK_DELETE_SUBSCRIPTION,
  UPDATE_TASK,
  SET_TASK_LAYOUT,

  ADD_SHORT_SUBTASK,
  UPDATE_SHORT_SUBTASK,
  DELETE_SHORT_SUBTASK,
  DELETE_TASK_ATTACHMENT,
} from '../queries';

import {
  GET_FILTER,
  GET_PROJECT,
} from 'apollo/localSchema/queries';

import {
  REST_URL,
} from 'configs/restAPI';


export default function TaskEditContainer( props ) {
  //data & queries
  const {
    match,
    taskID,
    closeModal,
    history,
    fromInvoice,
  } = props;

  const {
    t
  } = useTranslation();

  const inModal = props.inModal === true;
  const id = inModal ? taskID : parseInt( match.params.taskID );
  const client = useApolloClient();

  const {
    data: basicCompaniesData,
    loading: basicCompaniesLoading,
    refetch: basicCompaniesRefetch,
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: basicUsersData,
    loading: basicUsersLoading,
    refetch: basicUsersRefetch,
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
    data: myProjectsData,
    loading: myProjectsLoading,
    refetch: myProjectsRefetch,
  } = useQuery( GET_MY_PROJECTS, {
    variables: {
      fromInvoice,
    },
    fetchPolicy: 'network-only'
  } );
  const {
    data: taskData,
    loading: taskLoading,
    refetch: taskRefetch,
    error: taskError
  } = useQuery( GET_TASK, {
    variables: {
      id,
      fromInvoice,
    },
  } );
  //local
  const {
    data: filterData,
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
  } = useQuery( GET_PROJECT );

  const [ updateTask ] = useMutation( UPDATE_TASK );
  const [ setTaskLayout ] = useMutation( SET_TASK_LAYOUT );

  const [ addShortSubtask ] = useMutation( ADD_SHORT_SUBTASK );
  const [ updateShortSubtask ] = useMutation( UPDATE_SHORT_SUBTASK );
  const [ deleteShortSubtask ] = useMutation( DELETE_SHORT_SUBTASK );
  const [ deleteTask ] = useMutation( DELETE_TASK );
  const [ deleteTaskAttachment ] = useMutation( DELETE_TASK_ATTACHMENT );

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

  useSubscription( TASK_DELETE_SUBSCRIPTION, {
    variables: {
      taskId: id
    },
    onSubscriptionData: () => {
      if ( inModal ) {
        //update calendar
        closeModal( true );
      } else {
        history.push( match.url.substring( 0, match.url.length - match.params.taskID.length ) );
      }
    }
  } );

  useSubscription( PROJECTS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      myProjectsRefetch();
    }
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      basicCompaniesRefetch();
    }
  } );

  useSubscription( USERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      basicUsersRefetch();
    }
  } );

  React.useEffect( () => {
    taskRefetch( {
      variables: {
        id,
        fromInvoice,
      }
    } );
  }, [ id ] );

  const [ saving, setSaving ] = React.useState( false );

  //functions

  const updateCasheStorage = ( response, key, type ) => {
    const task = client.readQuery( {
        query: GET_TASK,
        variables: {
          id,
          fromInvoice
        },
      } )
      .task;
    let newTask = {
      ...task,
    };
    newTask[ key ] = [ ...newTask[ key ] ]
    switch ( type ) {
      case 'ADD': {
        newTask[ key ].push( response );
        break;
      }
      case 'UPDATE': {
        newTask[ key ][ newTask[ key ].findIndex( ( item ) => item.id === response.id ) ] = response;
        break;
      }
      case 'DELETE': {
        newTask[ key ] = newTask[ key ].filter( ( item ) => item.id !== response.id );
        break;
      }
      default: {
        return;
      }
    }
    client.writeQuery( {
      query: GET_TASK,
      variables: {
        id,
        fromInvoice,
      },
      data: {
        task: newTask
      }
    } );
  }

  const addShortSubtaskFunc = ( sub ) => {
    setSaving( true );

    addShortSubtask( {
        variables: {
          ...sub,
          fromInvoice
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addShortSubtask, 'shortSubtasks', 'ADD' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
  }

  const updateShortSubtaskFunc = ( sub ) => {
    setSaving( true );

    updateShortSubtask( {
        variables: {
          id: sub.id,
          title: sub.title,
          done: sub.done,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateShortSubtask, 'shortSubtasks', 'UPDATE' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
  }

  const deleteShortSubtaskFunc = ( id ) => {
    deleteShortSubtask( {
        variables: {
          id,
          fromInvoice,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'shortSubtasks', 'DELETE' );
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
  }

  const deleteTaskFunc = () => {
    if ( window.confirm( t( 'generalConfirmation' ) ) ) {
      deleteTask( {
          variables: {
            id,
            fromInvoice,
          }
        } )
        .then( ( response ) => {
          try {
            let tasks = client.readQuery( {
                query: GET_TASKS,
                variables: {
                  filterId: filterData.localFilter.id,
                  filter: localFilterToValues( filterData.localFilter ),
                  projectId: projectData.localProject.id,
                  sort: null
                }
              } )
              .tasks;
            client.writeQuery( {
              query: GET_TASKS,
              variables: {
                filterId: filterData.localFilter.id,
                filter: localFilterToValues( filterData.localFilter ),
                projectId: projectData.localProject.id,
                sort: null
              },
              data: {
                ...tasks,
                tasks: tasks.tasks.filter( ( task ) => task.id !== id )
              }
            } );
          } catch ( err ) {}
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  }

  const addCompanyToList = ( company ) => {
    basicCompaniesRefetch();
  }

  const addAttachments = ( attachments ) => {
    const formData = new FormData();
    attachments.forEach( ( file ) => formData.append( `file`, file ) );
    formData.append( "token", `Bearer ${sessionStorage.getItem('acctok')}` );
    formData.append( "taskId", id );
    formData.append( "fromInvoice", fromInvoice );
    axios.post( `${REST_URL}/upload-attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      } )
      .then( ( response ) => {
        const newAttachments = response.data.attachments.map( ( attachment ) => ( {
          ...attachment,
          __typename: "TaskAttachment",
        } ) )
        const oldTask = client.readQuery( {
            query: GET_TASK,
            variables: {
              id
            }
          } )
          .task;
        client.writeQuery( {
          query: GET_TASK,
          variables: {
            id
          },
          data: {
            task: {
              ...oldTask,
              taskAttachments: [ ...oldTask.taskAttachments, ...newAttachments ]
            }
          }
        } )


      } )
  }

  const removeAttachment = ( attachment ) => {
    if ( window.confirm( t( 'generalConfirmation' ) ) ) {
      deleteTaskAttachment( {
          variables: {
            id: attachment.id,
            fromInvoice,
          }
        } )
        .then( ( response ) => {
          const oldTask = client.readQuery( {
              query: GET_TASK,
              variables: {
                id,
                fromInvoice,
              }
            } )
            .task;
          client.writeQuery( {
            query: GET_TASK,
            variables: {
              id,
              fromInvoice,
            },
            data: {
              task: {
                ...oldTask,
                taskAttachments: oldTask.taskAttachments.filter( ( taskAttachment ) => taskAttachment.id !== attachment.id )
              }
            }
          } )
        } )
    }

  }

  const setTaskLayoutFunc = ( value ) => {
    setTaskLayout( {
        variables: {
          taskLayout: value,
        }
      } )
      .catch( ( err ) => addLocalError( err ) );
  }

  const currentUser = getMyData();
  const dataLoading = (
    !currentUser ||
    basicCompaniesLoading ||
    basicUsersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    myProjectsLoading ||
    taskLoading
  )

  if ( taskError ) {
    return (
      <AccessDenied>
        <ErrorMessage show={true} message={taskError.message} />
      </AccessDenied>
    )
  }

  if ( dataLoading ) {
    return ( <Loading /> );
  }

  return (
    <TaskEdit
      {...props}
      id={id}
      fromInvoice={fromInvoice}
      task={taskData.task}
      inModal={inModal}
      closeModal={closeModal}
      currentUser={currentUser}
      accessRights={currentUser.role.accessRights}
      companies={toSelArr(basicCompaniesData.basicCompanies)}
      users={toSelArr(basicUsersData.basicUsers, 'fullName')}
      taskTypes={toSelArr(taskTypesData.taskTypes)}
      tripTypes={toSelArr(tripTypesData.tripTypes)}
      projects={toSelArr(myProjectsData.myProjects.map((project) => ({...project, id: project.project.id, title: project.project.title}) ))}
      emails={/*emailsData && emailsData.emails ? emailsData.emails : */[]}
      filterValues={localFilterToValues(filterData.localFilter)}
      originalProjectId={projectData.localProject.id}
      filterId={filterData.localFilter.id}
      addCompanyToList={addCompanyToList}
      addAttachments={addAttachments}
      removeAttachment={removeAttachment}
      deleteTaskFunc={deleteTaskFunc}
      addShortSubtask={addShortSubtaskFunc}
      updateShortSubtask={updateShortSubtaskFunc}
      deleteShortSubtask={deleteShortSubtaskFunc}
      updateCasheStorage={updateCasheStorage}
      updateTask={updateTask}
      setTaskLayout={setTaskLayoutFunc}
      client={client}
      saving={saving}
      setSaving={setSaving}
      />
  );

}