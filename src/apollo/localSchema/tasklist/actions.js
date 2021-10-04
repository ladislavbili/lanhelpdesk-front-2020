import {
  localSearchVar,
  globalSearchVar,
  localStringFilterVar,
  globalStringFilterVar,
} from './variables';
import {
  getDayRange,
} from 'helperFunctions';

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
    createdAtFrom: localSearch.createdAt === null ? null : getDayRange( localSearch.createdAt ).start.toString(),
    createdAtTo: localSearch.createdAt === null ? null : getDayRange( localSearch.createdAt ).end.toString(),
    startsAt: localSearch.startsAt,
    startsAtFrom: localSearch.startsAt === null ? null : getDayRange( localSearch.startsAt ).start.toString(),
    startsAtTo: localSearch.startsAt === null ? null : getDayRange( localSearch.startsAt ).end.toString(),
    deadline: localSearch.deadline,
    deadlineFrom: localSearch.deadline === null ? null : getDayRange( localSearch.deadline ).start.toString(),
    deadlineTo: localSearch.deadline === null ? null : getDayRange( localSearch.deadline ).end.toString(),
    project: localSearch.project,
    taskType: localSearch.taskType,
    assignedTo: localSearch.assignedTo,
    tags: localSearch.tags,
    overtime: localSearch.overtime,
    pausal: localSearch.pausal,
  } );
}