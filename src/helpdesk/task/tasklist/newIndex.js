import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
  gql
} from "@apollo/client";

import Loading from 'components/loading';
import moment from 'moment';
import {
  displayCol,
  displayCal,
} from './showDataRenders';

import ShowData from 'components/showData';

import {
  timestampToString,
  orderArr,
  splitArrayByFilter,
  localFilterToValues,
  deleteAttributes
} from 'helperFunctions';

import {
  getEmptyFilter,
  getEmptyGeneralFilter
} from 'configs/constants/filter';

import {
  allMilestones
} from 'configs/constants/sidebar';

import {
  defaultTasklistColumnPreference
} from 'configs/constants/tasks';

import RowTaskAdd from './add/row';

import {
  SET_USER_STATUSES
} from 'helpdesk/settings/templateStatuses/queries';

import {
  SET_TASKLIST_LAYOUT,
} from 'helpdesk/settings/users/queries';

import {
  GET_TASKS,
  DELETE_TASK,
  GET_MY_DATA,
  GET_CALENDAR_EVENTS,
  GET_TASKLIST_COLUMNS_PREFERENCES,
  ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES
} from './queries';

import {
  GET_FILTER,
  GET_PROJECT,
  GET_MILESTONE,
  GET_TASK_SEARCH,
  GET_TASKS_SORT,
} from 'apollo/localSchema/queries';

import {
  setFilter,
  setProject,
  setMilestone,
  setTasksSort,
} from 'apollo/localSchema/actions';

import TaskEdit from './edit';
import TaskEmpty from './taskEmpty';
import TaskCalendar from '../calendar';

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

  const {
    data: filterData,
    loading: filterLoading
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
    loading: projectLoading
  } = useQuery( GET_PROJECT );

  const {
    data: milestoneData,
    loading: milestoneLoading
  } = useQuery( GET_MILESTONE );

  const {
    data: taskSearchData,
    loading: taskSearchLoading
  } = useQuery( GET_TASK_SEARCH );

  const {
    data: tasksSortData,
    loading: tasksSortLoading
  } = useQuery( GET_TASKS_SORT );

  const localFilter = filterData.localFilter;
  const localProject = projectData.localProject;
  const localMilestone = milestoneData.localMilestone;

  const {
    data: calendarEventsData,
    loading: calendarEventsLoading,
    refetch: calendarEventsRefetch
  } = useQuery( GET_CALENDAR_EVENTS, {
    variables: {
      filter: deleteAttributes(
        localFilterToValues( localFilter ),
        [
          'scheduledFrom', 'scheduledFromNow', 'scheduledTo', 'scheduledToNow',
          'createdAtFrom', 'createdAtFromNow', 'createdAtTo', 'createdAtToNow',
          'important',
          'invoiced',
          'pausal',
          'overtime'
        ]
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
        [
          'scheduledFrom', 'scheduledFromNow', 'scheduledTo', 'scheduledToNow',
          'createdAtFrom', 'createdAtFromNow', 'createdAtTo', 'createdAtToNow',
          'important',
          'invoiced',
          'pausal',
          'overtime'
        ]
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

  const dataLoading = (
    currentUserLoading ||
    filterLoading ||
    projectLoading ||
    milestoneLoading ||
    tasksLoading ||
    tasksSortLoading ||
    calendarEventsLoading ||
    preferencesLoading
  );

  //sync
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

  if ( dataLoading ) {
    return ( <Loading /> );
  }

  //constants
  let link = '';
  if ( match.params.hasOwnProperty( 'listID' ) ) {
    link = '/helpdesk/taskList/i/' + match.params.listID;
  } else {
    link = '/helpdesk/taskList'
  }

  const tasks = tasksData.tasks.tasks;
  const statuses = localProject.project.statuses ? localProject.project.statuses : [];
  const currentUser = currentUserData.getMyData;
  const tasksSort = tasksSortData.tasksSort;

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

  const getBreadcrumsData = () => {
    return [
      {
        type: 'project',
        show: true,
        data: localProject,
        label: localProject.title,
        onClick: () => {
          setMilestone( allMilestones );
          setFilter( getEmptyGeneralFilter() );
          history.push( '/helpdesk/taskList/i/all' );
        }
      },
      {
        type: 'milestone',
        show: localProject.id !== null && localMilestone.id !== null,
        data: localMilestone,
        label: localMilestone.title,
        onClick: () => {
          setFilter( getEmptyGeneralFilter() );
          history.push( '/helpdesk/taskList/i/all' );
        }
      },
      {
        type: 'filter',
        show: true,
        data: localFilter,
        label: localFilter.title,
        onClick: () => {}
      }
    ]
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
    setUserStatuses( {
        variables: {
          ids: [
          ...currentUser.statuses.map( ( status ) => status.id )
          .filter( ( statusID ) => !statuses.some( ( status ) => status.id === statusID ) ),
          ...ids
        ]
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const getCalendarEventsData = () => {
    return calendarEventsData.calendarEvents.map( ( event ) => {
      let newEvent = {
        eventID: event.id,
        ...event.task,
        ...event,
        isTask: false,
        titleFunction: displayCal,
        start: new Date( moment( parseInt( event.startsAt ) )
          .valueOf() ),
        end: new Date( moment( parseInt( event.endsAt ) )
          .valueOf() ),
      };
      delete newEvent.task;
      return newEvent;
    } )
  }

  const getCalendarAllDayData = ( tasks ) => {
    return tasks.map( ( task ) => {
        let newTask = {
          ...task,
          isTask: true,
          titleFunction: displayCal,
          allDay: true,
        }
        if ( !task.status ) {
          return {
            ...newTask,
            status: statuses.find( ( status ) => status.action === 'IsNew' ),
            start: new Date( moment()
              .valueOf() ),
          }
        }
        switch ( task.status.action ) {
          case 'Invoiced': {
            return {
              ...newTask,
              start: new Date( moment( parseInt( task.invoicedDate ) )
                .valueOf() ),
            }
          }
          case 'CloseDate': {
            return {
              ...newTask,
              start: new Date( moment( parseInt( task.closeDate ) )
                .valueOf() ),
            }
          }
          case 'CloseInvalid': {
            return {
              ...newTask,
              start: new Date( moment( parseInt( task.closeDate ) )
                .valueOf() ),
            }
          }
          case 'PendingDate': {
            return {
              ...newTask,
              start: new Date( moment( parseInt( task.pendingDate ) )
                .valueOf() ),
            }
          }
          default: {
            return {
              ...newTask,
              start: new Date( moment()
                .valueOf() ),
            }
          }
        }
      } )
      .map( ( task ) => ( {
        ...task,
        end: task.start
      } ) )
  }

  const filterTasks = ( tasks ) => {
    let currentStatuses = currentUser.statuses.filter( ( status1 ) => statuses.some( ( status2 ) => status1.id === status2.id ) )
    return tasks.filter( ( task ) => (
      ( currentStatuses.length === 0 || currentStatuses.some( ( status ) => status.id === task.status.id ) )
    ) )
  }

  const processTasks = ( tasks ) => {
    return tasks.map( ( task ) => ( {
      ...task,
      checked: markedTasks.includes( task.id )
    } ) )
  }

  const preference = ( preferencesData && preferencesData.tasklistColumnPreference ) ? preferencesData.tasklistColumnPreference : defaultTasklistColumnPreference;


  return (
      <ShowData
      data={processTasks(filterTasks(tasks))}
      filterBy={[
        {value:'assignedTo',type:'list',func:((total,user)=>total+=user.email+' '+user.fullName+' ')},
        {value:'statusChange',type:'date'},
        {value:'createdAt',type:'date'},
        {value:'requester',type:'user'},
        {value:'deadline',type:'date'},
        {value:'status',type:'object'},
        {value:'title',type:'text'},
        {value:'id',type:'int'},
        {value:'company',type:'object'},
      ]}
      displayCol={displayCol}
      filterName="help-tasks"
      displayValues={[
        {value:'checked', label: '', type:'checkbox', show: true },
        {value:'id',label:'ID',type:'int', show: preference['taskId'], visKey: 'taskId' },
        {value:'status',label:'Status',type:'object', show: preference['status'] },
        {value:'important',label:'Important',type:'important', show: preference['important'] },
        {value:'invoiced',label:'Invoiced',type:'invoiced', show: preference['invoiced'] },
        {value:'title',label:'Title',type:'text', show: preference['title'] },
        {value:'project',label:'Project',type:'object', show: preference['project'] },
        {value:'milestone',label:'Milestone',type:'object', show: preference['milestone'] },
        {value:'requester',label:'Requester',type:'user', show: preference['requester'] },
        {value:'company',label:'Company',type:'object', show: preference['company'] },
        {
          value:'assignedTo',
          label:'Assigned',
          type:'list',
          func: (items) => (
            <div>
              { items.map((item)=><div key={item.id}>{item.fullName}</div>) }
            </div>
          ),
          show: preference['assignedTo']
        },
        {
          value:'tags',
          label:'Tags',
          type:'list',
          func: (items) => (
            <div>
              { items.map((item)=>(
                <div style={{ background: item.color, color: 'white', borderRadius: 3 }} className="m-r-5 m-t-5 p-l-5 p-r-5">
                  {item.title}
                </div>
              ) ) }
            </div>
          ),
          show: preference['tags']
        },
        {value:'taskType',label:'Task Type',type:'object', show: preference['taskType'] },
        {value:'createdAt',label:'Created at',type:'date', show: preference['createdAtV'], visKey: 'createdAtV' },
        {value:'deadline',label:'Deadline',type:'date', show: preference['deadline'] },
        {value:'pausal',label:'Pausal',type:'boolean', show: preference['pausal'] },
        {value:'overtime',label:'Overtime',type:'boolean', show: preference['overtime'] },
      ]}
      setVisibility={(visibility) => {
        addOrUpdatePreferences({
          variables: {
            ...visibility,
            projectId: localProject.id,
          }
        }).then((response) => {

          const preference = client.readQuery( {
            query: GET_TASKLIST_COLUMNS_PREFERENCES,
            variables: {
              projectId: localProject.id
            },
          } )
          .tasklistColumnPreference;
          let newPreference = preference ? preference : {};
          console.log( preference );
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
        } ).catch((error) => {
          console.log(error);
        })
      }}
      orderByValues={[
        {value:'id',label:'ID',type:'int'},
        {value:'status',label:'Status',type:'object'},
        {value:'title',label:'Title',type:'text'},
        {value:'requester',label:'Requester',type:'user'},
        {value:'assignedTo',label:'Assigned',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
        {value:'createdAt',label:'Created at',type:'date'},
        {value:'deadline',label:'Deadline',type:'date'}
      ]}
      setOrderBy={(value) => {
        setTasksSort({ ...tasksSort, key: value })
      }}
      orderBy={ tasksSort.key }
      setAscending={(ascending) => {
        setTasksSort({ ...tasksSort, asc: ascending })
      }}
      ascending={ tasksSort.asc }
      dndGroupAttribute="status"
      dndGroupData={statuses}
      calendar={TaskCalendar}
      calendarAllDayData={getCalendarAllDayData}
      calendarEventsData={getCalendarEventsData}
      link={link}
      history={history}
      itemID={match.params.taskID ? match.params.taskID : ""}
      listID={match.params.listID}
      match={match}
      isTask={true}
      listName={localFilter.title}
      Edit={TaskEdit}
      Empty={TaskEmpty}
      useBreadcrums={true}
      breadcrumsData={getBreadcrumsData()}
      setStatuses={setUserStatusesFunc}
      underSearch={null}
      underSearchLabel={null}
      statuses={currentUser.statuses.map((status) => status.id ).filter((statusID) => statuses.some((status) => status.id === statusID ) )}
      allStatuses={statuses}
      checkTask={checkTask}
      deleteTask={deleteTaskFunc}

      tasklistLayout={currentUser.tasklistLayout}
      tasklistLayoutData={{
        setLayout: function(value) {
          setTasklistLayoutFunc(value);
        },
        showLayoutSwitch: true,
        dndLayout: localProject.title !== "Any project",
        calendarLayout: true,
      }}
      />
  );
}