import {
  tasksSortVar,
  ganttSortVar,
  localSearchVar,
  globalSearchVar,
  localStringFilterVar,
  globalStringFilterVar,
} from './variables';

export function setTasksSort( newValue ) {
  tasksSortVar( newValue );
}

export function setGanttSort( newValue ) {
  ganttSortVar( newValue );
}

export function setLocalTaskSearch( newValue ) {
  localSearchVar( newValue );
}

export function setGlobalTaskSearch() {
  globalSearchVar( localSearchVar() );
}

export function setLocalTaskStringFilter( newValue ) {
  localStringFilterVar( newValue );
}

export function setSingleLocalTaskStringFilter( attribute, value ) {
  let filter = {
    ...localStringFilterVar()
  };
  filter[ attribute ] = value;
  localStringFilterVar( filter );
}

export function setGlobalTaskStringFilter() {
  const localSearch = localStringFilterVar();
  globalStringFilterVar( {
    id: localSearch.id,
    status: localSearch.status,
    title: localSearch.title,
    requester: localSearch.requester,
    company: localSearch.company,
    createdAt: localSearch.createdAt,
    startsAt: localSearch.startsAt,
    deadline: localSearch.deadline,
    project: localSearch.project,
    taskType: localSearch.taskType,
    milestone: localSearch.milestone,
    assignedTo: localSearch.assignedTo,
    tags: localSearch.tags,
    overtime: localSearch.overtime,
    pausal: localSearch.pausal,
  } );
}