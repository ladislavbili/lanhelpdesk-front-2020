import {
  makeVar
} from "@apollo/client";
import {
  dashboard
} from 'configs/constants/sidebar';
export const projectVar = makeVar( dashboard );