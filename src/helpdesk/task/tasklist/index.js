import React from 'react';
import {
  useQuery,
  useMutation,
} from "@apollo/client";
import moment from 'moment';

import {
  splitArrayByFilter,
  localFilterToValues,
  deleteAttributes,
  getMyData,
} from 'helperFunctions';

import {
  defaultTasklistColumnPreference,
  defaultTasklistGanttColumnPreference,
  attributeLimitingRights,
  ganttAttributeLimitingRights,
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
  GET_MY_PROJECTS,
} from 'helpdesk/settings/projects/queries';

import {
  setFilter,
  setProject,
  setMilestone,
  setTasksSort,
  setGanttSort,
  addLocalError,
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
  GET_GANTT_SORT,
  GET_LOCAL_TASK_SEARCH,
  GET_GLOBAL_TASK_SEARCH,
  GET_LOCAL_TASK_STRING_FILTER,
  GET_GLOBAL_TASK_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  GET_TASKS,
  DELETE_TASK,
  GET_CALENDAR_EVENTS,
  GET_TASKLIST_COLUMNS_PREFERENCES,
  GET_TASKLIST_GANTT_COLUMNS_PREFERENCES,
  ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES,
  ADD_OR_UPDATE_TASKLIST_GANTT_COLUMNS_PREFERENCES,
} from '../queries';

export default function TasksLoader( props ) {
  const {
    history,
    match,
  } = props;
  const page = match.params.page ? parseInt( match.params.page ) : 1;
  const limit = 30;

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
    data: ganttSortData,
  } = useQuery( GET_GANTT_SORT );

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

  const localFilter = filterData.localFilter;
  const localProject = projectData.localProject;
  const localMilestone = milestoneData.localMilestone;
  const ganttSort = ganttSortData.ganttSort;
  const tasksSort = tasksSortData.tasksSort;

  const filterVariables = deleteAttributes(
    localFilterToValues( localFilter ),
    unimplementedAttributes
  );

  const currentUser = getMyData();
  const fetchingGantt = localProject.id !== null && currentUser && currentUser.tasklistLayout === 4;

  const statusFilter = ( currentUser ? currentUser.statuses : [] )
    .filter( ( selectedStatus ) => ( localProject.id === null || !localProject.project.statuses ? [] : localProject.project.statuses )
      .some( ( status ) => status.id === selectedStatus.id ) )
    .map( ( status ) => status.id );
  const taskVariables = {
    projectId: localProject.id,
    filter: filterVariables,
    sort: fetchingGantt ? ganttSort : tasksSort,
    milestoneSort: fetchingGantt,
    search: globalSearchData.globalTaskSearch,
    stringFilter: globalStringFilter.globalTaskStringFilter,
    statuses: statusFilter,
    page,
    limit,
  }

  const {
    data: myProjectsData,
    loading: myProjectsLoading,
    refetch: refetchMyProjects,
  } = useQuery( GET_MY_PROJECTS );

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
    data: ganttPreferencesData,
    loading: ganttPreferencesLoading,
    refetch: ganttPreferencesRefetch
  } = useQuery( GET_TASKLIST_GANTT_COLUMNS_PREFERENCES, {
    variables: {
      projectId: localProject.id
    },
  } );

  const {
    data: tasksData,
    loading: tasksLoading,
    refetch: tasksRefetchFunc,
  } = useQuery( GET_TASKS, {
    variables: taskVariables,
    notifyOnNetworkStatusChange: true,
  } );

  const [ deleteTask, {
    client
  } ] = useMutation( DELETE_TASK );
  const [ setUserStatuses ] = useMutation( SET_USER_STATUSES );
  const [ setTasklistLayout ] = useMutation( SET_TASKLIST_LAYOUT );
  const [ addOrUpdatePreferences ] = useMutation( ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES );
  const [ addOrUpdateGanttPreferences ] = useMutation( ADD_OR_UPDATE_TASKLIST_GANTT_COLUMNS_PREFERENCES );

  //sync

  const tasksRefetch = () => {
    tasksRefetchFunc( {
      variables: taskVariables,
    } );
  }
  //refetch calendar and tasks
  React.useEffect( () => {
    tasksRefetch();
  }, [ localFilter, localProject.id, tasksSort, ganttSort, globalSearchData, globalStringFilter ] );

  //monitor and log timings
  /*
    React.useEffect( () => {
      if ( !tasksLoading ) {
        console.log( 'timings', [ tasksData.tasks.execTime, tasksData.tasks.secondaryTimes ] );
      }
    }, [ tasksLoading ] );
  */
  //state
  const [ markedTasks, setMarkedTasks ] = React.useState( [] );

  const dataLoading = (
    tasksLoading ||
    preferencesLoading ||
    ganttPreferencesLoading
  );

  const tasks = dataLoading ? [] : tasksData.tasks.tasks;

  const setTasklistLayoutFunc = ( value ) => {
    setTasklistLayout( {
        variables: {
          tasklistLayout: value,
        }
      } )
      .then( ( response ) => {
        userDataRefetch();
      } )
      .catch( ( err ) => addLocalError( err ) );
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
          ...response.data.addOrUpdateTasklistColumnPreference
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
        addLocalError( error );
      } )
  }

  const setGanttPreference = ( visibility ) => {
    addOrUpdateGanttPreferences( {
        variables: {
          ...createGanttPreferences(),
          ...visibility,
          projectId: localProject.id,
        }
      } )
      .then( ( response ) => {

        const ganttPreference = client.readQuery( {
            query: GET_TASKLIST_GANTT_COLUMNS_PREFERENCES,
            variables: {
              projectId: localProject.id
            },
          } )
          .tasklistGanttColumnPreference;
        let newGanttPreference = ganttPreference ? ganttPreference : {};
        newGanttPreference = {
          ...newGanttPreference,
          ...response.data.addOrUpdateTasklistGanttColumnPreference
        }
        client.writeQuery( {
          query: GET_TASKLIST_GANTT_COLUMNS_PREFERENCES,
          variables: {
            projectId: localProject.id
          },
          data: {
            tasklistGanttColumnPreference: newGanttPreference
          }
        } );
      } )
      .catch( ( error ) => {
        addLocalError( error );
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
    if ( window.confirm( "Are you sure you want to delete checked tasks?" ) ) {
      let tasksForDelete = tasks.filter( ( task ) => markedTasks.includes( task.id ) );
      const [ canDeleteTasks, cantDeleteTasks ] = splitArrayByFilter( tasksForDelete, ( task ) => currentUser.role.level === 0 || task.rights.deleteTasks );
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
              variables: taskVariables
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
            variables: taskVariables
          } );
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );

      if ( cantDeleteTasks.length > 0 ) {
        window.alert( `${canDeleteTasks.length} were deleted. Some tasks couln't be deleted. This includes: \n` + cantDeleteTasks.reduce( ( acc, task ) => acc + `${task.id} ${task.title} \n`, '' ) )
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
      .catch( ( err ) => {
        addLocalError( err );
      } );
  }

  const processTasks = ( tasks ) => {
    return tasks.map( ( task ) => {
      let usersWithRights = []
      if ( !myProjectsLoading ) {
        let myProject = myProjectsData.myProjects.find( ( myProject ) => myProject.project.id === task.project.id );
        if ( myProject ) {
          usersWithRights = myProject.usersWithRights;
        }
      }
      return {
        ...task,
        usersWithRights,
        checked: markedTasks.includes( task.id )
      }
    } )
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

  const createGanttPreferences = () => {
    let ganttPreference = defaultTasklistGanttColumnPreference;
    if ( ganttPreferencesData && ganttPreferencesData.tasklistGanttColumnPreference ) {
      ganttPreference = {
        ...ganttPreference,
        ...ganttPreferencesData.tasklistGanttColumnPreference
      };
    }
    if ( localProject.project.id === null ) {
      return ganttPreference;
    }
    ganttAttributeLimitingRights.forEach( ( limitingRight ) => {
      if ( !localProject.right[ limitingRight.right ] ) {
        ganttPreference[ limitingRight.preference ] = false;
      }
    } )
    return ganttPreference;
  }

  const canViewCalendar = localProject.id === null || localProject.right.assignedRead;

  if ( !currentUser ) {
    return (
      <Loading />
    )
  }

  return (
    <TasklistSwitch
      history={history}
      match={match}
      loading={dataLoading}
      currentUser={currentUser}
      localFilter = {localFilter}
      setLocalFilter={setFilter}
      filterVariables={filterVariables}
      localProject = {localProject}
      setLocalProject={setProject}
      localMilestone = {localMilestone}
      setLocalMilestone={setMilestone}
      canViewCalendar={canViewCalendar}
      tasks={dataLoading ? [] : processTasks(tasks) }
      count={ tasksLoading ? null : tasksData.tasks.count }
      page={page}
      limit={limit}
      checkTask={checkTask}
      preference = { preferencesLoading ? defaultTasklistColumnPreference : createPreferences()}
      ganttPreference = { ganttPreferencesLoading ? defaultTasklistGanttColumnPreference : createGanttPreferences()}
      setPreference={setPreference}
      setGanttPreference={setGanttPreference}
      orderBy={ fetchingGantt ? ganttSort.key : tasksSort.key }
      setOrderBy={(value) => {
        if(fetchingGantt){
          setGanttSort({ ...ganttSort, key: value })
        }else{
          setTasksSort({ ...tasksSort, key: value })
        }
      }}
      ascending={ fetchingGantt ? ganttSort.asc : tasksSort.asc }
      setAscending={(ascending) => {
        if(fetchingGantt){
          setGanttSort({ ...ganttSort, asc: ascending })
        }else{
          setTasksSort({ ...tasksSort, asc: ascending })
        }
      }}
      selectedStatuses={currentUser.statuses.map((status) => status.id )}
      setSelectedStatuses={setUserStatusesFunc}
      deleteTask={deleteTaskFunc}
      tasksRefetch={tasksRefetch}
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