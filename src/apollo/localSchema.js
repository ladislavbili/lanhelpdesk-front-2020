
import { gql } from "@apollo/client";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
    project: BasicProject
    milestone: Milestone
    search: String
    showDataFilter: ShowDataFilter
    orderBy: String
    ascending: Boolean
  }

  type ShowDataFilter {
    name: String
    checked: Boolean
    important: Boolean
    id: String
    title: String
    status: String
    requester: String
    company: String
    assignedTo: String
    createdAt: String
    deadline: String
  }

  type Milestone {
    id: Int
    createdAt: String
    updatedAt: String
    title: String
    description: String
    startsAt: String
    endsAt: String
  }

  type BasicProject {
    id: Int
    title: String
    milestones: [Milestone]
    projectRights: ProjectRights
    __type: String
  }

  type ProjectRights {
    read: Boolean
    write: Boolean
    delete: Boolean
    admin: Boolean
    internal: Boolean
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const resolvers = {};
