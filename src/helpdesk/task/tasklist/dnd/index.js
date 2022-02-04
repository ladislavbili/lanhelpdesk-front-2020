import React from 'react';
import DnDList from './dndList';

import {
  useQuery,
} from "@apollo/client";

import {
  GET_LOCAL_TASK_STRING_FILTER,
  GET_GLOBAL_TASK_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  processStringFilter,
} from 'helperFunctions';

import {
  setLocalTaskStringFilter,
  setSingleLocalTaskStringFilter,
  setGlobalTaskStringFilter,
} from 'apollo/localSchema/actions';

import {
  defaultTasklistColumnPreference,
  createDisplayValues,
} from 'configs/constants/tasks';

import {
  useTranslation
} from "react-i18next";

export default function DnDListLoader( props ) {
  const {
    localProject,
    localMilestone,
    filterVariables,
    orderBy,
    ascending,
    globalTaskSearch,
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: localStringFilter,
  } = useQuery( GET_LOCAL_TASK_STRING_FILTER );

  const {
    data: globalStringFilter,
  } = useQuery( GET_GLOBAL_TASK_STRING_FILTER );

  const [ forcedRefetch, setForcedRefetch ] = React.useState( false );

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
  }

  const dndProps = {
    ...props,
    taskVariables,
    globalTaskSearch,

    forcedRefetch,
    forceRefetch: () => setForcedRefetch( !forcedRefetch ),
    localStringFilter: localStringFilter.localTaskStringFilter,
    setLocalTaskStringFilter,
    globalStringFilter: globalStringFilter.globalTaskStringFilter,
    setGlobalTaskStringFilter,
    setSingleLocalTaskStringFilter,
    displayValues: createDisplayValues( defaultTasklistColumnPreference, false, t ),
  }

  return (
    <DnDList {...dndProps} />
  );
}