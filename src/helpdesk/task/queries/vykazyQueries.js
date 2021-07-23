import {
  gql
} from '@apollo/client';

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
mutation addSubtask($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $discount: Float!, $type: Int!, $task: Int!, $assignedTo: Int!, $scheduled: ScheduledWorkInput ) {
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
mutation updateSubtask($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int, $scheduled: ScheduledWorkInput) {
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
mutation deleteSubtask($id: Int!) {
  deleteSubtask(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_WORKTRIP = gql `
mutation addWorkTrip($order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $discount: Float!, $type: Int!, $task: Int!, $assignedTo: Int!, $scheduled: ScheduledWorkInput) {
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
mutation updateWorkTrip($id: Int!, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int, $scheduled: ScheduledWorkInput) {
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