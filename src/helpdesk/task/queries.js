import {
  gql
} from '@apollo/client';

import {
  groupRights
} from 'helpdesk/settings/projects/queries';

const responseTask = `
id
important
invoiced
invoicedDate
title
updatedAt
createdAt
closeDate
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
taskAttachments{
  id
  path
  filename
  size
  mimetype
}
assignedTo {
  id
  name
  surname
  email
}
company {
  id
  title
  dph
  usedTripPausal
  usedSubtaskPausal
  taskWorkPausal
  taskTripPausal
  monthly
  monthlyPausal
  pricelist {
    id
    title
    materialMargin
    prices {
      type
      price
      taskType {
        id
      }
      tripType {
        id
      }
    }
  }
}
createdBy {
  id
  name
  surname
}
deadline
description
milestone{
  id
  title
}
pendingDate
project{
  id
  title
  autoApproved
}
requester{
  id
  fullName
}
status {
  id
  title
  color
  action
}
tags {
  id
  title
  color
  order
}
taskType {
  id
  title
}
repeat {
  id
  repeatEvery
  repeatInterval
  startsAt
  active
}
scheduled{
  id
  user{
    id
    fullName
    email
  }
  from
  to
}
shortSubtasks{
  id
  title
  done
}
subtasks {
  invoicedData{
    price
    quantity
    type
    assignedTo
  }
  id
  title
  order
  done
  approved
  approvedBy{
    id
    fullName
  }
  quantity
  discount
  type {
    id
    title
  }
  assignedTo {
    id
    email
    company {
      id
    }
  }
}
workTrips {
  invoicedData{
    price
    quantity
    type
    assignedTo
  }
  id
  order
  done
  approved
  approvedBy{
    id
    fullName
  }
  quantity
  discount
  type {
    id
    title
  }
  assignedTo {
    id
    email
    company {
      id
    }
  }
}
materials {
  invoicedData{
    title
    quantity
    price
    totalPrice
    margin
  }
  id
  title
  order
  done
  approved
  approvedBy{
    id
    fullName
  }
  quantity
  margin
  price
}
customItems {
  invoicedData{
    title
    quantity
    price
    totalPrice
  }
  id
  title
  order
  done
  approved
  approvedBy{
    id
    fullName
  }
  quantity
  price
}
invoicedTasks {
  assignedTo {
    title
    UserId
  }
  tags {
    title
    color
    TagId
  }
  project
  requester
  taskType
  company
  milestone
}
`

const listTasks = `
tasks {
  id
  title
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
  }
  createdBy {
    id
    name
    surname
  }
  deadline
  description
  milestone{
    id
    title
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
deadline
project
milestone
taskType
overtime
pausal
tags
statistics
`

export const ADD_TASK = gql `
mutation addTask(
  $title: String!,
  $closeDate: String,
  $assignedTo: [Int]!,
  $company: Int!,
  $deadline: String,
  $description: String!,
  $milestone: Int,
  $overtime: Boolean!,
  $pausal: Boolean!,
  $pendingChangable: Boolean,
  $pendingDate: String,
  $project: Int!,
  $requester: Int,
  $status: Int!,
  $tags: [Int]!,
  $taskType: Int,
  $repeat: TaskRepeatInput,
  $subtasks: [SubtaskInput],
  $workTrips: [WorkTripInput],
  $materials: [MaterialInput],
  $customItems: [CustomItemInput],
  $shortSubtasks: [ShortSubtaskInput],
  $scheduled: [ScheduledTaskInput],
){
  addTask(
    title: $title,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    deadline: $deadline,
    description: $description,
    milestone: $milestone,
    overtime: $overtime,
    pausal: $pausal,
    pendingChangable: $pendingChangable,
    pendingDate: $pendingDate,
    project: $project,
    requester: $requester,
    status: $status,
    tags: $tags,
    taskType: $taskType,
    repeat: $repeat,
    subtasks: $subtasks,
    workTrips: $workTrips,
    materials: $materials,
    customItems: $customItems,
    shortSubtasks: $shortSubtasks,
    scheduled: $scheduled,
  ){
    id
    title
    repeat{
      repeatTemplate{
        id
      }
    }
  }
}
`;

export const ADD_USER_TO_PROJECT = gql `
mutation addUserToProject(
  $userId: Int!,
  $projectId: Int!,
){
  addUserToProject(
    userId: $userId
    projectId: $projectId,
  ){
    id
  }
}
`;

export const GET_TASKS = gql `
query tasks(
  $projectId: Int
  $filter: FilterInput
  $sort: SortTasksInput
  $search: String
  $stringFilter: StringFilterInput
  $limit: Int
  $page: Int
){
  tasks (
    projectId: $projectId
    filter: $filter
    sort: $sort
    search: $search
    stringFilter: $stringFilter
    limit: $limit
    page: $page
  ){
    ${listTasks}
  }
}
`;

export const DELETE_TASK = gql `
mutation deleteTask($id: Int!) {
  deleteTask(
    id: $id,
  ){
    id
  }
}
`;

export const GET_TASK = gql `
query task($id: Int!){
  task(
    id: $id
  )  {
    ${responseTask}
  }
}
`;

export const UPDATE_TASK = gql `
mutation updateTask(
  $id: Int!,
  $important: Boolean,
  $title: String,
  $closeDate: String,
  $assignedTo: [Int],
  $company: Int,
  $deadline: String,
  $description: String,
  $milestone: Int,
  $overtime: Boolean,
  $pausal: Boolean,
  $pendingChangable: Boolean,
  $pendingDate: String,
  $project: Int,
  $requester: Int,
  $status: Int,
  $tags: [Int],
  $taskType: Int,
) {
  updateTask(
    id: $id,
    important: $important,
    title: $title,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    deadline: $deadline,
    description: $description,
    milestone: $milestone,
    overtime: $overtime,
    pausal: $pausal,
    pendingChangable: $pendingChangable,
    pendingDate: $pendingDate,
    project: $project,
    requester: $requester,
    status: $status,
    tags: $tags,
    taskType: $taskType,
  ){
    ${responseTask}
  }
}
`;

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    tasklistLayout
    taskLayout
    statuses {
      id
      title
      color
      action
    }
    company {
      id
      title
    }
    role {
      level
      accessRights {
        projects
        publicFilters
        users
        companies
        vykazy
      }
    }
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

export const ADD_OR_UPDATE_TASKLIST_COLUMNS_PREFERENCES = gql `
mutation addOrUpdateTasklistColumnPerference(
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
  $deadline: Boolean
  $project: Boolean
  $milestone: Boolean
  $taskType: Boolean
  $overtime: Boolean
  $pausal: Boolean
  $tags: Boolean
  $subtasksApproved: Boolean
  $subtasksPending: Boolean
  $tripsApproved: Boolean
  $tripsPending: Boolean
  $materialsApproved: Boolean
  $materialsPending: Boolean
  $itemsApproved: Boolean
  $itemsPending: Boolean
) {
  addOrUpdateTasklistColumnPerference(
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
    deadline: $deadline
    project: $project
    milestone: $milestone
    taskType: $taskType
    overtime: $overtime
    pausal: $pausal
    tags: $tags
    subtasksApproved: $subtasksApproved
    subtasksPending: $subtasksPending
    tripsApproved: $tripsApproved
    tripsPending: $tripsPending
    materialsApproved: $materialsApproved
    materialsPending: $materialsPending
    itemsApproved: $itemsApproved
    itemsPending: $itemsPending
  ){
    ${tasklistPreferenceBody}
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

//scheduled
export const GET_SCHEDULED_TASKS = gql `
query scheduledTasks(
  $projectId: Int
  $filter: FilterInput
  $from: String
  $to: String
  $userId: Int
){
  scheduledTasks(
    projectId: $projectId
    filter: $filter
    from: $from
    to: $to
    userId: $userId
  )  {
    id
    from
    to
    canEdit
    user {
      name
      surname
      fullName
    }
    task {
      id
      title
      status{
        id
        title
        color
      }
    }
  }
}
`;

export const ADD_SCHEDULED_TASK = gql `
mutation addScheduledTask($from: String!, $to: String!, $task: Int!, $UserId: Int!) {
  addScheduledTask(
    from: $from,
    to: $to,
    task: $task,
    UserId: $UserId
  ){
    id
    from
    to
    user{
      id
      fullName
      email
    }
  }
}
`;

export const DELETE_SCHEDULED_TASK = gql `
mutation deleteScheduledTask($id: Int!) {
  deleteScheduledTask(
    id: $id,
  ){
    id
  }
}
`;

//short subtasks
export const ADD_SHORT_SUBTASK = gql `
mutation addShortSubtask($title: String!, $done: Boolean!, $task: Int!) {
  addShortSubtask(
    title: $title,
    done: $done,
    task: $task
  ){
    id
    title
    done
  }
}
`;

export const UPDATE_SHORT_SUBTASK = gql `
mutation updateShortSubtask($id: Int!, $title: String, $done: Boolean) {
  updateShortSubtask(
    id: $id,
    title: $title,
    done: $done,
  ){
    id
    title
    done
  }
}
`;

export const DELETE_SHORT_SUBTASK = gql `
mutation deleteShortSubtask($id: Int!) {
  deleteShortSubtask(
    id: $id,
  ){
    id
  }
}
`;


//table
export const ADD_SUBTASK = gql `
mutation addSubtask($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $discount: Float!, $type: Int!, $task: Int!, $assignedTo: Int!) {
  addSubtask(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    task: $task,
    assignedTo: $assignedTo,
  ){
    id
    title
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    discount
    type {
      id
      title
    }
    assignedTo {
      id
      email
      company {
        id
      }
    }
  }
}
`;

export const UPDATE_SUBTASK = gql `
mutation updateSubtask($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int) {
  updateSubtask(
    id: $id,
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    assignedTo: $assignedTo,
  ){
    id
    title
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    discount
    type {
      id
      title
    }
    assignedTo {
      id
      email
      company {
        id
      }
    }
  }
}
`;

export const DELETE_SUBTASK = gql `
mutation deleteSubtask($id: Int!) {
  deleteSubtask(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_WORKTRIP = gql `
mutation addWorkTrip($order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $discount: Float!, $type: Int!, $task: Int!, $assignedTo: Int!) {
  addWorkTrip(
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    task: $task,
    assignedTo: $assignedTo,
  ){
    id
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    discount
    type {
      id
      title
    }
    assignedTo {
      id
      email
      company {
        id
      }
    }
  }
}
`;

export const UPDATE_WORKTRIP = gql `
mutation updateWorkTrip($id: Int!, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int) {
  updateWorkTrip(
    id: $id,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    assignedTo: $assignedTo,
  ){
    id
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    discount
    type {
      id
      title
    }
    assignedTo {
      id
      email
      company {
        id
      }
    }
  }
}
`;

export const DELETE_WORKTRIP = gql `
mutation deleteWorkTrip($id: Int!) {
  deleteWorkTrip(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_MATERIAL = gql `
mutation addMaterial($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $margin: Float!, $price: Float!, $task: Int!) {
  addMaterial(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    margin: $margin,
    price: $price,
    task: $task,
  ){
    id
    title
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    margin
    price
  }
}
`;

export const UPDATE_MATERIAL = gql `
mutation updateMaterial($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $margin: Float, $price: Float) {
  updateMaterial(
    id: $id,
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    margin: $margin,
    price: $price,
  ){
    id
    title
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    margin
    price
  }
}
`;

export const DELETE_MATERIAL = gql `
mutation deleteMaterial($id: Int!) {
  deleteMaterial(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_CUSTOM_ITEM = gql `
mutation addCustomItem($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $price: Float!, $task: Int!) {
  addCustomItem(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    price: $price,
    task: $task,
  ){
    id
    title
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    price
  }
}
`;

export const UPDATE_CUSTOM_ITEM = gql `
mutation updateCustomItem($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $price: Float) {
  updateCustomItem(
    id: $id,
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    price: $price,
  ){
    id
    title
    order
    done
    approved
    approvedBy{
      id
      fullName
    }
    quantity
    price
  }
}
`;

export const DELETE_CUSTOM_ITEM = gql `
mutation deleteCustomItem($id: Int!) {
  deleteCustomItem(
    id: $id,
  ){
    id
  }
}
`;

export const DELETE_TASK_ATTACHMENT = gql `
mutation deleteTaskAttachment($id: Int!) {
  deleteTaskAttachment(
    id: $id,
  ){
    id
  }
}
`;

export const UPDATE_INVOICED_TASK = gql `
mutation updateInvoicedTask($id: Int!, $taskChanges: TaskChangeInput, $stmcChanges: SMTCChangesInput, $cancelInvoiced: Boolean!) {
  updateInvoicedTask(
    id: $id,
    cancelInvoiced: $cancelInvoiced,
    taskChanges: $taskChanges,
    stmcChanges: $stmcChanges,
  ){
    ${responseTask}
  }
}
`;