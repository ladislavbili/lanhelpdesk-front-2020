import {
  gql
} from '@apollo/client';

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    tasklistLayout
  }
}
`;

export const GET_PROJECT_GROUPS = gql `
query project($id: Int!) {
  project(
    id: $id,
  ){
    groups {
      users {
        id
      }
      rights {
        projectSecondary
      }
    }
  }
}
`;