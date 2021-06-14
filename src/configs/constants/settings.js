import UserList from 'helpdesk/settings/users';
import CompanyList from 'helpdesk/settings/companies';
import PublicFiltersList from 'helpdesk/settings/publicFilters';
import SLAList from 'helpdesk/settings/pausals';
import ProjectList from 'helpdesk/settings/projects';
import StatusList from 'helpdesk/settings/templateStatuses';
import PriceList from 'helpdesk/settings/prices';
import RoleList from 'helpdesk/settings/roles';
import TripTypeList from 'helpdesk/settings/tripTypes';
import TaskTypeList from 'helpdesk/settings/taskTypes';
import ImapList from 'helpdesk/settings/imaps';
import SMTPList from 'helpdesk/settings/smtps';

export default [
  {
    title: 'Users',
    link: 'users',
    minimalRole: 1,
    component: UserList,
    value: 'users'
  },
  {
    title: 'Companies',
    link: 'companies',
    minimalRole: 1,
    component: CompanyList,
    value: 'companies'
  },
  {
    title: 'Public filters',
    link: 'publicFilters',
    minimalRole: 1,
    component: PublicFiltersList,
    value: 'publicFilters'
  },
  {
    title: 'Service level agreements',
    link: 'pausals',
    minimalRole: 3,
    component: SLAList,
    value: 'pausals'
  },
  {
    title: 'Projects',
    link: 'projects',
    minimalRole: 2,
    component: ProjectList,
    value: 'projects'
  },
  {
    title: 'Statuses',
    link: 'statuses',
    minimalRole: 3,
    component: StatusList,
    value: 'statuses'
  },
  {
    title: 'Price lists',
    link: 'pricelists',
    minimalRole: 2,
    component: PriceList,
    value: 'prices'
  },
  {
    title: 'Roles',
    link: 'roles',
    minimalRole: 2,
    component: RoleList,
    value: 'roles'
  },
  {
    title: 'Trip types',
    link: 'tripTypes',
    minimalRole: 2,
    component: TripTypeList,
    value: 'tripTypes'
  },
  {
    title: 'Task types',
    link: 'taskTypes',
    minimalRole: 2,
    component: TaskTypeList,
    value: 'taskTypes'
  },
  {
    title: 'Imaps',
    link: 'imaps',
    minimalRole: 3,
    component: ImapList,
    value: 'imaps'
  },
  {
    title: 'SMTPs',
    link: 'smtps',
    minimalRole: 3,
    component: SMTPList,
    value: 'smtps'
  },
]