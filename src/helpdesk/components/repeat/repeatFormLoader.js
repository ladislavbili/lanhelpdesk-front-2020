import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
} from "@apollo/client";
import {
  toSelArr
} from 'helperFunctions';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button
} from 'reactstrap';
import Loading from 'components/loading';
import {
  noMilestone
} from 'configs/constants/sidebar';
import RepeatForm from './repeatForm';
import axios from 'axios';
import {
  REST_URL,
} from 'configs/restAPI';

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
  GET_REPEAT,
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
  DELETE_REPEAT_TEMPLATE_ATTACHMENT,
} from './queries';

export default function RepeatFormLoader( props ) {
  const {
    repeat,
    closeModal,
    taskID,
    duplicateTask
  } = props;
  const client = useApolloClient();
  //data & queries
  const {
    data: repeatData,
    loading: repeatLoading,
    refetch: repeatRefetch,
    errror: repeatError,
  } = useQuery( GET_REPEAT, {
    variables: {
      id: repeat ? repeat.id : null
    },
    //notifyOnNetworkStatusChange: true,
  } );

  const repeatTemplateId = !repeatLoading && repeat && !repeatError ? repeatData.repeat.repeatTemplate.id : null;

  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES );
  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS );
  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES );
  const {
    data: tripTypesData,
    loading: tripTypesLoading
  } = useQuery( GET_TRIP_TYPES );

  const {
    data: projectsData,
    loading: projectsLoading
  } = useQuery( GET_MY_PROJECTS );
  const {
    data: currentUserData,
    loading: currentUserLoading
  } = useQuery( GET_MY_DATA );

  const [ addScheduledTask ] = useMutation( ADD_SCHEDULED_TASK );
  const [ deleteScheduledTask ] = useMutation( DELETE_SCHEDULED_TASK );
  const [ addShortSubtask ] = useMutation( ADD_SHORT_SUBTASK );
  const [ updateShortSubtask ] = useMutation( UPDATE_SHORT_SUBTASK );
  const [ deleteShortSubtask ] = useMutation( DELETE_SHORT_SUBTASK );
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
  const [ deleteRepeatTemplateAttachment ] = useMutation( DELETE_REPEAT_TEMPLATE_ATTACHMENT );

  const [ saving, setSaving ] = React.useState( false );

  const updateCasheStorage = ( response, key, type ) => {
    const oldRepeat = client.readQuery( {
        query: GET_REPEAT,
        variables: {
          id: repeat.id,
        }
      } )
      .repeat;
    let newRepeatTemplate = {
      ...oldRepeat.repeatTemplate,
    };
    newRepeatTemplate[ key ] = [ ...newRepeatTemplate[ key ] ]
    switch ( type ) {
      case 'ADD': {
        newRepeatTemplate[ key ].push( response );
        break;
      }
      case 'UPDATE': {
        newRepeatTemplate[ key ][ newRepeatTemplate[ key ].findIndex( ( item ) => item.id === response.id ) ] = response;
        break;
      }
      case 'DELETE': {
        newRepeatTemplate[ key ] = newRepeatTemplate[ key ].filter( ( item ) => item.id !== response.id );
        break;
      }
      default: {
        return;
      }
    }
    client.writeQuery( {
      query: GET_REPEAT,
      variables: {
        id: repeat.id,
      },
      data: {
        repeat: {
          ...oldRepeat,
          repeatTemplate: newRepeatTemplate
        }
      }
    } );
  }

  const addScheduledTaskFunc = ( scheduled, saveItem ) => {
    setSaving( true );

    addScheduledTask( {
        variables: scheduled
      } )
      .then( ( response ) => {
        saveItem( response.data.addRepeatTemplateScheduledTask.id );
        updateCasheStorage( response.data.addRepeatTemplateScheduledTask, 'scheduled', 'ADD' );
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

  const addShortSubtaskFunc = ( sub, saveItem ) => {
    setSaving( true );

    addShortSubtask( {
        variables: sub
      } )
      .then( ( response ) => {
        saveItem( response.data.addRepeatTemplateShortSubtask.id );
        updateCasheStorage( response.data.addRepeatTemplateShortSubtask, 'shortSubtasks', 'ADD' );
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
        updateCasheStorage( response.data.updateRepeatTemplateShortSubtask, 'shortSubtasks', 'UPDATE' );
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

  const addSubtaskFunc = ( sub, saveItem ) => {
    setSaving( true );

    addSubtask( {
        variables: {
          title: sub.title,
          order: sub.order,
          done: sub.done,
          discount: sub.discount,
          quantity: sub.quantity,
          type: sub.type.id,
          repeatTemplate: repeatTemplateId,
          assignedTo: sub.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        saveItem( response.data.addRepeatTemplateSubtask.id );
        updateCasheStorage( response.data.addRepeatTemplateSubtask, 'subtasks', 'ADD' );
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
          discount: sub.discount,
          quantity: sub.quantity,
          type: sub.type.id,
          assignedTo: sub.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateRepeatTemplateSubtask, 'subtasks', 'UPDATE' );
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

  const addWorkTripFunc = ( wt, saveItem ) => {
    setSaving( true );

    addWorkTrip( {
        variables: {
          order: wt.order,
          done: wt.done,
          discount: parseFloat( wt.discount ),
          quantity: parseFloat( wt.quantity ),
          type: wt.type.id,
          repeatTemplate: repeatTemplateId,
          assignedTo: wt.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        saveItem( response.data.addRepeatTemplateWorkTrip.id );
        updateCasheStorage( response.data.addRepeatTemplateWorkTrip, 'workTrips', 'ADD' );
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
          discount: item.discount,
          quantity: item.quantity,
          type: item.type.id,
          assignedTo: item.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateRepeatTemplateWorkTrip, 'workTrips', 'UPDATE' );
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

  const addMaterialFunc = ( item, saveItem ) => {
    setSaving( true );
    addMaterial( {
        variables: {
          title: item.title,
          order: item.order,
          done: item.done,
          quantity: parseFloat( item.quantity ),
          margin: parseFloat( item.margin ),
          price: parseFloat( item.price ),
          repeatTemplate: repeatTemplateId,
        }
      } )
      .then( ( response ) => {
        saveItem( response.data.addRepeatTemplateMaterial.id );
        updateCasheStorage( response.data.addRepeatTemplateMaterial, 'materials', 'ADD' );
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
          quantity: parseFloat( item.quantity ),
          margin: parseFloat( item.margin ),
          price: parseFloat( item.price ),
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateRepeatTemplateMaterial, 'materials', 'UPDATE' );
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

  const addCustomItemFunc = ( item, saveItem ) => {
    setSaving( true );
    addCustomItem( {
        variables: {
          title: item.title,
          order: item.order,
          done: item.done,
          quantity: parseFloat( item.quantity ),
          price: parseFloat( item.price ),
          repeatTemplate: repeatTemplateId,
        }
      } )
      .then( ( response ) => {
        saveItem( response.data.addRepeatTemplateCustomItem.id );
        updateCasheStorage( response.data.addRepeatTemplateCustomItem, 'customItems', 'ADD' );
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
          quantity: parseFloat( item.quantity ),
          price: parseFloat( item.price ),
        }
      } )
      .then( ( response ) => {
        updateCasheStorage( response.data.updateRepeatTemplateCustomItem, 'customItems', 'UPDATE' );
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

  const addAttachments = ( attachments ) => {
    const formData = new FormData();
    attachments.forEach( ( file ) => formData.append( `file`, file ) );
    formData.append( "token", `Bearer ${sessionStorage.getItem('acctok')}` );
    formData.append( "repeatTemplateId", repeatTemplateId );
    axios.post(
        `${REST_URL}/upload-repeat-template-attachments`,
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      .then( ( response ) => {
        const newAttachments = response.data.attachments.map( ( attachment ) => ( {
          ...attachment,
          __typename: "RepeatTemplateAttachment",
        } ) )
        const oldRepeat = client.readQuery( {
            query: GET_REPEAT,
            variables: {
              id: repeat.id,
            }
          } )
          .repeat;
        client.writeQuery( {
          query: GET_REPEAT,
          variables: {
            id: repeat.id,
          },
          data: {
            repeat: {
              ...oldRepeat,
              repeatTemplate: {
                ...oldRepeat.repeatTemplate,
                repeatTemplateAttachments: [ ...oldRepeat.repeatTemplate.repeatTemplateAttachments, ...newAttachments ]
              }
            }
          }
        } )
      } )
  }

  const removeAttachment = ( attachment ) => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteRepeatTemplateAttachment( {
          variables: {
            id: attachment.id,
          }
        } )
        .then( ( response ) => {
          const oldRepeat = client.readQuery( {
              query: GET_REPEAT,
              variables: {
                id: repeat.id,
              }
            } )
            .repeat;
          client.writeQuery( {
            query: GET_REPEAT,
            variables: {
              id: repeat.id,
            },
            data: {
              repeat: {
                ...oldRepeat,
                repeatTemplate: {
                  ...oldRepeat.repeatTemplate,
                  repeatTemplateAttachments: oldRepeat.repeatTemplate.repeatTemplateAttachments.filter( ( repeatTemplateAttachment ) => repeatTemplateAttachment.id !== attachment.id )
                }
              }
            }
          } )
        } )
    }
  }

  const loading = (
    companiesLoading ||
    usersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    projectsLoading ||
    currentUserLoading ||
    repeatLoading
  );

  if ( loading ) {
    return ( <Loading /> );
  }

  return (
    <RepeatForm
      {...props}
      originalRepeat={ repeat ? repeatData.repeat : null }
      editMode = { repeat ? true : false }
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
      directSaving={saving}
      taskID={taskID}
      duplicateTask={duplicateTask}
      addScheduledTaskFunc={addScheduledTaskFunc}
      deleteScheduledTaskFunc={deleteScheduledTaskFunc}
      addShortSubtaskFunc={addShortSubtaskFunc}
      updateShortSubtaskFunc={updateShortSubtaskFunc}
      deleteShortSubtaskFunc={deleteShortSubtaskFunc}
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
      addAttachments={addAttachments}
      removeAttachment={removeAttachment}
      />
  );
}