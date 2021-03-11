import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";

import Loading from 'components/loading';

// http://intljusticemission.github.io/react-big-calendar/examples/index.html
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Calendar,
  momentLocalizer
} from "react-big-calendar";

import CommandBar from './components/commandBar';
import ListHeader from './components/listHeader';
import TaskEdit from 'helpdesk/task/edit';
import ItemRender from './components/calendarItemRender';
import moment from "moment";
import {
  unimplementedAttributes,
} from 'configs/constants/tasks';
import {
  fromMomentToUnix,
  timestampToDate,
  timestampToHoursAndMinutes,
  updateArrayItem,
  localFilterToValues,
  deleteAttributes,
} from 'helperFunctions';

import {
  ADD_CALENDAR_EVENT,
  UPDATE_CALENDAR_EVENT,
  DELETE_CALENDAR_EVENT
} from '../queries';

import {
  GET_TASK,
  GET_TASKS,
  UPDATE_TASK,
  GET_CALENDAR_EVENTS,
} from 'helpdesk/task/queries';

const localizer = momentLocalizer( moment );
const formats = {

  dayFormat: ( date, culture, localizer ) => localizer.format( date, 'dddd', culture ), //timestampToDate( date ),
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


export default function TaskCalendar( props ) {
  const {
    match,
    history,
    tasks,
    statuses,
    allStatuses,
    link,
    localProject,
    localFilter,
    calendarEvents,
  } = props;

  const [ addCalendarEvent ] = useMutation( ADD_CALENDAR_EVENT );
  const [ deleteCalendarEvent ] = useMutation( DELETE_CALENDAR_EVENT );
  const [ updateCalendarEvent ] = useMutation( UPDATE_CALENDAR_EVENT );
  const [ updateTask ] = useMutation( UPDATE_TASK );

  const [ today, setToday ] = React.useState( moment() );
  const [ calendarLayout, setCalendarLayout ] = React.useState( 'week' );

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
                filterId: localFilter.id,
                filter: deleteAttributes(
                  localFilterToValues( localFilter ),
                  unimplementedAttributes
                ),
                projectId: localProject.id,
                sort: null
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
              filterId: localFilter.id,
              filter: deleteAttributes(
                localFilterToValues( localFilter ),
                unimplementedAttributes
              ),
              projectId: localProject.id,
              sort: null
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
        try {

          const allCalendarEvents = client.readQuery( {
              query: GET_CALENDAR_EVENTS,
              variables: {
                filter: localFilterToValues( localFilter ),
                projectId: localProject.id
              },
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
        } catch ( e ) {
          console.log( e.message );
        } finally {

        }
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const addCalendarEventFunc = ( addData ) => {
    addCalendarEvent( {
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
      } );
  }

  const deleteCalendarEventFunc = ( id ) => {
    deleteCalendarEvent( {
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
            calendarEvents: allCalendarEvents.map( event => event.id !== id )
          }
        } );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const onEventResize = ( item ) => {
    try {
      if ( calendarLayout === 'week' ) {
        if ( !item.event.isTask ) {
          updateCalendarEventFunc( item.event.eventID, {
            startsAt: item.start.getTime()
              .toString(),
            endsAt: item.end.getTime()
              .toString(),
          } )
        } else if ( item.event.status.action === 'PendingDate' ) {
          updateTaskFunc( item.id, {
            pendingDate: item.start.getTime()
              .toString(),
          } );
        }
      }
    } catch ( err ) {

    }
  };

  const getOnlyDaytime = ( date ) => {
    return ( new Date( date.getFullYear(), date.getMonth(), date.getDate() ) )
      .getTime();
  }

  const onEventDrop = ( item ) => {

    try {
      //MOVING TASKS
      if ( ( item.isAllDay || calendarLayout === 'month' ) && item.event.isTask ) {
        if ( [ 'IsNew', 'IsOpen' ].includes( item.event.status.action ) ) {
          if ( getOnlyDaytime( item.start ) > getOnlyDaytime( new Date( moment()
              .valueOf() ) ) ) {
            //SET PENDING
            updateTaskFunc( item.event.id, {
              pendingDate: item.start.getTime()
                .toString(),
              pendingChange: true,
              status: allStatuses.find( ( status ) => status.action === 'PendingDate' )
                .id
            } );
          } else if ( getOnlyDaytime( item.start ) < getOnlyDaytime( new Date( moment()
              .valueOf() ) ) ) {
            //SET CLOSED
            updateTaskFunc( item.event.id, {
              closeDate: item.start.getTime()
                .toString(),
              status: allStatuses.find( ( status ) => status.action === 'CloseDate' || status.action === 'CloseInvalid' )
                .id
            } );
          }
        } else if ( item.event.status.action === 'CloseDate' || item.event.status.action === 'CloseInvalid' ) {
          //UPDATE CLOSE DATE
          updateTaskFunc( item.event.id, {
            closeDate: item.start.getTime()
              .toString(),
          } );
        } else if ( item.event.status.action === 'PendingDate' && getOnlyDaytime( item.start ) >= getOnlyDaytime( new Date( moment()
            .valueOf() ) ) ) {
          // UPDATE PENDING DATE
          updateTaskFunc( item.event.id, {
            pendingDate: item.start.getTime()
              .toString(),
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
            startsAt: item.start.getTime()
              .toString(),
            endsAt: fromMomentToUnix( moment( item.start )
                .add( 1, 'hours' ) )
              .valueOf()
              .toString(),
          }
          if ( [ 'IsNew', 'IsOpen' ].includes( item.event.status.action ) ) {
            //if new it will be open
          } else if ( item.event.status.action === 'IsNew' ) {
            newEvent.end = fromMomentToUnix( moment( newEvent.start )
              .add( 2, 'hours' ) );
          } else if ( item.event.status.action === 'PendingDate' ) {
            newEvent.end = fromMomentToUnix( moment( newEvent.start )
              .add( 30, 'minutes' ) );
          }
          addCalendarEventFunc( newEvent );
        } else {
          //UPDATE EVENT
          updateCalendarEventFunc( item.event.eventID, {
            startsAt: item.start.getTime()
              .toString(),
            endsAt: item.end.getTime()
              .toString(),
          } );
        }
      }
    } catch ( err ) {

    }
  };

  const onEventDropTASKS = ( item ) => {
    try {
      //manage calendar all day
      if ( ( item.isAllDay || calendarLayout === 'month' ) && item.event.isTask ) {
        if ( [ 'IsNew', 'IsOpen' ].includes( item.event.status.action ) ) {
          if ( getOnlyDaytime( item.start ) > getOnlyDaytime( new Date( moment()
              .valueOf() ) ) ) {
            tasks.filter( ( event ) => !event.isTask )
              .forEach( ( event ) => {
                deleteCalendarEventFunc( event.eventID )
              } );
            updateTaskFunc( item.event.id, {
              pendingDate: item.start.getTime()
                .toString(),
              pendingChangeable: true,
              status: allStatuses.find( ( status ) => status.action === 'PendingDate' )
                .id
            } );
          } else if ( getOnlyDaytime( item.start ) < getOnlyDaytime( new Date( moment()
              .valueOf() ) ) ) {
            updateTaskFunc( item.event.id, {
              closeDate: item.start.getTime()
                .toString(),
              status: allStatuses.find( ( status ) => status.action === 'CloseDate' || status.action === 'CloseInvalid' )
                .id
            } );
          }
        } else if ( item.event.status.action === 'CloseDate' || item.event.status.action === 'CloseInvalid' ) {
          updateTaskFunc( item.event.id, {
            closeDate: item.start.getTime()
              .toString()
          } );
        } else if ( item.event.status.action === 'PendingDate' && getOnlyDaytime( item.start ) >= getOnlyDaytime( new Date( moment()
            .valueOf() ) ) ) {
          updateTaskFunc( item.event.id, {
            pendingDate: item.start.getTime()
              .toString(),
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
            start: item.start.getTime()
              .toString(),
            end: item.end.getTime()
              .toString(),
          }
          //if in fucture, set as PENDING
          if ( [ 'IsNew', 'IsOpen' ].includes( item.event.status.action ) && getOnlyDaytime( item.start ) > getOnlyDaytime( new Date( moment()
              .valueOf() ) ) ) {
            tasks.filter( ( event ) => !event.isTask )
              .forEach( ( event ) => {
                deleteCalendarEventFunc( event.eventID )
              } );

            updateTaskFunc( item.event.id, {
              pendingDate: item.start.getTime()
                .toString(),
              pendingChangeable: true,
              status: allStatuses.find( ( status ) => status.action === 'PendingDate' )
                .id
            } );
            //if new it will be open
          } else if ( item.event.status.action === 'new' ) {
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
              pendingDate: item.start.getTime()
                .toString(),
            } );
          } else {
            addCalendarEventFunc( newEvent );
          }
        } else { //if EVENT
          updateCalendarEventFunc( item.event.eventID, {
            startsAt: item.start.getTime()
              .toString(),
            endsAt: item.end.getTime()
              .toString()
          } );
        }
      }
    } catch ( err ) {

    }
  };

  const getCalendarEventsData = () => {
    return calendarEvents.map( ( event ) => {
      let newEvent = {
        eventID: event.id,
        ...event.task,
        ...event,
        isTask: false,
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

  let data = getCalendarEventsData()
    .concat( getCalendarAllDayData( tasks ) );

  let events = data.map( ( event ) => ( {
    ...event,
    title: <ItemRender task={event} showEvent={!event.isTask && calendarLayout === 'month'} />
  } ) );

  if ( match.params.taskID ) {
    return ( <TaskEdit match={match} columns={false} history={history} /> );
  }

  return (
    <div>
      <CommandBar {...props} />
      <div className="full-width scroll-visible fit-with-header-and-commandbar task-container">
        <ListHeader {...props} />
        <DnDCalendar
          events = { events }
          defaultDate = { new Date( moment().valueOf() ) }
          defaultView = { calendarLayout }
          style = {{ height: "100vh", padding: "20px" }}
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