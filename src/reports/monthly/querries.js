import { gql } from '@apollo/client';;

export const GET_INVOICE_COMPANIES = gql`
query getInvoiceCompanies( $fromDate: String!, $toDate: String!, $statuses: [Int]!){
    getInvoiceCompanies(
      fromDate: $fromDate
      toDate: $toDate
      statuses: $statuses
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

export const GET_STATUSES = gql `
query {
  statuses {
    title
    id
    action
    order
    color
  }
}
`;

export const GET_LOCAL_CACHE = gql `
query getLocalCache {
  reportsYear @client
  reportsMonth @client
  reportsToDate @client
  reportsFromDate @client
  reportsChosenStatuses @client
}
`;
