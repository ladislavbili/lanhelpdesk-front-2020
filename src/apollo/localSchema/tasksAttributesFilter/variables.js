import {
  makeVar
} from "@apollo/client";

import {
  defaultTasksAttributesFilter
} from 'configs/constants/tasks';

export const filterVar = makeVar( defaultTasksAttributesFilter );