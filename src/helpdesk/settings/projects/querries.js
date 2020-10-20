import gql from "graphql-tag";

export const GET_MY_PROJECTS = gql `
query {
  myProjects {
    project {
      title
      id
    }
  }
}
`;

export const GET_PROJECTS = gql `
query {
  projects {
      title
      id
  }
}
`;