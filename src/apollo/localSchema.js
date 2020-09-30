
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
    project: BasicProject
    milestone: Milestone
    filterName: String
    generalFilter: Filter
    filter: filter
    search: String
    showDataFilter: ShowDataFilter
  }

  type ShowDataFilter {
    id: String
    title: String
    status: String
    requester: BasicUser
    company: String
    assignedTo: BasicUser
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

  type Filter {
    id: Int
    createdAt: String
    updatedAt: String
    createdBy: BasicUser
    title: String
    pub: Boolean
    global: Boolean
    dashboard: Boolean
    order: Int
    filter: filter
    roles: [BasicRole]
    project: BasicProject
  }

  type filter {
    assignedToCur: Boolean
    assignedTo: BasicUser
    requesterCur: Boolean
    requester: BasicUser
    companyCur: Boolean
    company: BasicCompany
    taskType: TaskType
    oneOf: [OneOfEnum]
    updatedAt: String

    statusDateFrom: String
    statusDateFromNow: Boolean
    statusDateTo: String
    statusDateToNow: Boolean
    pendingDateFrom: String
    pendingDateFromNow: Boolean
    pendingDateTo: String
    pendingDateToNow: Boolean
    closeDateFrom: String
    closeDateFromNow: Boolean
    closeDateTo: String
    closeDateToNow: Boolean
    deadlineFrom: String
    deadlineFromNow: Boolean
    deadlineTo: String
    deadlineToNow: Boolean
  }

  type BasicUser {
    id: Int!
    email: String
    username: String
    name: String
    surname: String
    company: BasicCompany!
    language: LanguageEnum
    role: BasicRole!
  }

  type BasicCompany {
    id: Int!
    title: String!
    dph: Int
    pricelist: Pricelist
    users: [BasicUser]
    usedSubtaskPausal: Int
    usedTripPausal: Int
  }

  type BasicRole{
    id: Int
    createdAt: String
    updatedAt: String
    title: String
    order: Int
    level: Int

    accessRights: AccessRights
  }

  type TaskType {
    id: Int
    createdAt: String
    updatedAt: String
    title: String
    order: Int
    prices: [Price]
  }

  type Price {
    id: Int
    createdAt: String
    updatedAt: String
    price: Float!
    type: PriceAllowedType
    taskType: TaskType
    tripType: TripType
  }

  type TripType {
    id: Int
    createdAt: String
    updatedAt: String
    title: String
    order: Int
    prices: [Price]
  }

  enum PriceAllowedType {
    TripType
    TaskType
  }

  type AccessRights {
    ${createAccessRights(true)}
  }

  enum LanguageEnum {
    sk
    en
  }

  enum OneOfEnum {
    requester
    assigned
    company
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const resolvers = {};
