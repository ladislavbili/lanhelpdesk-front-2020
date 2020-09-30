
import { makeVar } from "@apollo/client";

export const filter = makeVar(null);
export const generalFilter = makeVar(null);
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
