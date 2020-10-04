
import { gql } from "@apollo/client";
const createAccessRights = (required) => {
  return ['login', 'testSections', 'mailViaComment', 'vykazy', 'publicFilters', 'addProjects', 'viewVykaz', 'viewRozpocet', 'viewErrors', 'viewInternal',
    'users', 'companies', 'pausals', 'projects', 'statuses', 'units', 'prices', 'suppliers', 'tags', 'invoices', 'roles', 'taskTypes', 'tripTypes', 'imaps', 'smtps'].reduce((acc, right) => {
      return acc + `${right}: Boolean${(required ? '!' : '')}\n`;
    }, '')
}

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
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
    title: String!
    description: String!
    startsAt: String
    endsAt: String
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const resolvers = {};
