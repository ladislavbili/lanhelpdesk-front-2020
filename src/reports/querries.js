import gql from "graphql-tag";

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


export const GET_MY_SETTINGS = gql`
query {
  getMyData{
    role {
      accessRights {
        viewVykaz
        viewRozpocet
        publicFilters
        users
        companies
        pausals
        projects
        statuses
        units
        prices
        suppliers
        tags
        invoices
        roles
        taskTypes
        tripTypes
        imaps
        smtps
      }
    }
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
