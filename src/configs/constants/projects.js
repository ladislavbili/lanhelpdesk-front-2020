import booleanSelects from './boolSelect';
import {
  remapRightsToBackend
} from 'helpdesk/settings/projects/helpers';
let fakeID = -1;

export const allACLs = [
  {
    id: 'sep1',
    title: 'PROJECT ACL',
    separator: true
  },
  {
    id: 'projectPrimary',
    title: 'Project name & description',
    disabled: [ {
      key: 'projectSecondary',
      values: 'read'
    } ],
    both: true
  },
  {
    id: 'projectSecondary',
    title: 'Project settings & ACL - write and edit',
    dependancy: [ {
      key: 'projectPrimary',
      affect: 'read'
    } ],
    both: false
  },
  {
    id: 'sep2',
    title: 'TASK ACL',
    separator: true,
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
    title: 'Task subtasks',
    both: true
  },
  {
    id: 'taskAttachments',
    title: 'Task attachments',
    both: true
  },
  {
    id: 'pausalInfo',
    title: 'Task pausal info',
    both: false
  },
  {
    id: 'vykaz',
    title: 'Vykaz',
    both: true
  },
  {
    id: 'rozpocet',
    title: 'Rozpočet',
    both: true
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
  {
    id: 'project',
    title: 'Project',
    both: true
  },
  {
    id: 'milestone',
    title: 'Milestone',
    both: true
  },
  {
    id: 'deadline',
    title: 'Deadline',
    both: true
  },
  {
    id: 'scheduled',
    title: 'Scheduled',
    both: true
  },
  {
    id: 'repeat',
    title: 'Repeat',
    both: true
  },
  {
    id: 'type',
    title: 'Type',
    both: true
  },
  {
    id: 'sep3',
    title: 'TASK ACL DEFAULT ATTRIBUTES',
    separator: true
  },
  {
    id: 'status',
    title: 'Status',
    both: true
  },
  {
    id: 'tags',
    title: 'Tags',
    both: true
  },
  {
    id: 'assigned',
    title: 'Assigned to',
    both: true
  },
  {
    id: 'requester',
    title: 'Requester',
    both: true
  },
  {
    id: 'company',
    title: 'Company',
    both: true
  },
  {
    id: 'pausal',
    title: 'Pausal',
    both: true
  },
  {
    id: 'overtime',
    title: 'Mimo pracovných hodín',
    both: true
  },
];

export const createCleanRights = ( access = false ) => {
  let rights = {};
  allACLs.filter( ( acl ) => !acl.separator ).forEach( ( acl ) => {
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
  id: fakeID--,
  order: index,
  rights: createCleanRights( index === 0 )
} ) )

export const noDef = {
  status: {
    def: false,
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
    def: false,
    fixed: false,
    value: [],
    required: true
  },
  requester: {
    def: false,
    fixed: false,
    value: null,
    required: true
  },
  company: {
    def: false,
    fixed: false,
    value: null,
    required: true
  },
  pausal: {
    def: false,
    fixed: false,
    value: booleanSelects[ 0 ],
    required: true
  },
  overtime: {
    def: false,
    fixed: false,
    value: booleanSelects[ 0 ],
    required: true
  },
}

export const defList = {
  fixed: false,
  def: false,
  required: true,
  value: []
}
export const defBool = {
  fixed: false,
  def: false,
  required: true,
  value: {
    value: false,
    label: 'No'
  }
}
export const defItem = {
  fixed: false,
  def: false,
  required: true,
  value: null,
}