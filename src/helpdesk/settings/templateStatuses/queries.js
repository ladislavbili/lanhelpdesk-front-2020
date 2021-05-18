import {
  gql
} from '@apollo/client';

export const GET_STATUS_TEMPLATES = gql `
query {
  statusTemplates {
    title
    id
    icon
    action
    order
    color
  }
}
`;
export const GET_STATUS_TEMPLATE = gql `
query statusTemplate($id: Int!) {
  statusTemplate (
    id: $id
  ) {
    id
    title
    color
    icon
    action
    order
  }
}
`;


export const GET_STATUSES_X = gql `
query statuses($id: Int! ) {
  statuses( id: $id ) {
    title
    id
    icon
    action
    order
    color
  }
}
`;

export const ADD_STATUS_TEMPLATE = gql `
mutation addStatusTemplate($title: String!, $order: Int!, $icon: String!, $color: String!, $action: StatusAllowedType!) {
  addStatusTemplate(
    title: $title,
    order: $order,
    icon: $icon,
    color: $color,
    action: $action,
  ){
    id
    title
    order
  }
}
`;

export const UPDATE_STATUS_TEMPLATE = gql `
mutation updateStatusTemplate($id: Int!, $title: String!, $order: Int!, $icon: String!, $color: String!, $action: StatusAllowedType!) {
  updateStatusTemplate(
    id: $id,
    title: $title,
    color: $color,
    icon: $icon,
    action: $action,
    order: $order,
  ){
    id
    title
    order
  }
}
`;

export const DELETE_STATUS_TEMPLATE = gql `
mutation deleteStatusTemplate($id: Int!) {
  deleteStatusTemplate(
    id: $id,
  ){
    id
  }
}
`;

export const SET_USER_STATUSES = gql `
mutation setUserStatuses($ids: [Int]!) {
  setUserStatuses(
    ids: $ids
  ){
    id
		statuses {
			id
			title
			color
			action
		}
		company {
			id
			title
		}
    role {
			level
      accessRights {
        projects
        publicFilters
        users
        companies
        vykazy
      }
    }
  }
}
`;

export const STATUS_TEMPLATE_SUBSCRIPTION = gql `
  subscription statusTemplateSubscription {
    statusTemplateSubscription
  }
`;