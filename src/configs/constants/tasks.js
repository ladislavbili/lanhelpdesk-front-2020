import React from 'react';
import {
  toMomentInput,
  timeRangeToString,
} from 'helperFunctions';
import TableSubtask from 'helpdesk/task/tasklist/components/tableSubtask';

export const defaultTasksAttributesFilter = {
  id: "",
  title: "",
  status: "",
  requester: "",
  company: "",
  createdAt: null,
  startsAt: null,
  deadline: null,
  project: "",
  taskType: "",
  assignedTo: "",
  tags: "",
  overtime: "",
  pausal: "",
}

export const defaultSorts = [
  //list
  {
    layout: 0,
    sort: 'status',
    asc: true
  },
  //now list used to be columns
  {
    layout: 1,
    sort: 'status',
    asc: true
  },
  //DnD
  {
    layout: 2,
    sort: 'createdAt',
    asc: false
  },
  //calendar
  {
    layout: 3,
    sort: 'status',
    asc: true
  },
  //gantt
  {
    layout: 4,
    sort: 'startsAt',
    asc: true
  },
]

export const defaultTasklistColumnPreference = {
  taskId: true,
  important: true,
  invoiced: true,
  title: true,
  status: true,
  requester: false,
  company: false,
  assignedTo: false,
  createdAtV: true,
  startsAt: false,
  deadline: false,
  project: true,
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
  repeat: false,
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
  subtasks: false,
  subtaskAssigned: false,
  subtasksHours: false,
}

export const orderByValues = [
  {
    value: 'id',
    label: 'ID',
    labelId: 'id',
    type: 'int',
  },
  {
    value: 'important',
    label: 'Important',
    labelId: 'important',
    type: 'boolean',
  },
  {
    value: 'title',
    label: 'Title',
    labelId: 'title',
    type: 'text',
  },
  {
    value: 'status',
    label: 'Status',
    labelId: 'status',
    type: 'object',
  },
  {
    value: 'requester',
    label: 'Requester',
    labelId: 'requester',
    type: 'user',
  },
  {
    value: 'updatedAt',
    label: 'Change date',
    labelId: 'updatedAt',
    type: 'date',
  },
  {
    value: 'createdAt',
    label: 'Created at',
    labelId: 'createdAt',
    type: 'date',
  },
  {
    value: 'startsAt',
    label: 'Starts at',
    labelId: 'startsAt',
    type: 'date',
  },
  {
    value: 'deadline',
    label: 'Deadline',
    labelId: 'deadline',
    type: 'date',
  },
]

const checkAttributeRight = ( project, right ) => {
  if ( !project ) {
    return false;
  }
  return project.attributeRights[ right ].view
}

const checkRight = ( project, right ) => {
  if ( !project ) {
    return false;
  }
  return project.right[ right ]
}

export const attributeLimitingRights = [
  {
    right: ( project ) => checkAttributeRight( project, 'assigned' ),
    preference: 'assignedTo'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'company' ),
    preference: 'company'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'overtime' ),
    preference: 'overtime'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'pausal' ),
    preference: 'pausal'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'requester' ),
    preference: 'requester'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'status' ),
    preference: 'status'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'tags' ),
    preference: 'tags'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'startsAt' ),
    preference: 'startsAt'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'deadline' ),
    preference: 'deadline'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'taskType' ),
    preference: 'taskType'
  },
  {
    right: ( project ) => checkRight( project, 'taskWorksRead' ),
    preference: 'works'
  },
  {
    right: ( project ) => checkRight( project, 'taskWorksRead' ),
    preference: 'trips'
  },
  {
    right: ( project ) => checkRight( project, 'taskMaterialsRead' ),
    preference: 'materialsWithoutDPH'
  },
  {
    right: ( project ) => checkRight( project, 'taskMaterialsRead' ),
    preference: 'materialsWithDPH'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'repeat' ),
    preference: 'repeat'
  },
]
export const ganttAttributeLimitingRights = [
  {
    right: ( project ) => checkAttributeRight( project, 'assigned' ),
    preference: 'assignedTo'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'company' ),
    preference: 'company'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'overtime' ),
    preference: 'overtime'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'pausal' ),
    preference: 'pausal'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'requester' ),
    preference: 'requester'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'status' ),
    preference: 'status'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'tags' ),
    preference: 'tags'
  },
  {
    right: ( project ) => checkAttributeRight( project, 'taskType' ),
    preference: 'taskType'
  },
  {
    right: ( project ) => checkRight( project, 'taskWorksRead' ),
    preference: 'works'
  },
  {
    right: ( project ) => checkRight( project, 'taskWorksRead' ),
    preference: 'trips'
  },
  {
    right: ( project ) => checkRight( project, 'taskMaterialsRead' ),
    preference: 'materialsWithoutDPH'
  },
  {
    right: ( project ) => checkRight( project, 'taskMaterialsRead' ),
    preference: 'materialsWithDPH'
  },
  {
    right: ( project ) => checkRight( project, 'taskWorksRead' ),
    preference: 'subtasks'
  },
  {
    right: ( project ) => checkRight( project, 'taskWorksRead' ),
    preference: 'subtaskAssigned'
  },
  {
    right: ( project ) => checkRight( project, 'taskWorksRead' ),
    preference: 'subtasksHours'
  },
]
export const unimplementedAttributes = [
]

//create state for all, display only available ones
export const allFilterAttributes = [
  {
    value: 'id',
    labelId: 'id',
    label: 'ID',
    right: null,
  },
  {
    value: 'title',
    labelId: 'title',
    label: 'Title',
    right: null,
  },
  {
    value: 'status',
    labelId: 'status',
    label: 'Status',
    right: ( project ) => checkAttributeRight( project, 'status' ),
  },
  {
    value: 'project',
    labelId: 'project',
    label: 'Project',
    right: null,
  },
  {
    value: 'requester',
    labelId: 'requester',
    label: 'Requester',
    right: ( project ) => checkAttributeRight( project, 'requester' ),
  },
  {
    value: 'company',
    labelId: 'company2',
    label: 'Company',
    right: ( project ) => checkAttributeRight( project, 'company' ),
  },
  {
    value: 'assignedTo',
    labelId: 'assignedTo',
    label: 'Assigned',
    right: ( project ) => checkAttributeRight( project, 'assigned' ),
  },
  {
    value: 'tags',
    labelId: 'tags',
    label: 'Tags',
    right: ( project ) => checkAttributeRight( project, 'tags' ),
  },
  {
    value: 'taskType',
    labelId: 'taskType',
    label: 'Task Type',
    right: ( project ) => checkAttributeRight( project, 'taskType' ),
  },
  {
    value: 'createdAt',
    labelId: 'createdAt',
    label: 'Created at',
    right: null,
  },
  {
    value: 'startsAt',
    labelId: 'startsAt',
    label: 'Starts at',
    right: ( project ) => checkAttributeRight( project, 'startsAt' ),
  },
  {
    value: 'deadline',
    labelId: 'deadline',
    label: 'Deadline',
    right: ( project ) => checkAttributeRight( project, 'deadline' ),
  },
  {
    value: 'pausal',
    labelId: 'pausal',
    label: 'Pausal',
    right: ( project ) => checkAttributeRight( project, 'pausal' ),
  },
  {
    value: 'overtime',
    labelId: 'overtime',
    label: 'Overtime',
    right: ( project ) => checkAttributeRight( project, 'overtime' ),
  },
]

export const createDisplayValues = ( preference, withoutProject, t ) => {
  let displayValues = [
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
      value: 'important',
      labelId: 'important',
      label: 'Important',
      type: 'important',
      show: preference[ 'important' ]
    },
    {
      value: 'invoiced',
      labelId: 'invoiced',
      label: 'Invoiced',
      type: 'invoiced',
      show: preference[ 'invoiced' ]
    },
    {
      value: 'title',
      labelId: 'title',
      label: 'Title',
      type: 'text',
      show: preference[ 'title' ],
      className: 'min-width-150',
    },
    {
      value: 'status',
      labelId: 'status',
      label: 'Status',
      type: 'object',
      show: preference[ 'status' ],
      width: '50',
    },
    {
      value: 'requester',
      labelId: 'requester',
      label: 'Requester',
      type: 'user',
      show: preference[ 'requester' ]
    },
    {
      value: 'company',
      labelId: 'company',
      label: 'Company',
      type: 'object',
      show: preference[ 'company' ]
    },
    {
      value: 'assignedTo',
      labelId: 'assignedTo',
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
    /*
    {
    value: 'scheduled',
    label: 'Scheduled',
    type: 'list',
    func: ( items ) => {
    if ( items.length === 0 ) {
    return null;
    }
    return (
    <div>
    { items.map((item)=><div key={item.id}>{timeRangeToString(toMomentInput(item.from), toMomentInput(item.to))}</div>) }
    </div>
    )
    },
    show: preference[ 'scheduled' ]
    },
    */
    {
      value: 'tags',
      labelId: 'tags',
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
      labelId: 'taskType',
      label: 'Task Type',
      type: 'object',
      show: preference[ 'taskType' ]
    },
    {
      value: 'createdAt',
      labelId: 'createdAt',
      label: 'Created at',
      type: 'date',
      show: preference[ 'createdAtV' ],
      visKey: 'createdAtV'
    },
    {
      value: 'startsAt',
      labelId: 'startsAt',
      label: 'Starts at',
      type: 'date',
      show: preference[ 'startsAt' ]
    },
    {
      value: 'deadline',
      labelId: 'deadline',
      label: 'Deadline',
      type: 'date',
      show: preference[ 'deadline' ]
    },
    {
      value: 'pausal',
      labelId: 'pausal',
      label: 'Pausal',
      type: 'boolean',
      show: preference[ 'pausal' ]
    },
    {
      value: 'overtime',
      labelId: 'overtime',
      label: 'Overtime',
      type: 'boolean',
      show: preference[ 'overtime' ]
    },
    {
      value: 'works',
      labelId: 'works',
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
      labelId: 'trips',
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
      labelId: 'materialsWithoutTax',
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
      labelId: 'materialsWithTax',
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
    {
      value: 'repeat',
      labelId: 'repeat',
      label: 'Repeat',
      type: 'custom',
      func: ( task ) => {
        return task.repeat ? `${t('repeatEvery')} ${task.repeat.repeatEvery} ${t(task.repeat.repeatInterval).toLowerCase()}` : t( 'noRepeat' );
      },
      show: preference[ 'repeat' ],
    },
  ]
  if ( !withoutProject ) {
    displayValues.splice(
      6,
      0, {
        value: 'project',
        labelId: 'project',
        label: 'Project',
        type: 'object',
        show: preference[ 'project' ]
      },
    )
  }
  return displayValues;
}
export const createGanttDisplayValues = ( preference, taskVariables ) => {

  return [
    {
      value: 'startsAt',
      labelId: 'startsAt',
      label: 'Starts at',
      type: 'date',
      show: true,
      permanent: true,
      width: '120px',
    },
    {
      value: 'deadline',
      labelId: 'deadline',
      label: 'End date',
      type: 'date',
      show: true,
      permanent: true,
      width: '120px',
    },
    {
      value: 'important',
      labelId: 'important',
      label: 'Important',
      type: 'important',
      show: preference[ 'important' ]
    },
    {
      value: 'invoiced',
      labelId: 'invoiced',
      label: 'Invoiced',
      type: 'invoiced',
      show: preference[ 'invoiced' ]
    },
    {
      value: 'title',
      labelId: 'title',
      label: 'Title',
      type: 'text',
      show: true,
      permanent: true,
      className: 'min-width-150',
    },
    {
      value: 'id',
      labelId: 'id',
      label: 'ID',
      type: 'int',
      show: preference[ 'taskId' ],
      visKey: 'taskId',
      width: '50',
    },
    {
      value: 'status',
      labelId: 'status',
      label: 'Status',
      type: 'object',
      show: preference[ 'status' ],
      width: '50',
    },
    {
      value: 'requester',
      labelId: 'requester',
      label: 'Requester',
      type: 'user',
      show: preference[ 'requester' ]
    },
    {
      value: 'company',
      labelId: 'company',
      label: 'Company',
      type: 'object',
      show: preference[ 'company' ]
    },
    {
      value: 'assignedTo',
      labelId: 'assignedTo',
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
    /*
    {
    value: 'scheduled',
    labelId: 'scheduled',
    label: 'Scheduled',
    type: 'list',
    func: ( items ) => {
    if ( items.length === 0 ) {
    return null;
    }
    return (
    <div>
    { items.map((item)=><div key={item.id}>{timeRangeToString(toMomentInput(item.from), toMomentInput(item.to))}</div>) }
    </div>
    )
    },
    show: preference[ 'scheduled' ]
    },
    */
    {
      value: 'tags',
      labelId: 'tags',
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
      labelId: 'taskType',
      label: 'Task Type',
      type: 'object',
      show: preference[ 'taskType' ]
    },
    {
      value: 'createdAt',
      labelId: 'createdAt',
      label: 'Created at',
      type: 'date',
      show: preference[ 'createdAtV' ],
      visKey: 'createdAtV'
    },
    {
      value: 'pausal',
      labelId: 'pausal',
      label: 'Pausal',
      type: 'boolean',
      show: preference[ 'pausal' ]
    },
    {
      value: 'overtime',
      labelId: 'overtime',
      label: 'Overtime',
      type: 'boolean',
      show: preference[ 'overtime' ]
    },
    {
      value: 'works',
      labelId: 'works',
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
      labelId: 'trips',
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
      labelId: 'materialsWithoutDPH',
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
      labelId: 'materialsWithDPH',
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
    {
      value: 'subtasks',
      labelId: 'works',
      label: 'Subtasks',
      type: 'custom',
      func: ( task ) => (
        <TableSubtask task={task} taskVariables={taskVariables} />
      ),
      show: preference[ 'subtasks' ]
    },
    {
      value: 'subtaskAssigned',
      labelId: 'worksAssignedTo',
      label: 'Subtask assigned to',
      type: 'custom',
      func: ( task ) => (
        <div>
          { task.subtasks.map((subtask) => (
            <div key={subtask.id} className="m-r-5 m-t-5 p-l-5 p-r-5">
              { subtask.assignedTo ? `${subtask.assignedTo.fullName}` : '---'}
            </div>
          ))}
        </div>
      ),
      show: preference[ 'subtaskAssigned' ]
    },
    {
      value: 'subtasksHours',
      labelId: 'hours',
      label: 'Hours',
      type: 'custom',
      func: ( task ) => (
        <div>
          { task.subtasks.map((subtask) => (
            <div key={subtask.id} className="m-r-5 m-t-5 p-l-5 p-r-5">
              { subtask.quantity }
            </div>
          ))}
        </div>
      ),
      show: preference[ 'subtasksHours' ]
    },

  ]
}

export const actionsAfterAdd = [
  {
    id: 0,
    value: 0,
    action: 'open_new_task',
    label: 'Open task'
  },
  {
    id: 1,
    value: 1,
    action: 'open_tasklist',
    label: 'Open list'
  },
]