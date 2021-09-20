import React from 'react';
import {
  getGroupsProblematicAttributes,
} from '../helpers';

export default function ProjectErrorDisplay( props ) {
  const {
    attributes,
    title,
    allTags,
    allStatuses,
    groups,
    userGroups,
    filters,
  } = props;
  const tagsWithBadTitle = allTags.filter( ( tag ) => tag.title.length === 0 );
  const tagsWithBadColor = allTags.filter( ( tag ) => !tag.color.includes( '#' ) );
  const tagsWithBadOrder = allTags.filter( ( tag ) => isNaN( parseInt( tag.order ) ) );
  const missingIsNewStatus = !allStatuses.some( ( status ) => status.action === 'IsNew' );
  const missingCloseDateStatus = !allStatuses.some( ( status ) => status.action === 'CloseDate' );
  const projectTitleError = title.length === 0;
  const missingAdmin = !groups.some( ( group ) => (
    group.rights.projectRead &&
    group.rights.projectWrite &&
    userGroups.some( ( userGroup ) => userGroup.group.id === group.id )
  ) );
  const attributesWithError = [ 'deadline', 'overtime', 'pausal', 'startsAt', 'status', 'taskType' ].filter( ( attr ) => attributes[ attr ].fixed && attributes[ attr ].value === null );

  const problematicFilters = filters.map( ( filter ) => ( {
      filter,
      groups: getGroupsProblematicAttributes( groups, filter ),
    } ) )
    .filter( ( filter ) => filter.filter.active && filter.groups.length !== 0 )

  return (
    <div>
      { ( projectTitleError ||
        missingIsNewStatus ||
        missingCloseDateStatus ||
        missingAdmin ) &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>General errors</h4>
          { projectTitleError &&
            <div className="error-message m-t-5">
              Project name can't be empty!
            </div>
          }
          { missingIsNewStatus &&
            <div className="error-message m-t-5">
              You need at least one status with "is new" action.
            </div>
          }
          { missingCloseDateStatus &&
            <div className="error-message m-t-5">
              You need at least one status with "close date" action.
            </div>
          }
          { missingAdmin &&
            <div className="error-message m-t-5">
              There needs to be at least one user in a group that has right to read and edit this project.
            </div>
          }
        </div>
      }
      { ( tagsWithBadTitle.length !== 0 ||
        tagsWithBadColor.length !== 0 ||
        tagsWithBadOrder.length !== 0 ) &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>Tags errors</h4>
          { tagsWithBadTitle.map((tag) => (
            <div className="error-message m-t-5">
              {`Tag with order ${tag.order} has empty title.`}
            </div>
          ))}
          { tagsWithBadColor.map((tag) => (
            <div className="error-message m-t-5">
              {`Tag with title ${tag.title} and order ${tag.order} has invalid color.`}
            </div>
          ))}
          { tagsWithBadOrder.map((tag) => (
            <div className="error-message m-t-5">
              {`Tag with title ${tag.title} is missing order.`}
            </div>
          ))}
        </div>
      }
      { attributesWithError.length !== 0 &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>Attributes errors</h4>
          { attributesWithError.map((attribute) => (
            <div className="error-message m-t-5">
              {`Attribute ${attribute} is fixed, but needs to be set to specific value.`}
            </div>
          ))}
        </div>
      }
      { problematicFilters.length !== 0 &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>Filters errors</h4>
          { problematicFilters.map((filterData) => (
            <div className="error-message m-t-5" key={filterData.filter.id}>
              <h4>Filter name: {filterData.filter.title}</h4>
                { filterData.groups.map((troubledGroup) => (
                  <div className="error-message" key={troubledGroup.group.id}>
                    {`Group ${troubledGroup.group.title} can't use this filter! Attributes that they can't see are: ${troubledGroup.attributes.join(', ')}`}
                  </div>
                ) ) }
            </div>
          ))}
        </div>
      }
    </div>
  );
}