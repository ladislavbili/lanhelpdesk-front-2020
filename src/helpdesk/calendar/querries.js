import {
  gql
} from '@apollo/client';

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
		statuses {
			id
			title
			color
			action
		}
  }
}
`;

export const ADD_CALENDAR_EVENT = gql `
mutation addCalendarEvent(
  $startsAt: String!,
  $endsAt: String!,
  $task: Int!
) {
  addCalendarEvent(
    startsAt: $startsAt,
    endsAt: $endsAt,
    task: $task,
  )
}{
      id
}`;

export const UPDATE_CALENDAR_EVENT = gql `
mutation updateCalendarEvent(
  $id: Int!,
  $startsAt: String,
  $endsAt: String
) {
  updateCalendarEvent(
    id: $id
    startsAt: $startsAt
    endsAt: $endsAt
  )
}{
      id
}`;

export const DELETE_CALENDAR_EVENT = gql `
mutation deleteCalendarEvent(
  $id: Int!,
) {
  deleteCalendarEvent(
    id: $id
  )
}{
      id
}`;