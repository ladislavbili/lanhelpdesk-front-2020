import gql from "graphql-tag";

export const GET_PROJECTS = gql `
query {
  myProjects {
    project {
      title
      id
    }
  }
}
`;