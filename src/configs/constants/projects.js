import booleanSelects from './boolSelect';
import {
  remapRightsToBackend
} from 'helpdesk/settings/projects/helpers';
let fakeID = -1;

export const allACLs = [
  {
    id: 'header1',
    title: 'projectACL',
    header: true
  },
  {
    id: 'projectRead',
    title: 'viewProjectNameDescription',
    disabled: [
      {
        key: 'projectWrite',
      }
    ],
    both: false
  },
  {
    id: 'projectWrite',
    title: 'projectSettings',
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
    title: 'tasklist',
    header: true,
  },
  {
    id: 'myTasks',
    title: 'viewMyTasks',
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
    title: 'viewMyCompanyTasks',
    both: false,
    disabled: [
      {
        key: 'allTasks'
      }
    ]
  },
  {
    id: 'allTasks',
    title: 'viewAllTasks',
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
    title: 'tasklistView',
    header: true,
  },
  {
    id: 'taskTable',
    title: 'taskTable',
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
    title: 'dnd',
    both: false,
  },
  {
    id: 'tasklistKalendar',
    title: 'calendar',
    both: false,
  },
  {
    id: 'tasklistGantt',
    title: 'projectManagement',
    both: false,
  },
  {
    id: 'tasklistStatistics',
    title: 'statistics',
    both: false,
  },
  {
    id: 'separator3',
    separator: true,
  },
  {
    id: 'headerAdd',
    title: 'addTask',
    header: true,
  },
  {
    id: 'addTask',
    title: 'addTaskRight',
    both: false
  },
  {
    id: 'separator4',
    separator: true,
  },
  {
    id: 'headerTaskEdit',
    title: 'editTask',
    header: true,
  },
  {
    id: 'deleteTask',
    title: 'deleteTask',
    both: false
  },
  {
    id: 'taskImportant',
    title: 'importantRight',
    both: false
  },
  {
    id: 'taskTitleWrite',
    title: 'taskTitleEdit',
    both: false
  },
  {
    id: 'taskProjectWrite',
    title: 'changeTaskProject',
    both: false
  },
  {
    id: 'taskDescription',
    title: 'taskDescription',
    both: true
  },
  {
    id: 'taskAttachments',
    title: 'taskAttachments',
    both: true
  },
  {
    id: 'taskSubtasks',
    title: 'taskSubtasksRight',
    both: true
  },
  {
    id: 'taskWorks',
    title: 'taskWorksRight',
    both: true
  },
  {
    id: 'taskWorksAdvanced',
    title: 'taskWorksAdvancedRight',
    both: true
  },
  {
    id: 'taskMaterials',
    title: 'taskMaterialsRight',
    both: true
  },
  {
    id: 'taskPausalInfo',
    title: 'taskPausalInfoRight',
    both: false
  },
  {
    id: 'separator5',
    separator: true,
  },
  {
    id: 'headerComments',
    title: 'commentsHistory',
    header: true,
  },
  {
    id: 'viewComments',
    title: 'viewComments',
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
    title: 'addComments',
    dependancy: [ {
      key: 'viewComments',
    } ],
    both: false
  },
  {
    id: 'internal',
    title: 'internalComments',
    dependancy: [ {
      key: 'viewComments',
    } ],
    both: false
  },
  {
    id: 'emails',
    title: 'sendEmailsFromComments',
    dependancy: [ {
      key: 'viewComments',
    } ],
    both: false
  },
  {
    id: 'history',
    title: 'taskHistory',
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
  labelId: 'emptyUserValue',
  label: 'Task Creator',
  title: 'Task Creator'
}

export const emptyCompanyValue = {
  id: null,
  value: null,
  labelId: 'emptyCompanyValue',
  label: "Task Creator's company",
  title: "Task Creator's company"
}

export const emptyAssigned = {
  id: null,
  value: null,
  labelId: 'emptyAssigned',
  label: 'Nepriradený/Zadávateľ má assigned edit právo',
  title: 'Nepriradený/Zadávateľ má assigned edit právo',
};

export const emptyStatus = {
  id: null,
  value: null,
  labelId: 'emptyStatus',
  title: 'New (first with new action)',
  label: 'New (first with new action)',
  color: 'green'
};

export const emptyPausal = {
  id: null,
  value: null,
  labelId: 'emptyPausal',
  title: 'Set by tasks company',
  label: 'Set by tasks company',
};