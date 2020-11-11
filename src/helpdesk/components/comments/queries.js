import {
  gql
} from '@apollo/client';

export const ADD_COMMENT = gql `
mutation addComment($message: String!, $internal: Boolean!, $parentCommentId: Int, $task: Int!) {
  addComment(
		message: $message,
		internal: $internal,
		parentCommentId: $parentCommentId,
		task: $task,
  ){
    id
    createdAt
    message
    internal
    user {
      id
      fullName
    }
    task {
      id
    }
    parentCommentId
  }
}
`;