import {
  gql
} from '@apollo/client';

export const GET_USER_NOTIFICATIONS = gql `
query userNotifications($limit: Int){
  userNotifications (
    limit: $limit,
  ){
    id
    read
    subject
    message
    forUser{
      id
      fullName
    }
    fromUser{
      id
      fullName
    }
    task{
      id
      title
    }
    createdAt
  }
}
`;

export const SET_USER_NOTIFICATION_READ = gql `
mutation setUserNotificationRead($id: Int!, $read: Boolean!) {
  setUserNotificationRead(
    id: $id,
    read: $read
  ) {
    id
  }
}
`;

export const SET_ALL_USER_NOTIFICATIONS_READ = gql `
mutation setAllUserNotificationsRead($read: Boolean!) {
  setAllUserNotificationsRead(
    read: $read
  )
}
`;

export const DELETE_ALL_USER_NOTIFICATIONS = gql `
mutation  {
  deleteAllUserNotifications
}
`;

export const DELETE_SELECTED_USER_NOTIFICATIONS = gql `
mutation deleteSelectedUserNotifications($ids: [Int]!) {
  deleteSelectedUserNotifications(
    ids: $ids,
  )
}
`;

export const GET_USER_NOTIFICATIONS_COUNT = gql `
query {
  userNotificationsCount
}
`;

export const USER_NOTIFICATIONS_SUBSCRIPTION = gql `
  subscription errorMessagesSubscription {
    userNotificationsSubscription
  }
`;


export const USER_NOTIFICATIONS_COUNT_SUBSCRIPTION = gql `
  subscription errorMessageCountSubscription {
    userNotificationsCountSubscription
  }
`;