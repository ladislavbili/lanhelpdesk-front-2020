import {
  gql
} from "@apollo/client";

export const COMPANIES_WITH_INVOICES = gql `
query companiesWithInvoices{
  companiesWithInvoices{
    id
    title
  }
}
`;

export const GET_COMPANY_INVOICES = gql `
query getCompanyInvoices(
  $id: Int!,
){
    getCompanyInvoices(
      id: $id
    ) {
    id
    createdAt
    title
    fromDate
    toDate
  }
}
`;

export const GET_TASK_INVOICE = gql `
query getTaskInvoice(
  $id: Int!,
){
  getTaskInvoice(
    id: $id
  ) {
    id
    title
    fromDate
    toDate
    companyRentsCounts {
      totalWithoutDPH
      totalWithDPH
    }
    pausalCounts {
      subtasks
      subtasksAfterHours
      subtasksAfterHoursTaskIds
      subtasksAfterHoursPrice
      trips
      tripsAfterHours
      tripsAfterHoursTaskIds
      tripsAfterHoursPrice
    }
    overPausalCounts {
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
    projectCounts {
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
    totalMaterialAndCustomItemPriceWithoutDPH
    totalMaterialAndCustomItemPriceWithDPH
    invoicedCompany {
      title
      companyRents {
        id
        title
        quantity
        cost
        price
        total
      }
    }
    materialTasks {
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
      materials {
        material {
          id
        }
        title
        quantity
        price
        totalPrice
        margin
      }
      customItems {
        customItem {
          id
        }
        title
        quantity
        price
        totalPrice
      }
    }
    pausalTasks {
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
        subtask {
          id
          title
        }
        price
        quantity
        type
        assignedTo
      }
      trips {
        trip {
          id
          type {
            title
          }
        }
        price
        quantity
        type
        assignedTo
      }
    }
    overPausalTasks {
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
        subtask {
          id
          title
        }
        price
        quantity
        type
        assignedTo
      }
      trips {
        trip {
          id
          type {
            title
          }
        }
        price
        quantity
        type
        assignedTo
      }
    }
    projectTasks {
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
        subtask {
          id
          title
        }
        price
        quantity
        type
        assignedTo
      }
      trips {
        trip {
          id
          type {
            title
          }
        }
        price
        quantity
        type
        assignedTo
      }
    }
  }
}
`;