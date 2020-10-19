import gql from "graphql-tag";

export const ADD_COMPANY = gql `
mutation addCompany($title: String!, $dph: Int!, $ico: String!, $dic: String!, $ic_dph: String!, $country: String!, $city: String!, $street: String!, $zip: String!, $email: String!, $phone: String!, $description: String!, $pricelistId: Int!, $monthly: Boolean!, $monthlyPausal: Float!, $taskWorkPausal: Float!, $taskTripPausal: Float!, $rents: [CompanyRentCreateInput]!) {
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
    id
    title
    monthly
    monthlyPausal
    taskWorkPausal
    taskTripPausal
    dph
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

export const GET_COMPANIES = gql `
query {
  companies {
    title
    id
    monthly
  }
}
`;

export const GET_COMPANY = gql `
query company($id: Int!) {
  company (
    id: $id
  ) {
      title
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