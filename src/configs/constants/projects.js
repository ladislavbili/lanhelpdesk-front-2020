import booleanSelects from './boolSelect';
import {
  remapRightsToBackend
} from 'helpdesk/settings/projects/helpers';
let fakeID = -1;

export const allACLs = [
  {
    id: 'header1',
    title: 'Project ACL',
    header: true
  },
  {
    id: 'projectPrimary',
    title: 'Project name & description VIEW/EDIT',
    disabled: [ {
      key: 'projectSecondary',
      values: 'read'
    } ],
    both: true
  },
  {
    id: 'projectSecondary',
    title: 'Project settings & ACL - write and edit  VIEW + EDIT',
    dependancy: [ {
      key: 'projectPrimary',
      affect: 'read'
    } ],
    both: false
  },
  {
    id: 'separator1',
    separator: true,
  },
  {
    id: 'header2',
    title: 'Task list',
    header: true,
  },
  {
    id: 'myTasks',
    title: 'View my tasks created/requested/assigned',
    both: false,
    fake: true,
    value: true,
    disabled: [
      {
        key: 'myTasks'
    }
  ]
  },
  {
    id: 'companyTasks',
    title: 'View my company tasks',
    both: false,
    disabled: [
      {
        key: 'allTasks'
    }
  ]
  },
  {
    id: 'allTasks',
    title: 'View all tasks',
    dependancy: [
      {
        key: 'companyTasks',
    }
  ],
    both: false
  },
  {
    id: 'statistics',
    title: 'View statistics',
    both: false,
  },
  {
    id: 'separator2',
    separator: true,
  },
  {
    id: 'headerAdd',
    title: 'Add task',
    header: true,
  },
  {
    id: 'addTasks',
    title: 'Add Tasks (can be requester)',
    both: false
  },
  {
    id: 'separator3',
    separator: true,
  },
  {
    id: 'headerEdit',
    title: 'Edit task',
    header: true,
  },
  {
    id: 'deleteTasks',
    title: 'Delete Tasks',
    both: false
  },
  {
    id: 'important',
    title: 'Mark tasks as important',
    both: false
  },
  {
    id: 'taskTitleEdit',
    title: 'Task title edit',
    both: false
  },
  {
    id: 'taskDescription',
    title: 'Task description',
    both: true
  },
  {
    id: 'taskShortSubtasks',
    title: 'Task subtasks VIEW/EDIT',
    both: true
  },
  {
    id: 'taskAttachments',
    title: 'Task attachments VIEW/EDIT',
    both: true
  },
  {
    id: 'pausalInfo',
    title: 'Task pausal info VIEW/EDIT',
    both: false
  },
  {
    id: 'vykaz',
    title: 'Vykaz VIEW/EDIT',
    both: true
  },
  {
    id: 'rozpocet',
    title: 'Rozpočet VIEW/EDIT',
    both: true
  },
  {
    id: 'separator4',
    separator: true,
  },
  {
    id: 'header3',
    title: 'Task default attributes',
    header: true
  },
  {
    id: 'status',
    title: 'Status VIEW/EDIT',
    both: true
  },
  {
    id: 'tags',
    title: 'Tags VIEW/EDIT',
    both: true
  },
  {
    id: 'assigned',
    title: 'Assigned to VIEW/EDIT',
    both: true
  },
  {
    id: 'requester',
    title: 'Requester VIEW/EDIT',
    both: true
  },
  {
    id: 'company',
    title: 'Company VIEW/EDIT',
    both: true
  },
  {
    id: 'project',
    title: 'Project VIEW/EDIT',
    both: true
  },
  {
    id: 'milestone',
    title: 'Milestone VIEW/EDIT',
    both: true
  },
  {
    id: 'deadline',
    title: 'Deadline VIEW/EDIT',
    both: true
  },
  {
    id: 'scheduled',
    title: 'Scheduled VIEW/EDIT',
    both: true
  },
  {
    id: 'repeat',
    title: 'Repeat VIEW/EDIT',
    both: true
  },
  {
    id: 'type',
    title: 'Type VIEW/EDIT',
    both: true
  },
  {
    id: 'separator5',
    separator: true,
  },
  {
    id: 'headerSLA',
    title: 'Pausal',
    header: true,
  },
  {
    id: 'pausal',
    title: 'Pausal VIEW/EDIT',
    both: true
  },
  {
    id: 'overtime',
    title: 'Mimo pracovných hodín VIEW/EDIT',
    both: true
  },
  {
    id: 'separator6',
    separator: true,
  },
  {
    id: 'headerComments',
    title: 'Comments & history',
    header: true,
  },
  {
    id: 'viewComments',
    title: 'View comments',
    both: false,
    disabled: [ {
      key: 'addComments'
    }, {
      key: 'internal'
    }, {
      key: 'emails'
    } ]
  },
  {
    id: 'addComments',
    title: 'Add comments',
    dependancy: [ {
      key: 'viewComments',
    } ],
    both: false
  },
  {
    id: 'internal',
    title: 'Internal comments',
    dependancy: [ {
      key: 'viewComments',
    } ],
    both: false
  },
  {
    id: 'emails',
    title: 'Send emails from comments',
    dependancy: [ {
      key: 'viewComments',
    } ],
    both: false
  },
  {
    id: 'history',
    title: 'Task history',
    both: false
  },

];

export const createCleanRights = ( access = false ) => {
  let rights = {};
  allACLs.filter( ( acl ) => !acl.header && !acl.fake ).forEach( ( acl ) => {
    if ( acl.both ) {
      rights[ acl.id ] = {
        read: access,
        write: access
      };
    } else {
      rights[ acl.id ] = access;
    }
  } )
  return rights;
}

export const backendCleanRights = ( access = false ) => {
  return remapRightsToBackend( {
    title: '',
    id: 0,
    order: 0,
    rights: createCleanRights( access )
  } ).rights
}

export const defaultGroups = [ 'Admin', 'Manager', 'Agent', 'Customer' ].map( ( name, index ) => ( {
  title: name,
  description: `${name} role`,
  id: fakeID--,
  order: index,
  rights: createCleanRights( index === 0 )
} ) )

export const noDef = {
  status: {
    def: true,
    fixed: false,
    value: null,
    required: true
  },
  tag: {
    def: false,
    fixed: false,
    value: [],
    required: false
  },
  assignedTo: {
    def: true,
    fixed: false,
    value: [],
    required: true
  },
  requester: {
    def: true,
    fixed: false,
    value: null,
    required: true
  },
  company: {
    def: true,
    fixed: false,
    value: null,
    required: true
  },
  type: {
    def: false,
    fixed: false,
    value: null,
    required: false
  },
  pausal: {
    def: true,
    fixed: false,
    value: booleanSelects[ 0 ],
    required: true
  },
  overtime: {
    def: true,
    fixed: false,
    value: booleanSelects[ 0 ],
    required: true
  },
}

export const defList = ( required ) => ( {
  def: required,
  fixed: false,
  required,
  value: []
} );

export const defBool = ( required ) => ( {
  def: required,
  fixed: false,
  required,
  value: {
    value: false,
    label: 'No'
  }
} );

export const defItem = ( required ) => ( {
  def: required,
  fixed: false,
  required,
  value: null,
} );

export const emptyUserValue = {
  id: null,
  value: null,
  label: 'Task Creator',
  title: 'Task Creator'
}

export const emptyCompanyValue = {
  id: null,
  value: null,
  label: "Task Creator's company",
  title: "Task Creator's company"
}

export const emptyStatus = {
  title: 'New (first with new action)',
  id: null,
  label: 'New (first with new action)',
  value: null,
  color: 'green'
};