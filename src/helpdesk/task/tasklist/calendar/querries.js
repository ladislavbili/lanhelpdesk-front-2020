import {
  gql
} from '@apollo/client';

export const GET_CALENDAR_REPEATS = gql `
query (
  $projectId: Int
  $active: Boolean
  $from: String!
  $to: String!
) {
  calendarRepeats(
    projectId: $projectId
    active: $active
    from: $from
    to: $to
  ) {
    id
    canEdit
    canCreateTask
    repeatEvery
    repeatInterval
    startsAt
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
    canCreateTask
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