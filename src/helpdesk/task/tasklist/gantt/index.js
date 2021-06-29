import React from 'react';
import GanttList from './ganttList';

import {
  useQuery,
  useMutation,
} from "@apollo/client";

import {
  createGanttDisplayValues,
  defaultTasklistGanttColumnPreference,
  ganttAttributeLimitingRights,
} from 'configs/constants/tasks';

import {
  addLocalError,
  setLocalTaskStringFilter,
  setSingleLocalTaskStringFilter,
  setGlobalTaskStringFilter,
} from 'apollo/localSchema/actions';

import {
  GET_LOCAL_TASK_STRING_FILTER,
  GET_GLOBAL_TASK_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  GET_TASKS,
  GET_TASKLIST_GANTT_COLUMNS_PREFERENCES,
  ADD_OR_UPDATE_TASKLIST_GANTT_COLUMNS_PREFERENCES,
} from 'helpdesk/task/queries';


export default function GanttListLoader( props ) {
  const {
    localProject,
    localMilestone,
    localFilter,
    orderBy,
    ascending,
    page,
    limit,
    processTasks,
    currentUser,
    filterVariables,
  } = props;

  //local queries
  const {
    data: localStringFilter,
  } = useQuery( GET_LOCAL_TASK_STRING_FILTER );

  const {
    data: globalStringFilter,
  } = useQuery( GET_GLOBAL_TASK_STRING_FILTER );

  //apollo queries
  const taskVariables = {
    projectId: localProject.id,
    milestoneId: localMilestone.id,
    filter: filterVariables,
    sort: {
      asc: ascending,
      key: orderBy
    },
    milestoneSort: true,
    stringFilter: globalStringFilter.globalTaskStringFilter,
    page,
    limit,
  }

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

  //state
  const [ forcedRefetch, setForcedRefetch ] = React.useState( false );

  //mutations
  const [ addOrUpdatePreferences ] = useMutation( ADD_OR_UPDATE_TASKLIST_GANTT_COLUMNS_PREFERENCES );

  //sync
  const tasksRefetch = () => {
    tasksRefetchFunc( {
      variables: taskVariables,
    } );
  }

  //refetch tasks
  React.useEffect( () => {
    tasksRefetch();
  }, [ localFilter, localProject.id, localMilestone.id, currentUser, globalStringFilter, forcedRefetch ] );

  const dataLoading = (
    ganttPreferencesLoading ||
    tasksLoading
  );

  const tasks = dataLoading ? [] : tasksData.tasks.tasks;

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

  const setPreference = ( visibility ) => {
    addOrUpdatePreferences( {
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


  const ganttProps = {
    ...props,
    displayValues: createGanttDisplayValues( createGanttPreferences() ),
    preference: createGanttPreferences(),
    setPreference,
    tasks: processTasks( tasks ),
    count: tasksLoading ? null : tasksData.tasks.count,
    loading: dataLoading,

    forceRefetch: () => setForcedRefetch( !forcedRefetch ),
    localStringFilter: localStringFilter.localTaskStringFilter,
    setLocalTaskStringFilter,
    globalStringFilter: globalStringFilter.globalTaskStringFilter,
    setGlobalTaskStringFilter,
    setSingleLocalTaskStringFilter,
  }

  return (
    <GanttList {...ganttProps}  />
  );
}