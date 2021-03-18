import moment from 'moment';
import {
  toSelArr
} from './select';

export const applyTaskFilter = ( task, filter, user, projectID, milestoneID ) => {
  let currentPermissions = null;
  if ( task.project && task.project.projectRights ) {
    currentPermissions = task.project.projectRights.find( ( permission ) => permission.user.id === user.id );
  }
  return ( filterOneOf( task, filter, user ) && ( user.statuses.length === 0 || ( task.status && user.statuses.includes( task.status.id ) ) ) && ( filter.taskType === null || ( task.taskType === filter.taskType ) ) && filterDateSatisfied( task, filter, 'statusDate' ) && filterDateSatisfied( task, filter, 'closeDate' ) && filterDateSatisfied( task, filter, 'pendingDate' ) && filterDateSatisfied( task, filter, 'deadline' ) && ( projectID === null || ( task.project && task.project.id === projectID ) ) && ( user.role.level === 3 || ( currentPermissions && currentPermissions.read ) ) && ( milestoneID === null || ( task.milestone && task.milestone === milestoneID ) ) )
}

export const filterDateSatisfied = ( task, filter, type ) => {
  let fromTime = filter[ `${type}From` ];
  let fromNow = filter[ `${type}FromNow` ] || false;
  let toTime = filter[ `${type}To` ];
  let toNow = filter[ `${type}ToNow` ] || false;
  if ( fromNow ) {
    fromTime = moment().unix() * 1000;
  }
  if ( toNow ) {
    toTime = moment().unix() * 1000;
  }
  return ( fromTime === null || ( task[ type ] !== null && task[ type ] >= fromTime ) ) && ( toTime === null || ( task[ type ] !== null && task[ type ] <= toTime ) )
}

export const filterOneOf = ( task, filter, user ) => {
  const requesterSatisfied = ( filter.requester === null || ( task.requester && task.requester.id === filter.requester ) || ( task.requester && filter.requesterCur && task.requester.id === user.id ) )
  const assignedSatisfied = ( filter.assignedTo === null || ( task.assignedTo && task.assignedTo.map( ( item ) => item.id ).includes( filter.assignedTo ) ) || ( task.assignedTo && filter.assignedToCur && task.assignedTo.map( ( item ) => item.id ).includes( user.id ) ) )

  const companySatisfied = ( filter.company === null || ( task.company && task.company.id === filter.company ) || ( task.company && filter.companyCur && task.company.id === user.company.id ) )

  const oneOf = [];
  const all = [];
  if ( filter.oneOf.includes( 'requester' ) ) {
    oneOf.push( requesterSatisfied )
  } else {
    all.push( requesterSatisfied )
  }

  if ( filter.oneOf.includes( 'assignedTo' ) ) {
    oneOf.push( assignedSatisfied )
  } else {
    all.push( assignedSatisfied )
  }

  if ( filter.oneOf.includes( 'company' ) ) {
    oneOf.push( companySatisfied )
  } else {
    all.push( companySatisfied )
  }
  return all.every( ( bool ) => bool ) && ( oneOf.length === 0 || oneOf.some( ( bool ) => bool ) )
}

export const filterProjectsByPermissions = ( projects, currentUser ) => {
  return toSelArr( projects ).filter( ( project ) => {
    if ( currentUser.userData && currentUser.userData.role.value === 3 ) {
      return true;
    }
    if ( project.permissions === undefined )
      return false;
    let permission = project.permissions.find( ( permission ) => permission.user === currentUser.id );
    return permission && permission.read;
  } )
}

export const localFilterToValues = ( localFilter ) => {
  console.log( localFilter );
  let filterValues = {
    ...localFilter.filter,
    assignedTos: localFilter.filter.assignedTos.map( ( user ) => user.id ),
    requesters: localFilter.filter.requesters.map( ( user ) => user.id ),
    companies: localFilter.filter.companies.map( ( company ) => company.id ),
    taskTypes: localFilter.filter.taskTypes.map( ( taskType ) => taskType.id ),
  }
  delete filterValues.__typename;
  return filterValues;
}