import {
  gql
} from "@apollo/client";

export const GET_INVOICE_USERS = gql `
query getInvoiceUsers(
  $fromDate: String!,
  $toDate: String!,
){
  getInvoiceUsers(
    fromDate: $fromDate
    toDate: $toDate
    statuses: $statuses
  ) {
    user{
      id
      email
      fullName
    }
    subtasksHours
    tripsHours
  }
}
`;

export const GET_USER_INVOICE = gql `
query getUserInvoice(
  $fromDate: String!
  $toDate: String!
  $userId: Int!
){
  getUserInvoice(
    fromDate: $fromDate
    toDate: $toDate
    statuses: $statuses
    userId: $userId
  ) {
    fromDate
    toDate
    user{
      id
      email
      fullName
    }
    subtaskTasks{
      task {
        id
        title
        requester{
          fullName
        }
        assignedTo{
          id
          fullName
        }
        status{
          title
          color
        }
        closeDate
      }
      subtasks {
        id
        subtask {
          title
        }
        type
        quantity
      }
    }
    tripTasks{
      task {
        id
        title
        requester{
          fullName
        }
        assignedTo{
          id
          fullName
        }
        status{
          title
          color
        }
        closeDate
      }
      trips {
        id
        quantity
        type
      }
    }
    subtaskTotals{
      type
      quantity
    }
    tripTotals{
      type
      quantity
    }
    subtaskCounts{
      total
      afterHours
      afterHoursTaskIds
    }
    tripCounts{
      total
      afterHours
      afterHoursTaskIds
    }
    typeTotals{
      subtaskPausal
      subtaskOverPausal
      subtaskProject

      tripPausal
      tripOverPausal
      tripProject
    }
  }
}
`;