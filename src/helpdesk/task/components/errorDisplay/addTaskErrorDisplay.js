import React from 'react';
import {
  useTranslation
} from "react-i18next";

const attributesKeys = [
  {
    key: 'status',
    label: 'status'
  },
  {
    key: 'requester',
    label: 'requester'
  },
  {
    key: 'company',
    label: 'company'
  },
  {
    key: 'taskType',
    label: 'taskType'
  },
  {
    key: 'deadline',
    label: 'deadline'
  },
  {
    key: 'startsAt',
    label: 'startsAt'
  },
  {
    key: 'pausal',
    label: 'pausal'
  },
  {
    key: 'overtime',
    label: 'overtime'
  },
];
export const hasAddTaskIssues = ( props, t ) => {
  const {
    userRights,
    projectAttributes,
    title,
    status,
    project,
    assignedTo,
    taskType,
    currentUser,
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
      label: t( 'assignedTo' )
    } )
  }

  const attributesErrors = (
    requiredAttributesErrors.length > 0 ||
    assignedFixedError
  )
  return ( generalErrors || attributesErrors );
}

export default function AddTaskErrorDisplay( props ) {
  const {
    userRights,
    projectAttributes,
    title,
    status,
    project,
    assignedTo,
    taskType,
    currentUser,
  } = props;

  const {
    t
  } = useTranslation();

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
      label: t( 'assignedTo' ),
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
      { attributesErrors &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>Attribute errors</h4>
          { assignedFixedError &&
            <div className="error-message m-t-5" key={attribute.key}>
              {t('taskAssignedWrongFixed')}
            </div>
          }
          { requiredAttributesErrors.forEach((attribute) => (
            <div className="error-message m-t-5" key={attribute.key}>
              ${`${t(attribute.label)} ${t('isRequiredButEmpty')}!`}
            </div>
          ))}
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