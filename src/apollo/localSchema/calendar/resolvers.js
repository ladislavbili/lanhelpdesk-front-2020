import {
  fromVar,
  toVar,
  calendarUserIdVar,
} from './variables';

export const localCalendarUserId = () => {
  return calendarUserIdVar();
}

export const localCalendarDateRange = () => {
  return {
    from: fromVar(),
    to: toVar(),
  };
}