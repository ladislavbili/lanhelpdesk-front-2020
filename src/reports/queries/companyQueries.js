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