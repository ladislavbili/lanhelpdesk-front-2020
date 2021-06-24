import React from 'react';
import DnDList from './dndList';

export default function DnDListLoader( props ) {
  const {
    localProject,
    localMilestone,
    filterVariables,
    orderBy,
    ascending,
    globalTaskSearch,
  } = props;

  const taskVariables = {
    projectId: localProject.id,
    milestoneId: localMilestone.id,
    filter: filterVariables,
    sort: {
      asc: ascending,
      key: orderBy
    },
    search: globalTaskSearch,
  }

  const dndProps = {
    ...props,
    taskVariables,
    tasks: [], //TEMP
  }

  return (
    <DnDList {...dndProps} />
  );
}