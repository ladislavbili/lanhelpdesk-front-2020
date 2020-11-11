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
import axios from 'axios';

import {
  toSelArr,
  localFilterToValues
} from 'helperFunctions';

import {
  GET_STATUSES
} from 'helpdesk/settings/statuses/querries';

import {
  GET_TAGS
} from 'helpdesk/settings/tags/querries';

import {
  GET_TASK_TYPES
} from 'helpdesk/settings/taskTypes/querries';

import {
  GET_TRIP_TYPES
} from 'helpdesk/settings/tripTypes/querries';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/querries';

import {
  GET_BASIC_COMPANIES
} from 'helpdesk/settings/companies/querries';

import {
  GET_BASIC_USERS
} from 'helpdesk/settings/users/querries';

import {
  GET_MY_DATA,
  GET_EMAILS,
  GET_TASK,

  ADD_USER_TO_PROJECT,
  DELETE_TASK,
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
} from './querries';

import {
  GET_FILTER,
  GET_PROJECT,
} from 'apollo/localSchema/querries';

import {
  ADD_COMMENT
} from '../components/comments/queries';

import {
  REST_URL,
} from 'configs/restAPI';


export default function TaskEditContainer( props ) {
  //data & queries
  const {
    match
  } = props;
  const id = parseInt( match.params.taskID );
  const client = useApolloClient();

  const {
    data: myData,
    loading: myDataLoading,
  } = useQuery( GET_MY_DATA );
  const {
    data: statusesData,
    loading: statusesLoading,
  } = useQuery( GET_STATUSES );
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
    data: tagsData,
    loading: tagsLoading,
  } = useQuery( GET_TAGS );
  const {
    data: myProjectsData,
    loading: myProjectsLoading,
    refetch: refetchMyProjects,
  } = useQuery( GET_MY_PROJECTS );
  const {
    data: taskData,
    loading: taskLoading,
    refetch: taskRefetch
  } = useQuery( GET_TASK, {
    variables: {
      id
    },
    notifyOnNetworkStatusChange: true,
  } );
  //local
  const {
    data: filterData,
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
  } = useQuery( GET_PROJECT );

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
  const [ addUserToProject ] = useMutation( ADD_USER_TO_PROJECT );
  const [ addComment ] = useMutation( ADD_COMMENT );


  React.useEffect( () => {
    taskRefetch( {
      variables: {
        id
      }
    } );
  }, [ id ] );

  const [ saving, setSaving ] = React.useState( false );

  //functions

  const addSubtaskFunc = ( sub ) => {
    setSaving( true );

    addSubtask( {
        variables: {
          title: sub.title,
          order: sub.order,
          done: sub.done,
          discount: sub.discount,
          quantity: sub.quantity,
          type: sub.type.id,
          task: parseInt( match.params.taskID ),
          assignedTo: sub.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        console.log( response );
        setSubtasks( [ ...subtasks, {
          ...sub,
          id: response.data.addSubtask.id
        } ] );
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
      .then( ( response ) => {} )
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
      .then( ( response ) => {} )
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
          discount: wt.discount,
          quantity: wt.quantity,
          type: wt.type.id,
          task: parseInt( match.params.taskID ),
          assignedTo: wt.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        console.log( response );
        setWorkTrips( [ ...workTrips, {
          ...wt,
          id: response.data.addWorkTrip.id
        } ] );
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
      .then( ( response ) => {} )
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
      .then( ( response ) => {} )
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
          quantity: parseFloat( item.quantity ),
          margin: parseFloat( item.margin ),
          price: parseFloat( item.price ),
          task: parseInt( match.params.taskID ),
        }
      } )
      .then( ( response ) => {
        console.log( response );
        setMaterials( [ ...materials, {
          ...item,
          id: response.data.addMaterial.id
        } ] );
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
      .then( ( response ) => {} )
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
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }

  const addCustomItemFunc = ( item ) => {
    setSaving( true );
    addCustomItem( {
        variables: {
          title: item.title,
          order: item.order,
          done: item.done,
          quantity: parseFloat( item.quantity ),
          price: parseFloat( item.price ),
          task: parseInt( match.params.taskID ),
        }
      } )
      .then( ( response ) => {
        console.log( response );
        setCustomItems( [ ...customItems, {
          ...item,
          id: response.data.addCustomItem.id
        } ] );
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
      .then( ( response ) => {} )
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
      .then( ( response ) => {} )
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
                projectId: projectData.localProject.id
              }
            } )
            .tasks;
          client.writeQuery( {
            query: GET_TASKS,
            variables: {
              filterId: filterData.localFilter.id,
              filter: localFilterToValues( filterData.localFilter ),
              projectId: projectData.localProject.id
            },
            data: {
              tasks: tasks.filter( ( task ) => task.id !== id )
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

  const addUserToProjectFunc = ( user, project ) => {
    addUserToProject( {
        variables: {
          userId: user.id,
          projectId: project.id,
        }
      } )
      .then( ( response ) => {
        refetchMyProjects()
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    basicUsersRefetch();
  }

  const addCompanyToList = ( company ) => {
    basicCompaniesRefetch();
  }

  const submitComment = ( comment, setSaving ) => {
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
    formData.append( "token", `Bearer ${localStorage.getItem('acctok')}` );
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
        if ( response.data.ok ) {
          const responseComment = response.data.comment;
          const newComment = {
            ...responseComment,
            childComments: [],
            createdAt: moment( responseComment.createdAt )
              .valueOf(),
            emailError: null,
            html: null,
            subject: null,
            tos: [],
            user: basicUsersData.basicUsers.find( ( user ) => user.id === responseComment.UserId ),
            __typename: "Comment"
          }
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
                comments: [ newComment, ...oldTask.comments ]
              }
            }
          } )
        }
        setSaving( false );
      } )
      .catch( ( err ) => {
        setSaving( false );
        console.log( err.message );
      } );
  }

  const submitEmail = ( email, setSaving ) => {
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
    formData.append( "token", `Bearer ${localStorage.getItem('acctok')}` );
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
        const responseComment = response.data.comment;
        const newComment = {
          ...responseComment,
          childComments: [],
          createdAt: moment( responseComment.createdAt )
            .valueOf(),
          html: responseComment.message,
          tos: responseComment.EmailTargets.map( ( emailTarget ) => emailTarget.address ),
          user: basicUsersData.basicUsers.find( ( user ) => user.id === responseComment.UserId ),
          __typename: "Comment",
        }
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
              comments: [ newComment, ...oldTask.comments ]
            }
          }
        } )
        setSaving( false );
      } )
      .catch( ( err ) => {
        setSaving( false );
        console.log( err.message );
      } );
  }

  const dataLoading = (
    myDataLoading ||
    statusesLoading ||
    basicCompaniesLoading ||
    basicUsersLoading ||
    taskTypesLoading ||
    tripTypesLoading ||
    tagsLoading ||
    myProjectsLoading ||
    taskLoading
  )
  if ( dataLoading ) {
    return ( <Loading /> );
  }

  return (
    <TaskEdit
			{...props}
      id={id}
      task={taskData.task}
			currentUser={myData.getMyData}
			accessRights={myData.getMyData.role.accessRights}
			statuses={toSelArr(statusesData.statuses)}
			companies={toSelArr(basicCompaniesData.basicCompanies)}
			users={toSelArr(basicUsersData.basicUsers, 'fullName')}
			taskTypes={toSelArr(taskTypesData.taskTypes)}
			tripTypes={toSelArr(tripTypesData.tripTypes)}
			allTags={toSelArr(tagsData.tags)}
      projects={toSelArr(myProjectsData.myProjects.map((project) => ({...project, id: project.project.id, title: project.project.title}) ))}
      emails={/*emailsData && emailsData.emails ? emailsData.emails : */[]}
      inModal={false}
      filterValues={localFilterToValues(filterData.localFilter)}
      originalProjectId={projectData.localProject.id}
      filterId={filterData.localFilter.id}
      addUserToProject={addUserToProjectFunc}
      addCompanyToList={addCompanyToList}
      submitComment={submitComment}
      submitEmail={submitEmail}
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
      saving={saving}
      setSaving={setSaving}
			 />
  );

}