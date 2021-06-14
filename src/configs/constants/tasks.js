import React from 'react';

export const defaultTasksAttributesFilter = {
  id: "",
  status: "",
  title: "",
  requester: "",
  company: "",
  createdAt: "",
  startsAt: "",
  deadline: "",
  project: "",
  taskType: "",
  milestone: "",
  assignedTo: "",
  tags: "",
  overtime: "",
  pausal: "",
}
export const defaultTaskSort = {
  key: 'status',
  asc: true
}

export const defaultGanttSort = {
  key: 'startsAt',
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
  startsAt: false,
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
  works: false,
  trips: false,
  materialsWithoutDPH: false,
  materialsWithDPH: false,
}

export const defaultTasklistGanttColumnPreference = {
  taskId: true,
  status: true,
  important: true,
  invoiced: true,
  requester: true,
  company: true,
  assignedTo: true,
  createdAtV: false,
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
  works: false,
  trips: false,
  materialsWithoutDPH: false,
  materialsWithDPH: false,
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
    value: 'startsAt',
    label: 'Starts at',
    type: 'date'
  },
  {
    value: 'deadline',
    label: 'Deadline',
    type: 'date'
  }
]
export const attributeLimitingRights = [
  {
    right: 'assignedRead',
    preference: 'assignedTo'
  },
  {
    right: 'companyRead',
    preference: 'company'
  },
  {
    right: 'overtimeRead',
    preference: 'overtime'
  },
  {
    right: 'pausalRead',
    preference: 'pausal'
  },
  {
    right: 'requesterRead',
    preference: 'requester'
  },
  {
    right: 'statusRead',
    preference: 'status'
  },
  {
    right: 'tagsRead',
    preference: 'tags'
  },
  {
    right: 'deadlineRead',
    preference: 'startsAt'
  },
  {
    right: 'deadlineRead',
    preference: 'deadline'
  },
  {
    right: 'milestoneRead',
    preference: 'milestone'
  },
  {
    right: 'typeRead',
    preference: 'taskType'
  },
  {
    right: 'vykazRead',
    preference: 'works'
  },
  {
    right: 'vykazRead',
    preference: 'trips'
  },
  {
    right: 'vykazRead',
    preference: 'materialsWithoutDPH'
  },
  {
    right: 'vykazRead',
    preference: 'materialsWithDPH'
  },
]
export const ganttAttributeLimitingRights = [
  {
    right: 'assignedRead',
    preference: 'assignedTo'
  },
  {
    right: 'companyRead',
    preference: 'company'
  },
  {
    right: 'overtimeRead',
    preference: 'overtime'
  },
  {
    right: 'pausalRead',
    preference: 'pausal'
  },
  {
    right: 'requesterRead',
    preference: 'requester'
  },
  {
    right: 'statusRead',
    preference: 'status'
  },
  {
    right: 'tagsRead',
    preference: 'tags'
  },
  {
    right: 'typeRead',
    preference: 'taskType'
  },
  {
    right: 'vykazRead',
    preference: 'works'
  },
  {
    right: 'vykazRead',
    preference: 'trips'
  },
  {
    right: 'vykazRead',
    preference: 'materialsWithoutDPH'
  },
  {
    right: 'vykazRead',
    preference: 'materialsWithDPH'
  },
]
export const unimplementedAttributes = [
]

export const createDisplayValues = ( preference ) => [
  {
    value: 'checked',
    label: '',
    type: 'checkbox',
    show: true,
    width: '40',
  },
  {
    value: 'id',
    label: 'ID',
    type: 'int',
    show: preference[ 'taskId' ],
    visKey: 'taskId',
    width: '50',
  },
  {
    value: 'status',
    label: 'Status',
    type: 'object',
    show: preference[ 'status' ],
    width: '50',
  },
  {
    value: 'important',
    label: 'Important',
    type: 'important',
    show: preference[ 'important' ]
  },
  {
    value: 'invoiced',
    label: 'Invoiced',
    type: 'invoiced',
    show: preference[ 'invoiced' ]
  },
  {
    value: 'title',
    label: 'Title',
    type: 'text',
    show: preference[ 'title' ],
    width: '30%',
  },
  {
    value: 'project',
    label: 'Project',
    type: 'object',
    show: preference[ 'project' ]
  },
  {
    value: 'milestone',
    label: 'Milestone',
    type: 'object',
    show: preference[ 'milestone' ]
  },
  {
    value: 'requester',
    label: 'Requester',
    type: 'user',
    show: preference[ 'requester' ]
  },
  {
    value: 'company',
    label: 'Company',
    type: 'object',
    show: preference[ 'company' ]
  },
  {
    value: 'assignedTo',
    label: 'Assigned',
    type: 'list',
    func: ( items ) => {
      if ( items.length === 0 ) {
        return <div className="message error-message">Nepriradený</div>
      }
      return (
        <div>
          { items.map((item)=><div key={item.id}>{item.fullName}</div>) }
        </div>
      )
    },
    show: preference[ 'assignedTo' ]
  },
  {
    value: 'tags',
    label: 'Tags',
    type: 'list',
    func: ( items ) => (
      <div>
        { items.map((item)=>(
          <div key={item.id} style={{ background: item.color, color: 'white', borderRadius: 3 }} className="m-r-5 m-t-5 p-l-5 p-r-5">
            {item.title}
          </div>
        ) ) }
      </div>
    ),
    show: preference[ 'tags' ]
  },
  {
    value: 'taskType',
    label: 'Task Type',
    type: 'object',
    show: preference[ 'taskType' ]
  },
  {
    value: 'createdAt',
    label: 'Created at',
    type: 'date',
    show: preference[ 'createdAtV' ],
    visKey: 'createdAtV'
  },
  {
    value: 'startsAt',
    label: 'Starts at',
    type: 'date',
    show: preference[ 'startsAt' ]
  },
  {
    value: 'deadline',
    label: 'Deadline',
    type: 'date',
    show: preference[ 'deadline' ]
  },
  {
    value: 'pausal',
    label: 'Pausal',
    type: 'boolean',
    show: preference[ 'pausal' ]
  },
  {
    value: 'overtime',
    label: 'Overtime',
    type: 'boolean',
    show: preference[ 'overtime' ]
  },
  {
    value: 'works',
    label: 'Works',
    type: 'custom',
    func: ( task ) => {
      if ( task.subtasksQuantity !== undefined && task.subtasksQuantity !== null ) {
        return task.subtasksQuantity;
      }
      return '---';
    },
    show: preference[ 'works' ],
  },
  {
    value: 'trips',
    label: 'Trips',
    type: 'custom',
    func: ( task ) => {
      if ( task.workTripsQuantity !== undefined && task.workTripsQuantity !== null ) {
        return task.workTripsQuantity;
      }
      return '---';
    },
    show: preference[ 'trips' ],
  },
  {
    value: 'materialsWithoutDPH',
    label: 'Materials without DPH',
    type: 'custom',
    func: ( task ) => {
      if ( task.materialsPrice !== undefined && task.materialsPrice !== null ) {
        return task.materialsPrice;
      }
      return '---';
    },
    show: preference[ 'materialsWithoutDPH' ],
  },
  {
    value: 'materialsWithDPH',
    label: 'Materials with DPH',
    type: 'custom',
    func: ( task ) => {
      if ( task.materialsPrice !== undefined && task.materialsPrice !== null ) {
        return task.materialsPrice * ( 1 + ( task.company ? task.company.dph : 20 ) / 100 );
      }
      return '---';
    },
    show: preference[ 'materialsWithDPH' ],
  },
]

export const createGanttDisplayValues = ( preference ) => [
  {
    value: 'startsAt',
    label: 'Starts at',
    type: 'date',
    show: true,
    permanent: true,
    width: '120px',
  },
  {
    value: 'deadline',
    label: 'End date',
    type: 'date',
    show: true,
    permanent: true,
    width: '120px',
  },
  {
    value: 'important',
    label: 'Important',
    type: 'important',
    show: preference[ 'important' ]
  },
  {
    value: 'invoiced',
    label: 'Invoiced',
    type: 'invoiced',
    show: preference[ 'invoiced' ]
  },
  {
    value: 'title',
    label: 'Title',
    type: 'text',
    show: true,
    permanent: true,
    width: '30%',
  },
  {
    value: 'id',
    label: 'ID',
    type: 'int',
    show: preference[ 'taskId' ],
    visKey: 'taskId',
    width: '50',
  },
  {
    value: 'status',
    label: 'Status',
    type: 'object',
    show: preference[ 'status' ],
    width: '50',
  },
  {
    value: 'requester',
    label: 'Requester',
    type: 'user',
    show: preference[ 'requester' ]
  },
  {
    value: 'company',
    label: 'Company',
    type: 'object',
    show: preference[ 'company' ]
  },
  {
    value: 'assignedTo',
    label: 'Assigned',
    type: 'list',
    func: ( items ) => {
      if ( items.length === 0 ) {
        return <div className="message error-message">Nepriradený</div>
      }
      return (
        <div>
          { items.map((item)=><div key={item.id}>{item.fullName}</div>) }
        </div>
      )
    },
    show: preference[ 'assignedTo' ]
  },
  {
    value: 'tags',
    label: 'Tags',
    type: 'list',
    func: ( items ) => (
      <div>
        { items.map((item)=>(
          <div key={item.id} style={{ background: item.color, color: 'white', borderRadius: 3 }} className="m-r-5 m-t-5 p-l-5 p-r-5">
            {item.title}
          </div>
        ) ) }
      </div>
    ),
    show: preference[ 'tags' ]
  },
  {
    value: 'taskType',
    label: 'Task Type',
    type: 'object',
    show: preference[ 'taskType' ]
  },
  {
    value: 'createdAt',
    label: 'Created at',
    type: 'date',
    show: preference[ 'createdAtV' ],
    visKey: 'createdAtV'
  },
  {
    value: 'pausal',
    label: 'Pausal',
    type: 'boolean',
    show: preference[ 'pausal' ]
  },
  {
    value: 'overtime',
    label: 'Overtime',
    type: 'boolean',
    show: preference[ 'overtime' ]
  },
  {
    value: 'works',
    label: 'Works',
    type: 'custom',
    func: ( task ) => {
      if ( task.subtasksQuantity !== undefined && task.subtasksQuantity !== null ) {
        return task.subtasksQuantity;
      }
      return '---';
    },
    show: preference[ 'works' ],
  },
  {
    value: 'trips',
    label: 'Trips',
    type: 'custom',
    func: ( task ) => {
      if ( task.workTripsQuantity !== undefined && task.workTripsQuantity !== null ) {
        return task.workTripsQuantity;
      }
      return '---';
    },
    show: preference[ 'trips' ],
  },
  {
    value: 'materialsWithoutDPH',
    label: 'Materials without DPH',
    type: 'custom',
    func: ( task ) => {
      if ( task.materialsPrice !== undefined && task.materialsPrice !== null ) {
        return task.materialsPrice;
      }
      return '---';
    },
    show: preference[ 'materialsWithoutDPH' ],
  },
  {
    value: 'materialsWithDPH',
    label: 'Materials with DPH',
    type: 'custom',
    func: ( task ) => {
      if ( task.materialsPrice !== undefined && task.materialsPrice !== null ) {
        return task.materialsPrice * ( 1 + ( task.company ? task.company.dph : 20 ) / 100 );
      }
      return '---';
    },
    show: preference[ 'materialsWithDPH' ],
  },
]