export const allACLs = [ {
    id: 'sep1',
    title: 'PROJECT ACL',
    separator: true
  },
  {
    id: 'projectPrimary',
    title: 'Project name & description',
    dependancy: null,
    both: true
  },
  {
    id: 'projectSecondary',
    title: 'Project settings & ACL - write and edit',
    dependancy: null,
    both: false
  },
  {
    id: 'sep2',
    title: 'TASK ACL',
    separator: true,
  },
  {
    id: 'taskTitleEdit',
    title: 'Task title edit',
    dependancy: null,
    both: false
  },
  {
    id: 'taskDescription',
    title: 'Task description',
    dependancy: null,
    both: true
  },
  {
    id: 'taskSubtasks',
    title: 'Task subtasks',
    dependancy: null,
    both: true
  },
  {
    id: 'taskAttachments',
    title: 'Task attachments',
    dependancy: null,
    both: true
  },
  {
    id: 'pausalInfo',
    title: 'Task pausal info',
    dependancy: null,
    both: false
  },
  {
    id: 'vykaz',
    title: 'Vykaz',
    dependancy: null,
    both: true
  },
  {
    id: 'rozpocet',
    title: 'Rozpočet',
    dependancy: null,
    both: true
  },
  {
    id: 'viewComments',
    title: 'View comments',
    dependancy: null,
    both: false
  },
  {
    id: 'addComments',
    title: 'Add comments',
    dependancy: 'viewComments',
    both: false
  },
  {
    id: 'internal',
    title: 'Internal comments',
    dependancy: 'viewComments',
    both: false
  },
  {
    id: 'emails',
    title: 'Send emails from comments',
    dependancy: 'viewComments',
    both: false
  },
  {
    id: 'sep3',
    title: 'TASK ACL DEFAULT ATTRIBUTES',
    separator: true
  },
  {
    id: 'status',
    title: 'Status',
    dependancy: null,
    both: true
  },
  {
    id: 'tags',
    title: 'Tags',
    dependancy: null,
    both: true
  },
  {
    id: 'assigned',
    title: 'Assigned to',
    dependancy: null,
    both: true
  },
  {
    id: 'requester',
    title: 'Requester',
    dependancy: null,
    both: true
  },
  {
    id: 'company',
    title: 'Company',
    dependancy: null,
    both: true
  },
  {
    id: 'pausal',
    title: 'Pausal',
    dependancy: null,
    both: true
  },
];

export function createRandomRights() {
  let rights = {};
  allACLs.forEach( ( acl ) => {
    if ( acl.both ) {
      rights[ acl.id ] = {
        read: Math.random() > 0.5,
        write: false
      };
    } else {
      rights[ acl.id ] = Math.random() > 0.5;
    }
  } )
  return rights;
}