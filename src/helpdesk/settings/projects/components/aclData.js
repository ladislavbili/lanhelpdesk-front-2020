export const allACLs = [ {
    id: 'projectTitle',
    title: 'Project name',
    dependancy: null,
    both: false
  },
  {
    id: 'projectDescription',
    title: 'Project description',
    dependancy: null,
    both: true
  },
  {
    id: 'statuses',
    title: 'Project statuses',
    dependancy: null,
    both: true
  },
  {
    id: 'tags',
    title: 'Project tags',
    dependancy: null,
    both: true
  },
  {
    id: 'projectAcl',
    title: 'Project ACL',
    dependancy: null,
    both: true
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