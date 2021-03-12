export const oneOfOptions = [ {
    value: 'requester',
    label: 'Requester'
  },
  {
    value: 'assigned',
    label: 'Assigned'
  },
  {
    value: 'company',
    label: 'Company'
  }
]

export const ofCurrentUser = {
  label: 'Current',
  value: 'cur',
  id: 'cur'
};


export const emptyFilter = {
  requester: {
    id: null,
    label: 'All',
    value: null
  },
  company: {
    id: null,
    label: 'All',
    value: null
  },
  assigned: {
    id: null,
    label: 'All',
    value: null
  },
  taskType: {
    id: null,
    label: 'All',
    value: null
  },

  statusDateFrom: null,
  statusDateFromNow: false,
  statusDateFromShowCalendar: false,
  statusDateTo: null,
  statusDateToNow: false,
  statusDateToShowCalendar: false,

  closeDateFrom: null,
  closeDateFromNow: false,
  closeDateTo: null,
  closeDateToNow: false,

  pendingDateFrom: null,
  pendingDateFromNow: false,
  pendingDateTo: null,
  pendingDateToNow: false,

  deadlineFrom: null,
  deadlineFromNow: false,
  deadlineTo: null,
  deadlineToNow: false,

  scheduledFrom: null,
  scheduledFromNow: false,
  scheduledTo: null,
  scheduledToNow: false,

  createdAtFrom: null,
  createdAtFromNow: false,
  createdAtTo: null,
  createdAtToNow: false,

  important: {
    id: null,
    label: 'Any',
    value: null
  },
  invoiced: {
    id: null,
    label: 'Any',
    value: null
  },
  pausal: {
    id: null,
    label: 'Any',
    value: null
  },
  overtime: {
    id: null,
    label: 'Any',
    value: null
  },

  public: false,
  oneOf: []
}

export const getEmptyGeneralFilter = () => ( {
  dashboard: false,
  global: false,
  id: null,
  project: null,
  pub: false,
  title: "",
  filter: getEmptyFilter(),
  roles: null,
} )

export const getEmptyFilter = () => ( {
  assignedToCur: false,
  assignedTo: null,
  requesterCur: false,
  requester: null,
  companyCur: false,
  company: null,
  taskType: null,
  oneOf: [],

  statusDateFrom: null,
  statusDateFromNow: false,
  statusDateTo: null,
  statusDateToNow: false,
  closeDateFrom: null,
  closeDateFromNow: false,
  closeDateTo: null,
  closeDateToNow: false,
  pendingDateFrom: null,
  pendingDateFromNow: false,
  pendingDateTo: null,
  pendingDateToNow: false,
  deadlineFrom: null,
  deadlineFromNow: false,
  deadlineTo: null,
  deadlineToNow: false,

  scheduledFrom: null,
  scheduledFromNow: false,
  scheduledTo: null,
  scheduledToNow: false,

  createdAtFrom: null,
  createdAtFromNow: false,
  createdAtTo: null,
  createdAtToNow: false,

  important: null,
  invoiced: null,
  pausal: null,
  overtime: null,
} )