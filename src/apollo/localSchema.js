
import { gql } from "@apollo/client";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
    project: Project!
    milestone: Milestone!
    filter: Filter!
    search: String!
    showDataFilter: ShowDataFilter!
  }

  type ShowDataFilter {
    id: String
    title: String
    status: String
    requester: String
    company: String
    assignedTo: String
    createdAt: String
    deadline: String
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const resolvers = {};
