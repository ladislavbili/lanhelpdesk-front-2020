import {
  gql
} from '@apollo/client';

const companyData = `
id
title
def
dph
ico
dic
ic_dph
country
city
street
zip
email
phone
description
pricelist {
  id
  title
  order
  afterHours
  def
  materialMargin
  materialMarginExtra
  prices {
    id
    type
    price
    taskType {
      id
      title
    }
    tripType {
      id
      title
    }
  }
}
monthly
monthlyPausal
taskWorkPausal
taskTripPausal
companyRents {
  id
  title
  quantity
  cost
  price
}
`;

export const GET_COMPANIES = gql `
query {
  companies {
    title
    id
    monthly
  }
}
`;

export const GET_BASIC_COMPANIES = gql `
query {
  basicCompanies {
    id
    title
    dph
    monthly
    pricelist {
      id
      title
      materialMargin
      prices {
        type
        price
        taskType {
          id
        }
        tripType {
          id
        }
      }
    }
  }
}
`;

export const ADD_COMPANY = gql `
mutation addCompany($title: String!, $dph: Int!, $ico: String!, $dic: String!, $ic_dph: String!, $country: String!, $city: String!, $street: String!, $zip: String!, $email: String, $phone: String!, $description: String!, $pricelistId: Int!, $monthly: Boolean!, $monthlyPausal: Float!, $taskWorkPausal: Float!, $taskTripPausal: Float!, $rents: [CompanyRentCreateInput]!) {
  addCompany(
    title: $title,
    dph: $dph,
    ico: $ico,
    dic: $dic,
    ic_dph: $ic_dph,
    country: $country,
    city: $city,
    street: $street,
    zip: $zip,
    email: $email,
    phone: $phone,
    description: $description,
    pricelistId: $pricelistId,
    monthly: $monthly,
    monthlyPausal: $monthlyPausal,
    taskWorkPausal: $taskWorkPausal,
    taskTripPausal: $taskTripPausal,
    rents: $rents,
  ){
    ${companyData}
  }
}
`;

export const GET_COMPANY = gql `
query company($id: Int!) {
  company (
    id: $id
  ) {
    ${companyData}
  }
}
`;

export const UPDATE_COMPANY = gql `
mutation updateCompany($id: Int!, $title: String, $dph: Int, $ico: String, $dic: String, $ic_dph: String, $country: String, $city: String, $street: String, $zip: String, $email: String, $phone: String, $description: String, $pricelistId: Int!, $monthly: Boolean, $monthlyPausal: Float, $taskWorkPausal: Float, $taskTripPausal: Float, $rents: [CompanyRentUpdateInput]) {
  updateCompany(
    id: $id,
    title: $title,
    dph: $dph,
    ico: $ico,
    dic: $dic,
    ic_dph: $ic_dph,
    country: $country,
    city: $city,
    street: $street,
    zip: $zip,
    email: $email,
    phone: $phone,
    description: $description,
    pricelistId: $pricelistId,
    monthly: $monthly,
    monthlyPausal: $monthlyPausal,
    taskWorkPausal: $taskWorkPausal,
    taskTripPausal: $taskTripPausal,
    rents: $rents,
  ){
    id
    title
    monthlyPausal
    taskWorkPausal
    taskTripPausal
  }
}
`;

export const DELETE_COMPANY = gql `
mutation deleteCompany($id: Int!, $newId: Int!) {
  deleteCompany(
    id: $id,
    newId: $newId,
  ){
    id
  }
}
`;

export const GET_PAUSAL_COMPANY = gql `
query pausalCompany($id: Int!) {
  pausalCompany (
    id: $id
  ) {
    title
    pricelist {
      id
      title
      order
      afterHours
      def
      materialMargin
      materialMarginExtra
      prices {
        id
        type
        price
        taskType {
          id
          title
        }
        tripType {
          id
          title
        }
      }
    }
    monthly
    monthlyPausal
    taskWorkPausal
    taskTripPausal
    companyRents {
      id
      title
      quantity
      cost
      price
    }
  }
}
`;

export const GET_DEF_COMPANY = gql `
query defCompany {
  defCompany {
    ${companyData}
  }
}
`;

export const GET_COMPANY_DEFAULTS = gql `
query companyDefaults {
  companyDefaults {
    dph
  }
}
`;

export const UPDATE_COMPANY_DEFAULTS = gql `
mutation updateCompanyDefaults($dph: Int!) {
  updateCompanyDefaults(
    dph: $dph
  ){
    dph
  }
}
`;

export const COMPANIES_SUBSCRIPTION = gql `
subscription companiesSubscription {
  companiesSubscription
}
`;