import {
  gql
} from '@apollo/client';

const responseTask = `
id
important
invoiced
invoicedDate
title
ganttOrder
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
startsAt
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
repeatTime{
  triggersAt
}
shortSubtasks{
  id
  title
  done
}
subtasks {
  scheduled {
    from
    to
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
  price
}
workTrips {
  scheduled {
    from
    to
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
  price
}
materials {
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
`

export const ADD_TASK = gql `
mutation addTask(
  $important: Boolean,
  $title: String!,
  $ganttOrder: Int,
  $closeDate: String,
  $assignedTo: [Int]!,
  $company: Int!,
  $startsAt: String,
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
  $shortSubtasks: [ShortSubtaskInput],
){
  addTask(
    important: $important,
    title: $title,
    ganttOrder: $ganttOrder,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    startsAt: $startsAt,
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
    shortSubtasks: $shortSubtasks,
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
  $ganttOrder: Int,
  $closeDate: String,
  $assignedTo: [Int],
  $company: Int,
  $startsAt: String,
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
    ganttOrder: $ganttOrder,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    startsAt: $startsAt,
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

export const SET_AFTER_TASK_CREATE = gql `
mutation setAfterTaskCreate($afterTaskCreate: Int!) {
  setAfterTaskCreate(
    afterTaskCreate: $afterTaskCreate
  ){
    afterTaskCreate
  }
}
`;

export const ADD_TASK_SUBSCRIPTION = gql `
subscription taskAddSubscription {
  taskAddSubscription
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

export const TASK_DELETE_SUBSCRIPTION = gql `
  subscription taskDeleteSubscription( $taskId: Int! ) {
    taskDeleteSubscription( taskId: $taskId )
  }
`;