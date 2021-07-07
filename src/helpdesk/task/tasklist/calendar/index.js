import React from 'react';
import Calendar from './calendar';
import {
  useQuery,
  useMutation,
  useApolloClient,
} from "@apollo/client";
import {
  getDateClock,
  processStringFilter,
} from 'helperFunctions';
import renderScheduled from './renderScheduled';
import renderRepeatTime from './renderRepeatTime';
import renderRepeat from './renderRepeat';
import moment from 'moment';

import {
  GET_TASKS,
  GET_SCHEDULED_TASKS,
  ADD_SCHEDULED_TASK,
  UPDATE_SCHEDULED_TASK,
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
  const scheduledTasksVariables = {
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
    data: scheduledTasksData,
    loading: scheduledTasksLoading,
    refetch: scheduledTasksRefetch,
  } = useQuery( GET_SCHEDULED_TASKS, {
    variables: scheduledTasksVariables,
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

  const [ addScheduledTask ] = useMutation( ADD_SCHEDULED_TASK );
  const [ updateScheduledTask ] = useMutation( UPDATE_SCHEDULED_TASK );
  const [ addRepeatTime ] = useMutation( ADD_REPEAT_TIME );
  const [ updateRepeatTime ] = useMutation( UPDATE_REPEAT_TIME );

  const [ triggerRepeat ] = useMutation( TRIGGER_REPEAT );
  const [ fakeEvents, setFakeEvents ] = React.useState( [] );
  const [ forcedRefetch, setForcedRefetch ] = React.useState( false );

  //sync
  const tasksRefetch = () => {
    tasksRefetchFunc( {
      variables: taskVariables,
    } );
  }

  const scheduledRefetch = () => {
    scheduledTasksRefetch( {
      projectId: localProject.id,
      filter: filterVariables,
      from: cFrom.toString(),
      to: cTo.toString(),
      userId: localCalendarUserId.localCalendarUserId,
    } );
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

  const repeats = !calendarRepeatsLoading ? calendarRepeatsData.calendarRepeats : [];
  const scheduled = !scheduledTasksLoading ? scheduledTasksData.scheduledTasks : [];
  const repeatTimes = !repeatTimesLoading ? repeatTimesData.repeatTimes : [];
  const tasks = tasksLoading ? [] : tasksData.tasks.tasks;

  React.useEffect( () => {
    setFakeEvents( fakeEvents.filter( ( fakeEvent ) => fakeEvent.type !== 'scheduled' || scheduled.some( ( scheduled ) => scheduled.id !== fakeEvent.id ) ) );
  }, [ scheduled ] );

  React.useEffect( () => {
    setFakeEvents( fakeEvents.filter( ( fakeEvent ) => fakeEvent.type !== 'repeatTime' || repeatTimes.some( ( repeatTime ) => repeatTime.id !== fakeEvent.repeatTime.id ) ) );
  }, [ repeatTimes ] );

  const canSeeStack = localProject.id === null || localProject.right.assignedWrite;

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
      title: renderRepeatTime( repeatTime, parseInt( repeatTime.triggersAt ) ),
      tooltip: repeatTime.task ? `Repeat task: ${repeatTime.task.title}` : `Repeat: every ${repeatTime.repeat.repeatEvery} ${repeatTime.repeat.repeatInterval}`,
    };
  }

  const createEventFromScheduled = ( scheduled ) => ( {
    ...scheduled,
    resizable: scheduled.canEdit,
    start: new Date( parseInt( scheduled.from ) ),
    end: new Date( parseInt( scheduled.to ) ),
    type: 'scheduled',
    allDay: isAllDay( scheduled ),
    title: renderScheduled( scheduled.task, new Date( parseInt( scheduled.from ) ), new Date( parseInt( scheduled.to ) ) ),
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
        title: renderRepeat( repeat, time ),
        tooltip: `Repeat: every ${repeat.repeatEvery} ${repeat.repeatInterval}`,
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
      scheduledTasksLoading ||
      calendarRepeatsLoading ||
      repeatTimesLoading
    ),
    scheduled,
    setCalendarTimeRange,
    scheduledUserId: localCalendarUserId.localCalendarUserId ? localCalendarUserId.localCalendarUserId : currentUser.id,
    addScheduled: addScheduledTask,
    updateScheduled: updateScheduledTask,
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
    scheduledTasksVariables,
    repeatTimesVariables,
    client: useApolloClient(),
    setFakeEvents,
    tasks: processTasks( tasks ),
    count: tasksLoading ? null : tasksData.tasks.count,
    globalTaskSearch,

    forceRefetch: () => setForcedRefetch( !forcedRefetch ),
    localStringFilter: localStringFilter.localTaskStringFilter,
    setLocalTaskStringFilter,
    globalStringFilter: globalStringFilter.globalTaskStringFilter,
    setGlobalTaskStringFilter,
    setSingleLocalTaskStringFilter,
    displayValues: createDisplayValues( defaultTasklistColumnPreference ),
  }

  return (
    <Calendar {...newProps} fakeEvents={fakeEvents} />
  )
}