import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
} from "@apollo/client";
import {
  toSelArr,
  getMyData,
} from 'helperFunctions';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import Loading from 'components/loading';
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
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
  GET_REPEAT,
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
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: tripTypesData,
    loading: tripTypesLoading
  } = useQuery( GET_TRIP_TYPES, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: projectsData,
    loading: projectsLoading
  } = useQuery( GET_MY_PROJECTS, {
    fetchPolicy: 'network-only'
  } );

  const [ addSubtask ] = useMutation( ADD_SUBTASK );
  const [ updateSubtask ] = useMutation( UPDATE_SUBTASK );
  const [ deleteSubtask ] = useMutation( DELETE_SUBTASK );
  const [ addWorkTrip ] = useMutation( ADD_WORKTRIP );
  const [ updateWorkTrip ] = useMutation( UPDATE_WORKTRIP );
  const [ deleteWorkTrip ] = useMutation( DELETE_WORKTRIP );
  const [ addMaterial ] = useMutation( ADD_MATERIAL );
  const [ updateMaterial ] = useMutation( UPDATE_MATERIAL );
  const [ deleteMaterial ] = useMutation( DELETE_MATERIAL );
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

  const currentUser = getMyData();

  const loading = (
    companiesLoading ||
    usersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    projectsLoading ||
    !currentUser ||
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
          attributeRights: myProject.attributeRights,
          users: myProject.usersWithRights
        }) ))
      }
      users={ usersData ? toSelArr(usersData.basicUsers, 'email') : [] }
      companies={ toSelArr(companiesData.basicCompanies) }
      taskTypes={ toSelArr(taskTypesData.taskTypes) }
      tripTypes={ toSelArr(tripTypesData.tripTypes) }
      currentUser={ currentUser }
      defaultUnit={null}
      directSaving={saving}
      taskID={taskID}
      duplicateTask={duplicateTask}
      updateCasheStorage={updateCasheStorage}
      addAttachments={addAttachments}
      removeAttachment={removeAttachment}
      />
  );
}