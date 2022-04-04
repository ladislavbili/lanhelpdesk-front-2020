import React from 'react';
import Calendar from './calendar';
import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription,
} from "@apollo/client";
import {
  getDateClock,
  processStringFilter,
} from 'helperFunctions';
import renderRepeatTime from './renderRepeatTime';
import renderRepeat from './renderRepeat';
import moment from 'moment';

import {
  useTranslation
} from "react-i18next";

import {
  GET_TASKS,
  GET_SCHEDULED_WORKS,
  UPDATE_SCHEDULED_WORK,
  ADD_TASK_SUBSCRIPTION,
  ADD_SCHEDULED_WORK,
  UPDATE_SUBTASK,
  UPDATE_WORKTRIP,
} from '../../queries';

import {
  GET_CALENDAR_REPEATS,
  GET_REPEAT_TIMES,
  TRIGGER_REPEAT,
  ADD_REPEAT_TIME,
  UPDATE_REPEAT_TIME,
} from './querries';

import {
  GET_LOCAL_CALENDAR_USER_ID,
  GET_LOCAL_CALENDAR_DATE_RANGE,
  GET_LOCAL_TASK_STRING_FILTER,
  GET_GLOBAL_TASK_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  setCalendarTimeRange,
  setLocalTaskStringFilter,
  setSingleLocalTaskStringFilter,
  setGlobalTaskStringFilter,
} from 'apollo/localSchema/actions';

import {
  defaultTasklistColumnPreference,
  createDisplayValues,
} from 'configs/constants/tasks';

const multipliers = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
}

export default function CalendarLoader( props ) {
  const {
    filterVariables,
    localProject,
    currentUser,
    localMilestone,
    globalTaskSearch,
    localFilter,
    orderBy,
    ascending,
    page,
    limit,
    processTasks,
  } = props;

  const {
    t
  } = useTranslation();

  const client = useApolloClient();

  //local queries
  const {
    data: localCalendarUserId,
  } = useQuery( GET_LOCAL_CALENDAR_USER_ID );

  const {
    data: localCalendarDateRange,
  } = useQuery( GET_LOCAL_CALENDAR_DATE_RANGE );

  const {
    data: localStringFilter,
  } = useQuery( GET_LOCAL_TASK_STRING_FILTER );

  const {
    data: globalStringFilter,
  } = useQuery( GET_GLOBAL_TASK_STRING_FILTER );

  const {
    from: cFrom,
    to: cTo,
  } = localCalendarDateRange.localCalendarDateRange;

  //apollo queries
  const scheduledWorksVariables = {
    projectId: localProject.id,
    filter: filterVariables,
    from: cFrom.toString(),
    to: cTo.toString(),
    userId: localCalendarUserId.localCalendarUserId,
  }

  const repeatTimesVariables = {
    active: true,
    from: cFrom.toString(),
    to: cTo.toString(),
  }

  const taskVariables = {
    projectId: localProject.id,
    milestoneId: localMilestone.id,
    filter: filterVariables,
    sort: {
      asc: ascending,
      key: orderBy
    },
    search: globalTaskSearch,
    stringFilter: processStringFilter( globalStringFilter.globalTaskStringFilter ),
    page,
    limit,
  }

  const {
    data: tasksData,
    loading: tasksLoading,
    refetch: tasksRefetchFunc,
  } = useQuery( GET_TASKS, {
    variables: taskVariables,
    notifyOnNetworkStatusChange: true,
  } );

  const {
    data: scheduledWorksData,
    loading: scheduledWorksLoading,
    refetch: scheduledWorksRefetch,
  } = useQuery( GET_SCHEDULED_WORKS, {
    variables: scheduledWorksVariables,
    //fetchPolicy: 'network-only',
  } );

  const {
    data: calendarRepeatsData,
    loading: calendarRepeatsLoading,
    refetch: calendarRepeatsRefetchFunc,
  } = useQuery( GET_CALENDAR_REPEATS, {
    variables: {
      projectId: localProject.id,
      active: true,
      from: cFrom.toString(),
      to: cTo.toString(),
    },
    fetchPolicy: 'network-only',
  } );

  const {
    data: repeatTimesData,
    loading: repeatTimesLoading,
    refetch: repeatTimesRefetchFunc,
  } = useQuery( GET_REPEAT_TIMES, {
    variables: repeatTimesVariables,
    //fetchPolicy: 'network-only',
  } );

  const [ updateScheduledWork ] = useMutation( UPDATE_SCHEDULED_WORK );
  const [ addRepeatTime ] = useMutation( ADD_REPEAT_TIME );
  const [ updateRepeatTime ] = useMutation( UPDATE_REPEAT_TIME );
  const [ triggerRepeat ] = useMutation( TRIGGER_REPEAT );
  const [ addScheduledWork ] = useMutation( ADD_SCHEDULED_WORK );
  const [ updateSubtask ] = useMutation( UPDATE_SUBTASK );
  const [ updateWorkTrip ] = useMutation( UPDATE_WORKTRIP );

  const [ fakeEvents, setFakeEvents ] = React.useState( [] );
  const [ forcedRefetch, setForcedRefetch ] = React.useState( false );

  //sync
  const tasksRefetch = () => {
    tasksRefetchFunc( {
      variables: taskVariables,
    } );
  }

  const scheduledRefetch = () => {
    scheduledWorksRefetch( scheduledWorksVariables );
  }

  const repeatsRefetch = () => {
    calendarRepeatsRefetchFunc( {
      projectId: localProject.id,
      active: true,
      from: cFrom.toString(),
      to: cTo.toString(),
    } );
  }

  const repeatTimesRefetch = () => {
    repeatTimesRefetchFunc( {
      active: true,
      from: cFrom.toString(),
      to: cTo.toString(),
    } );
  }

  React.useEffect( () => {
    scheduledRefetch();
    repeatsRefetch();
    repeatTimesRefetch();
    setFakeEvents( [] );
  }, [ cFrom, cTo ] );

  //refetch tasks
  React.useEffect( () => {
    tasksRefetch();
  }, [ localFilter, localProject.id, localMilestone.id, currentUser, globalTaskSearch, globalStringFilter, forcedRefetch ] );

  useSubscription( ADD_TASK_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tasksRefetch();
      scheduledRefetch();
      repeatsRefetch();
      repeatTimesRefetch();
      setFakeEvents( [] );
    }
  } );

  const repeats = !calendarRepeatsLoading ? calendarRepeatsData.calendarRepeats : [];
  const scheduled = !scheduledWorksLoading ? scheduledWorksData.scheduledWorks : [];
  const repeatTimes = !repeatTimesLoading ? repeatTimesData.repeatTimes : [];
  const tasks = tasksLoading ? [] : tasksData.tasks.tasks;

  React.useEffect( () => {
    setFakeEvents( fakeEvents.filter( ( fakeEvent ) => fakeEvent.type !== 'scheduled' || scheduled.some( ( scheduled ) => scheduled.id !== fakeEvent.id ) ) );
  }, [ scheduled ] );

  React.useEffect( () => {
    setFakeEvents( fakeEvents.filter( ( fakeEvent ) => fakeEvent.type !== 'repeatTime' || repeatTimes.some( ( repeatTime ) => repeatTime.id !== fakeEvent.repeatTime.id ) ) );
  }, [ repeatTimes ] );

  const canSeeStack = localProject.id === null || localProject.attributeRights.assigned.edit;

  const getRepeatMilisecs = ( repeatEvery, repeatInterval ) => {
    let multiplier = multipliers[ repeatInterval ];
    if ( multiplier === undefined || repeatEvery === 0 ) {
      return multipliers.day;
    }
    return multiplier * repeatEvery;
  }

  const getAllDatesInRange = ( repeat ) => {
    const ignoredDates = [ ...repeatTimes, ...fakeEvents.filter( ( fakeEvent ) => fakeEvent.type === 'repeatTime' )
      .map( ( fakeEvent ) => fakeEvent.repeatTime ) ].map( ( repeatTime ) => parseInt( repeatTime.originalTrigger ) );
    const startsAt = parseInt( repeat.startsAt );
    const everyMilisec = getRepeatMilisecs( repeat.repeatEvery, repeat.repeatInterval );
    let allDates = []
    for ( let i = startsAt; i < cTo; i = i + everyMilisec ) {
      if ( i >= cFrom ) {
        allDates.push( i );
      }
    }
    return allDates.filter( ( date ) => !ignoredDates.includes( date ) );
  };

  const createEventFromRepeatTime = ( repeatTime ) => {
    let start = ( new Date( parseInt( repeatTime.triggersAt ) ) );
    let end = ( new Date( parseInt( repeatTime.triggersAt ) ) );
    end.setHours( end.getHours() + 1 );

    return {
      repeatTime,
      canEdit: repeatTime.canEdit,
      allDay: false,
      resizable: false,
      start,
      end,
      type: 'repeatTime',
      time: parseInt( repeatTime.triggersAt ),
      title: renderRepeatTime( repeatTime, parseInt( repeatTime.triggersAt ), t ),
      tooltip: repeatTime.task ? `${t('repeatTask')}: ${repeatTime.task.title}` : `${t('repeat')}: ${t('every').toLowerCase()} ${repeatTime.repeat.repeatEvery} ${repeatTime.repeat.repeatInterval}`,
    };
  }

  const setScheduledDone = ( scheduled, done ) => {
    if ( scheduled.subtask !== null ) {
      const scheduledWorks = client.readQuery( {
          query: GET_SCHEDULED_WORKS,
          variables: scheduledWorksVariables
        } )
        .scheduledWorks;
      if ( fakeEvents.some( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === scheduled.id ) || !scheduledWorks.some( ( scheduledWork ) => scheduledWork.id === scheduled.id ) ) {
        setFakeEvents( [
          ...fakeEvents.filter( ( fakeEvent ) => fakeEvent.type !== 'scheduled' || fakeEvent.id !== scheduled.id ),
           createEventFromScheduled( {
            ...fakeEvents.find( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === scheduled.id ),
            subtask: {
              ...fakeEvents.find( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === scheduled.id )
              .subtask,
              done,
            }
          } )
        ] )
      } else {

        client.writeQuery( {
          query: GET_SCHEDULED_WORKS,
          variables: scheduledWorksVariables,
          data: {
            scheduledWorks: [
              ...scheduledWorks.filter( ( scheduledWork ) => scheduledWork.id !== scheduled.id ),
              {
                ...scheduledWorks.find( ( scheduledWork ) => scheduledWork.id === scheduled.id ),
                subtask: {
                  ...scheduledWorks.find( ( scheduledWork ) => scheduledWork.id === scheduled.id )
                  .subtask,
                  done,
                }
              }
            ]
          },
        } );
      }
      updateSubtask( {
        variables: {
          id: scheduled.subtask.id,
          done,
        }
      } )

    } else {
      if ( fakeEvents.some( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === scheduled.id ) ) {
        setFakeEvents( [
          ...fakeEvents.filter( ( fakeEvent ) => fakeEvent.type !== 'scheduled' || fakeEvent.id !== scheduled.id ),
           createEventFromScheduled( {
            ...fakeEvents.find( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === scheduled.id ),
            workTrip: {
              ...fakeEvents.find( ( fakeEvent ) => fakeEvent.type === 'scheduled' && fakeEvent.id === scheduled.id )
              .workTrip,
              done,
            }
          } )
        ] )
      } else {
        const scheduledWorks = client.readQuery( {
            query: GET_SCHEDULED_WORKS,
            variables: scheduledWorksVariables
          } )
          .scheduledWorks;

        client.writeQuery( {
          query: GET_SCHEDULED_WORKS,
          variables: scheduledWorksVariables,
          data: {
            scheduledWorks: [
              ...scheduledWorks.filter( ( scheduledWork ) => scheduledWork.id !== scheduled.id ),
              {
                ...scheduledWorks.find( ( scheduledWork ) => scheduledWork.id === scheduled.id ),
                workTrip: {
                  ...scheduledWorks.find( ( scheduledWork ) => scheduledWork.id === scheduled.id )
                  .workTrip,
                },
              }
            ]
          },
        } );
      }
      updateWorkTrip( {
        variables: {
          id: scheduled.workTrip.id,
          done,
        }
      } )
    }

  }

  const createEventFromScheduled = ( scheduled ) => ( {
    ...scheduled,
    resizable: scheduled.canEdit,
    start: new Date( parseInt( scheduled.from ) ),
    end: new Date( parseInt( scheduled.to ) ),
    type: 'scheduled',
    allDay: isAllDay( scheduled ),
    tooltip: `${getDateClock(new Date( parseInt( scheduled.from ) ))} - ${getDateClock(new Date( parseInt( scheduled.to ) ))} ${scheduled.task.title} `,
  } )

  const repeatEvents = repeats.reduce( ( acc, repeat ) => {
    return [
      ...acc,
      ...getAllDatesInRange( repeat )
      .map( ( time ) => ( {
        repeat,
        time,
        allDay: false,
        resizable: false,
        canEdit: repeat.canEdit,
        start: new Date( time ),
        end: new Date( time + 60 * 60 * 1000 ),
        title: renderRepeat( repeat, time, t ),
        tooltip: `${t('repeat')}: ${t('every').toLowerCase()} ${repeat.repeatEvery} ${repeat.repeatInterval}`,
      } ) )
    ]
  }, [] );

  const isAllDay = ( scheduled ) => {
    const sFrom = moment( parseInt( scheduled.from ) );
    const sTo = moment( parseInt( scheduled.to ) );
    return sFrom.diff( sTo, 'days' ) !== 0;
  }

  const scheduledEvents = scheduled.map( createEventFromScheduled );

  const repeatTimeEvents = repeatTimes.map( createEventFromRepeatTime );

  const newProps = {
    ...props,
    loading: (
      tasksLoading ||
      scheduledWorksLoading ||
      calendarRepeatsLoading ||
      repeatTimesLoading
    ),
    scheduled,
    setCalendarTimeRange,
    scheduledUserId: localCalendarUserId.localCalendarUserId ? localCalendarUserId.localCalendarUserId : currentUser.id,
    updateScheduled: updateScheduledWork,
    refetchScheduled: scheduledRefetch,
    repeats,
    repeatsRefetch,
    triggerRepeat,
    repeatTimes,
    repeatTimesRefetch,
    cFrom: cFrom,
    cTo: cTo,
    repeatEvents,
    scheduledEvents,
    repeatTimeEvents,
    addRepeatTime,
    updateRepeatTime,
    canSeeStack,
    createEventFromRepeatTime,
    createEventFromScheduled,
    scheduledWorksVariables,
    addScheduledWork,
    repeatTimesVariables,
    client,
    setFakeEvents,
    tasks: processTasks( tasks ),
    count: tasksLoading ? null : tasksData.tasks.count,
    globalTaskSearch,
    setScheduledDone,

    forceRefetch: () => setForcedRefetch( !forcedRefetch ),
    tasksRefetch,
    localStringFilter: localStringFilter.localTaskStringFilter,
    setLocalTaskStringFilter,
    globalStringFilter: globalStringFilter.globalTaskStringFilter,
    setGlobalTaskStringFilter,
    setSingleLocalTaskStringFilter,
    displayValues: createDisplayValues( defaultTasklistColumnPreference, false, t ),
  }

  return (
    <Calendar {...newProps} fakeEvents={fakeEvents} />
  )
}