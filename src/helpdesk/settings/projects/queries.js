import {
  gql
} from '@apollo/client';

export const groupRights = `
  assignedRead
  assignedWrite
  companyRead
  companyWrite
  deadlineRead
  deadlineWrite
  milestoneRead
  milestoneWrite
  overtimeRead
  overtimeWrite
  pausalRead
  pausalWrite
  projectRead
  projectWrite
  projectPrimaryRead
  projectPrimaryWrite
  repeatRead
  repeatWrite
  requesterRead
  requesterWrite
  rozpocetRead
  rozpocetWrite
  scheduledRead
  scheduledWrite
  statusRead
  statusWrite
  tagsRead
  tagsWrite
  taskAttachmentsRead
  taskAttachmentsWrite
  taskDescriptionRead
  taskDescriptionWrite
  taskShortSubtasksRead
  taskShortSubtasksWrite
  typeRead
  typeWrite
  vykazRead
  vykazWrite
  companyTasks
  allTasks
  addTasks
  deleteTasks
  important
  addComments
  emails
  history
  internal
  projectSecondary
  pausalInfo
  taskTitleEdit
  viewComments
  statistics
`;

const def = `
assignedTo {
  def
  fixed
  required
  value {
    id
  }
}
company {
  def
  fixed
  required
  value {
    id
  }
}
overtime {
  def
  fixed
  required
  value
}
pausal {
  def
  fixed
  required
  value
}
requester {
  def
  fixed
  required
  value {
    id
  }
}
type {
  def
  fixed
  required
  value {
    id
  }
}
status {
  def
  fixed
  required
  value {
    id
  }
}
tag {
  def
  fixed
  required
  value {
    id
  }
}
`;

export const GET_MY_PROJECTS = gql `
query {
  myProjects {
    project {
      id
      title
      lockedRequester
      autoApproved
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
        ${def}
      }
    }
    right {
      ${groupRights}
    }
    usersWithRights {
      user{
        id
        fullName
      }
      assignable
    }
  }
}
`;

export const GET_PROJECTS = gql `
query {
  projects {
    title
    id
    right{
      assignedRead
    }
  }
}
`;

const responseProject = `
id
title
description
lockedRequester
autoApproved
statuses{
  id
  title
  order
  color
  icon
  action
}
attachments{
  id
  path
  filename
  size
  mimetype
}
groups{
  id
  title
  order
  rights{
    ${groupRights}
  }
  users{
    id
    email
  }
}
tags {
  id
  title
  order
  color
}

def {
  ${def}
}
`

export const ADD_PROJECT = gql `
mutation addProject(
  $title: String!,
  $description: String!,
  $lockedRequester: Boolean!,
  $autoApproved: Boolean!,
  $def: ProjectDefaultsInput!,
  $tags: [NewTagInput]!,
  $statuses: [NewStatusInput]!
  $groups: [ProjectGroupInput]!
  $userGroups: [UserGroupInput]!
) {
  addProject(
    title: $title,
    description: $description,
    lockedRequester: $lockedRequester,
    autoApproved: $autoApproved,
    def: $def,
    tags: $tags,
    statuses: $statuses,
    groups: $groups,
    userGroups: $userGroups
  ){
    ${responseProject}
  }
}
`;

export const GET_PROJECT = gql `
query project($id: Int!) {
  project(
    id: $id,
  ){
    ${responseProject}
  }
}
`;

export const UPDATE_PROJECT = gql `
mutation updateProject(
  $id: Int!,
  $title: String,
  $description: String,
  $lockedRequester: Boolean,
  $autoApproved: Boolean,
  $def: ProjectDefaultsInput,
  $deleteTags: [Int]!,
  $updateTags: [TagUpdateInput]!,
  $addTags: [NewTagInput]!,
  $deleteStatuses: [Int]!,
  $updateStatuses: [UpdateStatusInput]!,
  $addStatuses: [NewStatusInput]!,
  $userGroups: [UserGroupUpdateInput]!,
  $addGroups: [ProjectGroupInput]!,
  $updateGroups: [ProjectGroupInput]!,
  $deleteGroups: [Int]!,
) {
  updateProject(
    id: $id
    title: $title
    description: $description
    lockedRequester: $lockedRequester
    autoApproved: $autoApproved
    def: $def
    deleteTags: $deleteTags
    updateTags: $updateTags
    addTags: $addTags
    deleteStatuses: $deleteStatuses
    updateStatuses: $updateStatuses
    addStatuses: $addStatuses
    userGroups: $userGroups
    addGroups: $addGroups
    updateGroups: $updateGroups
    deleteGroups: $deleteGroups
  ){
    ${responseProject}
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

export const DELETE_PROJECT_ATTACHMENT = gql `
mutation deleteProjectAttachment($id: Int!) {
  deleteProjectAttachment(
    id: $id,
  ){
    id
  }
}
`;

export const GET_NUMBER_OF_TASKS = gql `
query getNumberOfTasks($projectId: Int!) {
  getNumberOfTasks(
    projectId: $projectId,
  )
}
`;

export const ADD_USER_TO_PROJECT_GROUP = gql `
mutation addUserToProjectGroup(
  $id: Int!,
  $userId: Int!
) {
  addUserToProjectGroup(
    id: $id
    userId: $userId
  ){
    id
  }
}
`;

export const PROJECTS_SUBSCRIPTION = gql `
  subscription projectsSubscription {
    projectsSubscription
  }
`;

export const GET_PROJECT_GROUPS = gql `
query projectGroups($id: Int!) {
  projectGroups(
    id: $id,
  ){
    id
    title
    order
  }
}
`;



export const PROJECT_GROUPS_SUBSCRIPTION = gql `
  subscription projectGroupsSubscription($projectId: Int!) {
    projectGroupsSubscription(projectId: $projectId)
  }
`;