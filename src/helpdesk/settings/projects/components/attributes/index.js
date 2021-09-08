import React from 'react';
import Select from 'react-select';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  toSelItem
} from 'helperFunctions';
import Checkbox from 'components/checkbox';
import ProjectSingleAttribute from './singleAttribute';
import Switch from "components/switch";
import booleanSelects from 'configs/constants/boolSelect'
import {
  emptyUserValue,
  emptyCompanyValue,
  emptyStatus,
  emptyAssigned,
} from 'configs/constants/projects';

export const noSelect = {
  label: 'None',
  title: 'None',
  value: null,
  id: null
}

export default function ProjectAttributes( props ) {
  //data
  const {
    assignedTo,
    setAssignedTo,
    company,
    setCompany,
    status,
    setStatus,
    requester,
    setRequester,
    type,
    setType,
    tag,
    setTag,
    pausal,
    setPausal,
    overtime,
    setOvertime,
    statuses,
    users,
    assignableUsers,
    allTags,
    companies,
    taskTypes,
    autoApproved,
    setAutoApproved,
    groups,
    setGroups,
    attributes,
    setAttributes,
  } = props;

  return (
    <div>
      <ProjectSingleAttribute
        label="Status"
        roles={ groups }
        right="status"
        defColored
        defSelectValues={statuses}
        defEmptyValue={emptyStatus}
        attribute={ attributes.status }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, status: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label="Tags"
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
        label="Assigned"
        roles={ groups }
        right="assigned"
        defIsMulti
        defSelectValues={ assignableUsers }
        defEmptyValue={ emptyAssigned }
        attribute={ attributes.assigned }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, assigned: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label="Requester"
        roles={ groups }
        right="requester"
        defSelectValues={ users }
        defEmptyValue={ emptyUserValue }
        attribute={ attributes.requester }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, requester: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label="Company"
        roles={ groups }
        right="company"
        defSelectValues={ companies }
        defEmptyValue={ emptyCompanyValue }
        attribute={ attributes.company }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, company: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label="Task type"
        roles={ groups }
        right="taskType"
        canBeRequired
        defEmptyValue={ noSelect }
        defSelectValues={ taskTypes }
        attribute={ attributes.taskType }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, taskType: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label="Repeat"
        roles={ groups }
        right="repeat"
        noDef
        noRequired
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label="Starts at"
        roles={ groups }
        right="startsAt"
        canBeRequired
        attribute={ attributes.startsAt }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, startsAt: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label="Deadline"
        roles={ groups }
        right="deadline"
        canBeRequired
        attribute={ attributes.deadline }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, deadline: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label="Pausal"
        roles={ groups }
        right="pausal"
        canBeRequired
        defEmptyValue={ noSelect }
        defSelectValues={ booleanSelects }
        attribute={ attributes.pausal }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, pausal: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />

      <ProjectSingleAttribute
        label="Overtime"
        roles={ groups }
        right="overtime"
        canBeRequired
        defEmptyValue={ noSelect }
        defSelectValues={ booleanSelects }
        attribute={ attributes.overtime }
        onChangeAttribute={(value) => {
          setAttributes( { ...attributes, overtime: value } )
        } }
        onChangeRight={(roles) => setGroups(roles) }
        />
    </div>
  );
}