import {
  gql
} from '@apollo/client';

export const GET_MY_FILTERS = gql `
query {
  myFilters {
    title
    id
    createdAt
    updatedAt
    id
    title
    pub
    global
    dashboard
    project {
      id
      title
    }
    roles {
      id
      title
    }
    filter {
      oneOf
      assignedToCur
      assignedTo {
        id
        email
      }
      requesterCur
      requester {
        id
        email
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
  }
}
`;

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    email
    role {
      id
      accessRights {
        publicFilters
      }
    }
  }
}
`;

export const DELETE_FILTER = gql `
mutation deleteFilter($id: Int!) {
  deleteFilter(
    id: $id,
  ){
    id
  }
}
`;

export const GET_MY_FILTER = gql `
query myFilter($id: Int!) {
  myFilter(
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

export const ADD_FILTER = gql `
mutation addFilter(
  $title: String!,
  $pub: Boolean!,
  $global: Boolean!,
  $dashboard: Boolean!,
  $order: Int,
  $roles: [Int],
  $filter: FilterInput!
  $projectId: Int,
) {
  addFilter(
    title: $title,
    pub: $pub,
    global: $global,
    dashboard: $dashboard,
    order: $order,
    roles: $roles,
    filter: $filter,
    projectId: $projectId
){
  title
  id
  createdAt
  updatedAt
  id
  title
  pub
  global
  dashboard
  project {
    id
    title
  }
  roles {
    id
    title
  }
  filter {
    oneOf
    assignedToCur
    assignedTo {
      id
      email
    }
    requesterCur
    requester {
      id
      email
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
}
}
`;


export const UPDATE_FILTER = gql `
mutation updateFilter( $id: Int!, $title: String, $pub: Boolean!, $global: Boolean!, $dashboard: Boolean!, $order: Int, $roles: [Int], $filter: FilterInput, $projectId: Int,) {
  updateFilter(
    id: $id,
    title: $title,
    pub: $pub,
    global: $global,
    dashboard: $dashboard,
    order: $order,
    roles: $roles,
    filter: $filter,
    projectId: $projectId
){
  title
  id
  createdAt
  updatedAt
  id
  title
  pub
  global
  dashboard
  project {
    id
    title
  }
  roles {
    id
    title
  }
  filter {
    oneOf
    assignedToCur
    assignedTo {
      id
      email
    }
    requesterCur
    requester {
      id
      email
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
}
}
`;