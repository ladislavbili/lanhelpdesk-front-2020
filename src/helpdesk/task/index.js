import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
  gql
} from "@apollo/client";

import Loading from 'components/loading';
import moment from 'moment';

import ShowData from 'components/showData';

import {
  timestampToString,
  orderArr,
  splitArrayByFilter,
  localFilterToValues
} from 'helperFunctions';

import {
  getEmptyFilter,
  getEmptyGeneralFilter
} from 'configs/constants/filter';

import {
  allMilestones
} from 'configs/constants/sidebar';

import RowTaskAdd from './add/row';

import {
  SET_USER_STATUSES
} from 'helpdesk/settings/templateStatuses/queries';

import {
  GET_TASKS,
  DELETE_TASK,
  GET_MY_DATA,
  GET_CALENDAR_EVENTS,
} from './queries';

import {
  GET_FILTER,
  GET_PROJECT,
  GET_MILESTONE,
  GET_TASK_SEARCH,
} from 'apollo/localSchema/queries';

import {
  setFilter,
  setProject,
  setMilestone,
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

  const localFilter = filterData.localFilter;
  const localProject = projectData.localProject;
  const localMilestone = milestoneData.localMilestone;

  const {
    data: calendarEventsData,
    loading: calendarEventsLoading,
    refetch: calendarEventsRefetch
  } = useQuery( GET_CALENDAR_EVENTS, {
    variables: {
      filter: localFilterToValues( localFilter ),
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
      filter: localFilterToValues( localFilter ),
      projectId: localProject.id
    },
    notifyOnNetworkStatusChange: true,
  } );

  const [ deleteTask, {
    client
  } ] = useMutation( DELETE_TASK );
  const [ setUserStatuses ] = useMutation( SET_USER_STATUSES );

  const dataLoading = (
    currentUserLoading ||
    filterLoading ||
    projectLoading ||
    milestoneLoading ||
    tasksLoading ||
    calendarEventsLoading
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

  const getBreadcrumsData = () => {
    return [
      {
        type: 'project',
        show: localProject.id === null,
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
        show: localProject.id !== null,
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

  const displayCol = ( task ) => {
    return ( <li>
      <div className="taskCol-title">
        <span className="attribute-label">#{task.id} | </span> {task.title}
        </div>
        <div className="taskCol-body">
          <p className="pull-right m-0">
            <span className="label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
              {task.status?task.status.title:'Neznámy status'}
            </span>
          </p>
          <p>
            <span>
              <span className="attribute-label">Requested by: </span>
              {task.requester?(" " + task.requester.fullName):' Neznámy používateľ '}
            </span>
          </p>
          <p className="pull-right">
            <span>
              <span className="attribute-label">	<i className="fa fa-star-of-life" /> </span>
              {task.createdAt?timestampToString(task.createdAt):'None'}
            </span>
          </p>
          <p>
            <span>
              <span className="attribute-label">From </span>
              {task.company ? task.company.title : " Unknown"}
            </span>
          </p>

          <p className="pull-right">
            <span>
              <i
                className="fas fa-exclamation-triangle attribute-label m-r-3"
                />
              {task.deadline?timestampToString(task.deadline):'No deadline'}
            </span>
          </p>
          <p >
            <span style={{textOverflow: 'ellipsis'}}>
              <span className="attribute-label">Assigned: </span>
              {task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.fullName+', ','').slice(0,-2):'Neznámy používateľ'}</span>
          </p>
        </div>

        { task.tags.length > 0 &&
          <div className="taskCol-tags">
            {task.tags.map((tag)=>
              <span key={tag.id} className="label-info m-r-5" style={{backgroundColor: tag.color, color: "white"}}>{tag.title}</span>
            )}
          </div>
        }
      </li> )
  }

  const displayCal = ( task, showEvent ) => {
    return ( <div style={ showEvent ? { backgroundColor:'#eaf6ff', borderRadius:5 } : {} }>
  					<p className="m-0">
  						{showEvent && <span className="label-event">
  						Event
  					</span>}
  						<span className="label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
  							{task.status?task.status.title:'Neznámy status'}
  						</span>
  						<span className="attribute-label m-l-3">#{task.id} | {task.title}</span>
  					</p>
  			</div> )
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
          {value:'checked', label: '', type:'checkbox'},
          {value:'important',label:'',type:'important'},
          {value:'invoiced',label:'',type:'invoiced'},
          {value:'id',label:'ID',type:'int'},
          {value:'status',label:'Status',type:'object'},
          {value:'title',label:'Title',type:'text'},
          {value:'requester',label:'Requester',type:'user'},
          {value:'company',label:'Company',type:'object'},
          {value:'assignedTo',label:'Assigned',type:'list',func:(items)=>
            (<div>
              {
                items.map((item)=><div key={item.id}>{item.fullName}</div>)
              }
            </div>)
          },
          {value:'createdAt',label:'Created at',type:'date'},
          {value:'deadline',label:'Deadline',type:'date'}
        ]}
        orderByValues={[
          {value:'id',label:'ID',type:'int'},
          {value:'status',label:'Status',type:'object'},
          {value:'title',label:'Title',type:'text'},
          {value:'requester',label:'Requester',type:'user'},
          {value:'assignedTo',label:'Assigned',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
          {value:'createdAt',label:'Created at',type:'date'},
          {value:'deadline',label:'Deadline',type:'date'}
        ]}
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
        underSearch={RowTaskAdd}
        underSearchLabel={'Task'}
        statuses={currentUser.statuses.map((status) => status.id ).filter((statusID) => statuses.some((status) => status.id === statusID ) )}
        allStatuses={statuses}
        checkTask={checkTask}
        deleteTask={deleteTaskFunc}
        />
    );
  }