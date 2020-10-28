import gql from "graphql-tag";

export const ADD_MILESTONE = gql `
mutation addMilestone($title: String!, $description: String!, $startsAt: String, $endsAt: String, $projectId: Int!) {
  addMilestone(
    title: $title,
    description: $description,
    startsAt: $startsAt,
    endsAt: $endsAt,
    projectId: $projectId
){
  id
  title
  }
}
`;