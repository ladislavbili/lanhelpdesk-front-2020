import {
  gql
} from '@apollo/client';


import {
  groupRights
} from 'helpdesk/settings/projects/queries';

const listTasks = `
tasks {
  id
  title
  ganttOrder
  invoiced
  updatedAt
  createdAt
  important
  closeDate
  overtime
  pausal
  pendingChangable
  statusChange
  rights{
    ${groupRights}
  }
  metadata{
    subtasksApproved
    subtasksPending
    tripsApproved
    tripsPending
    materialsApproved
    materialsPending
    itemsApproved
    itemsPending
  }
  assignedTo {
    id
    fullName
    email
  }
  company {
    id
    title
    dph
  }
  createdBy {
    id
    name
    surname
  }
  startsAt
  deadline
  description
  milestone{
    id
    title
    order
    startsAt
    endsAt
  }
  subtasks{
    id
    done
    title
    quantity
    assignedTo{
      fullName
    }
  }
  pendingDate
  project{
    id
    title
    autoApproved
  }
  requester{
    id
    name
    surname
    fullName
    email
  }
  status {
    id
    title
    order
    color
    action
  }
  tags {
    id
    color
    title
  }
  taskType {
    id
    title
  }
  subtasksQuantity
  approvedSubtasksQuantity
  pendingSubtasksQuantity
  workTripsQuantity
  materialsPrice
  approvedMaterialsPrice
  pendingMaterialsPrice
}
totals{
  approvedSubtasks
  pendingSubtasks
  approvedMaterials
  pendingMaterials
}
count
execTime
secondaryTimes {
  time
  source
}
`

const tasklistPreferenceBody = `
taskId
status
important
invoiced
title
requester
company
assignedTo
createdAtV
startsAt
deadline
project
milestone
taskType
overtime
pausal
tags
statistics
works
trips
materialsWithoutDPH
materialsWithDPH
`;

const tasklistGanttPreferenceBody = `
taskId
status
important
invoiced
requester
company
assignedTo
createdAtV
taskType
overtime
pausal
tags
works
trips
materialsWithoutDPH
materialsWithDPH
subtasks
subtaskAssigned
subtasksHours
`;

export const GET_TASKS = gql `
query tasks(
  $projectId: Int
  $milestoneId: Int
  $filter: FilterInput
  $sort: SortTasksInput
  $milestoneSort: Boolean
  $search: String
  $stringFilter: StringFilterInput
  $limit: Int
  $page: Int
  $statuses: [Int]
){
  tasks (
    milestoneId: $milestoneId
    projectId: $projectId
    filter: $filter
    sort: $sort
    milestoneSort: $milestoneSort
    search: $search
    stringFilter: $stringFilter
    limit: $limit
    page: $page
    statuses: $statuses
  ){
    ${listTasks}
  }
}
`;

export const GET_TASKLIST_COLUMNS_PREFERENCES = gql `
query tasklistColumnPreference(
  $projectId: Int
){
  tasklistColumnPreference(
    projectId: $projectId
  )  {
    ${tasklistPreferenceBody}
  }
}
`;

export const GET_TASKLIST_GANTT_COLUMNS_PREFERENCES = gql `
query tasklistGanttColumnPreference(
  $projectId: Int
){
  tasklistGanttColumnPreference(
    projectId: $projectId
  )  {
    ${tasklistGanttPreferenceBody}
  }
}
`;

export const ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES = gql `
mutation addOrUpdateTasklistColumnPreference(
  $projectId: Int
  $taskId: Boolean
  $status: Boolean
  $important: Boolean
  $invoiced: Boolean
  $title: Boolean
  $requester: Boolean
  $company: Boolean
  $assignedTo: Boolean
  $createdAtV: Boolean
  $startsAt: Boolean
  $deadline: Boolean
  $project: Boolean
  $milestone: Boolean
  $taskType: Boolean
  $overtime: Boolean
  $pausal: Boolean
  $tags: Boolean
  $works: Boolean
  $trips: Boolean
  $materialsWithoutDPH: Boolean
  $materialsWithDPH: Boolean
) {
  addOrUpdateTasklistColumnPreference(
    projectId: $projectId
    taskId: $taskId
    status: $status
    important: $important
    invoiced: $invoiced
    title: $title
    requester: $requester
    company: $company
    assignedTo: $assignedTo
    createdAtV: $createdAtV
    startsAt: $startsAt
    deadline: $deadline
    project: $project
    milestone: $milestone
    taskType: $taskType
    overtime: $overtime
    pausal: $pausal
    tags: $tags
    works: $works
    trips: $trips
    materialsWithoutDPH: $materialsWithoutDPH
    materialsWithDPH: $materialsWithDPH
  ){
    ${tasklistPreferenceBody}
  }
}
`;

export const ADD_OR_UPDATE_TASKLIST_GANTT_COLUMNS_PREFERENCES = gql `
mutation addOrUpdateTasklistGanttColumnPreference(
  $projectId: Int
  $taskId: Boolean
  $status: Boolean
  $important: Boolean
  $invoiced: Boolean
  $requester: Boolean
  $company: Boolean
  $assignedTo: Boolean
  $createdAtV: Boolean
  $taskType: Boolean
  $overtime: Boolean
  $pausal: Boolean
  $tags: Boolean
  $works: Boolean
  $trips: Boolean
  $materialsWithoutDPH: Boolean
  $materialsWithDPH: Boolean
  $subtasks: Boolean
$subtaskAssigned: Boolean
$subtasksHours: Boolean
) {
  addOrUpdateTasklistGanttColumnPreference(
    projectId: $projectId
    taskId: $taskId
    status: $status
    important: $important
    invoiced: $invoiced
    requester: $requester
    company: $company
    assignedTo: $assignedTo
    createdAtV: $createdAtV
    taskType: $taskType
    overtime: $overtime
    pausal: $pausal
    tags: $tags
    works: $works
    trips: $trips
    materialsWithoutDPH: $materialsWithoutDPH
    materialsWithDPH: $materialsWithDPH
    subtasks: $subtasks
    subtaskAssigned: $subtaskAssigned
    subtasksHours: $subtasksHours
  ){
    ${tasklistGanttPreferenceBody}
  }
}
`;

export const SET_TASKLIST_SORT = gql `
mutation setMySort($sort: String!, $asc: Boolean!, $layout: Int!) {
  setTasklistSort(
    sort: $sort
    asc: $asc
    layout: $layout
  ){
    id
  }
}
`;

export const SET_TASK_LAYOUT = gql `
mutation setTaskLayout($taskLayout: Int!) {
  setTaskLayout(
    taskLayout: $taskLayout
  ){
    taskLayout
  }
}
`;

const scheduledWorkBody = `
id
from
to
canEdit
task{
  id
  title
  status{
    id
    title
    color
  }
}
user {
  name
  surname
  fullName
}
workTrip{
  id
  done
  type{
    title
  }
}
subtask{
  id
  done
  title
}
`;

export const GET_SCHEDULED_WORKS = gql `
query scheduledWorks (
  $projectId: Int
  $filter: FilterInput
  $from: String
  $to: String
  $userId: Int
){
  scheduledWorks (
    projectId: $projectId
    filter: $filter
    from: $from
    to: $to
    userId: $userId
  ){
    ${scheduledWorkBody}
  }
}
`;

export const ADD_SCHEDULED_WORK = gql `
mutation addScheduledWork(
  $taskId: Int!
  $userId: Int!
  $from: String!
  $to: String!
) {
  addScheduledWork(
    taskId: $taskId
    userId: $userId
    from: $from
    to: $to
  ){
    ${scheduledWorkBody}
  }
}
`;

export const UPDATE_SCHEDULED_WORK = gql `
mutation updateScheduledWork(
  $id: Int!
  $from: String!
  $to: String!
) {
  updateScheduledWork(
    id: $id
    from: $from
    to: $to
  ){
    ${scheduledWorkBody}
  }
}
`;