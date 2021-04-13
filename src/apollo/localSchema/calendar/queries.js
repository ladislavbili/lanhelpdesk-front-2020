import {
  gql
} from "@apollo/client";

export const GET_LOCAL_CALENDAR_USER_ID = gql `
query localCalendarUserId {
  localCalendarUserId @client
}
`;

export const GET_LOCAL_CALENDAR_DATE_RANGE = gql `
query localCalendarDateRange {
  localCalendarDateRange @client
}
`;