
import { gql } from "@apollo/client";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
    projectName: String
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
    title: String
    value: Int
    label: String
    __typename: String
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const resolvers = {};
