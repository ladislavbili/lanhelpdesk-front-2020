import React from 'react';
import {
  gql,
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import {
  Calendar,
  momentLocalizer
} from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import CommandBar from '../../components/showData/commandBar';
import ListHeader from '../../components/showData/listHeader';
import {
  fromMomentToUnix,
  timestampToString,
  timestampToDate,
  timestampToHoursAndMinutes,
  updateArrayItem
} from 'helperFunctions';

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Loading from 'components/loading';

import {
  GET_MY_DATA,
  ADD_CALENDAR_EVENT,
  UPDATE_CALENDAR_EVENT,
  DELETE_CALENDAR_EVENT
} from './querries';

import {
  GET_TASK,
  GET_TASKS,
  UPDATE_TASK,
  GET_CALENDAR_EVENTS,
} from 'helpdesk/task/querries';

const localizer = momentLocalizer( moment );
const formats = {

  dayFormat: ( date, culture, localizer ) => timestampToDate( date ),
  timeGutterFormat: ( date, culture, localizer ) => {
    return timestampToHoursAndMinutes( date );
  },
  dayRangeHeaderFormat: ( {
    start,
    end
  }, culture, localizer ) => {
    return timestampToDate( start ) + ' - ' + timestampToDate( end );
  },
  agendaHeaderFormat: ( {
    start,
    end
  }, culture, localizer ) => {
    return timestampToDate( start ) + ' - ' + timestampToDate( end );
  },
  selectRangeFormat: ( {
    start,
    end
  }, culture, localizer ) => {
    return timestampToHoursAndMinutes( start ) + ' - ' + timestampToHoursAndMinutes( end );
  },
  eventTimeRangeFormat: ( {
    start,
    end
  }, culture, localizer ) => {
    return timestampToHoursAndMinutes( start ) + ' - ' + timestampToHoursAndMinutes( end );
  },
}
const DnDCalendar = withDragAndDrop( Calendar );

// http://intljusticemission.github.io/react-big-calendar/examples/index.html

export default function TaskCalendar( props ) {
  const {
    match,
    history,
    statuses,
    allStatuses,
    statusesLoaded,
    setUserFilterStatuses,
    data,
    commandBar,
    listName,
    link,
    Edit,
    filterId,
    filterValues,
    originalProjectId,
  } = props;

  console.log( allStatuses );

  const {
    data: currentUserData,
    loading: currentUserLoading
  } = useQuery( GET_MY_DATA );

  const [ today, setToday ] = React.useState( moment() );
  const [ calendarLayout, setCalendarLayout ] = React.useState( 'month' );

  //const [ addCalendarEvent ] = useMutation( ADD_CALENDAR_EVENT );
  //const [ deleteCalendarEvent ] = useMutation( DELETE_CALENDAR_EVENT );
  //  const [ updateCalendarEvent ] = useMutation( UPDATE_CALENDAR_EVENT );
  //const [ updateTask ] = useMutation( UPDATE_TASK );

  const client = useApolloClient();

  const updateTaskFunc = ( id, updateData ) => {
    updateTask( {
        variables: {
          ...updateData,
          id,
        }
      } )
      .then( ( response ) => {
        const updatedTask = response.data.updateTask;
        delete updateTask.__typename;
        try {
          const originalTask = client.readQuery( {
              query: GET_TASK,
              variables: {
                id
              },
            } )
            .task;

          const newTask = {
            ...originalTask,
            ...updatedTask
          };

          client.writeQuery( {
            query: GET_TASK,
            variables: {
              id
            },
            data: {
              task: newTask
            }
          } );
        } catch ( e ) {
          console.log( e.message );
        }

        try {
          let execTasks = client.readQuery( {
              query: GET_TASKS,
              variables: {
                filterId,
                filter: filterValues,
                projectId: originalProjectId
              }
            } )
            .tasks;

          const newTask = {
            ...execTasks.tasks.find( task => task.id === id ),
            ...updateData
          };

          client.writeQuery( {
            query: GET_TASKS,
            variables: {
              filterId,
              filter: filterValues,
              projectId: originalProjectId
            },
            data: {
              tasks: {
                ...execTasks,
                tasks: updateArrayItem( execTasks.tasks, newTask )
              }
            }
          } );
        } catch ( e ) {
          console.log( e.message );
        } finally {

        }
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const updateCalendarEventFunc = ( id, updateData ) => {
    updateCalendarEvent( {
        variables: {
          ...updateData,
          id,
        }
      } )
      .then( ( response ) => {
        const allCalendarEvents = client.readQuery( {
            query: GET_CALENDAR_EVENTS
          } )
          .calendarEvents;
        client.writeQuery( {
          query: GET_CALENDAR_EVENTS,
          data: {
            calendarEvents: allCalendarEvents.map( event =>
              ( event.id !== id ? event : {
                ...event,
                ...updateData
              } )
            )
          }
        } );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const addCalendarEventFunc = ( addData ) => {
    /*     addCalendarEvent( {
              variables: {
                ...addData,
              }
            } )
            .then( ( response ) => {
              const allCalendarEvents = client.readQuery( {
                  query: GET_CALENDAR_EVENTS
                } )
                .calendarEvents;
              client.writeQuery( {
                query: GET_CALENDAR_EVENTS,
                data: {
                  calendarEvents: [ ...allCalendarEvents, {
                    ...response.data.addCalendarEvent,
                    __typename: 'CalendarEvent'
                  } ]
                }
              } );
            } )
            .catch( ( err ) => {
              console.log( err.message );
            } );*/
  }

  const deleteCalendarEventFunc = ( id ) => {
    /*    deleteCalendarEvent( {
            variables: {
              id
            }
          } )
          .then( ( response ) => {
            const allCalendarEvents = client.readQuery( {
                query: GET_CALENDAR_EVENTS
              } )
              .calendarEvents;
            client.writeQuery( {
              query: GET_CALENDAR_EVENTS,
              data: {
                calendarEvents: allCalendarEvents.map(event => event.id !== id)
              }
            } );
          } )
          .catch( ( err ) => {
            console.log( err.message );
          } );*/
  }

  const onEventResize = ( item ) => {
    const canEdit = item.event.project.projectRights.find( right => right.write && right.user.id === currentUserData.getMyData.id ) ? true : false;

    if ( !canEdit ) {
      return;
    }

    if ( calendarLayout === 'week' ) {
      if ( !item.event.isTask ) {
        updateCalendarEventFunc( item.id, {
          startsAt: item.start.getTime(),
          endsAt: item.end.getTime(),
        } )
      } else if ( item.event.status.action === 'PendingDate' ) {
        updateTaskFunc( item.id, {
          pendingDate: item.start.getTime(),
        } );
      }
    }
  };

  const getOnlyDaytime = ( date ) => {
    return ( new Date( date.getFullYear(), date.getMonth(), date.getDate() ) )
      .getTime();
  }

  const onEventDrop = ( item ) => {
    const canEdit = item.event.project.projectRights.find( right => right.write && right.user.id === currentUserData.getMyData.id ) ? true : false;

    if ( !canEdit ) {
      return;
    }
    //MOVING TASKS
    if ( ( item.isAllDay || calendarLayout === 'month' ) && item.event.isTask ) {
      if ( [ 'IsNew', 'IsOpen' ].includes( item.event.status.action ) ) {
        if ( getOnlyDaytime( item.start ) > getOnlyDaytime( new Date( moment()
            .valueOf() ) ) ) {
          //SET PENDING
          updateTaskFunc( item.id, {
            pendingDate: item.start.getTime(),
            pendingChange: true,
            status: allStatuses.find( ( status ) => status.action === 'PendingDate' )
              .id
          } );
        } else if ( getOnlyDaytime( item.start ) < getOnlyDaytime( new Date( moment()
            .valueOf() ) ) && statusesLoaded ) {
          //SET CLOSED
          updateTaskFunc( item.id, {
            closeDate: item.start.getTime(),
            status: allStatuses.find( ( status ) => status.action === 'CloseDate' || status.action === 'CloseInvalid' )
              .id
          } );
        }
      } else if ( item.event.status.action === 'close' ) {
        //UPDATE CLOSE DATE
        updateTaskFunc( item.id, {
          closeDate: item.start.getTime(),
        } );
      } else if ( item.event.status.action === 'PendingDate' && getOnlyDaytime( item.start ) >= getOnlyDaytime( new Date( moment()
          .valueOf() ) ) ) {
        // UPDATE PENDING DATE
        updateTaskFunc( item.id, {
          pendingDate: item.start.getTime(),
        } );
      }
      return;
    }
    //MOVING EVENTS (IN WEEK)
    if ( calendarLayout === 'week' && !item.isAllDay ) {
      //if TASK
      if ( item.event.isTask ) {
        let newEvent = {
          task: item.event.id,
          startsAt: item.start.getTime(),
          endsAt: fromMomentToUnix( moment( item.start )
              .add( 1, 'hours' ) )
            .valueOf(),
        }
        if ( [ 'IsNew', 'IsOpen' ].includes( item.event.status.action ) ) {
          //if new it will be open
        } else if ( item.event.status.action === 'IsNew' && statusesLoaded ) {
          newEvent.end = fromMomentToUnix( moment( newEvent.start )
            .add( 2, 'hours' ) );
        } else if ( item.event.status.action === 'PendingDate' ) {
          newEvent.end = fromMomentToUnix( moment( newEvent.start )
            .add( 30, 'minutes' ) );
        }
        addCalendarEventFunc( newEvent );
      } else {
        //UPDATE EVENT
        updateCalendarEventFunc( item.id, {
          startsAt: item.start.getTime(),
          endsAt: item.end.getTime(),
        } );
      }
    }
  };


  const onEventDropTASKS = ( item ) => {
    const canEdit = item.event.project.projectRights.find( right => right.write && right.user.id === currentUserData.getMyData.id ) ? true : false;

    if ( !canEdit ) {
      return;
    }

    //manage calendar all day
    if ( ( item.isAllDay || calendarLayout === 'month' ) && item.event.isTask ) {
      if ( [ 'IsNew', 'IsOpen' ].includes( item.event.status.action ) ) {
        if ( getOnlyDaytime( item.start ) > getOnlyDaytime( new Date( moment()
            .valueOf() ) ) ) {
          data.filter( ( event ) => !event.isTask )
            .forEach( ( event ) => {
              deleteCalendarEventFunc( event.eventID )
            } );
          updateTaskFunc( item.event.id, {
            pendingDate: item.start.getTime(),
            pendingChangeable: true,
            status: allStatuses.find( ( status ) => status.action === 'PendingDate' )
              .id
          } );
        } else if ( getOnlyDaytime( item.start ) < getOnlyDaytime( new Date( moment()
            .valueOf() ) ) && statusesLoaded ) {
          updateTaskFunc( item.event.id, {
            closeDate: item.start.getTime(),
            status: allStatuses.find( ( status ) => status.action === 'CloseDate' || status.action === 'CloseInvalid' )
              .id
          } );
        }
      } else if ( item.event.status.action === 'CloseDate' || item.event.status.action === 'CloseInvalid' ) {
        updateTaskFunc( item.event.id, {
          closeDate: item.start.getTime()
        } );
      } else if ( item.event.status.action === 'PendingDate' && getOnlyDaytime( item.start ) >= getOnlyDaytime( new Date( moment()
          .valueOf() ) ) ) {
        updateTaskFunc( item.event.id, {
          pendingDate: item.start.getTime(),
        } );
      }
      return false;
    }
    //manage calendar with time
    if ( calendarLayout === 'week' ) {
      if ( item.isAllDay ) {
        return false;
      }
      //if TASK
      if ( item.event.isTask ) {
        let newEvent = {
          task: item.event.id,
          start: item.start.getTime(),
          end: item.end.getTime(),
        }
        //if in fucture, set as PENDING
        if ( [ 'IsNew', 'IsOpen' ].includes( item.event.status.action ) && getOnlyDaytime( item.start ) > getOnlyDaytime( new Date( moment()
            .valueOf() ) ) ) {
          data.filter( ( event ) => !event.isTask )
            .forEach( ( event ) => {
              deleteCalendarEventFunc( event.eventID )
            } );

          updateTaskFunc( item.event.id, {
            pendingDate: item.start.getTime(),
            pendingChangeable: true,
            status: allStatuses.find( ( status ) => status.action === 'PendingDate' )
              .id
          } );
          //if new it will be open
        } else if ( item.event.status.action === 'new' && statusesLoaded ) {
          //new task is open
          newEvent.end = fromMomentToUnix( moment( newEvent.start )
            .add( 2, 'hours' ) );
          addCalendarEventFunc( newEvent );
          updateTaskFunc( item.event.id, {
            status: allStatuses.find( ( status ) => status.action === 'open' )
              .id
          } );
        } else if ( item.event.status.action === 'PendingDate' ) {
          updateTaskFunc( item.event.id, {
            pendingDate: item.start.getTime(),
          } );
        } else {
          addCalendarEventFunc( newEvent );
        }
      } else { //if EVENT
        updateCalendarEventFunc( item.event.eventID, {
          startsAt: item.start.getTime(),
          endsAt: item.end.getTime()
        } );
      }
    }
  };

  if ( currentUserLoading ) {
    return ( <Loading /> );
  }

  let events = data.map( ( event ) => ( {
    ...event,
    title: event.titleFunction( event, !event.isTask && calendarLayout === 'month' )
  } ) )

  if ( match.params.taskID ) {
    return ( <Edit match={match} columns={true} history={history} /> );
  }

  return (
    <div>
  			<CommandBar { ...commandBar } />
  			<div className="full-width scroll-visible fit-with-header-and-commandbar task-container p-20">
  				<ListHeader
            { ...commandBar }
            listName={ listName }
            statuses={currentUserData.getMyData.statuses}
            setStatuses={setUserFilterStatuses}
            allStatuses={allStatuses}
            />
  				<DnDCalendar
  					events = { events }
            defaultDate = { new Date( moment().valueOf() ) }
            defaultView = { calendarLayout }
  					style = {{ height: "100vh" }}
  					views={['month', 'week']}
  					drilldownView="day"
            localizer = { localizer }
            resizable
  					popup={true}
  					formats={formats}

            min={
              new Date(
                today.get('year'),
                today.get('month'),
                today.get('date'),
                8
              )
            }

  					onEventDrop = { onEventDrop }
  					onEventResize = { onEventResize }

  					onDoubleClickEvent={(event)=>{
  						history.push(link+'/'+event.id);
  					}}
  					onView={(viewType)=>{
  						setCalendarLayout(viewType);
  					}}
            />
  			</div>
      </div>
  );
}