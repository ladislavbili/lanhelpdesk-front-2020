import moment from 'moment';

export const getEmptyFilter = () => ({
  oneOf: [],
  requester:null,
  company:null,
  assigned:null,
  workType:null,
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
        assigned: "cur",
        requester: "cur",
        oneOf: ['assigned', 'requester' ],
      }
    },
    // assignedTasks
    {
      title: 'Assigned tasks',
      id: 'assignedTasks',
      filter:{
        ...getEmptyFilter(),
        assigned: "cur",
      }
    },
    // escalatedTasks
    {
      title: 'Escalated tasks',
      id: 'escalatedTasks',
      filter:{
        ...getEmptyFilter(),
        assigned: "cur",
        requester: "cur",
        oneOf: ['assigned', 'requester' ],
        deadlineTo: moment().unix()*1000
      }
    },
  ]
}
