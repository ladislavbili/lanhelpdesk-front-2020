export const showDataFilterType = `
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
`;

export const milestoneType = `
  type Milestone {
    id: Int
    title: String
    value: Int
    label: String
    __typename: String
  }
`;
