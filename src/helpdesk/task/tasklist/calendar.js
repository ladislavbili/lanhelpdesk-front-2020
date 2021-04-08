import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";

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
import ItemRender from './components/calendarItemRender';
import StackItem from './components/stackItem';
import Pagination from './components/pagination';
import moment from "moment";
import {
  taskCalendarDefaults,
} from 'configs/components/bigCalendar';
import {
  updateArrayItem,
  getDateClock,
} from 'helperFunctions';
let fakeId = 0;

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
  } = props;

  const [ calendarLayout, setCalendarLayout ] = React.useState( 'week' );
  const [ draggedTask, setDraggedTask ] = React.useState( null );
  const [ fakeEvents, setFakeEvents ] = React.useState( [] );

  const onEventResize = ( item ) => {
    const {
      event,
      start,
      end
    } = item;
    setFakeEvents(
      updateArrayItem(
        fakeEvents, {
          ...event,
          start: start,
          end: end,
          allDay: false,
          title: renderScheduled( event.task, start, end ),
        },
        'fakeId'
      )
    )
  };

  const onEventDrop = ( item ) => {
    const {
      event,
      start,
      end
    } = item;
    setFakeEvents(
      updateArrayItem(
        fakeEvents, {
          ...event,
          start: start,
          end: end,
          allDay: false,
          title: renderScheduled( event.task, start, end ),
        },
        'fakeId'
      )
    )
  };
  const onDropFromOutside = ( item ) => {
    let {
      start,
      end,
    } = item;

    if ( start.getDay() !== end.getDay() ) {
      end = new Date( start );
      start.setHours( 0 );
      end.setHours( 23 );
      end.setMinutes( 59 );
    }

    setFakeEvents( [
      ...fakeEvents,
      {
        start,
        end,
        allDay: false,
        title: renderScheduled( draggedTask, start, end ),
        task: draggedTask,
        id: fakeId--,
      }
    ] )
  };

  const renderScheduled = ( task, start, end ) => {
    return (
      <div>
        <p className="m-0">
          <span className="label label-info" style={{backgroundColor: task.status && task.status.color ? task.status.color: 'white' }}>
            { task.status ? task.status.title : 'Neznámy status' }
          </span>
          <span className="attribute-label m-l-3">{`#${ task.id } | ${ task.title }`}</span>
        </p>
        <p className="m-l-3 m-t-5" style={{ color: 'white' }}>
          { `${getDateClock(start)} - ${getDateClock(end)}` }
        </p>
      </div>
    )
  }

  const isAllDay = ( scheduled ) => {
    const sFrom = moment( parseInt( scheduled.from ) );
    const sTo = moment( parseInt( scheduled.to ) );
    return Math.abs( sFrom.diff( sTo, 'days' ) ) > 0;
  }

  return (
    <div>
      <CommandBar {...props} />
      <div className="full-width scroll-visible fit-with-header-and-commandbar calendar-container">
        <ListHeader {...props} />
        <div className="row">
          <div className="task-stack">
            <DndProvider backend={HTML5Backend}>
              <h1>Tasks stack</h1>
              { tasks.map( task =>
                <StackItem task={task} key={task.id} setDraggedTask={setDraggedTask} />
              )}
              <Pagination
                {...props}
                shortForm
                />
            </DndProvider>
          </div>
          <DnDCalendar
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
            tooltipAccessor={ (event) => `${event.task.title}` }
            onEventDrop = { onEventDrop }
            onEventResize = { onEventResize }
            onDropFromOutside = { onDropFromOutside }
            dragFromOutsideItem={ () => draggedTask }
            onDoubleClickEvent={(event)=>{
              history.push(link+'/'+event.id);
            }}
            />
        </div>
      </div>
    </div>
  );
}