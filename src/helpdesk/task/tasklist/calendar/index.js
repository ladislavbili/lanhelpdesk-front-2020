import React from 'react';
import Calendar from './calendar';
import {
  useQuery,
  useMutation,
} from "@apollo/client";
import {
  GET_SCHEDULED_TASKS,
  ADD_SCHEDULED_TASK,
  UPDATE_SCHEDULED_TASK,
} from '../../queries';

import {
  GET_REPEATS
} from './querries';

import {
  GET_LOCAL_CALENDAR_USER_ID,
  GET_LOCAL_CALENDAR_DATE_RANGE,
} from 'apollo/localSchema/queries';

import {
  setCalendarTimeRange
} from 'apollo/localSchema/actions';

export default function CalendarLoader( props ) {
  const {
    filterVariables,
    localProject,
    currentUser,
  } = props;

  const {
    data: localCalendarUserId,
  } = useQuery( GET_LOCAL_CALENDAR_USER_ID );

  const {
    data: localCalendarDateRange,
  } = useQuery( GET_LOCAL_CALENDAR_DATE_RANGE );

  const {
    from: cFrom,
    to: cTo,
  } = localCalendarDateRange.localCalendarDateRange;

  const {
    data: scheduledTasksData,
    loading: scheduledTasksLoading,
    refetch: scheduledTasksRefetch,
  } = useQuery( GET_SCHEDULED_TASKS, {
    variables: {
      projectId: localProject.id,
      filter: filterVariables,
      from: cFrom.toString(),
      to: cTo.toString(),
      userId: localCalendarUserId.localCalendarUserId,
    },
    fetchPolicy: 'network-only',
  } );


  const [ addScheduledTask ] = useMutation( ADD_SCHEDULED_TASK );
  const [ updateScheduledTask ] = useMutation( UPDATE_SCHEDULED_TASK );

  const scheduledRefetch = () => {
    scheduledTasksRefetch( {
      projectId: localProject.id,
      filter: filterVariables,
      from: cFrom.toString(),
      to: cTo.toString(),
      userId: localCalendarUserId.localCalendarUserId,
    } );
  }

  React.useEffect( () => {
    scheduledRefetch();
  }, [ cFrom, cTo ] );

  const newProps = {
    ...props,
    loading: (
      props.loading ||
      scheduledTasksLoading
    ),
    scheduled: !scheduledTasksLoading ? scheduledTasksData.scheduledTasks : [],
    setCalendarTimeRange,
    scheduledUserId: localCalendarUserId.localCalendarUserId ? localCalendarUserId.localCalendarUserId : currentUser.id,
    addScheduled: addScheduledTask,
    updateScheduled: updateScheduledTask,
    refetchScheduled: scheduledRefetch,
  }

  return (
    <Calendar {...newProps} />
  )
}