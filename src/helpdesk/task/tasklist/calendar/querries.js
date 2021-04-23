import {
  gql
} from '@apollo/client';

export const GET_REPEATS = gql `
query (
  $projectId: Int
  $active: Boolean
  $from: String
  $to: String
) {
  repeats(
    projectId: $projectId
    active: $active
    from: $from
    to: $to
  ) {
    id
    canEdit
    repeatEvery
    repeatInterval
    startsAt
    repeatTimes{
      id
      originalTrigger
      triggersAt
      triggered
      task{
        id
      }
    }
    repeatTemplate{
      title
    }
  }
}
`;

export const GET_REPEAT_TIMES = gql `
query (
  $from: String
  $to: String
  $active: Boolean
) {
  repeatTimes(
    from: $from
    to: $to
    active: $active
  ) {
    id
    originalTrigger
    triggersAt
    triggered
    canEdit
    task{
      id
      title
      status{
        color
      }
    }
    repeat{
      id
      repeatEvery
      repeatInterval
      repeatTemplate{
        title
      }
    }
  }
}
`;

export const TRIGGER_REPEAT = gql `
mutation triggerRepeat(
  $repeatId: Int!
  $repeatTimeId: Int
  $originalTrigger: String
) {
  triggerRepeat(
    repeatId: $repeatId
    repeatTimeId: $repeatTimeId
    originalTrigger: $originalTrigger
  ){
    id
  }
}
`;

export const ADD_REPEAT_TIME = gql `
mutation addRepeatTime(
  $repeatId: Int!
  $originalTrigger: String!
  $triggersAt: String!
) {
  addRepeatTime(
    repeatId: $repeatId
    originalTrigger: $originalTrigger
    triggersAt: $triggersAt
  ){
    id
  }
}
`;

export const UPDATE_REPEAT_TIME = gql `
mutation updateRepeatTime(
  $id: Int!
  $triggersAt: String!
) {
  updateRepeatTime(
    id: $id
    triggersAt: $triggersAt
  ){
    id
  }
}
`;