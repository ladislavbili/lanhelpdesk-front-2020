import {
  gql
} from '@apollo/client';

export const GET_REPEATS = gql `
query (
    $projectId: Int,
    $active: Boolean,
) {
  repeats(
      projectId: $projectId,
      active: $active
  ) {
    id
    repeatEvery
    repeatInterval
    startsAt
  }
}
`;