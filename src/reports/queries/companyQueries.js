import {
  gql
} from "@apollo/client";

export const INVOICE_COMPANIES = gql `
query invoiceCompanies($fromDate: String!, $toDate: String! ) {
  invoiceCompanies (
    fromDate: $fromDate
    toDate: $toDate
  ) {
    company {
      id
      title
      dph
      companyRents{
        id
        title
        quantity
        cost
        price
        total
      }
    }
    works
    trips
    materials
  }
}
`;

export const COMPANY_INVOICE = gql `
query companyInvoice($fromDate: String!, $toDate: String!, $companyId: Int! ) {
  companyInvoice(
    fromDate: $fromDate
    toDate: $toDate
    companyId: $companyId
  ) {
    pausalTasks {
      id
      title
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
      taskType{
        id
        title
      }
      subtasks {
        id
        title
        quantity
      }
      workTrips {
        id
        type {
          id
          title
        }
        quantity
      }
    }
    overPausalTasks {
      id
      title
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
      taskType{
        id
        title
      }
      subtasks {
        id
        title
        quantity
        price
        total
      }
      workTrips {
        id
        type {
          id
          title
        }
        quantity
        price
        total
      }
    }
    projectTasks {
      id
      title
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
      taskType{
        id
        title
      }
      subtasks {
        id
        title
        quantity
        price
        total
      }
      workTrips {
        id
        type {
          id
          title
        }
        quantity
        price
        total
      }
    }
    materialTasks {
      id
      title
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
      materials{
        id
        title
        quantity
        price
        total
      }
    }
    pausalTotals {
      workHours
      workOvertime
      workOvertimeTasks
      workExtraPrice
      tripHours
      tripOvertime
      tripOvertimeTasks
      tripExtraPrice
    }
    overPausalTotals {
      workHours
      workOvertime
      workOvertimeTasks
      workExtraPrice
      workTotalPrice
      workTotalPriceWithDPH
      tripHours
      tripOvertime
      tripOvertimeTasks
      tripExtraPrice
      tripTotalPrice
      tripTotalPriceWithDPH
    }
    projectTotals {
      workHours
      workOvertime
      workOvertimeTasks
      workExtraPrice
      workTotalPrice
      workTotalPriceWithDPH
      tripHours
      tripOvertime
      tripOvertimeTasks
      tripExtraPrice
      tripTotalPrice
      tripTotalPriceWithDPH
    }
    materialTotals {
      price
      priceWithDPH
    }
  }
}
`;