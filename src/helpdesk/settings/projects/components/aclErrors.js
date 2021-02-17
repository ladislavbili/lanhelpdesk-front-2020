import React from 'react';


export default function ACLErrors( props ) {
  const {
    groups,
    status,
    defTag,
    assignedTo,
    requester,
    company,
    type,
  } = props;
  let errors = [];
  groups.filter( ( group ) => group.rights.addTasks )
    .forEach( ( group ) => {
      let issueRights = [];
      if ( !group.rights.taskTitleEdit ) {
        issueRights.push( 'tasks title' );
      }
      if ( !group.rights.status.write && !status.def ) {
        issueRights.push( 'status' );
      }
      if ( !group.rights.tags.write && !defTag.def && defTag.required ) {
        issueRights.push( 'tags' );
      }
      if ( !group.rights.assigned.write && !assignedTo.def ) {
        issueRights.push( 'assigned to' );
      }
      if ( !group.rights.requester.write && !requester.def && requester.required ) {
        issueRights.push( 'requester' );
      }
      if ( !group.rights.type.write && !type.def && type.required ) {
        issueRights.push( 'task type' );
      }
      if ( !group.rights.company.write && !company.def ) {
        issueRights.push( 'company' );
      }
      if ( issueRights.length > 0 ) {
        errors.push( `Group ${group.title} is set to add tasks, but does not have rights for attributes ${issueRights.join(', ')}. They can be either set as default or give this group right to edit them!` )
      }
    } )
  if ( errors.length === 0 ) {
    return null
  }
  return (
    <div>
      {
        errors.map((error, index) => (
          <div className="project-message error-message" key={index}>{error}</div>
        ))
      }
    </div>
  );
}