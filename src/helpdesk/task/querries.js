import gql from "graphql-tag";

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