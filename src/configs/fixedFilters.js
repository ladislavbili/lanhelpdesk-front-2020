import moment from 'moment';

export const getEmptyGeneralFilter = () => ({
  id: null,
  createdAt: "",
  updatedAt: "",
  createdBy: null,
  title: "",
  pub: false,
  global: false,
  dashboard: false,
  order: false,
  filter: getEmptyFilter(),
  roles: null,
  project: null,
})

export const getEmptyFilter = () => ({
  assignedToCur: false,
  assignedTo:null,
  requesterCur: false,
  requester:null,
  companyCur: false,
  company:null,
  taskType:null,
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
})

export const getFixedFilters = (  ) => {
  return [
    //all tasks
    {
      title: 'All tasks',
      id: null,
      createdAt: "",
      updatedAt: "",
      createdBy: null,
      pub: true,
      global: true,
      dashboard: true,
      order: 0,
      roles: null,
      project: null,
      filter:{
        ...getEmptyFilter(),
      }
    },
    // my tasks
    {
      title: 'My tasks',
      id: null,
      createdAt: "",
      updatedAt: "",
      createdBy: null,
      pub: true,
      global: true,
      dashboard: true,
      order: 1,
      roles: null,
      project: null,
      filter:{
        ...getEmptyFilter(),
        assignedToCur: true,
        requesterCur: true,
        oneOf: ['assignedTo', 'requester' ],
      }
    },
    // assignedTasks
    {
      title: 'Assigned tasks',
      id: null,
      createdAt: "",
      updatedAt: "",
      createdBy: null,
      pub: true,
      global: true,
      dashboard: true,
      order: 2,
      roles: null,
      project: null,
      filter:{
        ...getEmptyFilter(),
        assignedToCur: true,
      }
    },
    // escalatedTasks
    {
      title: 'Escalated tasks',
      id: null,
      createdAt: "",
      updatedAt: "",
      createdBy: null,
      pub: true,
      global: true,
      dashboard: true,
      order: 3,
      roles: null,
      project: null,
      filter:{
        ...getEmptyFilter(),
        assignedToCur: true,
        requesterCur: true,
        oneOf: ['assignedTo', 'requester' ],
        deadlineTo: moment().unix()*1000
      }
    },
  ]
}
