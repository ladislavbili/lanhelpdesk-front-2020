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
  labelId: 'currentUser',
  value: 'cur',
  id: 'cur'
};

export const emptyFilter = {
  requesters: [],
  companies: [],
  assignedTos: [],
  taskTypes: [],
  tags: [],
  statuses: [],

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
    value: null,
    labelId: 'any',
  },
  invoiced: {
    id: null,
    label: 'Any',
    value: null,
    labelId: 'any',
  },
  pausal: {
    id: null,
    label: 'Any',
    value: null,
    labelId: 'any',
  },
  overtime: {
    id: null,
    label: 'Any',
    value: null,
    labelId: 'any',
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
  assignedTos: [],
  requesterCur: false,
  requesters: [],
  companyCur: false,
  companies: [],
  taskTypes: [],
  tags: [],
  statuses: [],
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

export const booleanSelectOptions = [ {
  label: 'Any',
  label: 'any',
  value: null,
  id: null
}, {
  label: 'Ano',
  label: 'yes',
  value: true,
  id: 'ano'
}, {
  label: 'Nie',
  label: 'no',
  value: false,
  id: 'nie'
} ]