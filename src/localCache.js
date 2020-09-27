
import { makeVar } from "@apollo/client";
import { getFixedFilters } from "configs/fixedFilters";

export const selectedProject = makeVar(null);
export const selectedMilestone = makeVar(null);
export const filters = makeVar([]);
export const filter = makeVar(getFixedFilters()[0]);
export const showDataFilter = makeVar({
  id: "",
  title: "",
  status: "",
  requester: "",
  company: "",
  assignedTo: "",
  createdAt: "",
  deadline: "",
});
export const filterName = makeVar("All tasks");
export const search = makeVar("");
export const tasklistLayout = makeVar(0);
export const currentUser = makeVar({});
