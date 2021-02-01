import {
  makeVar
} from "@apollo/client";
import {
  defaultTaskSort
} from 'configs/constants/tasks';

export const tasksSortVar = makeVar( defaultTaskSort );