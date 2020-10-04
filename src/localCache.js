import { makeVar } from "@apollo/client";

import { getEmptyFilter } from 'configs/fixedFilters';

export const filter = makeVar(getEmptyFilter());
export const generalFilter = makeVar(null);
export const filterName = makeVar("All tasks");
export const project = makeVar(null);
