import {
  gql
} from '@apollo/client';

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
		statuses {
			id
			title
			color
			action
		}
  }
}
`;