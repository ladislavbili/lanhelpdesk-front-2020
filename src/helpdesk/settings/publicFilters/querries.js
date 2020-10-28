import { gql } from '@apollo/client';;

export const GET_PUBLIC_FILTERS = gql `
query {
  publicFilters {
    title
    id
    order
    roles {
      id
      title
    }
  }
}
`;

export const GET_FILTER = gql `
query filter($id: Int!) {
  filter(
    id: $id
  ){
    id
    title
    global
    dashboard
    order
    roles {
      id
      title
    }
    filter {
      assignedToCur
      assignedTo {
        id
        fullName
      }
      requesterCur
      requester {
        id
        fullName
      }
      companyCur
      company {
        id
        title
      }
      taskType {
        id
        title
      }
      oneOf
      statusDateFrom
      statusDateFromNow
      statusDateTo
      statusDateToNow
      pendingDateFrom
      pendingDateFromNow
      pendingDateTo
      pendingDateToNow
      closeDateFrom
      closeDateFromNow
      closeDateTo
      closeDateToNow
      deadlineFrom
      deadlineFromNow
      deadlineTo
      deadlineToNow
    }
    project {
      id
    }
  }
}
`;

export const ADD_PUBLIC_FILTER = gql `
mutation addPublicFilter(
   $title: String!,
   $global: Boolean!,
   $dashboard: Boolean!,
   $order: Int!,
   $filter: FilterInput!,
   $roles: [Int]!,
   $projectId: Int
  ) {
  addPublicFilter(
    title: $title
    global: $global
    dashboard: $dashboard
    order: $order
    filter: $filter
    roles: $roles
    projectId: $projectId
    ){
      title
      id
      order
      roles {
        id
        title
      }
    }
  }
`

export const UPDATE_PUBLIC_FILTER = gql `
mutation updatePublicFilter(
   $id: Int!
   $title: String,
   $global: Boolean!
   $dashboard: Boolean!,
   $order: Int,
   $filter: FilterInput,
   $roles: [Int],
   $projectId: Int
  ) {
  updatePublicFilter(
    id: $id
    title: $title
    global: $global
    dashboard: $dashboard
    order: $order
    filter: $filter
    roles: $roles
    projectId: $projectId
    ){
      title
      id
      order
      roles {
        id
        title
      }
    }
  }
`