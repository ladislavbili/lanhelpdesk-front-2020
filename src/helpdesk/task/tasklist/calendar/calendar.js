import React from 'react';
import Loading from 'components/loading';

// http://intljusticemission.github.io/react-big-calendar/examples/index.html
//https://github.com/jquense/react-big-calendar/blob/master/examples/demos/dndOutsideSource.js
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Calendar
} from "react-big-calendar";
import {
  DndProvider
} from 'react-dnd';
import {
  HTML5Backend
} from 'react-dnd-html5-backend';

import CommandBar from '../components/commandBar';
import Search from '../components/search';
import ActiveSearch from '../components/activeSearch';
import Pagination from '../components/pagination';
import TaskEdit from 'helpdesk/task/edit';
import Repeat from 'helpdesk/components/repeat/repeatFormModal';
import DragRepeatContextMenu from './dragRepeatContextMenu';
import DragRepeatTimeContextMenu from './dragRepeatTimeContextMenu';
import RepeatContextMenu from './repeatContextMenu';
import RepeatTimeContextMenu from './repeatTimeContextMenu';
import StackItem from './renderStackItem';
import classnames from 'classnames';
import moment from "moment";
import {
  taskCalendarDefaults,
} from 'configs/components/bigCalendar';
import {
  lightenDarkenColor,
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  GET_CALENDAR_REPEATS,
  GET_REPEAT_TIMES,
} from './querries';
import {
  GET_SCHEDULED_TASKS,
} from '../../queries';

let fakeID = -1;

const DnDCalendar = withDragAndDrop( Calendar );

export default function TaskCalendar( props ) {
  const {
    match,
    history,
    tasks,
    tasksRefetch,
    statuses,
    allStatuses,
    scheduled,
    link,
    localProject,
    localFilter,
    scheduledUserId,
    addScheduled,
    updateScheduled,
    refetchScheduled,
    setCalendarTimeRange,
    repeats,
    triggerRepeat,
    repeatTimes,
    repeatsRefetch,
    repeatTimesRefetch,
    addRepeatTime,
    updateRepeatTime,
    cFrom,
    cTo,
    canSeeStack,
    repeatEvents,
    scheduledEvents,
    repeatTimeEvents,
    client,
    createEventFromRepeatTime,
    createEventFromScheduled,
    scheduledTasksVariables,
    fakeEvents,
    setFakeEvents,
    repeatTimesVariables,
    globalStringFilter,
    globalTaskSearch,
  } = props;

  //TODO: AK repeat nacita svoje repeatTimes, existuje dovod preco nacitavat zvlast repeattimes? nezabudnut na podmienku ak je v range zacaitok alebo novy zaciatok
  let path = `/helpdesk/taskList/i/${match.params.listID}`;
  if ( match.params.page ) {
    path = `${path}/p/${match.params.page}`
  }

  const [ calendarLayout, setCalendarLayout ] = React.useState( 'week' );
  const [ draggedTask, setDraggedTask ] = React.useState( null );
  const [ focusedRepeatEvent, setFocusedRepeatEvent ] = React.useState( null );

  const [ draggedRepeatEvent, setDraggedRepeatEvent ] = React.useState( null );
  const [ draggedRepeatTimeEvent, setDraggedRepeatTimeEvent ] = React.useState( null );
  const [ openedRepeat, setOpenedRepeat ] = React.useState( null );
  const [ focusedRepeatTimeEvent, setFocusedRepeatTimeEvent ] = React.useState( null );

  React.useEffect( () => {
    setFakeEvents( [] );
  }, [ cFrom, cTo ] );


  const onDropFromOutside = ( eventData ) => {
    const {
      start,
      end
    } = eventData;
    const newFakeID = fakeID--;
    setFakeEvents( [ ...fakeEvents, expandScheduledEvent( createEventFromScheduled( {
      id: newFakeID,
      task: draggedTask.task,
      from: start.valueOf()
        .toString(),
      to: end.valueOf()
        .toString(),
      canEdit: false,
      type: 'scheduled',
    } ) ) ] );
    addScheduled( {
        variables: {
          from: start.valueOf()
            .toString(),
          to: end.valueOf()
            .toString(),
          task: draggedTask.task.id,
          UserId: scheduledUserId,
        }
      } )
      .then( ( response ) => {
        setFakeEvents( [ ...fakeEvents.filter( ( event ) => event.id !== newFakeID ), expandScheduledEvent( createEventFromScheduled( response.data.addScheduledTask ) ) ] );
      } )
      .catch( ( err ) => {
        setFakeEvents( fakeEvents.filter( ( event ) => event.id !== newFakeID ) )
        addLocalError( err );
      } );
  };

  const onScheduledResizeOrDrop = ( eventData, fakeEvents ) => {
    const {
      event,
      start,
      end
    } = eventData;
    if ( !event.canEdit ) {
      return;
    }
    //fake resize broken creates new
    if ( fakeEvents.some( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === event.id ) ) {
      setFakeEvents( [
        ...fakeEvents.filter( ( fakeEvent ) => fakeEvent.type !== 'scheduled' || fakeEvent.id !== event.id ),
        expandScheduledEvent( createEventFromScheduled( {
          ...fakeEvents.find( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === event.id ),
          from: start.valueOf()
            .toString(),
          to: end.valueOf()
            .toString(),
        } ) )
      ] )
    } else {
      const scheduledTasks = client.readQuery( {
          query: GET_SCHEDULED_TASKS,
          variables: scheduledTasksVariables
        } )
        .scheduledTasks;

      client.writeQuery( {
        query: GET_SCHEDULED_TASKS,
        variables: scheduledTasksVariables,
        data: {
          scheduledTasks: [
            ...scheduledTasks.filter( ( scheduled ) => scheduled.id !== event.id ),
            {
              ...scheduledTasks.find( ( scheduled ) => scheduled.id === event.id ),
              from: start.valueOf()
                .toString(),
              to: end.valueOf()
                .toString(),
            }
          ]
        },
      } );
    }
    updateScheduled( {
        variables: {
          id: event.id,
          from: start.valueOf()
            .toString(),
          to: end.valueOf()
            .toString(),
        }
      } )
      .catch( ( err ) => {
        if ( fakeEvents.some( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === event.id ) ) {
          setFakeEvents( [
          ...fakeEvents.filter( ( fakeEvent ) => fakeEvent.type !== 'scheduled' || fakeEvent.id !== event.id ),
            {
              ...fakeEvents.find( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === event.id ),
              from: event.start.valueOf()
                .toString(),
              to: event.end.valueOf()
                .toString(),
          }
        ] )
        } else {
          const scheduledTasks = client.readQuery( {
              query: GET_SCHEDULED_TASKS,
              variables: scheduledTasksVariables
            } )
            .scheduledTasks;
          client.writeQuery( {
            query: GET_SCHEDULED_TASKS,
            variables: scheduledTasksVariables,
            data: {
              scheduledTasks: [
              ...scheduledTasks.filter( ( scheduled ) => scheduled.id !== event.id ),
                {
                  ...scheduledTasks.find( ( scheduled ) => scheduled.id === event.id ),
                  from: event.start.valueOf()
                    .toString(),
                  to: event.end.valueOf()
                    .toString(),
              }
            ]
            },
          } );
        }
        addLocalError( err );
      } );
  };

  const onRangeChange = ( dates, type ) => {
    if ( !type ) {
      type = calendarLayout;
    }
    if ( [ 'month', 'agenda' ].includes( type ) ) {
      setCalendarTimeRange( {
        from: moment( dates.start )
          .valueOf(),
        to: moment( dates.end )
          .valueOf(),
      } )
    } else {
      const start = moment( dates[ 0 ] )
        .startOf( 'isoWeek' );
      const end = moment( dates[ 0 ] )
        .endOf( 'isoWeek' );
      setCalendarTimeRange( {
        from: start.valueOf(),
        to: end.valueOf(),
      } )
    }
  }

  const expandScheduledEvent = ( scheduledEvent ) => ( {
    ...scheduledEvent,
    onDoubleClick: () => history.push( `${ path }/${ scheduledEvent.task.id }` ),
    propsGetter: () => {
      const status = scheduledEvent.task.status;
      if ( status ) {
        return {
          className: "",
          style: {
            backgroundColor: status.color,
            borderColor: lightenDarkenColor( -0.3, status.color )
          }
        };
      }
      return {
        className: "",
        style: {}
      };
    },
    onEventDrop: ( e, fakeEvents ) => {
      onScheduledResizeOrDrop( e, fakeEvents );
    },
    onEventResize: ( e, fakeEvents ) => {
      onScheduledResizeOrDrop( e, fakeEvents );
    },
  } )

  const expandRepeatEvent = ( repeatEvent ) => ( {
    ...repeatEvent,
    onDoubleClick: ( repeatEvent ) => {
      setFocusedRepeatEvent( repeatEvent );
    },
    propsGetter: () => {
      return {
        className: "",
        style: {}
      };
    },
    onEventDrop: ( event ) => {
      setDraggedRepeatEvent( {
        ...event.event,
        newDate: event.start.valueOf(),
      } )
    },
    onEventResize: ( e ) => {},

  } )

  const expandRepeatTimeEvent = ( repeatTimeEvent ) => ( {
    ...repeatTimeEvent,
    onDoubleClick: ( repeatTimeEvent ) => {
      setFocusedRepeatTimeEvent( repeatTimeEvent );
    },
    propsGetter: ( repeatTimeEvent ) => {
      let task = repeatTimeEvent.repeatTime.task;
      if ( task !== null && task.status ) {
        return {
          className: "",
          style: {
            backgroundColor: task.status.color,
            borderColor: lightenDarkenColor( -0.3, task.status.color )
          }
        };
      }
      return {
        className: "",
        style: {}
      };
    },
    onEventDrop: ( event ) => {
      setDraggedRepeatTimeEvent( {
        ...event.event,
        newDate: event.start.valueOf(),
      } )
    },
    onEventResize: ( e ) => {},

  } );

  const newScheduledEvents = scheduledEvents.map( expandScheduledEvent )
  const newRepeatEvents = repeatEvents.map( expandRepeatEvent )
  const newRepeatTimeEvents = repeatTimeEvents.map( expandRepeatTimeEvent )
  const events = [ ...newScheduledEvents, ...newRepeatEvents, ...newRepeatTimeEvents, ...fakeEvents ]

  const activeSearchHidden = (
    globalStringFilter === null ||
    Object.keys( globalStringFilter )
    .filter( ( filterKey ) => (
      ![ 'createdAt', 'startsAt', 'deadline' ].includes( filterKey ) &&
      globalStringFilter[ filterKey ] !== null &&
      globalStringFilter[ filterKey ].length !== 0
    ) )
    .length === 0
  ) && globalTaskSearch.length === 0;

  return (
    <div>
      <CommandBar {...props} showSort />
      <div className="calendar-container">
        <Search {...props} />
        <ActiveSearch {...props} includeGlobalSearch />
        <div className="row m-r-30">
          { canSeeStack &&
            <div
              className={classnames(
                "task-stack scroll-visible",
                {
                  'fit-with-header-and-commandbar-5': activeSearchHidden,
                  'fit-with-header-and-commandbar-7': !activeSearchHidden,
              }
              )}
              >
              <DndProvider backend={HTML5Backend}>
                <h1>Tasks stack</h1>
                { tasks.map( task =>
                  <StackItem task={task} key={task.id} path={path} setDraggedTask={setDraggedTask} history={history} scheduledUserId={scheduledUserId} />
                )}
                <Pagination
                  {...props}
                  shortForm
                  />
              </DndProvider>
            </div>
          }

          <DnDCalendar
            className={classnames(
              "calendar",
              {
                'fit-with-header-and-commandbar-5': activeSearchHidden,
                'fit-with-header-and-commandbar-7': !activeSearchHidden,
            }
            )}
            {...taskCalendarDefaults}
            events = { events }
            defaultView = { calendarLayout }
            onView={(viewType)=>{
              setCalendarLayout(viewType);
            }}
            dragFromOutsideItem={ () => draggedTask }
            onDropFromOutside = { onDropFromOutside }
            onRangeChange={onRangeChange}
            tooltipAccessor={ (e) => e.tooltip }
            draggableAccessor={ (e) => e.canEdit }
            resizableAccessor={(e) => e.resizable }
            onEventDrop = { (e) => e.event.onEventDrop(e, fakeEvents) }
            onEventResize = { (e) => e.event.onEventResize(e, fakeEvents) }
            eventPropGetter={ (e) => e.propsGetter(e) }
            onDoubleClickEvent={(e) => e.onDoubleClick(e) }
            />
        </div>
      </div>

      <DragRepeatContextMenu
        repeatEvent={ draggedRepeatEvent }
        openRepeat={ setOpenedRepeat }
        closeContextMenu={ () => setDraggedRepeatEvent(null) }
        addRepeatTime={ addRepeatTime }
        repeatsRefetch={repeatsRefetch}
        repeatTimesRefetch={repeatTimesRefetch}
        client={client}
        getFakeID={ () => fakeID++ }
        fakeEvents={fakeEvents}
        setFakeEvents={setFakeEvents}
        expandRepeatTimeEvent={expandRepeatTimeEvent}
        createEventFromRepeatTime={createEventFromRepeatTime}
        />
      <DragRepeatTimeContextMenu
        repeatTimeEvent={ draggedRepeatTimeEvent }
        openRepeat={ setOpenedRepeat }
        closeContextMenu={ () => setDraggedRepeatTimeEvent(null) }
        updateRepeatTime={ updateRepeatTime }
        repeatTimesRefetch={repeatTimesRefetch}
        setFakeEvents={setFakeEvents}
        fakeEvents={fakeEvents}
        client={client}
        expandRepeatTimeEvent={expandRepeatTimeEvent}
        createEventFromRepeatTime={createEventFromRepeatTime}
        repeatTimesVariables={repeatTimesVariables}
        />
      <RepeatContextMenu
        repeatEvent={ focusedRepeatEvent }
        closeContextMenu={ () => setFocusedRepeatEvent(null) }
        openCreatedTask={ (id) => history.push( `${ path }/${ id }` ) }
        openRepeat={ setOpenedRepeat }
        repeatsRefetch={repeatsRefetch}
        repeatTimesRefetch={repeatTimesRefetch}
        tasksRefetch={tasksRefetch}
        triggerRepeat={triggerRepeat}
        />
      <RepeatTimeContextMenu
        repeatTimeEvent={ focusedRepeatTimeEvent }
        closeContextMenu={ () => setFocusedRepeatTimeEvent(null) }
        openCreatedTask={ (id) => history.push( `${ path }/${ id }` ) }
        openRepeat={ setOpenedRepeat }
        repeatsRefetch={repeatsRefetch}
        repeatTimesRefetch={repeatTimesRefetch}
        tasksRefetch={tasksRefetch}
        triggerRepeat={triggerRepeat}
        />
      <Repeat
        isOpen={ openedRepeat !== null }
        repeat={ openedRepeat }
        newStartsAt={ openedRepeat ? openedRepeat.newDate : null }
        closeModal={ (hasChanged, isDisabled) => {
          if(hasChanged){
            repeatsRefetch();
            repeatTimesRefetch();
          }
          if(isDisabled){
            setFakeEvents(fakeEvents.filter((fakeEvent) => fakeEvent.type !== 'scheduled' || fakeEvent.repeatTime.repeat.id !== openRepeat.id ))
          }
          setOpenedRepeat( null );
        } }
        />

    </div>
  );
}