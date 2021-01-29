import {
  gql
} from '@apollo/client';

import {
  groupRights
} from 'helpdesk/settings/projects/queries';

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
    company{
      id
    }
    role {
      id
      level
      accessRights {
        addProjects
        publicFilters
        users
        companies
        pausals
        projects
        statuses
        prices
        roles
        taskTypes
        tripTypes
        imaps
        smtps
      }
    }
  }
}
`;