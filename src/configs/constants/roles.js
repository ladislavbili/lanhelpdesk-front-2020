export const acl = {
  //general rules
  login: false,
  testSections: false,
  mailViaComment: false,
  vykazy: false,
  publicFilters: false,
  addProjects: false,
  viewVykaz: false,
  viewRozpocet: false,
  viewErrors: false,
  viewInternal: false,

  //settings access
  users: false,
  companies: false,
  pausals: false,
  projects: false,
  statuses: false,
  units: false,
  prices: false,
  suppliers: false,
  tags: false,
  invoices: false,
  roles: false,
  types: false,
  tripTypes: false,
  imaps: false,
  smtps: false,
}

export const roles = [
  {
    id: '0',
    title: 'Guest',
    acl,
  },
  {
    id: '1',
    title: 'User',
    acl:{
      ...acl,
      login: true,
      viewVykaz: true,
    },
  },
  {
    id: '2',
    title: 'Agent',
    acl:{
      ...acl,
      login: true,
      viewVykaz: true,
      viewRozpocet: true,
      testSections: true,
      mailViaComment: true,
      addProjects: true,
      viewInternal: true,

      tags: true,
      users: true,
      companies: true,
    },
  },
  {
    id: '3',
    title: 'Manager',
    acl:{
      ...acl,
      login: true,
      viewVykaz: true,
      viewRozpocet: true,
      testSections: true,
      mailViaComment: true,
      addProjects: true,
      vykazy: true,
      viewErrors: true,
      viewInternal: true,

      tags: true,
      users: true,
      companies: true,
    },
  },
  {
    id: '4',
    title: 'Admin',
    acl:{
      login: true,
      testSections: true,
      mailViaComment: true,
      vykazy: true,
      publicFilters: true,
      addProjects: true,
      viewVykaz: true,
      viewRozpocet: true,
      viewErrors: true,
      viewInternal: true,

      //settings access
      users: true,
      companies: true,
      pausals: true,
      projects: true,
      statuses: true,
      units: true,
      prices: true,
      suppliers: true,
      tags: true,
      invoices: true,
      roles: true,
      types: true,
      tripTypes: true,
      imaps: true,
      smtps: true,
    },
  },
];

export const generalRights = [
  {
    name: 'Login to system',
    value: 'login',
  },
  {
    name: 'Test sections - Navoody, CMDB, Hesla, Naklady, Projekty, Monitoring',
    value: 'testSections',
  },
  {
    name: 'Send mails via comments',
    value: 'mailViaComment',
  },
  {
    name: 'Výkazy',
    value: 'vykazy',
  },
  {
    name: 'Public Filters',
    value: 'publicFilters',
  },
  {
    name: 'Add projects',
    value: 'addProjects',
  },
  {
    name: 'View vykaz',
    value: 'viewVykaz',
  },
  {
    name: 'View rozpocet',
    value: 'viewRozpocet',
  },
  {
    name: 'View errors',
    value: 'viewErrors',
  },
  {
    name: 'Internal messages',
    value: 'viewInternal',
  },
]

export const specificRules = [
  {
    name: 'Users',
    value: 'users',
  },
  {
    name: 'Companies',
    value: 'companies',
  },
  {
    name: 'Service level agreements',
    value: 'pausals',
  },
  {
    name: 'Projects',
    value: 'projects',
  },
  {
    name: 'Statuses',
    value: 'statuses',
  },
  {
    name: 'Units',
    value: 'units',
  },
  {
    name: 'Prices',
    value: 'prices',
  },
  {
    name: 'Suppliers',
    value: 'suppliers',
  },
  {
    name: 'Tags',
    value: 'tags',
  },
  {
    name: 'Invoices',
    value: 'invoices',
  },
  {
    name: 'Roles',
    value: 'roles',
  },
  {
    name: 'Types',
    value: 'types',
  },
  {
    name: 'Trip types',
    value: 'tripTypes',
  },
  {
    name: 'Imaps',
    value: 'imaps',
  },
  {
    name: 'SMTPs',
    value: 'smtps',
  },
]
