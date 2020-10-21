import {
  gql
} from "@apollo/client";

import {
  showDataFilterType,
  milestoneType
} from './types';

export const typeDefs = gql `
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
    projectName: String
    filterName: String
    milestone: Milestone
    search: String
    showDataFilter: ShowDataFilter
    orderBy: String
    ascending: Boolean

    reportsFromDate: Int
    reportsToDate: Int
    reportsMonth: Int
    reportsYear: Int
    reportsChosenStatuses: [Int]
  }

  ${showDataFilterType}

  ${milestoneType}

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const resolvers = {};
