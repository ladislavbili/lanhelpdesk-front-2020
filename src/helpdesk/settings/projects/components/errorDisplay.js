import React from 'react';
import {
  getGroupsProblematicAttributes,
} from '../helpers';
import {
  useTranslation
} from "react-i18next";

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

  const {
    t
  } = useTranslation();

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
  const projectMustHaveTaskType = attributes.taskType.value === null;

  const problematicFilters = filters.map( ( filter ) => ( {
      filter,
      groups: getGroupsProblematicAttributes( groups, filter, t ),
    } ) )
    .filter( ( filter ) => filter.filter.active && filter.groups.length !== 0 )

  return (
    <div>
      { ( projectTitleError ||
        missingIsNewStatus ||
        missingCloseDateStatus ||
        missingAdmin ) &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>{t('generalErrors')}</h4>
          { projectTitleError &&
            <div className="error-message m-t-5">
              {t('errorProjectNameCantBeEmpty')}
            </div>
          }
          { missingIsNewStatus &&
            <div className="error-message m-t-5">
              {t('errorProjectNeedsIsNewStatus')}
            </div>
          }
          { missingCloseDateStatus &&
            <div className="error-message m-t-5">
              {t('errorProjectNeedsCloseDateStatus')}
            </div>
          }
          { missingAdmin &&
            <div className="error-message m-t-5">
              {t('errorProjectAtLeastOneAdmin')}
            </div>
          }
        </div>
      }
      { ( tagsWithBadTitle.length !== 0 ||
        tagsWithBadColor.length !== 0 ||
        tagsWithBadOrder.length !== 0 ) &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>{t('tagsErrors')}</h4>
          { tagsWithBadTitle.map((tag) => (
            <div className="error-message m-t-5">
              {`${t('errorProjectTag1')} ${tag.order} ${t('errorProjectTag2')}.`}
            </div>
          ))}
          { tagsWithBadColor.map((tag) => (
            <div className="error-message m-t-5">
              {`${t('errorProjectTag3')} ${tag.title} ${t('errorProjectTag4')} ${tag.order} ${t('errorProjectTag5')}.`}
            </div>
          ))}
          { tagsWithBadOrder.map((tag) => (
            <div className="error-message m-t-5">
              {`${t('errorProjectTag6')} ${tag.title} ${t('errorProjectTag7')}.`}
            </div>
          ))}
        </div>
      }
      { (attributesWithError.length !== 0 || projectMustHaveTaskType) &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>Attributes errors</h4>
          { attributesWithError.map((attribute) => (
            <div className="error-message m-t-5">
              {`${t('errorProjectAttribute1')} ${attribute} ${t('errorProjectAttribute2')}.`}
            </div>
          ))}
          { projectMustHaveTaskType &&
            <div className="error-message m-t-5">
              {`${t('errorProjectTaskTypeNoValue')}.`}
            </div>
          }
        </div>
      }
      { problematicFilters.length !== 0 &&
        <div className="p-10 m-t-10 bkg-white">
          <h4>{t('filterErrors')}</h4>
          { problematicFilters.map((filterData) => (
            <div className="error-message m-t-5" key={filterData.filter.id}>
              <h4>{t('filterName')}: {filterData.filter.title}</h4>
                { filterData.groups.map((troubledGroup) => (
                  <div className="error-message" key={troubledGroup.group.id}>
                    {`${t('group')} ${troubledGroup.group.title} ${t('errorProjectCantUseFilter')} ${troubledGroup.attributes.join(', ')}`}
                  </div>
                ) ) }
            </div>
          ))}
        </div>
      }
    </div>
  );
}