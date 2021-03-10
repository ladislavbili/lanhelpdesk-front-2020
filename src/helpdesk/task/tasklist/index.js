import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
} from "@apollo/client";
import moment from 'moment';

import {
  splitArrayByFilter,
  localFilterToValues,
  deleteAttributes
} from 'helperFunctions';

import {
  defaultTasklistColumnPreference,
  unimplementedAttributes,
} from 'configs/constants/tasks';

import Loading from 'components/loading';
import TasklistSwitch from './layoutSwitch';

import {
  SET_USER_STATUSES
} from 'helpdesk/settings/templateStatuses/queries';

import {
  SET_TASKLIST_LAYOUT,
} from 'helpdesk/settings/users/queries';

import {
  setFilter,
  setProject,
  setMilestone,
  setTasksSort,
  setTasksAttributeFilter,
  setTasksAttributesFilter,
  setTaskSearch,
} from 'apollo/localSchema/actions';

import {
  GET_FILTER,
  GET_PROJECT,
  GET_MILESTONE,
  GET_TASK_SEARCH,
  GET_TASKS_SORT,
  GET_TASKS_ATTRIBUTES_FILTER,
} from 'apollo/localSchema/queries';

import {
  GET_TASKS,
  DELETE_TASK,
  GET_MY_DATA,
  GET_CALENDAR_EVENTS,
  GET_TASKLIST_COLUMNS_PREFERENCES,
  ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES
} from '../queries';

export default function TasksIndex( props ) {
  const {
    history,
    match,
  } = props;

  const {
    data: currentUserData,
    loading: currentUserLoading,
    refetch: userDataRefetch
  } = useQuery( GET_MY_DATA );

  //local
  const {
    data: filterData,
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
  } = useQuery( GET_PROJECT );

  const {
    data: milestoneData,
  } = useQuery( GET_MILESTONE );

  const {
    data: taskSearchData,
  } = useQuery( GET_TASK_SEARCH );

  const {
    data: tasksSortData,
  } = useQuery( GET_TASKS_SORT );

  const {
    data: attributesFilterData
  } = useQuery( GET_TASKS_ATTRIBUTES_FILTER );

  const localFilter = filterData.localFilter;
  const localProject = projectData.localProject;
  const localMilestone = milestoneData.localMilestone;

  //network
  const {
    data: calendarEventsData,
    loading: calendarEventsLoading,
    refetch: calendarEventsRefetch
  } = useQuery( GET_CALENDAR_EVENTS, {
    variables: {
      filter: deleteAttributes(
        localFilterToValues( localFilter ),
        unimplementedAttributes
      ),
      projectId: localProject.id
    },
  } );

  const {
    data: preferencesData,
    loading: preferencesLoading,
    refetch: preferencesRefetch
  } = useQuery( GET_TASKLIST_COLUMNS_PREFERENCES, {
    variables: {
      projectId: localProject.id
    },
  } );

  const {
    data: tasksData,
    loading: tasksLoading,
    refetch: tasksRefetch,
  } = useQuery( GET_TASKS, {
    variables: {
      filterId: localFilter.id,
      filter: deleteAttributes(
        localFilterToValues( localFilter ),
        unimplementedAttributes
      ),
      projectId: localProject.id,
      sort: null
    },
    notifyOnNetworkStatusChange: true,
  } );

  const [ deleteTask, {
    client
  } ] = useMutation( DELETE_TASK );
  const [ setUserStatuses ] = useMutation( SET_USER_STATUSES );
  const [ setTasklistLayout ] = useMutation( SET_TASKLIST_LAYOUT );
  const [ addOrUpdatePreferences ] = useMutation( ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES );

  //sync
  //refetch calendar and tasks
  React.useEffect( () => {
    tasksRefetch( {
      variables: {
        filterId: localFilter.id,
        filter: localFilterToValues( localFilter ),
        projectId: localProject.id
      }
    } );
    calendarEventsRefetch( {
      variables: {
        filter: localFilterToValues( localFilter ),
        projectId: localProject.id
      }
    } );
  }, [ localFilter, localProject.id ] );

  //state
  const [ markedTasks, setMarkedTasks ] = React.useState( [] );

  const dataLoading = (
    currentUserLoading ||
    tasksLoading ||
    calendarEventsLoading ||
    preferencesLoading
  );

  if ( dataLoading ) {
    return ( <Loading /> );
  }

  const tasks = tasksData.tasks.tasks;
  const currentUser = currentUserData.getMyData;
  const tasksSort = tasksSortData.tasksSort;

  //done
  const setTasklistLayoutFunc = ( value ) => {
    setTasklistLayout( {
        variables: {
          tasklistLayout: value,
        }
      } )
      .then( ( response ) => {
        userDataRefetch();
      } )
      .catch( ( err ) => console.log( err ) );
  }

  const setPreference = ( visibility ) => {
    console.log( {
      preference,
      visibility
    } );
    addOrUpdatePreferences( {
        variables: {
          ...preference,
          ...visibility,
          projectId: localProject.id,
        }
      } )
      .then( ( response ) => {

        const preference = client.readQuery( {
            query: GET_TASKLIST_COLUMNS_PREFERENCES,
            variables: {
              projectId: localProject.id
            },
          } )
          .tasklistColumnPreference;
        let newPreference = preference ? preference : {};
        newPreference = {
          ...newPreference,
          ...response.data.addOrUpdateTasklistColumnPerference
        }
        client.writeQuery( {
          query: GET_TASKLIST_COLUMNS_PREFERENCES,
          variables: {
            projectId: localProject.id
          },
          data: {
            tasklistColumnPreference: newPreference
          }
        } );
      } )
      .catch( ( error ) => {
        console.log( error );
      } )
  }

  //done
  const checkTask = ( id ) => {
    if ( id === 'all' ) {
      if ( markedTasks.length === tasks.length ) {
        setMarkedTasks( [] );
      } else {
        setMarkedTasks( tasks.map( ( task ) => task.id ) )
      }
    } else {
      if ( !markedTasks.includes( id ) ) {
        setMarkedTasks( [ ...markedTasks, id ] );
      } else {
        setMarkedTasks( markedTasks.filter( ( taskId ) => taskId !== id ) );
      }
    }
  }

  //done
  const deleteTaskFunc = () => {
    if ( window.confirm( "Are you sure?" ) ) {
      let tasksForDelete = tasks.filter( ( task ) => markedTasks.includes( task.id ) );
      const [ canDeleteTasks, cantDeleteTasks ] = splitArrayByFilter( tasksForDelete, ( task ) => currentUser.role.level === 0 || task.project.right.delete );
      Promise.all(
          canDeleteTasks.map( task => {
            deleteTask( {
              variables: {
                id: task.id,
              }
            } )
          } )
        )
        .then( ( responses ) => {
          const queryFilter = localFilterToValues( filterData.localFilter );
          const existingTasks = client.readQuery( {
              query: GET_TASKS,
              variables: {
                filterId: localFilter.id,
                filter: queryFilter,
                projectId: localProject.id
              }
            } )
            .tasks;

          client.writeQuery( {
            query: GET_TASKS,
            data: {
              tasks: {
                ...existingTasks,
                tasks: existingTasks.tasks.filter( ( existingTask ) => !canDeleteTasks.some( ( deletedTask ) => deletedTask.id === existingTask.id ) )
              }
            },
            variables: {
              filterId: localFilter.id,
              filter: queryFilter,
              projectId: localProject.id
            }
          } );
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );

      if ( cantDeleteTasks.length > 0 ) {
        window.alert( `${tasksToDelete.length} were deleted. Some tasks couln't be deleted. This includes: \n` + cantDeleteTasks.reduce( ( acc, task ) => acc + `${task.id} ${task.title} \n`, '' ) )
      }
    }
  }
  //done
  const setUserStatusesFunc = ( ids ) => {
    let projectStatusIds = ( localProject.project.statuses ? localProject.project.statuses : [] )
      .map( ( status ) => status.id );
    setUserStatuses( {
        variables: {
          ids: [
          ...currentUser.statuses.map( ( status ) => status.id )
          .filter( ( id ) => !projectStatusIds.includes( id ) ),
          ...ids
          ]
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const processTasks = ( tasks ) => {
    return tasks.map( ( task ) => ( {
      ...task,
      checked: markedTasks.includes( task.id )
    } ) )
  }

  const preference = ( preferencesData && preferencesData.tasklistColumnPreference ) ? preferencesData.tasklistColumnPreference : defaultTasklistColumnPreference;


  localFilter
  localProject
  localMilestone
  calendarEventsData

  return (
    <TasklistSwitch
      history={history}
      match={match}
      currentUser={currentUser}
      localFilter = {localFilter}
      setLocalFilter={setFilter}
      localProject = {localProject}
      setLocalProject={setProject}
      localMilestone = {localMilestone}
      setLocalMilestone={setMilestone}
      taskSearch={taskSearchData.taskSearch}
      setTaskSearch={setTaskSearch}
      calendarEvents={calendarEventsData.calendarEvents}
      tasks={processTasks(tasks)}
      checkTask={checkTask}
      preference = {preference}
      setPreference={setPreference}
      orderBy={ tasksSort.key }
      setOrderBy={(value) => {
        setTasksSort({ ...tasksSort, key: value })
      }}
      ascending={ tasksSort.asc }
      setAscending={(ascending) => {
        setTasksSort({ ...tasksSort, asc: ascending })
      }}
      selectedStatuses={currentUser.statuses.map((status) => status.id )}
      setSelectedStatuses={setUserStatusesFunc}
      deleteTask={deleteTaskFunc}
      tasklistLayout={currentUser.tasklistLayout}
      setTasklistLayout={setTasklistLayoutFunc}
      attributesFilter={attributesFilterData.tasksAttributesFilter}
      setAttributeFilter={setTasksAttributeFilter}
      setAttributesFilter={setTasksAttributesFilter}
      />
  );
}