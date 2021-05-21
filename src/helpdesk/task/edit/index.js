import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
  gql,
} from "@apollo/client";

import moment from 'moment';

import Loading from 'components/loading';
import TaskEdit from './taskEdit';
import AccessDenied from 'components/accessDenied';
import ErrorMessage from 'components/errorMessage';
import axios from 'axios';

import {
  toSelArr,
  localFilterToValues,
  getMyData,
} from 'helperFunctions';

import {
  GET_TASK_TYPES
} from 'helpdesk/settings/taskTypes/queries';

import {
  GET_TRIP_TYPES
} from 'helpdesk/settings/tripTypes/queries';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/queries';

import {
  GET_BASIC_COMPANIES
} from 'helpdesk/settings/companies/queries';

import {
  GET_BASIC_USERS
} from 'helpdesk/settings/users/queries';

import {
  GET_TASK,
  GET_TASKS,

  DELETE_TASK,
  UPDATE_TASK,
  UPDATE_INVOICED_TASK,
  SET_TASK_LAYOUT,

  ADD_SCHEDULED_TASK,
  DELETE_SCHEDULED_TASK,
  ADD_SHORT_SUBTASK,
  UPDATE_SHORT_SUBTASK,
  DELETE_SHORT_SUBTASK,
  ADD_SUBTASK,
  UPDATE_SUBTASK,
  DELETE_SUBTASK,
  ADD_WORKTRIP,
  UPDATE_WORKTRIP,
  DELETE_WORKTRIP,
  ADD_MATERIAL,
  UPDATE_MATERIAL,
  DELETE_MATERIAL,
  ADD_CUSTOM_ITEM,
  UPDATE_CUSTOM_ITEM,
  DELETE_CUSTOM_ITEM,
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
    history
  } = props;

  const inModal = props.inModal === true;
  const id = inModal ? taskID : parseInt( match.params.taskID );
  const client = useApolloClient();

  const {
    data: basicCompaniesData,
    loading: basicCompaniesLoading,
    refetch: basicCompaniesRefetch,
  } = useQuery( GET_BASIC_COMPANIES );
  const {
    data: basicUsersData,
    loading: basicUsersLoading,
    refetch: basicUsersRefetch,
  } = useQuery( GET_BASIC_USERS );
  const {
    data: taskTypesData,
    loading: taskTypesLoading,
  } = useQuery( GET_TASK_TYPES );
  const {
    data: tripTypesData,
    loading: tripTypesLoading,
  } = useQuery( GET_TRIP_TYPES );
  const {
    data: myProjectsData,
    loading: myProjectsLoading,
    refetch: refetchMyProjects,
  } = useQuery( GET_MY_PROJECTS );
  const {
    data: taskData,
    loading: taskLoading,
    refetch: taskRefetch,
    error: taskError
  } = useQuery( GET_TASK, {
    variables: {
      id
    },
    //notifyOnNetworkStatusChange: true,
  } );
  //local
  const {
    data: filterData,
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
  } = useQuery( GET_PROJECT );

  const [ updateTask ] = useMutation( UPDATE_TASK );
  const [ updateInvoicedTask ] = useMutation( UPDATE_INVOICED_TASK );
  const [ setTaskLayout ] = useMutation( SET_TASK_LAYOUT );

  const [ addScheduledTask ] = useMutation( ADD_SCHEDULED_TASK );
  const [ deleteScheduledTask ] = useMutation( DELETE_SCHEDULED_TASK );
  const [ addShortSubtask ] = useMutation( ADD_SHORT_SUBTASK );
  const [ updateShortSubtask ] = useMutation( UPDATE_SHORT_SUBTASK );
  const [ deleteShortSubtask ] = useMutation( DELETE_SHORT_SUBTASK );
  const [ deleteTask ] = useMutation( DELETE_TASK );
  const [ addSubtask ] = useMutation( ADD_SUBTASK );
  const [ updateSubtask ] = useMutation( UPDATE_SUBTASK );
  const [ deleteSubtask ] = useMutation( DELETE_SUBTASK );
  const [ addWorkTrip ] = useMutation( ADD_WORKTRIP );
  const [ updateWorkTrip ] = useMutation( UPDATE_WORKTRIP );
  const [ deleteWorkTrip ] = useMutation( DELETE_WORKTRIP );
  const [ addMaterial ] = useMutation( ADD_MATERIAL );
  const [ updateMaterial ] = useMutation( UPDATE_MATERIAL );
  const [ deleteMaterial ] = useMutation( DELETE_MATERIAL );
  const [ addCustomItem ] = useMutation( ADD_CUSTOM_ITEM );
  const [ updateCustomItem ] = useMutation( UPDATE_CUSTOM_ITEM );
  const [ deleteCustomItem ] = useMutation( DELETE_CUSTOM_ITEM );
  const [ deleteTaskAttachment ] = useMutation( DELETE_TASK_ATTACHMENT );

  React.useEffect( () => {
    taskRefetch( {
      variables: {
        id
      }
    } );
  }, [ id ] );

  const [ saving, setSaving ] = React.useState( false );

  //functions

  const updateCasheStorage = ( response, key, type ) => {
    const task = client.readQuery( {
        query: GET_TASK,
        variables: {
          id
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
        id
      },
      data: {
        task: newTask
      }
    } );
  }

  const addScheduledTaskFunc = ( scheduled ) => {
    setSaving( true );

    addScheduledTask( {
        variables: scheduled
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addScheduledTask, 'scheduled', 'ADD' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteScheduledTaskFunc = ( id ) => {
    deleteScheduledTask( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'scheduled', 'DELETE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }


  const addShortSubtaskFunc = ( sub ) => {
    setSaving( true );

    addShortSubtask( {
        variables: sub
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addShortSubtask, 'shortSubtasks', 'ADD' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
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
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateShortSubtask, 'shortSubtasks', 'UPDATE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteShortSubtaskFunc = ( id ) => {
    deleteShortSubtask( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'shortSubtasks', 'DELETE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }

  const addSubtaskFunc = ( sub ) => {
    setSaving( true );

    addSubtask( {
        variables: {
          title: sub.title,
          order: sub.order,
          done: sub.done,
          approved: sub.approved,
          discount: sub.discount,
          quantity: sub.quantity,
          type: sub.type.id,
          task: parseInt( match.params.taskID ),
          assignedTo: sub.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addSubtask, 'subtasks', 'ADD' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const updateSubtaskFunc = ( sub ) => {
    setSaving( true );

    updateSubtask( {
        variables: {
          id: sub.id,
          title: sub.title,
          order: sub.order,
          done: sub.done,
          approved: sub.approved,
          discount: sub.discount,
          quantity: sub.quantity,
          type: sub.type.id,
          assignedTo: sub.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateSubtask, 'subtasks', 'UPDATE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteSubtaskFunc = ( id ) => {
    deleteSubtask( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'subtasks', 'DELETE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }

  const addWorkTripFunc = ( wt ) => {
    setSaving( true );

    addWorkTrip( {
        variables: {
          order: wt.order,
          done: wt.done,
          approved: wt.approved,
          discount: parseFloat( wt.discount ),
          quantity: parseFloat( wt.quantity ),
          type: wt.type.id,
          task: parseInt( match.params.taskID ),
          assignedTo: wt.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addWorkTrip, 'workTrips', 'ADD' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const updateWorkTripFunc = ( item ) => {
    setSaving( true );

    updateWorkTrip( {
        variables: {
          id: item.id,
          order: item.order,
          done: item.done,
          approved: item.approved,
          discount: item.discount,
          quantity: item.quantity,
          type: item.type.id,
          assignedTo: item.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateWorkTrip, 'workTrips', 'UPDATE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteWorkTripFunc = ( id ) => {
    deleteWorkTrip( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'workTrips', 'DELETE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }

  const addMaterialFunc = ( item ) => {
    setSaving( true );
    addMaterial( {
        variables: {
          title: item.title,
          order: item.order,
          done: item.done,
          approved: item.approved,
          quantity: parseFloat( item.quantity ),
          margin: parseFloat( item.margin ),
          price: parseFloat( item.price ),
          task: parseInt( match.params.taskID ),
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addMaterial, 'materials', 'ADD' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const updateMaterialFunc = ( item ) => {
    setSaving( true );

    updateMaterial( {
        variables: {
          id: item.id,
          title: item.title,
          order: item.order,
          done: item.done,
          approved: item.approved,
          quantity: parseFloat( item.quantity ),
          margin: parseFloat( item.margin ),
          price: parseFloat( item.price ),
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateMaterial, 'materials', 'UPDATE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteMaterialFunc = ( id ) => {
    deleteMaterial( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'materials', 'DELETE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const addCustomItemFunc = ( item ) => {
    setSaving( true );
    addCustomItem( {
        variables: {
          title: item.title,
          order: item.order,
          done: item.done,
          approved: item.approved,
          quantity: parseFloat( item.quantity ),
          price: parseFloat( item.price ),
          task: parseInt( match.params.taskID ),
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.addCustomItem, 'customItems', 'ADD' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const updateCustomItemFunc = ( item ) => {
    setSaving( true );

    updateCustomItem( {
        variables: {
          id: item.id,
          title: item.title,
          order: item.order,
          done: item.done,
          approved: item.approved,
          quantity: parseFloat( item.quantity ),
          price: parseFloat( item.price ),
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateCustomItem, 'customItems', 'UPDATE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteCustomItemFunc = ( id ) => {
    deleteCustomItem( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( {
          id
        }, 'customItems', 'DELETE' );
      } )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }

  const deleteTaskFunc = () => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteTask( {
          variables: {
            id,
          }
        } )
        .then( ( response ) => {
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
          if ( inModal ) {
            closeModal();
          } else {
            history.goBack();
            history.push( match.url.substring( 0, match.url.length - match.params.taskID.length ) );
          }
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  }

  const addCompanyToList = ( company ) => {
    basicCompaniesRefetch();
  }

  const submitComment = ( comment, setSaving = () => {}, onFinish = () => {} ) => {
    const {
      id,
      message,
      attachments,
      parentCommentId,
      internal,
    } = comment;

    setSaving( true );
    const formData = new FormData();
    attachments.forEach( ( file ) => formData.append( `file`, file ) );
    //FORM DATA
    formData.append( "token", `Bearer ${sessionStorage.getItem('acctok')}` );
    formData.append( "taskId", id );
    formData.append( "message", message );
    formData.append( "parentCommentId", parentCommentId );
    formData.append( "internal", internal );
    axios.post( `${REST_URL}/send-comment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      } )
      .then( ( response ) => {
        onFinish();
        setSaving( false );
      } )
      .catch( ( err ) => {
        setSaving( false );
        console.log( err.message );
      } );
  }

  const submitEmail = ( email, setSaving = () => {}, onFinish = () => {} ) => {
    const {
      id,
      attachments,
      emailBody,
      subject,
      tos
    } = email;
    setSaving( true );
    const formData = new FormData();
    attachments.forEach( ( file ) => formData.append( `file`, file ) );
    //FORM DATA
    formData.append( "token", `Bearer ${sessionStorage.getItem('acctok')}` );
    formData.append( "taskId", id );
    formData.append( "message", emailBody );
    formData.append( "subject", subject );
    tos.forEach( ( to ) => formData.append( `tos`, to.email ) );
    axios.post( `${REST_URL}/send-email`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      } )
      .then( ( response ) => {
        onFinish();
        setSaving( false );
      } )
      .catch( ( err ) => {
        setSaving( false );
        console.log( err.message );
      } );
  }

  const addAttachments = ( attachments ) => {
    const formData = new FormData();
    attachments.forEach( ( file ) => formData.append( `file`, file ) );
    formData.append( "token", `Bearer ${sessionStorage.getItem('acctok')}` );
    formData.append( "taskId", id );
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
    if ( window.confirm( "Are you sure?" ) ) {
      deleteTaskAttachment( {
          variables: {
            id: attachment.id,
          }
        } )
        .then( ( response ) => {
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
      .catch( ( err ) => console.log( err ) );
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
      submitComment={submitComment}
      submitEmail={submitEmail}
      addAttachments={addAttachments}
      removeAttachment={removeAttachment}
      addScheduledTaskFunc={addScheduledTaskFunc}
      deleteScheduledTaskFunc={deleteScheduledTaskFunc}
      deleteTaskFunc={deleteTaskFunc}
      addSubtaskFunc={addSubtaskFunc}
      updateSubtaskFunc={updateSubtaskFunc}
      deleteSubtaskFunc={deleteSubtaskFunc}
      addWorkTripFunc={addWorkTripFunc}
      updateWorkTripFunc={updateWorkTripFunc}
      deleteWorkTripFunc={deleteWorkTripFunc}
      addMaterialFunc={addMaterialFunc}
      updateMaterialFunc={updateMaterialFunc}
      deleteMaterialFunc={deleteMaterialFunc}
      addCustomItemFunc={addCustomItemFunc}
      updateCustomItemFunc={updateCustomItemFunc}
      deleteCustomItemFunc={deleteCustomItemFunc}
      addShortSubtask={addShortSubtaskFunc}
      updateShortSubtask={updateShortSubtaskFunc}
      deleteShortSubtask={deleteShortSubtaskFunc}
      updateTask={updateTask}
      updateInvoicedTask={updateInvoicedTask}
      setTaskLayout={setTaskLayoutFunc}
      client={client}
      saving={saving}
      setSaving={setSaving}
      canEditInvoiced={props.canEditInvoiced === true}
      />
  );

}