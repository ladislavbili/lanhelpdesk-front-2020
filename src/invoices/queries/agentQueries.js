import {
  gql
} from "@apollo/client";

export const INVOICE_AGENTS = gql `
query invoiceAgents($fromDate: String!, $toDate: String!, $invoiced: Boolean!, $statusActions: [StatusAllowedType]! ) {
  invoiceAgents (
    fromDate: $fromDate
    toDate: $toDate
    invoiced: $invoiced
    statusActions: $statusActions
  ) {
    user{
      id
      name
      surname
      fullName
      email
    }
    works
    trips
  }
}
`;

export const AGENT_INVOICE = gql `
query agentInvoice($fromDate: String!, $toDate: String!, $invoiced: Boolean!, $statusActions: [StatusAllowedType]!, $userId: Int! ) {
  agentInvoice(
    fromDate: $fromDate
    toDate: $toDate
    invoiced: $invoiced
    statusActions: $statusActions
    userId: $userId
  ) {
    workTasks {
      taskId
      title
      status{
        id
        title
        color
      }
      company{
        id
        title
      }
      requester {
        id
        email
        fullName
      }
      assignedTo {
        id
        email
        fullName
      }
      closeDate
      taskType {
        id
        title
      }
      subtasks {
        title
        quantity
      }
    }
    tripTasks {
      taskId
      title
      status{
        id
        title
        color
      }
      company{
        id
        title
      }
      requester {
        id
        email
        fullName
      }
      assignedTo {
        id
        email
        fullName
      }
      closeDate
      taskType {
        id
        title
      }
      workTrips {
        type {
          id
          title
        }
        quantity
      }
    }
    taskTypeTotals {
      id
      title
      quantity
    }
    tripTypeTotals {
      id
      title
      quantity
    }
    totals {
      workHours
      workOvertime
      workOvertimeTasks
      tripHours
      tripOvertime
      tripOvertimeTasks
      pausalWorkHours
      overPausalWorkHours
      projectWorkHours
      pausalTripHours
      overPausalTripHours
      projectTripHours
    }
  }
}
`;