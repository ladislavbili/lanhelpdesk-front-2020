import {
  gql
} from '@apollo/client';

export const GET_COMMENTS = gql `
query comments($task: Int!){
	comments(
		task: $task
	){
    id
    createdAt
    internal
    isEmail
    message
    html
    subject
    tos
    emailSend
    emailError
    user{
      id
      fullName
      email
    }
    commentAttachments{
      id
      path
      filename
      size
      mimetype
    }
    childComments {
      id
      createdAt
      internal
      isEmail
      message
      html
      subject
      tos
      emailSend
      emailError
      user{
        id
        fullName
        email
      }
      commentAttachments{
      id
      path
      filename
      size
      mimetype
      }
    }
  }
}
`;

export const COMMENTS_SUBSCRIPTION = gql `
  subscription commentsSubscription( $taskId: Int! ) {
    commentsSubscription( taskId: $taskId )
  }
`;