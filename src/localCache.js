import React from 'react';
import { makeVar } from "@apollo/client";
import { getFixedFilters } from "configs/fixedFilters";

export const selectedProject = makeVar(null);
export const selectedMilestone = makeVar(null);
export const filter = makeVar({"All tasks": getFixedFilters()[0]});
export const filterName = makeVar("All tasks");
export const showDataFilter = makeVar(null);
export const search = makeVar("");
export const tasklistLayout = makeVar(0);
