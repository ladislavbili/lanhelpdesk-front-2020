import {
  gql
} from '@apollo/client';
import {
  groupRights
} from 'helpdesk/settings/projects/queries';

const repeatData = `
id
repeatEvery
repeatInterval
startsAt
active
repeatTemplate{
  id
  important
  title
  updatedAt
  createdAt
  closeDate
  repeatTemplateAttachments{
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
    fullName
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
  }
  requester{
    id
    email
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
  }
  taskType {
    id
    title
  }
  shortSubtasks{
    id
    title
    done
  }
  subtasks {
    id
    title
    order
    done
    approved
    scheduled {
      from
      to
    }
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
    id
    order
    done
    approved
    approvedBy{
      id
      fullName
    }

    scheduled {
      from
      to
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
`

export const GET_REPEAT = gql `
query repeat($id: Int){
  repeat (
    id: $id,
  ){
    ${repeatData}
  }
}
`;

export const GET_REPEATS = gql `
query (
  $projectId: Int
    $milestoneId: Int
) {
  repeats(
    projectId: $projectId
      milestoneId: $milestoneId
  ) {
    id
    repeatEvery
    repeatInterval
    startsAt
    active
    repeatTemplate{
      id
      title
      updatedAt
      createdAt
      important
      closeDate
      overtime
      pausal
      pendingChangable
      statusChange
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
        right{
          ${groupRights}
        }
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
        color
        action
      }
      tags {
        id
        title
      }
      taskType {
        id
        title
      }
    }
  }
}
`;

export const ADD_REPEAT = gql `
mutation addRepeat(
  $taskId: Int
  $repeatEvery: Int!
  $repeatInterval: EnumRepeatInterval!
  $startsAt: String!
  $active: Boolean!
  $repeatTemplate: RepeatTemplateAddInput!
){
  addRepeat(
    taskId: $taskId
    repeatEvery: $repeatEvery
    repeatInterval: $repeatInterval
    startsAt: $startsAt
    active: $active
    repeatTemplate: $repeatTemplate
  ){
    id
    repeatEvery
    repeatInterval
    startsAt
    active
  }
}
`;

export const UPDATE_REPEAT = gql `
mutation updateRepeat(
  $id: Int!
  $repeatEvery: Int
  $repeatInterval: EnumRepeatInterval
  $startsAt: String
  $active: Boolean
  $repeatTemplate: RepeatTemplateUpdateInput
){
  updateRepeat(
    id: $id
    repeatEvery: $repeatEvery
    repeatInterval: $repeatInterval
    startsAt: $startsAt
    active: $active
    repeatTemplate: $repeatTemplate
  ){
    ${repeatData}
  }
}
`;

export const DELETE_REPEAT = gql `
mutation deleteRepeat($id: Int!) {
  deleteRepeat(
    id: $id,
  ){
    id
  }
}
`;

export const REPEATS_SUBSCRIPTION = gql `
subscription repeatsSubscription {
  repeatsSubscription
}
`;


//short subtasks
export const ADD_SHORT_SUBTASK = gql `
mutation addRepeatTemplateShortSubtask($title: String!, $done: Boolean!, $repeatTemplate: Int!) {
  addRepeatTemplateShortSubtask(
    title: $title,
    done: $done,
    repeatTemplate: $repeatTemplate
  ){
    id
    title
    done
  }
}
`;

export const UPDATE_SHORT_SUBTASK = gql `
mutation updateRepeatTemplateShortSubtask($id: Int!, $title: String, $done: Boolean) {
  updateRepeatTemplateShortSubtask(
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
mutation deleteRepeatTemplateShortSubtask($id: Int!) {
  deleteRepeatTemplateShortSubtask(
    id: $id,
  ){
    id
  }
}
`;


//table
export const ADD_SUBTASK = gql `
mutation addRepeatTemplateSubtask($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $discount: Float!, $type: Int!, $repeatTemplate: Int!, $assignedTo: Int!, $scheduled: ScheduledWorkInput) {
  addRepeatTemplateSubtask(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    repeatTemplate: $repeatTemplate,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
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
    scheduled {
      from
      to
    }
  }
}
`;

export const UPDATE_SUBTASK = gql `
mutation updateRepeatTemplateSubtask($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int, $scheduled: ScheduledWorkInput) {
  updateRepeatTemplateSubtask(
    id: $id,
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
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
    scheduled {
      from
      to
    }
  }
}
`;

export const DELETE_SUBTASK = gql `
mutation deleteRepeatTemplateSubtask($id: Int!) {
  deleteRepeatTemplateSubtask(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_WORKTRIP = gql `
mutation addWorkRepeatTemplateTrip($order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $discount: Float!, $type: Int!, $repeatTemplate: Int!, $assignedTo: Int!, $scheduled: ScheduledWorkInput) {
  addRepeatTemplateWorkTrip(
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    repeatTemplate: $repeatTemplate,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
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
    scheduled {
      from
      to
    }
  }
}
`;

export const UPDATE_WORKTRIP = gql `
mutation updateRepeatTemplateWorkTrip($id: Int!, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int, $scheduled: ScheduledWorkInput) {
  updateRepeatTemplateWorkTrip(
    id: $id,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
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
    scheduled {
      from
      to
    }
  }
}
`;

export const DELETE_WORKTRIP = gql `
mutation deleteRepeatTemplateWorkTrip($id: Int!) {
  deleteRepeatTemplateWorkTrip(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_MATERIAL = gql `
mutation addRepeatTemplateMaterial($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $margin: Float!, $price: Float!, $repeatTemplate: Int!) {
  addRepeatTemplateMaterial(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    margin: $margin,
    price: $price,
    repeatTemplate: $repeatTemplate,
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
mutation updateRepeatTemplateMaterial($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $margin: Float, $price: Float) {
  updateRepeatTemplateMaterial(
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
mutation deleteRepeatTemplateMaterial($id: Int!) {
  deleteRepeatTemplateMaterial(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_CUSTOM_ITEM = gql `
mutation addRepeatTemplateCustomItem($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $price: Float!, $repeatTemplate: Int!) {
  addRepeatTemplateCustomItem(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    price: $price,
    repeatTemplate: $repeatTemplate,
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
mutation updateRepeatTemplateCustomItem($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $price: Float) {
  updateRepeatTemplateCustomItem(
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
mutation deleteRepeatTemplateCustomItem($id: Int!) {
  deleteRepeatTemplateCustomItem(
    id: $id,
  ){
    id
  }
}
`;

export const DELETE_REPEAT_TEMPLATE_ATTACHMENT = gql `
mutation deleteRepeatTemplateAttachment($id: Int!) {
  deleteRepeatTemplateTaskAttachment(
    id: $id,
  ){
    id
  }
}
`;