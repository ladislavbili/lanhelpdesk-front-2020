import React from 'react';
import {
  useTranslation
} from "react-i18next";

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

  const {
    t
  } = useTranslation();

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
          <h4>{t('generalErrors')}</h4>
          { titleError &&
            <div className="error-message m-t-5">
              {t('taskTitleCantBeEmpty')}
            </div>
          }
          { statusError &&
            <div className="error-message m-t-5">
              {t('taskStatusMissing')}
            </div>
          }
          { projectError &&
            <div className="error-message m-t-5">
              {t('taskProjectIsMissing')}
            </div>
          }
          { missingAssignedError &&
            <div className="error-message m-t-5">
              {t('taskMustBeAssigned')}
            </div>
          }
        </div>
      }
      { warnings &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>Warnings</h4>
          { taskTypeWarning &&
            <div className="warning-message m-t-5">
              {t('withoutTaskTypeCantCreateWorksAndTrips')}
            </div>
          }
          { assignedWarning &&
            <div className="warning-message m-t-5">
              {t('taskWasntAssignedToAnyoneCantCreateWorksTrips')}
            </div>
          }
        </div>
      }
    </div>
  );
}