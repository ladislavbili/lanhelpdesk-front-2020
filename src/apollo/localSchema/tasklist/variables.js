import {
  makeVar
} from "@apollo/client";

import {
  defaultTasksAttributesFilter,
} from 'configs/constants/tasks';

export const localSearchVar = makeVar( "" );
export const globalSearchVar = makeVar( "" );

export const localStringFilterVar = makeVar( defaultTasksAttributesFilter );
export const globalStringFilterVar = makeVar( null );

export const filterOpenVar = makeVar( false );