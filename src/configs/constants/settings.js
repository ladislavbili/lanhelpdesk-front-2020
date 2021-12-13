import UserList from 'helpdesk/settings/users';
import CompanyList from 'helpdesk/settings/companies';
import PublicFiltersList from 'helpdesk/settings/publicFilters';
import SLAList from 'helpdesk/settings/pausals';
import ProjectList from 'helpdesk/settings/projects';
import StatusList from 'helpdesk/settings/templateStatuses';
import PriceList from 'helpdesk/settings/pricelists';
import RoleList from 'helpdesk/settings/roles';
import TripTypeList from 'helpdesk/settings/tripTypes';
import TaskTypeList from 'helpdesk/settings/taskTypes';
import ImapList from 'helpdesk/settings/imaps';
import SMTPList from 'helpdesk/settings/smtps';

export default [
  {
    title: 'users',
    link: 'users',
    minimalRole: 1,
    component: UserList,
    value: 'users'
  },
  {
    title: 'companies',
    link: 'companies',
    minimalRole: 1,
    component: CompanyList,
    value: 'companies'
  },
  {
    title: 'publicFilters',
    link: 'publicFilters',
    minimalRole: 1,
    component: PublicFiltersList,
    value: 'publicFilters'
  },
  {
    title: 'sla',
    link: 'pausals',
    minimalRole: 3,
    component: SLAList,
    value: 'pausals'
  },
  {
    title: 'projects',
    link: 'projects',
    minimalRole: 2,
    component: ProjectList,
    value: 'projects'
  },
  {
    title: 'statuses',
    link: 'statuses',
    minimalRole: 3,
    component: StatusList,
    value: 'statuses'
  },
  {
    title: 'pricelists',
    link: 'pricelists',
    minimalRole: 2,
    component: PriceList,
    value: 'prices'
  },
  {
    title: 'roles',
    link: 'roles',
    minimalRole: 2,
    component: RoleList,
    value: 'roles'
  },
  {
    title: 'tripTypes',
    link: 'tripTypes',
    minimalRole: 2,
    component: TripTypeList,
    value: 'tripTypes'
  },
  {
    title: 'taskTypes',
    link: 'taskTypes',
    minimalRole: 2,
    component: TaskTypeList,
    value: 'taskTypes'
  },
  {
    title: 'imaps',
    link: 'imaps',
    minimalRole: 3,
    component: ImapList,
    value: 'imaps'
  },
  {
    title: 'smtps',
    link: 'smtps',
    minimalRole: 3,
    component: SMTPList,
    value: 'smtps'
  },
]