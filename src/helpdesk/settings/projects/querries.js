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

export const ADD_PROJECT = gql `
mutation addProject($title: String!, $description: String!, $lockedRequester: Boolean!, $projectRights: [ProjectRightInput]!, $def: ProjectDefaultsInput!) {
  addProject(
    title: $title,
    description: $description,
    lockedRequester: $lockedRequester,
    projectRights: $projectRights,
    def: $def,
  ){
    id
    title
    description
    lockedRequester
    milestones {
      id
      title
    }
    projectRights {
			read
			write
			delete
			internal
			admin
			user {
				id
        email
			}
		}
    def {
			assignedTo {
				def
				fixed
				show
				value {
					id
				}
			}
			company {
				def
				fixed
				show
				value {
					id
				}
			}
			overtime {
				def
				fixed
				show
				value
			}
			pausal {
				def
				fixed
				show
				value
			}
			requester {
				def
				fixed
				show
				value {
					id
				}
			}
			status {
				def
				fixed
				show
				value {
					id
				}
			}
			tag {
				def
				fixed
				show
				value {
					id
				}
			}
			taskType {
				def
				fixed
				show
				value {
					id
				}
			}
		}

  }
}
`;

export const GET_PROJECT = gql `
query project($id: Int!) {
  project(
		id: $id,
  ){
    id
    title
    description
    lockedRequester
    projectRights {
			read
			write
			delete
			internal
			admin
			user {
				id
        email
			}
		}
    def {
			assignedTo {
				def
				fixed
				show
				value {
					id
				}
			}
			company {
				def
				fixed
				show
				value {
					id
				}
			}
			overtime {
				def
				fixed
				show
				value
			}
			pausal {
				def
				fixed
				show
				value
			}
			requester {
				def
				fixed
				show
				value {
					id
				}
			}
			status {
				def
				fixed
				show
				value {
					id
				}
			}
			tag {
				def
				fixed
				show
				value {
					id
				}
			}
			taskType {
				def
				fixed
				show
				value {
					id
				}
			}
		}
  }
}
`;

export const UPDATE_PROJECT = gql `
mutation updateProject($id: Int!, $title: String, $description: String, $lockedRequester: Boolean, $projectRights: [ProjectRightInput], $def: ProjectDefaultsInput) {
  updateProject(
		id: $id,
    title: $title,
    description: $description,
    lockedRequester: $lockedRequester,
    projectRights: $projectRights,
    def: $def,
  ){
    id
    title
  }
}
`;

export const DELETE_PROJECT = gql `
mutation deleteProject($id: Int!, $newId: Int!) {
  deleteProject(
    id: $id,
    newId: $newId,
  ){
    id
  }
}
`;

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    role {
      accessRights {
        addProjects
        projects
      }
    }
  }
}
`;