import {
  localSearchVar,
  globalSearchVar,
  localStringFilterVar,
  globalStringFilterVar,
} from './variables';

export function setLocalTaskSearch( newValue ) {
  localSearchVar( newValue );
}

export function setGlobalTaskSearch() {
  if ( globalSearchVar() === localSearchVar() ) {
    globalSearchVar( localSearchVar() + ' ' );
  } else {
    globalSearchVar( localSearchVar() );
  }
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