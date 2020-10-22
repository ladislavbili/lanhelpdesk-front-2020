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
    label: 'Žiadny',
    value: null
  },
  company: {
    id: null,
    label: 'Žiadny',
    value: null
  },
  assigned: {
    id: null,
    label: 'Žiadny',
    value: null
  },
  taskType: {
    id: null,
    label: 'Žiadny',
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

  public: false,
  oneOf: []
}