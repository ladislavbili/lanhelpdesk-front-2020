import UserList from 'helpdesk/settings/users';
import CompanyList from 'helpdesk/settings/companies';
import PublicFiltersList from 'helpdesk/settings/publicFilters';
import SLAList from 'helpdesk/settings/pausals';
import ProjectList from 'helpdesk/settings/projects';
import StatusList from 'helpdesk/settings/statuses';
import PriceList from 'helpdesk/settings/prices';
import TagList from 'helpdesk/settings/tags';
import RoleList from 'helpdesk/settings/roles';
import TripTypeList from 'helpdesk/settings/tripTypes';
import TaskTypeList from 'helpdesk/settings/taskTypes';
import ImapList from 'helpdesk/settings/imaps';
import SMTPList from 'helpdesk/settings/smtps';

export default [
	{ title: 'Users', link: 'users', minimalRole: 1, component: UserList },
	{ title: 'Companies', link: 'companies', minimalRole: 1, component: CompanyList },
	{ title: 'Public filters', link: 'publicFilters', minimalRole: 1, component: PublicFiltersList },
	{ title: 'Service level agreements', link: 'sla', minimalRole: 3, component: SLAList },
	{ title: 'Projects', link: 'projects', minimalRole: 2, component: ProjectList },
	{ title: 'Statuses', link: 'statuses', minimalRole: 3, component: StatusList },
	{ title: 'Price lists', link: 'pricelists', minimalRole: 2, component: PriceList },
	{ title: 'Tags', link: 'tags', minimalRole: 2, component: TagList },
	{ title: 'Roles', link: 'roles', minimalRole: 2, component: RoleList },
	{ title: 'Trip types', link: 'tripTypes', minimalRole: 2, component: TripTypeList },
	{ title: 'Task types', link: 'taskTypes', minimalRole: 2, component: TaskTypeList },
	{ title: 'Imaps', link: 'imaps', minimalRole: 3, component: ImapList },
	{ title: 'SMTPs', link: 'smtps', minimalRole: 3, component: SMTPList },
]
