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
  attributeLimitingRights,
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
  setLocalTaskSearch,
  setGlobalTaskSearch,
  setLocalTaskStringFilter,
  setSingleLocalTaskStringFilter,
  setGlobalTaskStringFilter,
} from 'apollo/localSchema/actions';

import {
  GET_FILTER,
  GET_PROJECT,
  GET_MILESTONE,
  GET_TASKS_SORT,
  GET_LOCAL_TASK_SEARCH,
  GET_GLOBAL_TASK_SEARCH,
  GET_LOCAL_TASK_STRING_FILTER,
  GET_GLOBAL_TASK_STRING_FILTER,
  GET_LOCAL_CALENDAR_USER_ID,
  GET_LOCAL_CALENDAR_DATE_RANGE,
} from 'apollo/localSchema/queries';

import {
  GET_TASKS,
  DELETE_TASK,
  GET_MY_DATA,
  GET_CALENDAR_EVENTS,
  GET_TASKLIST_COLUMNS_PREFERENCES,
  GET_SCHEDULED_TASKS,
  ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES,
  ADD_SCHEDULED_TASK,
  UPDATE_SCHEDULED_TASK,
} from '../queries';

export default function TasksIndex( props ) {
  const {
    history,
    match,
  } = props;
  const page = match.params.page ? parseInt( match.params.page ) : 1;
  const limit = 30;
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
    data: tasksSortData,
  } = useQuery( GET_TASKS_SORT );

  const {
    data: localSearchData,
  } = useQuery( GET_LOCAL_TASK_SEARCH );

  const {
    data: globalSearchData,
  } = useQuery( GET_GLOBAL_TASK_SEARCH );

  const {
    data: localStringFilter,
  } = useQuery( GET_LOCAL_TASK_STRING_FILTER );

  const {
    data: globalStringFilter,
  } = useQuery( GET_GLOBAL_TASK_STRING_FILTER );

  const {
    data: localCalendarUserId,
  } = useQuery( GET_LOCAL_CALENDAR_USER_ID );

  const {
    data: localCalendarDateRange,
  } = useQuery( GET_LOCAL_CALENDAR_DATE_RANGE );

  const localFilter = filterData.localFilter;
  const localProject = projectData.localProject;
  const localMilestone = milestoneData.localMilestone;
  const tasksSort = tasksSortData.tasksSort;
  const filterVariables = deleteAttributes(
    localFilterToValues( localFilter ),
    unimplementedAttributes
  );
  const taskVariables = {
    projectId: localProject.id,
    filter: filterVariables,
    sort: tasksSort,
    search: globalSearchData.globalTaskSearch,
    stringFilter: globalStringFilter.globalTaskStringFilter,
    page,
    limit,
  }

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
    variables: taskVariables,
    notifyOnNetworkStatusChange: true,
  } );

  const {
    from: cFrom,
    to: cTo,
  } = localCalendarDateRange.localCalendarDateRange;

  const {
    data: scheduledTasksData,
    loading: scheduledTasksLoading,
    refetch: scheduledTasksRefetch,
  } = useQuery( GET_SCHEDULED_TASKS, {
    variables: {
      projectId: localProject.id,
      filter: filterVariables,
      from: cFrom.toString(),
      to: cTo.toString(),
      userId: localCalendarUserId.localCalendarUserId,
    },
    fetchPolicy: 'network-only',
  } );

  const [ deleteTask, {
    client
  } ] = useMutation( DELETE_TASK );
  const [ setUserStatuses ] = useMutation( SET_USER_STATUSES );
  const [ setTasklistLayout ] = useMutation( SET_TASKLIST_LAYOUT );
  const [ addOrUpdatePreferences ] = useMutation( ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES );
  const [ addScheduledTask ] = useMutation( ADD_SCHEDULED_TASK );
  const [ updateScheduledTask ] = useMutation( UPDATE_SCHEDULED_TASK );

  //sync
  //refetch calendar and tasks
  React.useEffect( () => {
    tasksRefetch( {
      variables: taskVariables,
    } );
  }, [ localFilter, localProject.id, tasksSort, globalSearchData, globalStringFilter ] );

  const scheduledRefetch = () => {
    scheduledTasksRefetch( {
      projectId: localProject.id,
      filter: filterVariables,
      from: cFrom.toString(),
      to: cTo.toString(),
      userId: localCalendarUserId.localCalendarUserId,
    } );
  }

  React.useEffect( () => {
    scheduledRefetch();
  }, [ cFrom, cTo ] );

  //monitor and log timings
  React.useEffect( () => {
    if ( !tasksLoading && false ) {
      console.log( 'timings', [ tasksData.tasks.execTime, tasksData.tasks.secondaryTimes ] );
    }
  }, [ tasksLoading ] );

  //state
  const [ markedTasks, setMarkedTasks ] = React.useState( [] );

  const dataLoading = (
    currentUserLoading ||
    tasksLoading ||
    preferencesLoading ||
    scheduledTasksLoading
  );

  if ( currentUserLoading ) {
    return ( <Loading /> );
  }

  const tasks = dataLoading ? [] : tasksData.tasks.tasks;
  const currentUser = currentUserData.getMyData;

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
    addOrUpdatePreferences( {
        variables: {
          ...createPreferences(),
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

  const createPreferences = () => {
    let preference = defaultTasklistColumnPreference;
    if ( preferencesData && preferencesData.tasklistColumnPreference ) {
      preference = {
        ...preference,
        ...preferencesData.tasklistColumnPreference
      };
    }
    if ( localProject.project.id === null ) {
      return preference;
    }
    attributeLimitingRights.forEach( ( limitingRight ) => {
      if ( !localProject.right[ limitingRight.right ] ) {
        preference[ limitingRight.preference ] = false;
      }
    } )
    return preference;
  }

  return (
    <TasklistSwitch
      history={history}
      match={match}
      loading={dataLoading}
      currentUser={currentUser}
      localFilter = {localFilter}
      setLocalFilter={setFilter}
      localProject = {localProject}
      setLocalProject={setProject}
      localMilestone = {localMilestone}
      setLocalMilestone={setMilestone}
      scheduledUserId={ localCalendarUserId.localCalendarUserId ? localCalendarUserId.localCalendarUserId : currentUser.id }
      scheduled={ !scheduledTasksLoading ? scheduledTasksData.scheduledTasks : [] }
      addScheduled={addScheduledTask}
      updateScheduled={updateScheduledTask}
      refetchScheduled={scheduledRefetch}
      tasks={dataLoading ? [] : processTasks(tasks) }
      count={ tasksLoading ? null : tasksData.tasks.count }
      page={page}
      limit={limit}
      checkTask={checkTask}
      preference = { preferencesLoading ? defaultTasklistColumnPreference : createPreferences()}
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

      taskSearch={localSearchData.localTaskSearch}
      setLocalTaskSearch={setLocalTaskSearch}
      setGlobalTaskSearch={setGlobalTaskSearch}

      attributesFilter={localStringFilter.localTaskStringFilter}
      setLocalTaskStringFilter={setLocalTaskStringFilter}
      setSingleLocalTaskStringFilter={setSingleLocalTaskStringFilter}
      setGlobalTaskStringFilter={setGlobalTaskStringFilter}
      />
  );
}