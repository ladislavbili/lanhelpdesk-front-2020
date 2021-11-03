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

export const ALL_INVOICE_COMPANIES = gql `
query allInvoiceCompanies {
  allInvoiceCompanies {
    title
    id
  }
}
`;

export const COMPANIES_WITH_INVOICE = gql `
query companiesWithInvoice($fromDate: String!, $toDate: String! ) {
  companiesWithInvoice (
    fromDate: $fromDate
    toDate: $toDate
  ) {
    title
    id
  }
}
`;

export const INVOICE_DATES_OF_COMPANY = gql `
query invoiceDatesOfCompany( $companyId: Int! ) {
  invoiceDatesOfCompany (
    companyId: $companyId
  ) {
    month
    year
  }
}
`;