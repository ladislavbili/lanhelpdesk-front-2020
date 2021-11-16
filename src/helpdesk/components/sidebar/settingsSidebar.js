import React from 'react';
import {
  Nav,
  NavItem,
  Label,
} from 'reactstrap';
import {
  Link,
} from 'react-router-dom';
import classnames from 'classnames';
import settings from 'configs/constants/settings';
import {
  getMyData,
} from 'helperFunctions';
import DefaultCompany from './defaultCompany';

export default function SettingsSidebar( props ) {
  //data & queries
  const {
    location,
    history,
  } = props;

  const currentUser = getMyData();
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  return (
    <Nav vertical>
      <NavItem key="back-to-tasks" className="p-t-3 p-b-3">
        <button className="btn-link sidebar-align full-width text-left" onClick={() => { history.push('/helpdesk/taskList/i/all') } }>
          <i className="fa fa-chevron-left m-r-5" />
          Back to tasks
        </button>
      </NavItem>
      <div className="sidebar-align p-t-7 p-b-7">
        <i className="fa fa-cog font-19" />
        <Label className="noselect m-b-0">
          Settings
        </Label>
      </div>
      { accessRights.companies && <DefaultCompany {...props} accessRights={accessRights} /> }
				{settings.filter((setting) => accessRights[setting.value]).map((setting)=>
					<NavItem key={setting.link}>
						<Link className={classnames("sidebar-menu-item" , {"active" : location.pathname.includes(setting.link)})}
							to={{ pathname:`/helpdesk/settings/${setting.link}/list` }}>{setting.title}</Link>
					</NavItem>
				)}
			</Nav>
  );
}