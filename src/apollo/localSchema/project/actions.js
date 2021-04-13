import {
  projectVar,
} from './variables';

import {
  calendarUserIdVar,
} from '../calendar/variables';

export function setProject( newValue ) {
  calendarUserIdVar( null );
  projectVar( newValue );
}