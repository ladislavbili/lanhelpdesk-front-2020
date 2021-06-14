import {
  makeVar
} from "@apollo/client";

import {
  defaultTasksAttributesFilter,
  defaultTaskSort,
  defaultGanttSort,
} from 'configs/constants/tasks';

export const tasksSortVar = makeVar( defaultTaskSort );
export const ganttSortVar = makeVar( defaultGanttSort );

export const localSearchVar = makeVar( "" );
export const globalSearchVar = makeVar( "" );

export const localStringFilterVar = makeVar( defaultTasksAttributesFilter );
export const globalStringFilterVar = makeVar( null );