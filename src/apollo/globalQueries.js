import {
  gql
} from '@apollo/client';
import {
  accessRights
} from 'helpdesk/settings/roles/queries';

export const USER_DATA_SUBSCRIPTION = gql `
subscription userDataSubscription {
  userDataSubscription
}
`;

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    active
    username
    email
    name
    surname
    fullName
    receiveNotifications
    signature
    language
    tasklistLayout
    taskLayout
    afterTaskCreate
    tasklistSorts{
      asc
      sort
      layout
    }
    statuses {
      id
      title
      order
      color
      icon
      action
    }
    company {
      id
      title
    }
    role {
      id
      title
      order
      level
      accessRights {
        ${accessRights}
      }
    }
  }
}
`;