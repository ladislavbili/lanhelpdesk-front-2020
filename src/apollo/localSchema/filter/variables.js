import {
  makeVar
} from "@apollo/client";

import {
  getEmptyGeneralFilter
} from 'configs/constants/filter';

export const filterVar = makeVar( getEmptyGeneralFilter() );