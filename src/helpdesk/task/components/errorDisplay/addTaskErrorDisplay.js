import React from 'react';

const attributesKeys = [
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'requester',
    label: 'Requester'
  },
  {
    key: 'company',
    label: 'Company'
  },
  {
    key: 'taskType',
    label: 'Task Type'
  },
  {
    key: 'deadline',
    label: 'Deadline'
  },
  {
    key: 'startsAt',
    label: 'Starts at'
  },
  {
    key: 'pausal',
    label: 'Pausal'
  },
  {
    key: 'overtime',
    label: 'After working hours'
  }
];
export const hasAddTaskIssues = ( props ) => {
  const {
    userRights,
    projectAttributes,
    title,
    status,
    project,
    assignedTo,
    taskType,
  } = props;
  const titleError = title.length === 0;
  const statusError = status === null && userRights.attributeRights.status.add;
  const projectError = project === null;
  const missingAssignedError = assignedTo.length === 0 && userRights.attributeRights.assigned.add && !projectAttributes.assigned.fixed;
  const assignedFixedError = (
    projectAttributes.assigned.fixed &&
    (
      //assigned ma def hodnotu a nedodrzuje ju
      (
        projectAttributes.assigned.value.length !== 0 &&
        (
          projectAttributes.assigned.value.length !== assignedTo.length ||
          !projectAttributes.assigned.value.every( ( user1 ) => assignedTo.some( ( user2 ) => user1.id === user2.id ) )
        )
      ) ||
      //assigned nema def hodnotu a niesi priradeny alebo prazdny
      projectAttributes.assigned.value.length === 0 &&
      (
        assignedTo.length > 1 ||
        (
          assignedTo.length === 1 &&
          assignedTo[ 0 ].id !== currentUser.id
        )
      )
    )
  );

  const generalErrors = (
    titleError ||
    statusError ||
    projectError ||
    missingAssignedError
  );

  //required
  let requiredAttributesErrors = attributesKeys.filter( ( attribute ) => project.projectAttributes[ attribute.key ].required && !props[ attribute.key ] )

  if ( assignedTo.length === 0 && project.projectAttributes.assigned.required ) {
    requiredAttributesErrors.push( {
      key: 'assignedTo',
      label: 'Assigned to'
    } )
  }

  const attributesErrors = (
    requiredAttributesErrors.length > 0 ||
    assignedFixedError
  )
  return ( generalErrors || attributesErrors );
}

export default function EditTaskErrorDisplay( props ) {
  const {
    userRights,
    projectAttributes,
    title,
    status,
    project,
    assignedTo,
    taskType,
  } = props;

  //errors
  const titleError = title.length === 0;
  const statusError = status === null && userRights.attributeRights.status.add;
  const projectError = project === null;
  const missingAssignedError = assignedTo.length === 0 && userRights.attributeRights.assigned.add && !projectAttributes.assigned.fixed;
  const assignedFixedError = (
    projectAttributes.assigned.fixed &&
    (
      //assigned ma def hodnotu a nedodrzuje ju
      (
        projectAttributes.assigned.value.length !== 0 &&
        (
          projectAttributes.assigned.value.length !== assignedTo.length ||
          !projectAttributes.assigned.value.every( ( user1 ) => assignedTo.some( ( user2 ) => user1.id === user2.id ) )
        )
      ) ||
      //assigned nema def hodnotu a niesi priradeny alebo prazdny
      projectAttributes.assigned.value.length === 0 &&
      (
        assignedTo.length > 1 ||
        (
          assignedTo.length === 1 &&
          assignedTo[ 0 ].id !== currentUser.id
        )
      )
    )
  );

  const generalErrors = (
    titleError ||
    statusError ||
    projectError ||
    missingAssignedError
  );

  //required
  let requiredAttributesErrors = attributesKeys.filter( ( attribute ) => project.projectAttributes[ attribute.key ].required && !props[ attribute.key ] )

  if ( assignedTo.length === 0 && project.projectAttributes.assigned.required ) {
    requiredAttributesErrors.push( {
      key: 'assignedTo',
      label: 'Assigned to'
    } )
  }

  const attributesErrors = (
    requiredAttributesErrors.length > 0 ||
    assignedFixedError
  )

  const taskTypeWarning = ( taskType === null || taskType.value === null ) && (
    userRights.attributeRights.taskType.add ||
    userRights.rights.taskWorksRead ||
    userRights.rights.taskWorksAdvancedRead
  );
  const assignedWarning = ( assignedTo.length === 0 &&
    (
      userRights.rights.taskWorksRead ||
      userRights.rights.taskWorksAdvancedRead
    )
  );
  const warnings = (
    taskTypeWarning ||
    assignedWarning
  )

  return (
    <div className="full-width m-b-20" >
      { generalErrors &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>General errors</h4>
          { titleError &&
            <div className="error-message m-t-5">
              Task title can't be empty!
            </div>
          }
          { statusError &&
            <div className="error-message m-t-5">
              Task status is missing!
            </div>
          }
          { projectError &&
            <div className="error-message m-t-5">
              Task project is missing!
            </div>
          }
          { missingAssignedError &&
            <div className="error-message m-t-5">
              Task must be assigned to someone!
            </div>
          }
        </div>
      }
      { attributesErrors &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>Attribute errors</h4>
          { assignedFixedError &&
            <div className="error-message m-t-5" key={attribute.key}>
              Assigned is fixed but either assigned user is not you, empty or set value of project
            </div>
          }
          { requiredAttributesErrors.forEach((attribute) => (
            <div className="error-message m-t-5" key={attribute.key}>
              ${`${attribute.label} is required but empty!`}
            </div>
          ))}
        </div>
      }
      { warnings &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>Warnings</h4>
          { taskTypeWarning &&
            <div className="warning-message m-t-5">
              Without task type you can't create works and trips!
            </div>
          }
          { assignedWarning &&
            <div className="warning-message m-t-5">
              Task type wasn't assigned to anyone, you can't create works and trips!
            </div>
          }
        </div>
      }
    </div>
  );
}