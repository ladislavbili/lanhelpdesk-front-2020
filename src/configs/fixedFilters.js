import moment from 'moment';

export const getEmptyFilter = () => ({
  oneOf: [],
  requester:null,
  company:null,
  assignedTo:null,
  taskType:null,
  statusDateFrom: null,
  statusDateTo: null,
  closeDateFrom: null,
  closeDateTo: null,
  pendingDateFrom: null,
  pendingDateTo: null,
  deadlineFrom: null,
  deadlineTo: null,
  updatedAt: moment().unix()*1000
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
