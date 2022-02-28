import React from 'react';
import Select from 'react-select';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  toSelItem,
  translateSelectItem,
  translateAllSelectItems,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";
import Checkbox from 'components/checkbox';
import ProjectSingleAttribute from './singleAttribute';
import Switch from "components/switch";
import booleanSelects from 'configs/constants/boolSelect';
import {
  emptyUserValue,
  emptyCompanyValue,
  emptyStatus,
  emptyAssigned,
  emptyPausal,
} from 'configs/constants/projects';

export const noSelect = {
  label: 'None',
  labelId: 'none',
  title: 'None',
  value: null,
  id: null
}

export default function ProjectAttributes( props ) {
  //data
  const {
    statuses,
    users,
    assignableUsers,
    allTags,
    companies,
    taskTypes,
    groups,
    setGroups,
    attributes,
    setAttributes,
  } = props;

  const {
    t
  } = useTranslation();

  React.useEffect( () => {
    if ( attributes.assigned.value.some( ( user1 ) => !assignableUsers.some( ( user2 ) => user1.id === user2.id ) ) ) {
      setAttributes( {
        ...attributes,
        assigned: {
          ...attributes.assigned,
          value: attributes.assigned.value.filter( ( user1 ) => assignableUsers.some( ( user2 ) => user1.id === user2.id ) ),
        }
      } )
    }
  }, [ assignableUsers ] );

  return (
    <div>
      <ProjectSingleAttribute
        label={t('status')}
        roles={ groups }
        right="status"
        defColored
        defSelectValues={statuses}
        defEmptyValue={translateSelectItem(emptyStatus,t)}
        attribute={ attributes.status }
        onChangeAttribute={(value) => {
          if(!attributes.status.fixed && value.fixed && value.value === null ){
            setAttributes( { ...attributes, status: {...value, value: statuses.find((status) => status.action === 'IsNew' ) } } )
          }else{
            setAttributes( { ...attributes, status: value } )
          }
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label={t('tags')}
        roles={ groups }
        right="tags"
        defColored
        defIsMulti
        defSelectValues={allTags}
        attribute={ attributes.tags }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, tags: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label={t('assignedTo')}
        roles={ groups }
        right="assigned"
        defIsMulti
        defSelectValues={ assignableUsers }
        defEmptyValue={ translateSelectItem(emptyAssigned, t) }
        attribute={ attributes.assigned }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, assigned: value } )
        } }
        onChangeRight={(roles) => {
          setGroups(roles);
        }}
        />

      <ProjectSingleAttribute
        label={t('requester')}
        roles={ groups }
        right="requester"
        defSelectValues={ users }
        defEmptyValue={ translateSelectItem(emptyUserValue,t ) }
        attribute={ attributes.requester }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, requester: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label={t('company')}
        roles={ groups }
        right="company"
        defSelectValues={ companies }
        defEmptyValue={ translateSelectItem(emptyCompanyValue, t) }
        attribute={ attributes.company }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, company: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label={t('taskType')}
        roles={ groups }
        right="taskType"
        canBeRequired
        defSelectValues={ taskTypes }
        attribute={ attributes.taskType }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, taskType: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label={t('repeat')}
        roles={ groups }
        right="repeat"
        noDef
        noRequired
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label={t('startsAt')}
        roles={ groups }
        right="startsAt"
        canBeRequired
        dataType="date"
        attribute={ attributes.startsAt }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, startsAt: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label={t('deadline')}
        roles={ groups }
        right="deadline"
        canBeRequired
        dataType="date"
        attribute={ attributes.deadline }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, deadline: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label={t('pausal')}
        roles={ groups }
        right="pausal"
        defSelectValues={ translateAllSelectItems([...booleanSelects, emptyPausal], t) }
        attribute={ attributes.pausal }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, pausal: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label={t('overtime')}
        roles={ groups }
        right="overtime"
        canBeRequired
        defEmptyValue={ translateSelectItem(noSelect, t) }
        defSelectValues={ translateAllSelectItems(booleanSelects, t) }
        attribute={ attributes.overtime }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, overtime: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />
    </div>
  );
}