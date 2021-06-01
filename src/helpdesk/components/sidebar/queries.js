import {
  gql
} from '@apollo/client';

export const MILESTONES_SUBSCRIPTION = gql `
  subscription milestonesSubscription {
    milestonesSubscription
  }
`;