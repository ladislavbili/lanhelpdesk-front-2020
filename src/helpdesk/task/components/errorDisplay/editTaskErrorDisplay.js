import React from 'react';

export default function AddTaskErrorDisplay( props ) {
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
  const statusError = status === null && userRights.attributeRights.status.view;
  const projectError = project === null;
  const missingAssignedError = assignedTo.length === 0 && userRights.attributeRights.assigned.view && !projectAttributes.assigned.fixed;
  const generalErrors = (
    titleError ||
    statusError ||
    projectError ||
    missingAssignedError
  );

  const taskTypeWarning = ( taskType === null || taskType.value === null ) && (
    userRights.attributeRights.taskType.view ||
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
    <div className="full-width" >
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