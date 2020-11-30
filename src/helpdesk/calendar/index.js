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
  timestampToHoursAndMinutes
} from '../../helperFunctions';

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Loading from 'components/loading';

import {
  GET_MY_DATA,
} from './querries';

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
    calendarLayout,
    statuses,
    statusesLoaded,
    setUserFilterStatuses,
    data,
    commandBar,
    listName,
    link,
    setCalendarLayout,
    Edit,
  } = props;

  //TODO u sure?
  const {
    data: currentUserData,
    loading: currentUserLoading
  } = useQuery( GET_MY_DATA );

  const [ today, setToday ] = React.useState( moment() );

  const onEventResize = ( item ) => {
    // TODO pozi rules
    /*  if ( currentUser.userData.role.value === 0 ) {
        return;
      }*/
    if ( calendarLayout === 'week' ) {
      if ( !item.event.isTask ) {
        /*    rebase.updateDoc( '/help-calendar_events/' + item.event.eventID, {
              start: item.start.getTime(),
              end: item.end.getTime()
            } )*/
      }
      /*else if(item.event.status.action==='pending'){
      				rebase.updateDoc('/help-tasks/'+item.event.id, { pendingDate:item.start.getTime(), pendingDateTo:item.end.getTime(), pendingChange:true })
      			}*/
    }
  };

  const getOnlyDaytime = ( date ) => {
    // TODO yzmen na moment
    return ( new Date( date.getFullYear(), date.getMonth(), date.getDate() ) )
      .getTime();
  }

  const onEventDrop = ( item ) => {
    // TODO pozi rules
    /*    if ( currentUser.userData.role.value === 0 ) {
          return;
        }*/
    //MOVING TASKS
    /*  if ( ( item.isAllDay || calendarLayout === 'month' ) && item.event.isTask ) {
        if ( [ 'new', 'open' ].includes( item.event.status.action ) ) {
          if ( this.getOnlyDaytime( item.start ) > this.getOnlyDaytime( new Date() ) ) {
            //SET PENDING
            rebase.updateDoc( '/help-tasks/' + item.event.id, {
              pendingDate: item.start.getTime(),
              pendingChange: true,
              status: this.props.statuses.find( ( status ) => status.action === 'pending' )
                .id
            } )
          } else if ( this.getOnlyDaytime( item.start ) < this.getOnlyDaytime( new Date() ) && this.props.statusesLoaded ) {
            //SET CLOSED
            rebase.updateDoc( '/help-tasks/' + item.event.id, {
              closeDate: item.start.getTime(),
              status: this.props.statuses.find( ( status ) => status.action === 'close' )
                .id
            } )
          }
        } else if ( item.event.status.action === 'close' ) {
          //UPDATE CLOSE DATE
          rebase.updateDoc( '/help-tasks/' + item.event.id, {
            closeDate: item.start.getTime()
          } );
        } else if ( item.event.status.action === 'pending' && this.getOnlyDaytime( item.start ) >= this.getOnlyDaytime( new Date() ) ) {
          // UPDATE PENDING DATE
          rebase.updateDoc( '/help-tasks/' + item.event.id, {
            pendingDate: item.start.getTime()
          } );
        }
        return;
  }*/
    //MOVING EVENTS (IN WEEK)
    /*  if ( this.props.calendarLayout === 'week' && !item.isAllDay ) {
        //if TASK
        if ( item.event.isTask ) {
          let newEvent = {
            taskID: item.event.id,
            start: item.start.getTime(),
            end: fromMomentToUnix( moment( item.start )
              .add( 1, 'hours' ) ),
          }
          if ( [ 'new', 'open' ].includes( item.event.status.action ) ) {
            //if new it will be open
          } else if ( item.event.status.action === 'new' && this.props.statusesLoaded ) {
            newEvent.end = fromMomentToUnix( moment( newEvent.start )
              .add( 2, 'hours' ) );
          } else if ( item.event.status.action === 'pending' ) {
            newEvent.end = fromMomentToUnix( moment( newEvent.start )
              .add( 30, 'minutes' ) );
          }
          rebase.addToCollection( 'help-calendar_events', newEvent );
        } else {
          //UPDATE EVENT
          rebase.updateDoc( '/help-calendar_events/' + item.event.eventID, {
            start: item.start.getTime(),
            end: item.end.getTime()
          } )
        }
      }*/
  };


  const onEventDropTASKS = ( item ) => {
    /*  if ( currentUser.userData.role.value === 0 ) {
        return;
      }*/
    //manage calendar all day
    /*  if ( ( item.isAllDay || this.props.calendarLayout === 'month' ) && item.event.isTask ) {
        if ( [ 'new', 'open' ].includes( item.event.status.action ) ) {
          if ( this.getOnlyDaytime( item.start ) > this.getOnlyDaytime( new Date() ) ) {
            this.props.data.filter( ( event ) => !event.isTask )
              .forEach( ( event ) => {
                rebase.removeDoc( '/help-calendar_events/' + event.eventID );
              } );
            rebase.updateDoc( '/help-tasks/' + item.event.id, {
              pendingDate: item.start.getTime(),
              pendingDateTo: fromMomentToUnix( moment( item.end.getTime() )
                .add( 30, 'minutes' ) ),
              pendingChange: true,
              status: this.props.statuses.find( ( status ) => status.action === 'pending' )
                .id
            } )
          } else if ( this.getOnlyDaytime( item.start ) < this.getOnlyDaytime( new Date() ) && this.props.statusesLoaded ) {
            rebase.updateDoc( '/help-tasks/' + item.event.id, {
              closeDate: item.start.getTime(),
              status: this.props.statuses.find( ( status ) => status.action === 'close' )
                .id
            } )
          }
        } else if ( item.event.status.action === 'close' ) {
          rebase.updateDoc( '/help-tasks/' + item.event.id, {
            closeDate: item.start.getTime()
          } );
        } else if ( item.event.status.action === 'pending' && this.getOnlyDaytime( item.start ) >= this.getOnlyDaytime( new Date() ) ) {
          rebase.updateDoc( '/help-tasks/' + item.event.id, {
            pendingDate: item.start.getTime(),
            pendingDateTo: item.end.getTime(),
          } );
        }
        return false;
      }
      //manage calendar with time
      if ( this.props.calendarLayout === 'week' ) {
        if ( item.isAllDay ) {
          return false;
        }
        //if TASK
        if ( item.event.isTask ) {
          let newEvent = {
            taskID: item.event.id,
            start: item.start.getTime(),
            end: item.end.getTime(),
          }
          //if in fucture, set as PENDING
          if ( [ 'new', 'open' ].includes( item.event.status.action ) && this.getOnlyDaytime( item.start ) > this.getOnlyDaytime( new Date() ) ) {
            this.props.data.filter( ( event ) => !event.isTask )
              .forEach( ( event ) => {
                rebase.removeDoc( '/help-calendar_events/' + event.eventID );
              } );

            rebase.updateDoc( '/help-tasks/' + item.event.id, {
              status: this.props.statuses.find( ( status ) => status.action === 'pending' )
                .id,
              pendingDate: item.start.getTime(),
              pendingDateTo: fromMomentToUnix( moment( newEvent.start )
                .add( 30, 'minutes' ) ),
              pendingChange: true
            } )
            //if new it will be open
          } else if ( item.event.status.action === 'new' && this.props.statusesLoaded ) {
            //new task is open
            newEvent.end = fromMomentToUnix( moment( newEvent.start )
              .add( 2, 'hours' ) );
            rebase.addToCollection( 'help-calendar_events', newEvent );
            rebase.updateDoc( '/help-tasks/' + item.event.id, {
              status: this.props.statuses.find( ( status ) => status.action === 'open' )
                .id
            } )
          } else if ( item.event.status.action === 'pending' ) {
            rebase.updateDoc( '/help-tasks/' + item.event.id, {
              pendingDate: item.start.getTime(),
              pendingDateTo: item.end.getTime()
            } )
          } else {
            rebase.addToCollection( 'help-calendar_events', newEvent );
          }
        } else { //if EVENT
          rebase.updateDoc( '/help-calendar_events/' + item.event.eventID, {
            start: item.start.getTime(),
            end: item.end.getTime()
          } )
        }
      }*/
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

  console.log( data );
  return (
    <div>
  			<CommandBar { ...commandBar } />
  			<div className="full-width scroll-visible fit-with-header-and-commandbar task-container p-20">
  				<ListHeader
            { ...commandBar }
            listName={ listName }
            statuses={currentUserData.getMyData.statuses}
            setStatuses={setUserFilterStatuses}
            allStatuses={statuses}
            />
  				<DnDCalendar
  					events = { events }
            defaultDate = { new Date() }
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
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
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