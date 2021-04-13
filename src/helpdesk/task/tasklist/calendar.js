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

import CommandBar from './components/commandBar';
import ListHeader from './components/listHeader';
import TaskEdit from 'helpdesk/task/edit';
import StackItem from './components/stackItem';
import Pagination from './components/pagination';
import moment from "moment";
import {
  taskCalendarDefaults,
} from 'configs/components/bigCalendar';
import {
  updateArrayItem,
  getDateClock,
  lightenDarkenColor,
} from 'helperFunctions';
import {
  setCalendarTimeRange
} from 'apollo/localSchema/actions';

const DnDCalendar = withDragAndDrop( Calendar );

export default function TaskCalendar( props ) {
  const {
    match,
    history,
    tasks,
    statuses,
    allStatuses,
    scheduled,
    link,
    localProject,
    localFilter,
    calendarEvents,
    scheduledUserId,
    addScheduled,
    updateScheduled,
    refetchScheduled,
  } = props;

  let path = `/helpdesk/taskList/i/${match.params.listID}`;
  if ( match.params.page ) {
    path = `${path}/p/${match.params.page}`
  }
  const [ calendarLayout, setCalendarLayout ] = React.useState( 'week' );
  const [ draggedTask, setDraggedTask ] = React.useState( null );

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

  const onEventResizeOrDrop = ( eventData ) => {
    const {
      event,
      start,
      end
    } = eventData;
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

  const renderScheduled = ( task, start, end ) => {
    return (
      <div>
        <p className="m-0" style={{ color: 'white' }}>
          <span className="m-l-3">{`${ task.title } | #${ task.id }`}</span>
        </p>
        { start && end &&
          <p className="m-l-3 m-t-5">
            { `${getDateClock(start)} - ${getDateClock(end)}` }
          </p>
        }
      </div>
    )
  }

  const isAllDay = ( scheduled ) => {
    const sFrom = moment( parseInt( scheduled.from ) );
    const sTo = moment( parseInt( scheduled.to ) );
    return sFrom.diff( sTo, 'days' ) !== 0;
  }

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

  return (
    <div>
      <CommandBar {...props} />
      <div className="full-width calendar-container">
        <ListHeader {...props} />
        <div className="row">
          <div className="task-stack fit-with-header-and-commandbar-5 scroll-visible">
            <DndProvider backend={HTML5Backend}>
              <h1>Tasks stack</h1>
              { tasks.map( task =>
                <StackItem task={task} key={task.id} path={path} setDraggedTask={setDraggedTask} history={history} renderScheduled={renderScheduled} scheduledUserId={scheduledUserId} />
              )}
              <Pagination
                {...props}
                shortForm
                />
            </DndProvider>
          </div>
          <DnDCalendar
            className="fit-with-header-and-commandbar-5"
            {...taskCalendarDefaults}
            events = { scheduled.map((scheduled) => ({
              ...scheduled,
              start: new Date( parseInt( scheduled.from ) ),
              end: new Date( parseInt( scheduled.to ) ),
              allDay: isAllDay(scheduled),
              title: renderScheduled( scheduled.task, new Date( parseInt( scheduled.from ) ), new Date( parseInt( scheduled.to ) ) ),
            })) }
            defaultView = { calendarLayout }
            onView={(viewType)=>{
              setCalendarLayout(viewType);
            }}
            tooltipAccessor={ (event) => `${getDateClock(event.start)} - ${getDateClock(event.end)} ${event.task.title} ` }
            onEventDrop = { onEventResizeOrDrop }
            eventPropGetter={
              ( event ) => {
                const status = event.task.status;
                if(status){
                  return {
                    className: "",
                    style: { backgroundColor: status.color, borderColor: lightenDarkenColor(-0.3, status.color ) }
                  };
                }
                return {
                  className: "",
                  style: {}
                };
              }
            }
            onEventResize = { onEventResizeOrDrop }
            onDropFromOutside = { onDropFromOutside }
            dragFromOutsideItem={ () => draggedTask }
            onDoubleClickEvent={(event)=>{
              history.push(`${ path }/${ event.task.id }`);
            }}
            onRangeChange={onRangeChange}
            />
        </div>
      </div>
    </div>
  );
}