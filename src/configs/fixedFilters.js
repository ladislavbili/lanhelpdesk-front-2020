import moment from 'moment';

export const getEmptyFilter = () => ({
  oneOf: [],
  requester:null,
  requesterCur: false,
  company:null,
  companyCur: false,
  assignedTo:null,
  assignedToCur: false,
  taskType:null,
  statusDateFrom: null,
  statusDateTo: null,
  statusDateFromNow: null,
  statusDateToNow: null,
  closeDateFrom: null,
  closeDateTo: null,
  closeDateFromNow: null,
  closeDateToNow: null,
  pendingDateFrom: null,
  pendingDateTo: null,
  pendingDateFromNow: null,
  pendingDateToNow: null,
  deadlineFrom: null,
  deadlineTo: null,
  deadlineFromNow: null,
  deadlineToNow: null,
  updatedAt: moment().unix()
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
