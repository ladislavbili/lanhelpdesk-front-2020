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
      id: 'all',
      filter:{
        ...getEmptyFilter(),
      }
    },
    // my tasks
    {
      title: 'My tasks',
      id: 'myTasks',
      filter:{
        ...getEmptyFilter(),
        assignedTo: "cur",
        requester: "cur",
        oneOf: ['assignedTo', 'requester' ],
      }
    },
    // assignedTasks
    {
      title: 'Assigned tasks',
      id: 'assignedTasks',
      filter:{
        ...getEmptyFilter(),
        assignedTo: "cur",
      }
    },
    // escalatedTasks
    {
      title: 'Escalated tasks',
      id: 'escalatedTasks',
      filter:{
        ...getEmptyFilter(),
        assignedTo: "cur",
        requester: "cur",
        oneOf: ['assignedTo', 'requester' ],
        deadlineTo: moment().unix()*1000
      }
    },
  ]
}
