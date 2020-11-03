import {
  gql
} from '@apollo/client';

export const ADD_TASK = gql `
mutation addTask(
  $title: String!,
  $closeDate: String,
  $assignedTo: [Int]!,
  $company: Int!,
  $deadline: String,
  $description: String!,
  $milestone: Int,
  $overtime: Boolean!,
  $pausal: Boolean!,
  $pendingChangable: Boolean,
  $pendingDate: String,
  $project: Int!,
  $requester: Int,
  $status: Int!,
  $tags: [Int]!,
  $taskType: Int!,
  $repeat: RepeatInput,
  $subtasks: [SubtaskInput],
  $workTrips: [WorkTripInput],
  $materials: [MaterialInput],
  $customItems: [CustomItemInput]
){
  addTask(
    title: $title,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    deadline: $deadline,
    description: $description,
    milestone: $milestone,
    overtime: $overtime,
    pausal: $pausal,
    pendingChangable: $pendingChangable,
    pendingDate: $pendingDate,
    project: $project,
    requester: $requester,
    status: $status,
    tags: $tags,
    taskType: $taskType,
    repeat: $repeat,
    subtasks: $subtasks,
    workTrips: $workTrips,
    materials: $materials,
    customItems: $customItems,
  ){
    id
    title
  }
}
`;

export const GET_TASKS = gql `
query tasks($filter: FilterInput, $projectId: Int){
  tasks (
    filter: $filter,
    projectId: $projectId,
  ){
		tasks {
			id
			title
			updatedAt
			createdAt
			important
			closeDate
			overtime
			pausal
			pendingChangable
			statusChange
			assignedTo {
				id
				fullName
				email
			}
			company {
				id
				title
			}
			createdBy {
				id
				name
				surname
			}
			deadline
			description
			milestone{
				id
				title
			}
			pendingDate
			project{
				id
				title
        right{
          write
          delete
        }
			}
			requester{
				id
				name
				surname
				fullName
				email
			}
			status {
				id
				title
				color
				action
			}
			tags {
				id
				title
			}
			taskType {
				id
				title
			}
			repeat {
				repeatEvery
				repeatInterval
				startsAt
			}
		}
    execTime
    secondaryTimes {
      time
      source
    }
  }
}
`;

export const DELETE_TASK = gql `
mutation deleteTask($id: Int!) {
  deleteTask(
    id: $id,
  ){
    id
  }
}
`;

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
		company {
			id
			title
		}
    role {
			level
      accessRights {
        projects
        publicFilters
      }
    }
  }
}
`;