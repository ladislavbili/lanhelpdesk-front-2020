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
import ListHeader from '../components/listHeader';
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
  } = props;

  let {
    repeatEvents,
    scheduledEvents,
    repeatTimeEvents,
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

  const onDropFromOutside = ( eventData ) => {
    const {
      start,
      end
    } = eventData;

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
      .then( refetchScheduled )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  };

  const onScheduledResizeOrDrop = ( eventData ) => {
    const {
      event,
      start,
      end
    } = eventData;
    if ( !event.canEdit ) {
      return;
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
      .then( refetchScheduled )
      .catch( ( err ) => {
        console.log( err.message );
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

  scheduledEvents = scheduledEvents.map( ( scheduledEvent ) => ( {
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
    onEventDrop: ( e ) => {
      onScheduledResizeOrDrop( e );
    },
    onEventResize: ( e ) => {
      onScheduledResizeOrDrop( e );
    },

  } ) )

  repeatEvents = repeatEvents.map( ( repeatEvent ) => ( {
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

  } ) )

  repeatTimeEvents = repeatTimeEvents.map( ( repeatTimeEvent ) => ( {
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

  } ) )

  const events = [
    ...repeatEvents,
    ...scheduledEvents,
    ...repeatTimeEvents,

  ]

  return (
    <div>
      <CommandBar {...props} />
      <div className="full-width calendar-container">
        <ListHeader {...props} />
        <div className="row">
          { canSeeStack &&
            <div className="task-stack fit-with-header-and-commandbar-5 scroll-visible">
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
            className="fit-with-header-and-commandbar-5 calendar"
            {...taskCalendarDefaults}
            events = { events }
            defaultView = { calendarLayout }
            onView={(viewType)=>{
              setCalendarLayout(viewType);
            }}
            dragFromOutsideItem={ () => draggedTask }
            onDropFromOutside = { onDropFromOutside }
            onRangeChange={onRangeChange}
            tooltipAccessor={ (event) => event.tooltip }
            draggableAccessor={ (event) => event.canEdit }
            resizableAccessor={(event) => event.resizable }
            onEventDrop = { (e) => e.event.onEventDrop(e) }
            onEventResize = { (e) => e.event.onEventResize(e) }
            eventPropGetter={ (event) => event.propsGetter(event) }
            onDoubleClickEvent={(event) => event.onDoubleClick(event) }
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
        />
      <DragRepeatTimeContextMenu
          repeatTimeEvent={ draggedRepeatTimeEvent }
          openRepeat={ setOpenedRepeat }
          closeContextMenu={ () => setDraggedRepeatTimeEvent(null) }
          updateRepeatTime={ updateRepeatTime }
          repeatTimesRefetch={repeatTimesRefetch}
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
        closeModal={ (hasChanged) => {
          setOpenedRepeat( null );
        } }
        />

    </div>
  );
}