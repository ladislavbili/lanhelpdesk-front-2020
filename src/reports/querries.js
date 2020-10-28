import { gql } from '@apollo/client';;

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
