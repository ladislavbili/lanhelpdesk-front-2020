import {
  gql
} from '@apollo/client';

export const GET_MY_PROJECTS = gql `
query {
  myProjects {
    project {
      id
      title
      lockedRequester
      milestones {
        id
        title
        endsAt
      }
      tags {
        id
        title
        order
        color
      }
      statuses {
        id
        title
        order
        color
        icon
        action
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
    right {
      read
			write
			delete
			internal
			admin
    }
    usersWithRights {
      id
      fullName
    }
  }
}
`;

export const GET_PROJECTS = gql `
query {
  projects {
      title
      id
      projectRights{
        user{
          id
        }
      }
  }
}
`;

export const ADD_PROJECT = gql `
mutation addProject($title: String!, $description: String!, $lockedRequester: Boolean!, $projectRights: [ProjectRightInput]!, $def: ProjectDefaultsInput!, $tags: [NewTagInput]!, $statuses: [NewStatusInput]!) {
  addProject(
    title: $title,
    description: $description,
    lockedRequester: $lockedRequester,
    projectRights: $projectRights,
    def: $def,
    tags: $tags,
    statuses: $statuses,
  ){
    id
    title
    description
    lockedRequester
    milestones {
      id
      title
    }
    tags {
      id
      title
      order
      color
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
    statuses{
      id
      title
      order
      color
      icon
      action
    }
    tags {
      id
      title
      order
      color
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

export const UPDATE_PROJECT = gql `
mutation updateProject(
  $id: Int!,
  $title: String,
  $description: String,
  $lockedRequester: Boolean,
  $projectRights: [ProjectRightInput],
  $def: ProjectDefaultsInput,
  $deleteTags: [Int]!,
  $updateTags: [TagUpdateInput]!,
  $addTags: [NewTagInput]!,
  $deleteStatuses: [Int]!,
  $updateStatuses: [UpdateStatusInput]!,
  $addStatuses: [NewStatusInput]!,
) {
  updateProject(
		id: $id
    title: $title
    description: $description
    lockedRequester: $lockedRequester
    projectRights: $projectRights
    def: $def
    deleteTags: $deleteTags
    updateTags: $updateTags
    addTags: $addTags
    deleteStatuses: $deleteStatuses
    updateStatuses: $updateStatuses
    addStatuses: $addStatuses
  ){
    id
    title
    description
    lockedRequester
    tags {
      id
      title
      order
      color
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