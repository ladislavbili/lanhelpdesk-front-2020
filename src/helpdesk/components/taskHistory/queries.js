import {
  gql
} from '@apollo/client';

export const GET_TASK_CHANGES = gql `
query taskChanges($taskId: Int!){
	taskChanges(
		taskId: $taskId
	)  {
    id
    createdAt
    user{
      id
      fullName
    }
    taskChangeMessages{
      id
      type
      message
    }
	}
}
`;