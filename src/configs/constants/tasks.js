export const defaultTasksAttributesFilter = {
  name: undefined,
  checked: false,
  important: false,
  id: "",
  title: "",
  status: "",
  requester: "",
  company: "",
  assignedTo: "",
  createdAt: "",
  deadline: "",
  project: "",
  milestone: "",
  taskType: "",
  overtime: "",
  pausal: "",
  tags: "",
  subtasksApproved: "",
  subtasksPending: "",
  tripsApproved: "",
  tripsPending: "",
  materialsApproved: "",
  materialsPending: "",
  itemsApproved: "",
  itemsPending: "",
}
export const defaultTaskSort = {
  key: 'status',
  asc: true
}
export const defaultTasklistColumnPreference = {
  taskId: true,
  status: true,
  important: true,
  invoiced: true,
  title: true,
  requester: true,
  company: true,
  assignedTo: true,
  createdAtV: false,
  deadline: true,
  project: true,
  milestone: false,
  taskType: false,
  overtime: false,
  pausal: false,
  tags: false,
  subtasksApproved: false,
  subtasksPending: false,
  tripsApproved: false,
  tripsPending: false,
  materialsApproved: false,
  materialsPending: false,
  itemsApproved: false,
  itemsPending: false,
}
export const orderByValues = [
  {
    value: 'id',
    label: 'ID',
    type: 'int'
  },
  {
    value: 'status',
    label: 'Status',
    type: 'object'
  },
  {
    value: 'title',
    label: 'Title',
    type: 'text'
  },
  {
    value: 'requester',
    label: 'Requester',
    type: 'user'
  },
  {
    value: 'createdAt',
    label: 'Created at',
    type: 'date'
  },
  {
    value: 'deadline',
    label: 'Deadline',
    type: 'date'
  }
]
export const unimplementedAttributes = [
  'scheduledFrom', 'scheduledFromNow', 'scheduledTo', 'scheduledToNow',
  'createdAtFrom', 'createdAtFromNow', 'createdAtTo', 'createdAtToNow',
  'important',
  'invoiced',
  'pausal',
  'overtime'
]