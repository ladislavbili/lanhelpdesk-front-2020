import {
  gql
} from '@apollo/client';

export const accessRights = `
  login
  vykazy
  publicFilters
  addProjects
  viewErrors
  lanwiki
  cmdb

  users
  companies
  pausals
  projects
  statuses
  prices
  roles
  taskTypes
  tripTypes
  imaps
  smtps
  tasklistLayout
  tasklistCalendar
  tasklistPreferences
  customFilters
`;

export const GET_ROLES = gql `
query {
  roles {
    title
    id
    order
    level
  }
}
`;

export const GET_BASIC_ROLES = gql `
query {
  basicRoles {
    title
    id
    order
    level
  }
}
`;

export const ADD_ROLE = gql `
mutation addRole($title: String!, $order: Int, $level: Int!, $accessRights: AccessRightsCreateInput!) {
  addRole(
    title: $title,
    order: $order,
    level: $level,
    accessRights: $accessRights,
  ){
    id
    title
    order
    level
  }
}
`;

export const GET_ROLE = gql `
query role($id: Int!) {
  role (
    id: $id
  ) {
    id
    title
    order
    level
    accessRights {
      ${accessRights}
    }
  }
}
`;

export const UPDATE_ROLE = gql `
mutation updateRole($id: Int!, $title: String, $order: Int, $level: Int, $accessRights: AccessRightsUpdateInput) {
  updateRole(
    id: $id,
    title: $title,
    order: $order,
    level: $level,
    accessRights: $accessRights,
  ){
    id
    title
    order
    level
  }
}
`;

export const DELETE_ROLE = gql `
mutation deleteRole($id: Int!, $newId: Int!) {
  deleteRole(
    id: $id,
    newId: $newId,
  ){
    id
  }
}
`;

export const ROLES_SUBSCRIPTION = gql `
  subscription rolesSubscription {
    rolesSubscription
  }
`;