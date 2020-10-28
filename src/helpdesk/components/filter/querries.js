import gql from "graphql-tag";

export const GET_MY_FILTERS = gql `
query {
  myFilters {
    title
    id
    createdAt
    updatedAt
    id
    title
    pub
    global
    dashboard
    project {
      id
      title
    }
    roles {
      id
      title
    }
    filter {
      oneOf
      assignedToCur
      assignedTo {
        id
        email
      }
      requesterCur
      requester {
        id
        email
      }
      companyCur
      company {
        id
        title
      }
      taskType {
        id
        title
      }
      statusDateFrom
      statusDateFromNow
      statusDateTo
      statusDateToNow
      pendingDateFrom
      pendingDateFromNow
      pendingDateTo
      pendingDateToNow
      closeDateFrom
      closeDateFromNow
      closeDateTo
      closeDateToNow
      deadlineFrom
      deadlineFromNow
      deadlineTo
      deadlineToNow
    }
  }
}
`;