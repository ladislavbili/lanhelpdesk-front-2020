import {
  gql
} from '@apollo/client';

const subtaskData = `
  id
  title
  order
  done
  approved
  price
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
    fullName
    email
    company {
      id
    }
  }
  scheduled {
    from
    to
  }
`;

const tripData = `
  id
  order
  done
  approved
  price
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
    fullName
    email
    company {
      id
    }
  }
  scheduled {
    from
    to
  }
`;

const materialData = `
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
`;

export const ADD_SUBTASK = gql `
mutation addSubtask($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $discount: Float!, $task: Int!, $assignedTo: Int!, $scheduled: ScheduledWorkInput, $fromInvoice: Boolean ) {
  addSubtask(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    task: $task,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
    fromInvoice: $fromInvoice
  ){
    ${subtaskData}
  }
}
`;

export const UPDATE_SUBTASK = gql `
mutation updateSubtask($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $discount: Float, $assignedTo: Int, $scheduled: ScheduledWorkInput, $fromInvoice: Boolean) {
  updateSubtask(
    id: $id,
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
    fromInvoice: $fromInvoice
  ){
    ${subtaskData}
  }
}
`;

export const DELETE_SUBTASK = gql `
mutation deleteSubtask($id: Int!, $fromInvoice: Boolean) {
  deleteSubtask(
    id: $id,
    fromInvoice: $fromInvoice
  ){
    id
  }
}
`;

export const ADD_WORKTRIP = gql `
mutation addWorkTrip($order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $discount: Float!, $type: Int!, $task: Int!, $assignedTo: Int!, $scheduled: ScheduledWorkInput, $fromInvoice: Boolean) {
  addWorkTrip(
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    task: $task,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
    fromInvoice: $fromInvoice
  ){
    ${tripData}
  }
}
`;

export const UPDATE_WORKTRIP = gql `
mutation updateWorkTrip($id: Int!, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $discount: Float, $type: Int!, $assignedTo: Int, $scheduled: ScheduledWorkInput, $fromInvoice: Boolean) {
  updateWorkTrip(
    id: $id,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    type: $type,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
    fromInvoice: $fromInvoice
  ){
    ${tripData}
  }
}
`;

export const DELETE_WORKTRIP = gql `
mutation deleteWorkTrip($id: Int!, $fromInvoice: Boolean) {
  deleteWorkTrip(
    id: $id,
    fromInvoice: $fromInvoice
  ){
    id
  }
}
`;

export const ADD_MATERIAL = gql `
mutation addMaterial($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $margin: Float!, $price: Float!, $task: Int!, $fromInvoice: Boolean) {
  addMaterial(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    margin: $margin,
    price: $price,
    task: $task,
    fromInvoice: $fromInvoice
  ){
    ${materialData}
  }
}
`;

export const UPDATE_MATERIAL = gql `
mutation updateMaterial($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $margin: Float, $price: Float, $fromInvoice: Boolean) {
  updateMaterial(
    id: $id,
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    margin: $margin,
    price: $price,
    fromInvoice: $fromInvoice
  ){
    ${materialData}
  }
}
`;

export const DELETE_MATERIAL = gql `
mutation deleteMaterial($id: Int!, $fromInvoice: Boolean) {
  deleteMaterial(
    id: $id,
    fromInvoice: $fromInvoice
  ){
    id
  }
}
`;