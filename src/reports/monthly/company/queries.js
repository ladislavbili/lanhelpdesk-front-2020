import {
  gql
} from "@apollo/client";

export const GET_INVOICE_COMPANIES = gql `
query getInvoiceCompanies(
  $fromDate: String!,
  $toDate: String!,
  $type: ReportTypeAllowed!
){
  getInvoiceCompanies(
    fromDate: $fromDate
    toDate: $toDate
    type: $type
  ) {
    company {
      id
      title
    }
    subtasksHours
    tripsHours
    materialsQuantity
    customItemsQuantity
    rentedItemsQuantity
  }
}
`;

export const GET_COMPANY_INVOICE_DATA = gql `
query getCompanyInvoiceData(
  $fromDate: String!,
  $toDate: String!,
  $companyId: Int!,
  $type: ReportTypeAllowed!
){
  getCompanyInvoiceData(
    fromDate: $fromDate
    toDate: $toDate
    companyId: $companyId
    type: $type
  ) {
    company{
      companyRents {
        id
        title
        quantity
        cost
        price
        total
      }
    }
    companyRentsCounts {
      totalWithoutDPH
      totalWithDPH
    }
    pausalTasks{
      task {
        id
        title
        overtime
        assignedTo {
          email
          id
        }
        requester {
          email
          id
        }
        status {
          id
          title
          action
          color
        }
        closeDate
        company {
          title
        }
      }
      subtasks {
        id
        subtaskID
        title
        quantity
        price
        type {
          title
        }
      }
      trips {
        id
        quantity
        price
        type {
          title
        }
      }
    }
    pausalCounts{
      subtasks
      subtasksAfterHours
      subtasksAfterHoursTaskIds
      subtasksAfterHoursPrice
      trips
      tripsAfterHours
      tripsAfterHoursTaskIds
      tripsAfterHoursPrice
    }
    overPausalCounts{
      subtasks
      subtasksAfterHours
      subtasksAfterHoursTaskIds
      subtasksAfterHoursPrice
      subtasksTotalPriceWithoutDPH
      subtasksTotalPriceWithDPH
      trips
      tripsAfterHours
      tripsAfterHoursTaskIds
      tripsAfterHoursPrice
      tripsTotalPriceWithoutDPH
      tripsTotalPriceWithDPH
    }
    overPausalTasks{
      task {
        id
        title
        overtime
        assignedTo {
          id
          email
        }
        requester {
          email
          id
        }
        status {
          id
          title
          action
          color
        }
        closeDate
        company {
          title
        }
      }
      subtasks {
        id
        title
        quantity
        discount
        price
        price
        type {
          title
        }
      }
      trips {
        id
        quantity
        discount
        price
        type {
          title
        }
      }
    }
    projectTasks{
      task {
        id
        title
        overtime
        assignedTo {
          id
          email
        }
        requester {
          email
          id
        }
        status {
          id
          title
          action
          color
        }
        closeDate
        company {
          title
        }
      }
      subtasks {
        id
        title
        quantity
        discount
        price
        price
        type {
          title
        }
      }
      trips {
        id
        quantity
        discount
        price
        type {
          title
        }
      }
    }
    projectCounts{
      subtasks
      subtasksAfterHours
      subtasksAfterHoursTaskIds
      subtasksAfterHoursPrice
      subtasksTotalPriceWithoutDPH
      subtasksTotalPriceWithDPH
      trips
      tripsAfterHours
      tripsAfterHoursTaskIds
      tripsAfterHoursPrice
      tripsTotalPriceWithoutDPH
      tripsTotalPriceWithDPH
    }
    materialTasks{
      task {
        id
        title
        status{
          id
          title
          color
        }
        statusChange
        assignedTo{
          id
          email
        }
        requester{
          id
          email
        }
      }
      materials {
        id
        title
        quantity
        price
        totalPrice
      }
      customItems {
        id
        title
        quantity
        price
        totalPrice
      }
    }
    totalMaterialAndCustomItemPriceWithoutDPH
    totalMaterialAndCustomItemPriceWithDPH
  }
}
`;

export const CREATE_TASK_INVOICE = gql `
mutation createTaskInvoice(
  $fromDate: String!,
  $toDate: String!,
  $companyId: Int!,
  $title: String!
){
  createTaskInvoice(
    fromDate: $fromDate,
    toDate: $toDate,
    companyId: $companyId,
    title: $title
  ){
    title
  }
}
`;