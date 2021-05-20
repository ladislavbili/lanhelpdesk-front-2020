import {
  gql
} from '@apollo/client';

export const SET_ERROR_MESSAGE_READ = gql `
mutation setErrorMessageRead($id: Int!, $read: Boolean!) {
  setErrorMessageRead(
    id: $id,
    read: $read
  ) {
    id
  }
}
`;

export const SET_ALL_ERROR_MESSAGES_READ = gql `
mutation setAllErrorMessageSRead($read: Boolean!) {
  setAllErrorMessagesRead(
    read: $read
  )
}
`;

export const DELETE_ALL_ERROR_MESSAGES = gql `
mutation  {
  deleteAllErrorMessages
}
`;

export const DELETE_SELECTED_ERROR_MESSAGES = gql `
mutation deleteSelectedErrorMessages($ids: [Int]!) {
  deleteSelectedErrorMessages(
    ids: $ids,
  )
}
`;

export const GET_ERROR_MESSAGES = gql `
query {
  errorMessages{
    id
    createdAt
    updatedAt
    errorMessage
    read
    source
    sourceId
    type
    user {
      email
    }
  }
}
`;


export const GET_ERROR_MESSAGES_COUNT = gql `
query {
  errorMessageCount
}
`;

export const ERROR_MESSAGES_SUBSCRIPTION = gql `
  subscription errorMessagesSubscription {
    errorMessagesSubscription
  }
`;


export const ERROR_MESSAGE_COUNT_SUBSCRIPTION = gql `
  subscription errorMessageCountSubscription {
    errorMessageCountSubscription
  }
`;