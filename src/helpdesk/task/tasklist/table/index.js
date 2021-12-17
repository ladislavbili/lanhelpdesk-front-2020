import React from 'react';
import TableList from './tableList';

import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription,
} from "@apollo/client";

import {
  createDisplayValues,
  defaultTasklistColumnPreference,
  attributeLimitingRights,
} from 'configs/constants/tasks';

import {
  splitArrayByFilter,
  localFilterToValues,
  processStringFilter,
  translateAllSelectItems,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";

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
  DELETE_TASK,
  GET_TASKLIST_COLUMNS_PREFERENCES,
  ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES,
  ADD_TASK_SUBSCRIPTION,
} from 'helpdesk/task/queries';

export default function TableListLoader( props ) {
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

  const {
    t
  } = useTranslation();

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
    stringFilter: processStringFilter( globalStringFilter.globalTaskStringFilter ),
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
    refetch: tasksRefetchFunc,
  } = useQuery( GET_TASKS, {
    variables: taskVariables,
    notifyOnNetworkStatusChange: true,
  } );

  //mutations
  const [ deleteTask ] = useMutation( DELETE_TASK );
  const [ addOrUpdatePreferences ] = useMutation( ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES );
  const client = useApolloClient();
  //state
  const [ markedTasks, setMarkedTasks ] = React.useState( [] );
  const [ forcedRefetch, setForcedRefetch ] = React.useState( false );

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

  useSubscription( ADD_TASK_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tasksRefetch();
    }
  } );


  const dataLoading = (
    preferencesLoading ||
    tasksLoading
  );

  const tasks = dataLoading ? [] : tasksData.tasks.tasks;
  const createPreferences = () => {
    if ( !currentUser || !currentUser.role.accessRights.tasklistPreferences ) {
      return defaultTasklistColumnPreference;
    }
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
    preference.project = false;
    attributeLimitingRights.forEach( ( limitingRight ) => {
      if ( !limitingRight.right( localProject ) ) {
        preference[ limitingRight.preference ] = false;
      }
    } )
    return preference;
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
    if ( window.confirm( t( 'deleteSelectedTasksConfirmation' ) ) ) {
      let tasksForDelete = tasks.filter( ( task ) => markedTasks.includes( task.id ) );
      const [ canDeleteTasks, cantDeleteTasks ] = splitArrayByFilter( tasksForDelete, ( task ) => task.rights.deleteTask );
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
        window.alert( `${canDeleteTasks.length} ${t('notAllTasksDeletedMessage')}: \n` + cantDeleteTasks.reduce( ( acc, task ) => acc + `${task.id} ${task.title} \n`, '' ) )
      }
    }
  }

  const tableProps = {
    ...props,
    displayValues: translateAllSelectItems( createDisplayValues( createPreferences(), localProject.project.id !== null ), t ),
    preference: createPreferences(),
    loading: dataLoading,
    setPreference,
    tasks: processTasks( tasks )
      .map( ( task ) => ( {
        ...task,
        checked: markedTasks.includes( task.id )
      } ) ),
    checkTask,
    markedTasks,
    deleteTask: deleteTaskFunc,
    count: tasksLoading ? null : tasksData.tasks.count,
    forceRefetch: () => setForcedRefetch( !forcedRefetch ),
    localStringFilter: localStringFilter.localTaskStringFilter,
    setLocalTaskStringFilter,
    globalStringFilter: globalStringFilter.globalTaskStringFilter,
    setGlobalTaskStringFilter,
    setSingleLocalTaskStringFilter,
  }

  return (
    <TableList {...tableProps} />
  );
}