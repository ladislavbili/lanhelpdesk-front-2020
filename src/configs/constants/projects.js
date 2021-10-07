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
    id: 'projectRead',
    title: 'View project name & description',
    disabled: [
      {
        key: 'projectWrite',
      }
    ],
    both: false
  },
  {
    id: 'projectWrite',
    title: 'Project settings',
    dependancy: [
      {
        key: 'projectRead',
      }
    ],
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
        key: 'myTasks',
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
    title: 'View all tasks in this project',
    dependancy: [
      {
        key: 'companyTasks',
      }
    ],
    both: false
  },
  {
    id: 'separator2',
    separator: true,
  },
  {
    id: 'headerTaskList',
    title: 'Task list view',
    header: true,
  },
  {
    id: 'taskTable',
    title: 'Task table',
    both: false,
    fake: true,
    value: true,
    disabled: [
      {
        key: 'taskTable',
      }
    ]
  },
  {
    id: 'tasklistDnD',
    title: 'Drag & Drop',
    both: false,
  },
  {
    id: 'tasklistKalendar',
    title: 'Calendar',
    both: false,
  },
  {
    id: 'tasklistGantt',
    title: 'Project management',
    both: false,
  },
  {
    id: 'tasklistStatistics',
    title: 'Statistics',
    both: false,
  },
  {
    id: 'separator3',
    separator: true,
  },
  {
    id: 'headerAdd',
    title: 'Add task',
    header: true,
  },
  {
    id: 'addTask',
    title: 'Add Task ( title, description, attachments )',
    both: false
  },
  {
    id: 'separator4',
    separator: true,
  },
  {
    id: 'headerTaskEdit',
    title: 'Edit task',
    header: true,
  },
  {
    id: 'deleteTask',
    title: 'Delete Task',
    both: false
  },
  {
    id: 'taskImportant',
    title: 'Mark tasks as important',
    both: false
  },
  {
    id: 'taskTitleWrite',
    title: 'Task title edit',
    both: false
  },
  {
    id: 'taskProjectWrite',
    title: 'Change task project',
    both: false
  },
  {
    id: 'taskDescription',
    title: 'Task description',
    both: true
  },
  {
    id: 'taskAttachments',
    title: 'Task attachments',
    both: true
  },
  {
    id: 'taskSubtasks',
    title: 'Task subtasks VIEW/EDIT',
    both: true
  },
  {
    id: 'taskWorks',
    title: 'Task works VIEW/EDIT',
    both: true
  },
  {
    id: 'taskWorksAdvanced',
    title: 'Task works advanced VIEW/EDIT',
    both: true
  },
  {
    id: 'taskMaterials',
    title: 'Task materials VIEW/EDIT',
    both: true
  },
  {
    id: 'taskPausalInfo',
    title: 'Task pausal info VIEW/EDIT',
    both: false
  },
  {
    id: 'separator5',
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

export const createCleanRights = ( access = false, admin = false ) => {
  let rights = {};
  allACLs.filter( ( acl ) => !acl.header && !acl.fake && !acl.separator ).forEach( ( acl ) => {
    if ( admin && [ 'projectRead', 'projectWrite' ].includes( acl.id ) ) {
      rights[ acl.id ] = true;
    } else {
      if ( acl.both ) {
        rights[ acl.id ] = {
          read: access,
          write: access
        };
      } else {
        rights[ acl.id ] = access;
      }
    }
  } )
  return rights;
}

export const backendCleanRights = ( access = false ) => {
  return remapRightsToBackend( {
    title: '',
    id: 0,
    order: 0,
    rights: createCleanRights( access ),
    attributeRights: getEmptyAttributeRights()
  } )
}

export const attributesNames = [ 'status', 'tags', 'assigned', 'requester', 'company', 'taskType', 'pausal', 'overtime', 'startsAt', 'deadline', 'repeat' ];
export const getEmptyAttributeRights = () => {
  let attributeRights = {};
  attributesNames.forEach( ( attribute ) => {
    if ( attribute !== 'repeat' ) {
      attributeRights[ attribute ] = {
        required: false,
        add: false,
        view: false,
        edit: false,
      };
    } else {
      attributeRights[ attribute ] = {
        add: false,
        view: false,
        edit: false,
      };
    }
  } )
  return attributeRights;
}

export const getEmptyAttributes = () => {
  let defaultAttributes = {};
  attributesNames.forEach( ( attribute ) => {
    if ( attribute !== 'repeat' ) {
      defaultAttributes[ attribute ] = {
        fixed: false,
        value: [ 'tags', 'assigned' ].includes( attribute ) ? [] : null,
      }
    }
  } )
  return defaultAttributes;
}

export const defaultGroups = [ 'Admin', 'Agent', 'Customer' ].map( ( name, index ) => ( {
  title: name,
  description: `${name} role`,
  id: -( index + 1 ),
  def: true,
  admin: index === 0,
  order: index,
  attributeRights: getEmptyAttributeRights(),
  rights: createCleanRights( false, index === 0 )
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

export const emptyAssigned = {
  id: null,
  value: null,
  label: 'Nepriradený/Zadávateľ má assigned edit právo',
  title: 'Nepriradený/Zadávateľ má assigned edit právo',
};

export const emptyStatus = {
  title: 'New (first with new action)',
  id: null,
  label: 'New (first with new action)',
  value: null,
  color: 'green'
};

export const emptyPausal = {
  title: 'Set by tasks company',
  id: null,
  label: 'Set by tasks company',
  value: null,
};