import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";

import Loading from 'components/loading';

// http://intljusticemission.github.io/react-big-calendar/examples/index.html
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Calendar
} from "react-big-calendar";

import CommandBar from './components/commandBar';
import ListHeader from './components/listHeader';
import TaskEdit from 'helpdesk/task/edit';
import ItemRender from './components/calendarItemRender';
import StackItem from './components/stackItem';
import Pagination from './components/pagination';
import moment from "moment";
import {
  unimplementedAttributes,
  calendarDateFormats,
  calendarLocalizer,
} from 'configs/constants/tasks';
import {
  fromMomentToUnix,
  updateArrayItem,
  localFilterToValues,
  deleteAttributes,
} from 'helperFunctions';



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

  const [ today, setToday ] = React.useState( moment() );
  const [ calendarLayout, setCalendarLayout ] = React.useState( 'week' );

  const updateTaskFunc = ( id, updateData ) => {}

  const updateCalendarEventFunc = ( id, updateData ) => {}

  const addCalendarEventFunc = ( addData ) => {}

  const deleteCalendarEventFunc = ( id ) => {}

  const onEventResize = ( item ) => {};

  const getOnlyDaytime = ( date ) => {}

  const onEventDrop = ( item ) => {};

  const getCalendarEventsData = () => {}

  const getCalendarAllDayData = ( tasks ) => {}

  return (
    <div>
      <CommandBar {...props} />
      <div className="full-width scroll-visible fit-with-header-and-commandbar calendar-container">
        <ListHeader {...props} />
        <div className="row">
          <div className="task-stack">
            <h1>Tasks stack</h1>
            { tasks.map( task =>
              <StackItem task={task}  />
            )}
            <Pagination
              {...props}
              shortForm
              />
          </div>
          <DnDCalendar
            events = { []  }
            defaultDate = { new Date( moment().valueOf() ) }
            defaultView = { calendarLayout }
            style = {{padding: "20px" }}
            views={['month', 'week', 'work_week', 'day', 'agenda']}
            drilldownView="day"
            localizer = { calendarLocalizer }
            resizable
            popup={true}
            formats={ calendarDateFormats }

            scrollToTime={
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
    </div>
  );
}